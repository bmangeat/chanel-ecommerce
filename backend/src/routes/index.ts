import { FastifyInstance } from 'fastify'
import authRoutes from './auth'
import productRoutes from './products'
import cartRoutes from './cart'
import orderRoutes from './orders'

export default async function routes(fastify: FastifyInstance) {
  fastify.register(authRoutes, { prefix: '/auth' })
  fastify.register(productRoutes, { prefix: '/products' })
  fastify.register(cartRoutes, { prefix: '/cart' })
  fastify.register(orderRoutes, { prefix: '/orders' })
}
