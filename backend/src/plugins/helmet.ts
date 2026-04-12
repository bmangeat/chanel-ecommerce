import fp from 'fastify-plugin'
import helmet from '@fastify/helmet'

export default fp(async (fastify) => {
  await fastify.register(helmet, {
    // En développement on désactive le CSP strict pour Swagger UI
    contentSecurityPolicy: process.env.NODE_ENV === 'production',
  })
})
