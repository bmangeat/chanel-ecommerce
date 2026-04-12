'use client'

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

export {}
