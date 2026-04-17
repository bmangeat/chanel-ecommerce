'use client'

// ----------------------------------------------------------------
// EXERCISE 3 — Implémenter la page panier
// ----------------------------------------------------------------
// TODO :
//   1. Importer useCart depuis '@/lib/hooks/useCart' (Exercise 3)
//   2. Afficher un loader pendant isLoading
//   3. Afficher un message si le panier est vide avec un lien vers /products
//   4. Afficher la liste des CartItem :
//      - Nom, prix unitaire, quantité, sous-total
//      - Bouton pour modifier la quantité (+/-)
//      - Bouton pour supprimer l'article
//   5. Afficher le total du panier
//   6. Bouton "Commander" qui appelle POST /api/orders (Exercise 8)
//
// Si l'utilisateur n'est pas connecté (erreur 401 sur GET /cart) :
//   → Rediriger vers /login avec next=/cart en param
//
// Composant CartItem suggéré : src/components/cart/CartItem.tsx
// ----------------------------------------------------------------

import Link from "next/link"
import { useCart, useRemoveFromCart, useUpdateCartItem } from "@/lib/hooks/useCart"
import { CartItem } from "@/components/cart/CartItem"

export default function CartPage() {
  const { data: cart, isLoading, isError, error } = useCart()
  const { mutate: removeItem } = useRemoveFromCart()
  const { mutate: updateItem } = useUpdateCartItem()

  if (isLoading) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-12">
        <h1 className="mb-10 font-serif text-3xl text-chanel-black">Votre Panier</h1>
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-chanel-black border-t-transparent"></div>
        </div>
      </div>
    )
  }

  if (!cart || isError) {
    const status = (error as Error & { status?: number }).status;

    if (status !== 401) {
      return (
      <div className="mx-auto max-w-4xl px-6 py-12">
        <h1 className="mb-10 font-serif text-3xl text-chanel-black">Votre Panier</h1>
        <div className="flex h-64 items-center justify-center border border-chanel-gray-light">
          <p className="text-center text-sm text-chanel-gray">
            Erreur lors du chargement du panier.
            <br />
            <button
              onClick={() => window.location.reload()}
              className="mt-4 inline-block text-xs uppercase tracking-luxury text-chanel-black hover:underline"
            >
              Recharger la page
            </button>
          </p>
        </div>
      </div>
      )
    }

    return (
      <div className="mx-auto max-w-4xl px-6 py-12">
        <h1 className="mb-10 font-serif text-3xl text-chanel-black">Votre Panier</h1>
        <div className="flex h-64 items-center justify-center border border-chanel-gray-light">
          <p className="text-center text-sm text-chanel-gray">
            Vous devez être connecté pour accéder à votre panier.
            <br />
            <Link
              href="/login?next=/cart"
              className="mt-4 inline-block text-xs uppercase tracking-luxury text-chanel-black hover:underline"
            >
              Se connecter
            </Link>
          </p>
        </div>
      </div>
    )
  }

  if (cart.items.length === 0) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-12">
        <h1 className="mb-10 font-serif text-3xl text-chanel-black">Votre Panier</h1>
        <div className="flex h-64 items-center justify-center border border-chanel-gray-light">
          <p className="text-center text-sm text-chanel-gray">
            Votre panier est vide.
            <br />
            <Link
              href="/products"
              className="mt-4 inline-block text-xs uppercase tracking-luxury text-chanel-black hover:underline"
            >
              Découvrir nos produits
            </Link>
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <h1 className="mb-10 font-serif text-3xl text-chanel-black">Votre Panier</h1>

      <div className="space-y-6">
        {cart.items.map((item) => (
          <CartItem
            key={item.id}
            item={item}
            onRemove={() => removeItem(item.id)}
            onUpdateQuantity={(quantity) => updateItem({ id: item.id, quantity })}
          />
        ))}
      </div>

      {/* Total du panier */}
      <div className="mt-12 flex items-center justify-between border-t border-chanel-gray-light pt-6">
        <span className="text-xs uppercase tracking-luxury text-chanel-black">
          Total
        </span>
        <span className="font-serif text-2xl text-chanel-black">
          {cart.total.toFixed(2)} MAD
        </span>
      </div>

      {/* Bouton Commander */}
      <div className="mt-8">
        <Link
          href="/checkout?next=/cart"
          className="block w-full bg-chanel-black px-8 py-3 text-center text-xs font-medium tracking-wider text-white uppercase hover:bg-chanel-black/80"
        >
          Commander
        </Link>
      </div>
    </div>
  )
}

