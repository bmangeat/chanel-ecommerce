import Link from 'next/link'

export default function ProductNotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 px-6">
      <p className="text-xs uppercase tracking-luxury text-chanel-gray">Produit introuvable</p>
      <h1 className="font-serif text-3xl text-chanel-black">Cette création n&apos;est plus disponible</h1>
      <Link
        href="/products"
        className="text-xs uppercase tracking-luxury text-chanel-gray underline underline-offset-4 hover:text-chanel-black"
      >
        Voir toutes les collections
      </Link>
    </div>
  )
}
