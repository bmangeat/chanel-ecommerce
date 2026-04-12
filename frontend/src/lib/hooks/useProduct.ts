'use client'

import { useQuery } from '@tanstack/react-query'
import { productsApi } from '../api'

export const productKeys = {
  all: ['products'] as const,
  lists: () => [...productKeys.all, 'list'] as const,
  list: (params: Record<string, unknown>) => [...productKeys.lists(), params] as const,
  details: () => [...productKeys.all, 'detail'] as const,
  detail: (id: string) => [...productKeys.details(), id] as const,
  stock: (id: string) => [...productKeys.all, 'stock', id] as const,
}

export function useProductStock(productId: string) {
  return useQuery({
    queryKey: productKeys.stock(productId),
    queryFn: () => productsApi.getStock(productId),
    // Refetch toutes les 30 secondes pour garder le stock à jour
    refetchInterval: 30_000,
    staleTime: 10_000,
  })
}

export function useProducts(params?: { category?: string }) {
  return useQuery({
    queryKey: productKeys.list(params ?? {}),
    queryFn: () => productsApi.list(params),
    staleTime: 60_000,
  })
}
