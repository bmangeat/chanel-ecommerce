import { FastifyRequest, FastifyReply } from 'fastify'
import { JwtPayload } from '../types'

/**
 * preHandler réutilisable pour protéger les routes qui nécessitent une authentification.
 *
 * Vérifie le JWT présent dans le cookie `auth_token`.
 * En cas de succès, attache le payload au request sous `request.user`.
 *
 * Usage :
 *   fastify.get('/me', { preHandler: authenticate }, handler)
 */
export async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  try {
    await request.jwtVerify()
    request.user = request.user as JwtPayload
  } catch {
    reply.code(401).send({ error: 'Unauthorized', message: 'Token invalide ou expiré' })
  }
}
