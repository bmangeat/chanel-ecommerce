import fp from 'fastify-plugin'
import cors from '@fastify/cors'

export default fp(async (fastify) => {
  await fastify.register(cors, {
    origin: process.env.FRONTEND_URL ?? 'http://localhost:3000',
    credentials: true,           // Indispensable pour les cookies cross-origin
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
})
