import Fastify from 'fastify'
import 'dotenv/config'

import corsPlugin from './plugins/cors'
import cookiePlugin from './plugins/cookie'
import jwtPlugin from './plugins/jwt'
import helmetPlugin from './plugins/helmet'
import swaggerPlugin from './plugins/swagger'
import routes from './routes'
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox'


export function buildApp() {
  const fastify = Fastify({
    logger: {
      level: process.env.NODE_ENV === 'production' ? 'warn' : 'info',
      transport:
        process.env.NODE_ENV !== 'production'
          ? { target: 'pino-pretty', options: { colorize: true } }
          : undefined,
    },
  }).withTypeProvider<TypeBoxTypeProvider>()

  // ── Sécurité & transport ──────────────────────────────────────
  fastify.register(helmetPlugin)
  fastify.register(corsPlugin)
  fastify.register(cookiePlugin)
  fastify.register(jwtPlugin)

  // ── Documentation ─────────────────────────────────────────────
  if (process.env.NODE_ENV !== 'production') {
    fastify.register(swaggerPlugin)
  }

  // ── Rate limiting — EXERCISE 5 ────────────────────────────────
  // TODO : Importer @fastify/rate-limit et l'enregistrer ici
  // Configuration suggérée :
  //   - Global : 200 requêtes / minute
  //   - Sur les routes /api/auth/* : 10 requêtes / 15 minutes
  // fastify.register(import('@fastify/rate-limit'), { ... })

  fastify.register(import('@fastify/rate-limit'), {
    max: 200,
    timeWindow: '1 minute'
  })
  // ── Routes ────────────────────────────────────────────────────
  fastify.register(routes, { prefix: '/api' })

  // ── Health check ──────────────────────────────────────────────
  fastify.get('/health', async () => ({ status: 'ok', timestamp: new Date().toISOString() }))

  return fastify
}
