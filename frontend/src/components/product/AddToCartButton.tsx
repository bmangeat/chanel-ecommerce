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

interface AddToCartButtonProps {
  productId: string
  stock: number
}

export function AddToCartButton({ productId: _productId, stock }: AddToCartButtonProps) {
  // TODO : Implémenter avec useAddToCart()

  if (stock === 0) {
    return (
      <Button variant="secondary" disabled className="w-full">
        Indisponible
      </Button>
    )
  }

  return (
    <Button variant="primary" className="w-full">
      Ajouter au panier
    </Button>
  )
}
