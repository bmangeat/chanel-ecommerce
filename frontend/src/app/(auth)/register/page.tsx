'use client'

import { useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { authApi } from '@/lib/api'

export default function RegisterPage() {
  const router = useRouter()
  const [form, setForm] = useState({ email: '', password: '', first_name: '', last_name: '' })
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      await authApi.register(form)
      // Après inscription, rediriger vers login
      router.push('/login')
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
        <h1 className="mb-10 text-center font-serif text-3xl text-chanel-black">Créer un compte</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <Input id="first_name" name="first_name" label="Prénom" value={form.first_name} onChange={handleChange} />
            <Input id="last_name" name="last_name" label="Nom" value={form.last_name} onChange={handleChange} />
          </div>
          <Input
            id="email"
            name="email"
            type="email"
            label="Adresse e-mail"
            value={form.email}
            onChange={handleChange}
            required
            autoComplete="email"
          />
          <Input
            id="password"
            name="password"
            type="password"
            label="Mot de passe (min. 8 caractères)"
            value={form.password}
            onChange={handleChange}
            required
            minLength={8}
            autoComplete="new-password"
          />

          {error && (
            <p className="text-xs text-red-600" role="alert">
              {error}
            </p>
          )}

          <Button type="submit" className="w-full" loading={loading}>
            Créer mon compte
          </Button>
        </form>

        <p className="mt-8 text-center text-xs text-chanel-gray">
          Déjà client ?{' '}
          <Link href="/login" className="text-chanel-black underline underline-offset-4">
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  )
}
