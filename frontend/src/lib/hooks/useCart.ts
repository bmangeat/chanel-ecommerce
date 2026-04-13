'use client'

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Cart } from "../types"
import { cartApi } from "../api"

// ----------------------------------------------------------------
// EXERCISE 3 — Implémenter ce hook avec TanStack Query
// ----------------------------------------------------------------
// TODO :
//   1. Créer les query keys (cartKeys)
//   2. Créer useCart() qui fetch GET /api/cart via cartApi.get()
//      - staleTime : 0 (le panier doit toujours être frais)
//      - retry : false (si 401, ne pas retenter)
//
//   3. Créer useAddToCart() avec useMutation
//      - onMutate : Optimistic update — ajouter l'item localement avant la réponse serveur
//      - onError : Rollback du cache si l'API renvoie une erreur (ex: stock épuisé)
//      - onSettled : Invalider le cache pour forcer un refetch
//
//   4. Créer useRemoveFromCart() avec useMutation
//      - Même pattern optimiste
//
//   5. Créer useUpdateCartItem() avec useMutation
//
// 💡 L'optimistic update est la clé de l'UX premium :
//    L'utilisateur voit l'ajout immédiatement, et en cas d'erreur 409 (stock épuisé)
//    on rollback proprement avec un message d'erreur élégant.
//
// Imports nécessaires :
//   import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
//   import { cartApi } from '../api'
//   import type { Cart } from '../types'
// ----------------------------------------------------------------

export const cartKeys = {
    all: ['cart'] as const,
    lists: () => [...cartKeys.all, 'list'] as const,
    list: (params: Record<string, unknown>) => [...cartKeys.lists(), params] as const,
    details: () => [...cartKeys.all, 'detail'] as const,
    detail: (id: string) => [...cartKeys.details(), id] as const,
}

export function useCart() {
    return useQuery<Cart>({
        queryKey: cartKeys.all,
        queryFn: cartApi.get,
        staleTime: 0,
        retry: false,
    })
}

export function useAddToCart() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (data: { product_id: string; quantity: number }) => cartApi.addItem(data),
        onMutate: async (data) => {
            await queryClient.cancelQueries({ queryKey: cartKeys.all })
            const previousCart = queryClient.getQueryData(cartKeys.all)
            queryClient.setQueryData(cartKeys.all, (oldCart: Cart | undefined) => {
                if (!oldCart) return undefined;
                const newItem = {
                    id: 'temp-' + data.product_id,
                    product_id: data.product_id,
                    quantity: data.quantity,
                    product: {
                        id: data.product_id,
                        name: '',
                        price: 0,
                        image_url: null,
                        stock: 0
                    },
                }
                return {
                    ...oldCart,
                    items: [...oldCart.items, newItem],
                }
            });
            return { previousCart };
        },
        onError: (_err, _data, context) => {
            if (context?.previousCart) {
                queryClient.setQueryData(cartKeys.all, context.previousCart);
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: cartKeys.all });
        }
    });
}

export function useRemoveFromCart() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (id: string) => cartApi.removeItem(id),
        onMutate: async (data) => {
            await queryClient.cancelQueries({ queryKey: cartKeys.all })
            const previousCart = queryClient.getQueryData(cartKeys.all);
            queryClient.setQueryData(cartKeys.all, (oldCart: Cart | undefined) => {
                if (!oldCart) return undefined;
                return {
                    ...oldCart,
                    items: oldCart.items.filter((item) => item.id !== data)
                }
            })
            return { previousCart };
        },
        onError: (_err, _data, context) => {
            if (context?.previousCart) {
                queryClient.setQueryData(cartKeys.all, context.previousCart);
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: cartKeys.all });
        }
    })
}

export function useUpdateCartItem() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (data: { id: string; quantity: number }) => cartApi.updateItem(data.id, { quantity: data.quantity }),
        onMutate: async (data) => {
            await queryClient.cancelQueries({ queryKey: cartKeys.all })
            const previousCart = queryClient.getQueryData(cartKeys.all);
            queryClient.setQueryData(cartKeys.all, (oldCart: Cart | undefined) => {
                if (!oldCart) return undefined;
                return {
                    ...oldCart,
                    items: oldCart.items.map(item => item.id === data.id ? { ...item, quantity: data.quantity } : item)
                }
            })
            return { previousCart }
        },
        onError: (_err, _data, context) => {
            if (context?.previousCart) {
                queryClient.setQueryData(cartKeys.all, context.previousCart);
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: cartKeys.all });
        }
    })
}