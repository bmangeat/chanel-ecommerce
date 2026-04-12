import { notFound } from 'next/navigation'
import Image from 'next/image'
import type { Metadata } from 'next'
import type { Product } from '@/lib/types'
import { formatPrice } from '@/lib/utils'
import { ProductStock } from '@/components/product/ProductStock'
import { AddToCartButton } from '@/components/product/AddToCartButton'

// ISR — la fiche produit est statique mais revalidée toutes les 30s
// La latence simulée de 600ms côté API est absorbée par le cache ISR
// EXERCISE 9 : Ajouter des cache tags pour l'invalidation ciblée
export const revalidate = 30

interface PageProps {
  params: Promise<{ id: string }>
}

async function getProduct(id: string): Promise<Product | null> {
  const res = await fetch(`${process.env.API_URL}/api/products/${id}`, {
    next: { revalidate: 30, tags: [`product-${id}`] },
  })

  if (res.status === 404) return null
  if (!res.ok) throw new Error('Erreur serveur')
  return res.json()
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params
  const product = await getProduct(id)
  if (!product) return { title: 'Produit introuvable' }
  return {
    title: product.name,
    description: product.description ?? undefined,
  }
}

export default async function ProductPage({ params }: PageProps) {
  const { id } = await params
  const product = await getProduct(id)

  if (!product) notFound()

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <div className="grid gap-12 lg:grid-cols-2">
        {/* Visuel produit */}
        <div className="relative aspect-[3/4] w-full bg-chanel-gray-light">
          {product.image_url ? (
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <span className="text-xs uppercase tracking-luxury text-chanel-gray">
                Image indisponible
              </span>
            </div>
          )}
          {product.is_limited_edition && (
            <div className="absolute left-4 top-4 bg-chanel-black px-3 py-1.5">
              <span className="text-[9px] uppercase tracking-luxury text-white">Édition limitée</span>
            </div>
          )}
        </div>

        {/* Détails produit */}
        <div className="flex flex-col justify-center">
          <p className="mb-2 text-xs uppercase tracking-luxury text-chanel-gray">
            {product.category}
          </p>

          <h1 className="mb-6 font-serif text-3xl text-chanel-black">{product.name}</h1>

          <p className="mb-8 text-2xl text-chanel-gray-dark">{formatPrice(product.price)}</p>

          {/* Stock en temps réel — Client Component (Exercise 1) */}
          {/* Le rendu SSR affiche un skeleton, remplacé par le stock réel côté client */}
          <div className="mb-6">
            <ProductStock productId={product.id} />
          </div>

          {product.description && (
            <p className="mb-10 text-sm leading-relaxed text-chanel-gray">
              {product.description}
            </p>
          )}

          {/* Bouton panier — Client Component (Exercise 2) */}
          {/* Le stock passé en prop est le stock SSR (peut être légèrement périmé) */}
          {/* La validation finale est côté Fastify */}
          <AddToCartButton productId={product.id} stock={product.stock} />

          {/* Informations additionnelles */}
          <div className="mt-10 border-t border-chanel-gray-light pt-8 space-y-3">
            {[
              'Livraison offerte en boutique',
              'Emballage cadeau disponible',
              'Retours gratuits sous 30 jours',
            ].map((info) => (
              <p key={info} className="flex items-center gap-2 text-xs text-chanel-gray">
                <span className="h-px w-4 bg-chanel-gray" />
                {info}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
