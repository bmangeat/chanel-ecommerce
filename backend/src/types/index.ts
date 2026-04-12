// ============================================================
// Domain types partagés dans le backend
// À dupliquer / synchoniser avec le frontend (cf. lib/types.ts)
// ============================================================

export interface User {
  id: string
  email: string
  first_name: string | null
  last_name: string | null
  created_at: Date
  updated_at: Date
}

export interface Product {
  id: string
  name: string
  description: string | null
  price: number
  category: string
  image_url: string | null
  stock: number
  is_limited_edition: boolean
  version: number
  created_at: Date
  updated_at: Date
}

export interface Cart {
  id: string
  user_id: string
  created_at: Date
  updated_at: Date
  items: CartItem[]
}

export interface CartItem {
  id: string
  cart_id: string
  product_id: string
  quantity: number
  created_at: Date
  updated_at: Date
  product?: Pick<Product, 'id' | 'name' | 'price' | 'image_url' | 'stock'>
}

export interface Order {
  id: string
  user_id: string
  status: OrderStatus
  total: number
  created_at: Date
  updated_at: Date
  items?: OrderItem[]
}

export interface OrderItem {
  id: string
  order_id: string
  product_id: string
  quantity: number
  unit_price: number
}

export type OrderStatus = 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'

// Payload du JWT stocké dans le cookie
export interface JwtPayload {
  sub: string    // user id
  email: string
}

// Augmentation du type FastifyRequest pour TypeScript
declare module 'fastify' {
  interface FastifyRequest {
    user: JwtPayload
  }
}
