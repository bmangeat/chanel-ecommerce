// ============================================================
// Types partagés entre les composants et les hooks
// Miroir des types backend (backend/src/types/index.ts)
// ============================================================

export interface User {
  id: string
  email: string
  first_name: string | null
  last_name: string | null
  created_at: string
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
  created_at: string
  updated_at: string
}

export interface ProductStock {
  id: string
  stock: number
  is_limited_edition: boolean
  version: number
}

export interface ProductListResponse {
  data: Product[]
  total: number
  limit: number
  offset: number
}

export interface CartItem {
  id: string
  product_id: string
  quantity: number
  product: {
    id: string
    name: string
    price: number
    image_url: string | null
    stock: number
  }
}

export interface Cart {
  id: string
  user_id: string
  items: CartItem[]
  total: number
}

export interface ApiError {
  error: string
  message: string
}
