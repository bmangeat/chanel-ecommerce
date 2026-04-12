'use client'

import { useState, type FormEvent } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { authApi } from '@/lib/api'
import type { Metadata } from 'next'

// Note : metadata ne fonctionne pas dans les Client Components.
// Déplacer dans un Server Component wrapper si SEO important.
export const metadata: Metadata = { title: 'Connexion' }

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const next = searchParams.get('next') ?? '/account'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      await authApi.login({ email, password })
      router.push(next)
      router.refresh() // Rafraîchit les Server Components (ex: header)
    } catch (err) {
      const message = (err as { message?: string })?.message ?? 'Une erreur est survenue'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <h1 className="mb-10 text-center font-serif text-3xl text-chanel-black">Connexion</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            id="email"
            type="email"
            label="Adresse e-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
          <Input
            id="password"
            type="password"
            label="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />

          {error && (
            <p className="text-xs text-red-600" role="alert">
              {error}
            </p>
          )}

          <Button type="submit" className="w-full" loading={loading}>
            Se connecter
          </Button>
        </form>

        <p className="mt-8 text-center text-xs text-chanel-gray">
          Pas encore de compte ?{' '}
          <Link href="/register" className="text-chanel-black underline underline-offset-4">
            Créer un compte
          </Link>
        </p>
      </div>
    </div>
  )
}
