import type { Product, ProductListResponse, ProductStock, Cart, User } from './types'

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? process.env.API_URL ?? 'http://localhost:3001'

// ----------------------------------------------------------------
// Utilitaire fetch avec gestion d'erreur centralisée
// ----------------------------------------------------------------
async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    credentials: 'include', // Envoie les cookies HttpOnly automatiquement
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    ...options,
  })

  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: 'Unknown', message: res.statusText }))
    throw Object.assign(new Error(error.message ?? 'API Error'), { status: res.status, data: error })
  }

  return res.json()
}

// ================================================================
// PRODUCTS
// ================================================================
export const productsApi = {
  list: (params?: { category?: string; limit?: number; offset?: number }) => {
    const qs = new URLSearchParams()
    if (params?.category) qs.set('category', params.category)
    if (params?.limit) qs.set('limit', String(params.limit))
    if (params?.offset) qs.set('offset', String(params.offset))
    return apiFetch<ProductListResponse>(`/api/products?${qs}`)
  },

  get: (id: string) => apiFetch<Product>(`/api/products/${id}`),

  getStock: (id: string) => apiFetch<ProductStock>(`/api/products/${id}/stock`),
}

// ================================================================
// AUTH
// ================================================================
export const authApi = {
  register: (data: { email: string; password: string; first_name?: string; last_name?: string }) =>
    apiFetch<User>('/api/auth/register', { method: 'POST', body: JSON.stringify(data) }),

  login: (data: { email: string; password: string }) =>
    apiFetch<User>('/api/auth/login', { method: 'POST', body: JSON.stringify(data) }),

  logout: () =>
    apiFetch<{ message: string }>('/api/auth/logout', { method: 'POST' }),

  me: () => apiFetch<User>('/api/auth/me'),
}

// ================================================================
// CART
// ================================================================
export const cartApi = {
  get: () => apiFetch<Cart>('/api/cart'),

  addItem: (data: { product_id: string; quantity: number }) =>
    apiFetch<Cart>('/api/cart/items', { method: 'POST', body: JSON.stringify(data) }),

  updateItem: (itemId: string, data: { quantity: number }) =>
    apiFetch<Cart>(`/api/cart/items/${itemId}`, { method: 'PUT', body: JSON.stringify(data) }),

  removeItem: (itemId: string) =>
    apiFetch<void>(`/api/cart/items/${itemId}`, { method: 'DELETE' }),
}
