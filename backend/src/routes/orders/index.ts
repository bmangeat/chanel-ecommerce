import { FastifyInstance } from 'fastify'
import { authenticate } from '../../middlewares/authenticate'

export default async function orderRoutes(fastify: FastifyInstance) {
  fastify.addHook('preHandler', authenticate)

  // ----------------------------------------------------------------
  // POST /api/orders — EXERCISE 8
  // ----------------------------------------------------------------
  // TODO : Implémenter le checkout
  // Étapes :
  //   1. Récupérer le panier de l'utilisateur avec tous ses items
  //   2. Vérifier que le panier n'est pas vide
  //   3. Dans une transaction :
  //      a. Pour chaque item, vérifier à nouveau le stock (last check before payment)
  //      b. Calculer le total
  //      c. Créer l'ordre (table orders) avec status = 'confirmed'
  //      d. Créer les order_items (snapshot des prix au moment de l'achat)
  //      e. Décrémenter les stocks
  //      f. Vider le panier (DELETE FROM cart_items WHERE cart_id = ?)
  //   4. Retourner l'ordre créé (code 201)
  //
  // 💡 Le prix unitaire doit être snapshoté depuis la DB au moment de l'achat,
  //    jamais depuis le front-end. C'est la réponse à la question de l'entretien
  //    "que se passe-t-il si le prix change avant le paiement ?"
  // ----------------------------------------------------------------
  fastify.post('/', async (_request, reply) => {
    return reply.code(501).send({ error: 'Not Implemented', message: 'Exercise 8 — À implémenter' })
  })

  // ----------------------------------------------------------------
  // GET /api/orders — EXERCISE 8 (bonus)
  // ----------------------------------------------------------------
  fastify.get('/', async (_request, reply) => {
    return reply.code(501).send({ error: 'Not Implemented', message: 'Exercise 8 bonus — À implémenter' })
  })
}
