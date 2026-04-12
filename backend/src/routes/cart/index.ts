import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox'
import { PoolClient } from 'pg'
import { db } from '../../db'
import { authenticate } from '../../middlewares/authenticate'
import { getCartSchema, addToCartSchema, updateCartItemSchema } from '../../schemas/cart'

/**
 * Récupère ou crée le panier de l'utilisateur connecté.
 * Retourne le cart_id.
 */
async function decrementStock(
  client: PoolClient,
  productId: string,
  quantity: number,
  isLimitedEdition: boolean,
  version: number
): Promise<boolean> {
  if (isLimitedEdition) {
    const { rowCount } = await client.query(
      `UPDATE products SET stock = stock - $1, version = version + 1
       WHERE id = $2 AND version = $3`,
      [quantity, productId, version]
    )
    return rowCount !== 0
  }
  await client.query(
    `UPDATE products SET stock = stock - $1 WHERE id = $2`,
    [quantity, productId]
  )
  return true
}

async function getOrCreateCart(userId: string): Promise<string> {
  const existing = await db.query('SELECT id FROM carts WHERE user_id = $1', [userId])
  if (existing.rows[0]) return existing.rows[0].id

  const { rows } = await db.query(
    'INSERT INTO carts (user_id) VALUES ($1) RETURNING id',
    [userId]
  )
  return rows[0].id
}


const cartRoutes: FastifyPluginAsyncTypebox = async (fastify) => {
  // Toutes les routes du panier sont protégées
  fastify.addHook('preHandler', authenticate)

  // ----------------------------------------------------------------
  // GET /api/cart
  // Retourne le panier avec les détails produits et le total calculé
  // ----------------------------------------------------------------
  fastify.get('/', { schema: getCartSchema }, async (request, reply) => {
    const cartId = await getOrCreateCart(request.user.sub)

    const { rows: items } = await db.query(
      `SELECT
        ci.id,
        ci.product_id,
        ci.quantity,
        ci.created_at,
        ci.updated_at,
        json_build_object(
          'id', p.id,
          'name', p.name,
          'price', p.price::float,
          'image_url', p.image_url,
          'stock', p.stock
        ) AS product
       FROM cart_items ci
       JOIN products p ON p.id = ci.product_id
       WHERE ci.cart_id = $1
       ORDER BY ci.created_at ASC`,
      [cartId]
    )

    const total = items.reduce((sum: number, item: { quantity: number; product: { price: number } }) => {
      return sum + item.quantity * item.product.price
    }, 0)

    return reply.send({
      id: cartId,
      user_id: request.user.sub,
      items,
      total: Math.round(total * 100) / 100,
    })
  })

  // ----------------------------------------------------------------
  // POST /api/cart/items — EXERCISE 2
  // ----------------------------------------------------------------
  // TODO : Implémenter cette route
  // Étapes :
  //   1. Valider le body avec addToCartSchema (déjà configuré)
  //   2. Récupérer ou créer le panier via getOrCreateCart()
  //   3. Vérifier que le produit existe ET que stock >= quantity
  //      → Si stock insuffisant : reply.code(409).send({ error: 'Out of stock' })
  //   4. Si le produit est déjà dans le panier : incrémenter la quantité
  //      Sinon : insérer une nouvelle ligne dans cart_items
  //   5. Pour les éditions limitées (is_limited_edition = true) :
  //      → Utiliser un verrouillage optimiste (vérifier la colonne `version`)
  //      → Si version ne correspond pas : reply.code(409).send({ error: 'Conflict' })
  //   6. Décrémenter le stock dans la table products
  //   7. Retourner le cart_item créé/mis à jour (code 201)
  //
  // 💡 Conseil : Utiliser une transaction PostgreSQL (BEGIN / COMMIT / ROLLBACK)
  //    pour garantir l'atomicité des opérations stock + cart_item.
  // ----------------------------------------------------------------
  fastify.post('/items', { schema: addToCartSchema }, async (request, reply) => {
    const { product_id, quantity } = request.body;
    const cartId = await getOrCreateCart(request.user.sub);

    const client = await db.connect();
    try {
      await client.query('BEGIN');
      const { rows: productRows } = await client.query(
        'SELECT stock, is_limited_edition, version FROM products WHERE id = $1',
        [product_id]
      )

      if (productRows.length === 0) {
        await client.query('ROLLBACK');
        return reply.code(404).send({ error: 'Product not found', message: 'Product not found' })
      }

      const stock = productRows[0].stock;

      if (stock < quantity) {
        await client.query('ROLLBACK');
        return reply.code(409).send({ error: 'Out of stock', message: 'Stock is insufficient' })
      }
      const { rows: items } = await client.query(
        `SELECT
        ci.id,
        ci.product_id
       FROM cart_items ci
       WHERE ci.cart_id = $1
       AND ci.product_id = $2`,
        [cartId, product_id]
      );
      const { is_limited_edition, version } = productRows[0];

      // If product already in cart
      if (items.length > 0) {
        const { rows: updatedItem } = await client.query(
          `UPDATE cart_items SET quantity = quantity + $1
           WHERE cart_id = $2 AND product_id = $3
           RETURNING *`,
          [quantity, cartId, product_id]
        );
        const ok = await decrementStock(client, product_id, quantity, is_limited_edition, version)
        if (!ok) {
          await client.query('ROLLBACK');
          return reply.code(409).send({ error: 'Conflict', message: 'Product has been updated by another user' })
        }
        await client.query('COMMIT');
        return reply.code(201).send(updatedItem[0]);
      }

      // Empty cart
      const { rows: newItem } = await client.query(
        `INSERT INTO cart_items (cart_id, product_id, quantity)
         VALUES ($1, $2, $3)
         RETURNING *`,
        [cartId, product_id, quantity]
      );
      const ok = await decrementStock(client, product_id, quantity, is_limited_edition, version)
      if (!ok) {
        await client.query('ROLLBACK');
        return reply.code(409).send({ error: 'Conflict', message: 'Product has been updated by another user' })
      }

      await client.query('COMMIT');
      return reply.code(201).send(newItem[0]);
    } catch (error) {
      await client.query('ROLLBACK');
      return reply.code(500).send({ error: 'Internal Server Error', message: 'Failed to add item to cart' })
    } finally {
      client.release();
    }
  })

  // ----------------------------------------------------------------
  // PUT /api/cart/items/:itemId — EXERCISE 3
  // ----------------------------------------------------------------
  // TODO : Mettre à jour la quantité d'un item du panier
  // Étapes :
  //   1. Vérifier que l'item appartient bien au panier de l'utilisateur connecté
  //   2. Vérifier que le stock est suffisant pour la nouvelle quantité
  //   3. Ajuster le stock en conséquence (diff entre ancienne et nouvelle quantité)
  //   4. Mettre à jour cart_items.quantity
  //   5. Retourner l'item mis à jour (code 200)
  // ----------------------------------------------------------------
  fastify.put('/items/:itemId', { schema: updateCartItemSchema }, async (_request, reply) => {
    return reply.code(501).send({ error: 'Not Implemented', message: 'Exercise 3 — À implémenter' })
  })

  // ----------------------------------------------------------------
  // DELETE /api/cart/items/:itemId — EXERCISE 3
  // ----------------------------------------------------------------
  // TODO : Supprimer un item du panier et restaurer le stock
  // ----------------------------------------------------------------
  fastify.delete('/items/:itemId', async (_request, reply) => {
    return reply.code(501).send({ error: 'Not Implemented', message: 'Exercise 3 — À implémenter' })
  })
}
