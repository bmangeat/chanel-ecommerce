import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },

  // EXERCISE 9 — ISR avec revalidation par tags
  // Les routes /api/products/* sont configurées avec un cache de 30s.
  // Voir : app/(shop)/products/page.tsx et app/(shop)/products/[id]/page.tsx
}

export default nextConfig
