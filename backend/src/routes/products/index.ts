import { FastifyInstance } from 'fastify'
import { db } from '../../db'
import { listProductsSchema, getProductSchema, getProductStockSchema } from '../../schemas/product'

export default async function productRoutes(fastify: FastifyInstance) {
  // ----------------------------------------------------------------
  // GET /api/products
  // Pagination + filtre par catégorie
  // ----------------------------------------------------------------
  fastify.get('/', { schema: listProductsSchema }, async (request, reply) => {
    const { category, limit = 20, offset = 0 } = request.query as {
      category?: string
      limit?: number
      offset?: number
    }

    const conditions: string[] = []
    const params: unknown[] = []
    let paramIndex = 1

    if (category) {
      conditions.push(`category = $${paramIndex++}`)
      params.push(category)
    }

    const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : ''

    const [{ rows: data }, { rows: countRows }] = await Promise.all([
      db.query(
        `SELECT id, name, description, price, category, image_url, stock, is_limited_edition, version, created_at, updated_at
         FROM products ${where}
         ORDER BY created_at DESC
         LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`,
        [...params, limit, offset]
      ),
      db.query(`SELECT COUNT(*) FROM products ${where}`, params),
    ])

    return reply.send({
      data,
      total: parseInt(countRows[0].count, 10),
      limit,
      offset,
    })
  })

  // ----------------------------------------------------------------
  // GET /api/products/:id
  // Simule une latence de 600ms pour rendre l'exercice de cache pertinent
  // ----------------------------------------------------------------
  fastify.get('/:id', { schema: getProductSchema }, async (request, reply) => {
    const { id } = request.params as { id: string }

    // ⚠️ Latence simulée — en production ce serait un vrai appel DB ou PIM
    await new Promise((resolve) => setTimeout(resolve, 600))

    const { rows } = await db.query(
      `SELECT id, name, description, price, category, image_url, stock, is_limited_edition, version, created_at, updated_at
       FROM products WHERE id = $1`,
      [id]
    )

    if (!rows[0]) {
      return reply.code(404).send({ error: 'Not Found', message: 'Produit introuvable' })
    }

    return reply.send(rows[0])
  })

  // ----------------------------------------------------------------
  // GET /api/products/:id/stock
  // Route légère pour la mise à jour temps réel du stock (TanStack Query)
  // Pas de latence simulée — doit être rapide
  // ----------------------------------------------------------------
  fastify.get('/:id/stock', { schema: getProductStockSchema }, async (request, reply) => {
    const { id } = request.params as { id: string }

    const { rows } = await db.query(
      'SELECT id, stock, is_limited_edition, version FROM products WHERE id = $1',
      [id]
    )

    if (!rows[0]) {
      return reply.code(404).send({ error: 'Not Found', message: 'Produit introuvable' })
    }

    return reply.send(rows[0])
  })
}
