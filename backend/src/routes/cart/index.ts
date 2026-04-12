import { FastifyInstance } from 'fastify'
import { db } from '../../db'
import { authenticate } from '../../middlewares/authenticate'
import { getCartSchema, addToCartSchema, updateCartItemSchema } from '../../schemas/cart'

/**
 * Récupère ou crée le panier de l'utilisateur connecté.
 * Retourne le cart_id.
 */
async function getOrCreateCart(userId: string): Promise<string> {
  const existing = await db.query('SELECT id FROM carts WHERE user_id = $1', [userId])
  if (existing.rows[0]) return existing.rows[0].id

  const { rows } = await db.query(
    'INSERT INTO carts (user_id) VALUES ($1) RETURNING id',
    [userId]
  )
  return rows[0].id
}

export default async function cartRoutes(fastify: FastifyInstance) {
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
  fastify.post('/items', { schema: addToCartSchema }, async (_request, reply) => {
    return reply.code(501).send({ error: 'Not Implemented', message: 'Exercise 2 — À implémenter' })
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
