import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'CHANEL — Maison de Couture',
}

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative flex h-[calc(100vh-4rem)] items-center justify-center bg-chanel-black">
        <div className="text-center">
          <p className="mb-6 text-xs uppercase tracking-[0.4em] text-chanel-gray">
            Nouvelle Collection
          </p>
          <h1 className="mb-8 font-serif text-5xl text-white md:text-7xl">
            L&apos;Élégance <br /> Intemporelle
          </h1>
          <Link
            href="/products"
            className="inline-block border border-white px-12 py-3 text-xs uppercase tracking-luxury text-white transition-colors hover:bg-white hover:text-chanel-black"
          >
            Découvrir
          </Link>
        </div>
      </section>

      {/* Catégories */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <h2 className="mb-12 text-center font-serif text-2xl text-chanel-black">
          Nos Univers
        </h2>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          {[
            { name: 'Sacs', color: 'bg-stone-100' },
            { name: 'Prêt-à-porter', color: 'bg-zinc-100' },
            { name: 'Parfums', color: 'bg-amber-50' },
            { name: 'Beauté', color: 'bg-rose-50' },
            { name: 'Horlogerie', color: 'bg-slate-100' },
            { name: 'Joaillerie', color: 'bg-yellow-50' },
          ].map((cat) => (
            <Link
              key={cat.name}
              href={`/products?category=${cat.name}`}
              className={`group flex h-40 items-center justify-center ${cat.color} transition-opacity hover:opacity-80`}
            >
              <span className="text-xs uppercase tracking-luxury text-chanel-black">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
