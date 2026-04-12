import Link from 'next/link'

export function Header() {
  return (
    <header className="fixed top-0 z-50 w-full border-b border-chanel-gray-light bg-chanel-white/95 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        {/* Logo */}
        <Link href="/" className="font-serif text-xl tracking-widest text-chanel-black">
          CHANEL
        </Link>

        {/* Navigation */}
        <nav className="hidden gap-8 md:flex">
          {['Mode', 'Sacs', 'Beauté', 'Parfums', 'Horlogerie', 'Joaillerie'].map((item) => (
            <Link
              key={item}
              href={`/products?category=${item}`}
              className="text-xs uppercase tracking-luxury text-chanel-gray transition-colors hover:text-chanel-black"
            >
              {item}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-6">
          <Link
            href="/account"
            className="text-xs uppercase tracking-luxury text-chanel-gray transition-colors hover:text-chanel-black"
            aria-label="Mon compte"
          >
            Compte
          </Link>
          <Link
            href="/cart"
            className="relative text-xs uppercase tracking-luxury text-chanel-gray transition-colors hover:text-chanel-black"
            aria-label="Panier"
          >
            Panier
            {/* EXERCISE 3 bonus — afficher le nombre d'articles */}
          </Link>
        </div>
      </div>
    </header>
  )
}
