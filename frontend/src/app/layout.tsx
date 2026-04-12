import type { Metadata } from 'next'
import './globals.css'
import { Providers } from '@/components/providers'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

export const metadata: Metadata = {
  title: { default: 'CHANEL', template: '%s | CHANEL' },
  description: 'La maison de mode, de parfumerie et de haute couture.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>
        <Providers>
          <Header />
          <main className="min-h-screen pt-16">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  )
}
