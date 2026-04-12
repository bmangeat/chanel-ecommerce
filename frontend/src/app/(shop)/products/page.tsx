import type { Metadata } from 'next'
import { ProductGrid } from '@/components/product/ProductGrid'
import type { ProductListResponse } from '@/lib/types'

export const metadata: Metadata = { title: 'Collections' }

// ISR — revalidation toutes les 60 secondes
// EXERCISE 9 : Remplacer par revalidate + tags pour une invalidation ciblée
export const revalidate = 60

interface PageProps {
  searchParams: Promise<{ category?: string }>
}

async function getProducts(category?: string): Promise<ProductListResponse> {
  const qs = new URLSearchParams({ limit: '20', offset: '0' })
  if (category) qs.set('category', category)

  // fetch côté serveur — Next.js met cette réponse en cache (ISR)
  const res = await fetch(`${process.env.API_URL}/api/products?${qs}`, {
    next: { revalidate: 60 },
  })

  if (!res.ok) throw new Error('Impossible de charger les produits')
  return res.json()
}

export default async function ProductsPage({ searchParams }: PageProps) {
  const { category } = await searchParams
  const { data: products, total } = await getProducts(category)

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      {/* En-tête */}
      <div className="mb-10">
        <h1 className="font-serif text-3xl text-chanel-black">
          {category ?? 'Toutes les Collections'}
        </h1>
        <p className="mt-1 text-xs text-chanel-gray">{total} création{total > 1 ? 's' : ''}</p>
      </div>

      {/* Filtres catégories */}
      <nav className="mb-10 flex flex-wrap gap-4 border-b border-chanel-gray-light pb-6">
        {[undefined, 'Sacs', 'Prêt-à-porter', 'Parfums', 'Beauté', 'Horlogerie', 'Joaillerie', 'Accessoires', 'Chaussures'].map((cat) => (
          <a
            key={cat ?? 'all'}
            href={cat ? `/products?category=${cat}` : '/products'}
            className={`text-xs uppercase tracking-luxury transition-colors ${
              (category ?? undefined) === cat
                ? 'text-chanel-black underline underline-offset-4'
                : 'text-chanel-gray hover:text-chanel-black'
            }`}
          >
            {cat ?? 'Tout'}
          </a>
        ))}
      </nav>

      <ProductGrid products={products} />
    </div>
  )
}
