import Link from 'next/link'
import Image from 'next/image'
import type { Product } from '@/lib/types'
import { formatPrice } from '@/lib/utils'

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Link href={`/products/${product.id}`} className="group block">
      {/* Image */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-chanel-gray-light">
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <span className="text-xs uppercase tracking-luxury text-chanel-gray">Image indisponible</span>
          </div>
        )}

        {/* Badge édition limitée */}
        {product.is_limited_edition && (
          <div className="absolute left-3 top-3 bg-chanel-black px-2 py-1">
            <span className="text-[9px] uppercase tracking-luxury text-white">Édition limitée</span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="mt-4 space-y-1">
        <p className="text-[10px] uppercase tracking-luxury text-chanel-gray">{product.category}</p>
        <h3 className="font-serif text-sm text-chanel-black">{product.name}</h3>
        <p className="text-sm text-chanel-gray-dark">{formatPrice(product.price)}</p>
      </div>
    </Link>
  )
}
