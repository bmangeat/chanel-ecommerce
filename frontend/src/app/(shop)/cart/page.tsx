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

export default function CartPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <h1 className="mb-10 font-serif text-3xl text-chanel-black">Votre Panier</h1>
      <div className="flex h-64 items-center justify-center border border-chanel-gray-light">
        <p className="text-xs uppercase tracking-luxury text-chanel-gray">
          Exercise 3 — À implémenter
        </p>
      </div>
    </div>
  )
}
