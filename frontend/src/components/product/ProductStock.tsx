'use client'

import { useProductStock } from "@/lib/hooks/useProduct"

// ----------------------------------------------------------------
// EXERCISE 1 — Implémenter ce composant
// ----------------------------------------------------------------
// Ce composant est un Client Component qui affiche le stock en temps réel.
// Il doit fetcher GET /api/products/:id/stock avec TanStack Query
// pour avoir une donnée fraîche, sans bloquer le rendu SSR de la page.
//
// TODO :
//   1. Importer useProductStock depuis '@/lib/hooks/useProduct'
//   2. Afficher un skeleton pendant le chargement (isLoading)
//   3. Afficher le stock avec une couleur contextuelle :
//      - stock > 5 : vert (disponible)
//      - stock 1-5 : orange (stock limité)
//      - stock === 0 : rouge (rupture de stock)
//   4. Pour les éditions limitées (is_limited_edition === true) :
//      → Afficher "Plus que X exemplaire(s)" plutôt qu'un simple chiffre
//   5. Gérer l'état d'erreur : si l'API ne répond pas, afficher
//      "Disponibilité sur demande" (Graceful Degradation — Exercise 7)
//
// Props attendues :
//   productId: string
//
// 💡 Ce composant illustre le pattern "hybrid rendering" de l'entretien :
//    Le "squelette" de la page est statique (ISR), mais le stock est dynamique.
// ----------------------------------------------------------------

interface ProductStockProps {
  productId: string
}

export function ProductStock({ productId }: ProductStockProps) {
  const { data, isLoading, error } = useProductStock(productId)
  return (
    <div aria-live="polite" aria-atomic="true">
      {isLoading && <div className="h-5 w-32 animate-pulse rounded bg-chanel-gray-light" aria-label="Chargement du stock" />}
      {!isLoading && (error || !data) && <p>Disponibilité sur demande</p>}
      {!isLoading && data && <StockDisplay stock={data.stock} isLimitedEdition={data.is_limited_edition} />}
    </div>
  )
}

const StockDisplay = ({ stock, isLimitedEdition }: { stock: number, isLimitedEdition: boolean }) => {
  if (stock === 0) {
    return <div className="text-red-500">Rupture de stock</div>
  }
  if (isLimitedEdition) {
    return <div className="text-orange-500">Plus que {stock} exemplaire(s)</div>
  }

if (stock > 5) return <div className="text-green-500">{stock} unités</div>
return <div className="text-orange-500">{stock} unités</div>
}

