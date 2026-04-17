import { FastifyInstance } from 'fastify'
import bcrypt from 'bcryptjs'
import { db } from '../../db'
import { authenticate } from '../../middlewares/authenticate'
import { registerSchema, loginSchema, meSchema } from '../../schemas/auth'

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
  maxAge: 60 * 60 * 24 * 7, // 7 jours
}

export default async function authRoutes(fastify: FastifyInstance) {
  await fastify.register(import('@fastify/rate-limit'), {
    max: 10,
    timeWindow: '15 minutes',
  })

  // ----------------------------------------------------------------
  // POST /api/auth/register
  // ----------------------------------------------------------------
  fastify.post('/register', { schema: registerSchema }, async (request, reply) => {
    const { email, password, first_name, last_name } = request.body as {
      email: string
      password: string
      first_name?: string
      last_name?: string
    }

    // Vérification si l'email existe déjà
    const existing = await db.query('SELECT id FROM users WHERE email = $1', [email])
    if (existing.rows.length > 0) {
      return reply.code(409).send({ error: 'Conflict', message: 'Cet email est déjà utilisé' })
    }

    const password_hash = await bcrypt.hash(password, 12)

    const { rows } = await db.query(
      `INSERT INTO users (email, password, first_name, last_name)
       VALUES ($1, $2, $3, $4)
       RETURNING id, email, first_name, last_name`,
      [email, password_hash, first_name ?? null, last_name ?? null]
    )

    return reply.code(201).send(rows[0])
  })

  // ----------------------------------------------------------------
  // POST /api/auth/login
  // ----------------------------------------------------------------
  fastify.post('/login', { schema: loginSchema }, async (request, reply) => {
    const { email, password } = request.body as { email: string; password: string }

    const { rows } = await db.query(
      'SELECT id, email, password, first_name, last_name FROM users WHERE email = $1',
      [email]
    )

    const user = rows[0]

    // On utilise un timing constant pour éviter les attaques par timing
    const isValid = user ? await bcrypt.compare(password, user.password) : await bcrypt.compare(password, '$2b$12$invalid.hash.for.timing.protection')

    if (!user || !isValid) {
      return reply.code(401).send({ error: 'Unauthorized', message: 'Email ou mot de passe invalide' })
    }

    // Génération du JWT
    const token = fastify.jwt.sign({ sub: user.id, email: user.email })

    // Stockage dans un cookie HttpOnly — le JS client ne peut pas y accéder
    reply.setCookie('auth_token', token, COOKIE_OPTIONS)

    return reply.send({
      id: user.id,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
    })
  })

  // ----------------------------------------------------------------
  // POST /api/auth/logout
  // ----------------------------------------------------------------
  fastify.post('/logout', async (_request, reply) => {
    reply.clearCookie('auth_token', { path: '/' })
    return reply.send({ message: 'Déconnecté avec succès' })
  })

  // ----------------------------------------------------------------
  // GET /api/auth/me — Route protégée
  // ----------------------------------------------------------------
  fastify.get('/me', { preHandler: authenticate, schema: meSchema }, async (request, reply) => {
    const { rows } = await db.query(
      'SELECT id, email, first_name, last_name, created_at FROM users WHERE id = $1',
      [request.user.sub]
    )

    if (!rows[0]) {
      return reply.code(404).send({ error: 'Not Found', message: 'Utilisateur introuvable' })
    }

    return reply.send(rows[0])
  })
}
