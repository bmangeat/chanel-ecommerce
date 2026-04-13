'use client'

// ----------------------------------------------------------------
// EXERCISE 2 — Implémenter ce composant après avoir terminé
//              la route POST /api/cart/items côté Fastify
// ----------------------------------------------------------------
// Ce composant gère l'ajout au panier avec Optimistic UI.
//
// TODO :
//   1. Importer useAddToCart depuis '@/lib/hooks/useCart' (Exercise 3)
//   2. Au clic, appeler la mutation avec { product_id, quantity: 1 }
//   3. Gérer les états :
//      - isPending : bouton en loading avec spinner
//      - isError + status 409 : afficher "Rupture de stock" en rouge,
//        rollback automatique via onError dans le hook
//      - isSuccess : feedback visuel bref ("Ajouté")
//   4. Si stock === 0 (prop passée depuis le composant parent) :
//      → Désactiver le bouton, afficher "Indisponible"
//
// ⚠️ Le stock passé en prop vient du rendu SSR (donc peut être légèrement
//    périmé). La vérification réelle se fait côté Fastify au moment du POST.
//    Le front ne fait que refléter l'état probable.
//
// Props attendues :
//   productId: string
//   stock: number     (stock côté SSR — peut être stale)
// ----------------------------------------------------------------

import { Button } from '@/components/ui/Button'
import { useAddToCart } from '@/lib/hooks/useCart'

interface AddToCartButtonProps {
  productId: string
  stock: number
}

export function AddToCartButton({ productId, stock }: AddToCartButtonProps) {
  const { mutateAsync: addToCart, isPending, isError, error, isSuccess } = useAddToCart()
  // TODO : Implémenter avec useAddToCart()

  if (stock === 0) {
    return (
      <Button variant="secondary" disabled className="w-full">
        Indisponible
      </Button>
    )
  }
   if (isPending) {
    return (
      <Button loading variant="primary" disabled className="w-full">
        Ajout en cours...
      </Button>
    )
  }


  if (isError && error.cause === 409) {
    return (
      <Button variant="secondary" disabled className="w-full">
        Rupture de stock
      </Button>
    )
  }

  return (
    <>
      <PopUpAddToCart isSuccess={isSuccess} />
      <Button variant="primary" onClick={() => addToCart({ product_id: productId, quantity: 1 })} className="w-full">
        Ajouter au panier
      </Button>
    </>
  )
}

export function PopUpAddToCart({ isSuccess }: { isSuccess: boolean }) {
  if (isSuccess) {
    return (
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-chanel-black px-6 py-3">
        <span className="text-white">Ajouté au panier</span>
      </div>
    )
  }
  return null
}