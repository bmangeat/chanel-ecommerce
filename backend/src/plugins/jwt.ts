import fp from 'fastify-plugin'
import jwt from '@fastify/jwt'

export default fp(async (fastify) => {
  await fastify.register(jwt, {
    secret: process.env.JWT_SECRET ?? 'super-secret-change-me',
    cookie: {
      cookieName: 'auth_token',
      signed: false,
    },
    sign: {
      expiresIn: process.env.JWT_EXPIRES_IN ?? '7d',
    },
  })
})
