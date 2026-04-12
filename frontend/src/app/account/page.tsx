// ----------------------------------------------------------------
// EXERCISE 4 — Cette page doit être protégée par le middleware Next.js
// ----------------------------------------------------------------
// Pour l'instant elle est accessible à tous. Après l'Exercise 4 :
//   → Le middleware.ts redirigera vers /login?next=/account si le cookie
//     auth_token est absent ou invalide.
//
// TODO (Exercise 4) :
//   Implémenter middleware.ts à la racine du projet :
//   1. Lire le cookie 'auth_token' depuis request.cookies
//   2. Vérifier sa validité (jose ou @auth/next-auth ou jwtVerify)
//   3. Si invalide → NextResponse.redirect('/login?next=' + pathname)
//   4. Configurer le matcher pour protéger /account et /cart
// ----------------------------------------------------------------

import { cookies } from 'next/headers'

async function getUser() {
  const cookieStore = await cookies()
  const token = cookieStore.get('auth_token')
  if (!token) return null

  try {
    const res = await fetch(`${process.env.API_URL}/api/auth/me`, {
      headers: { Cookie: `auth_token=${token.value}` },
      cache: 'no-store',
    })
    if (!res.ok) return null
    return res.json()
  } catch {
    return null
  }
}

export default async function AccountPage() {
  const user = await getUser()

  if (!user) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-12">
        <p className="text-sm text-chanel-gray">
          Vous n&apos;êtes pas connecté.{' '}
          <a href="/login?next=/account" className="underline">
            Se connecter
          </a>
        </p>
        <p className="mt-4 text-xs text-chanel-gray-light">
          (Exercise 4 : Redirection automatique via middleware à implémenter)
        </p>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <h1 className="mb-10 font-serif text-3xl text-chanel-black">Mon Compte</h1>

      <div className="grid gap-8 md:grid-cols-2">
        <div className="border border-chanel-gray-light p-6">
          <h2 className="mb-4 text-xs uppercase tracking-luxury text-chanel-black">Informations personnelles</h2>
          <p className="text-sm text-chanel-gray-dark">
            {user.first_name} {user.last_name}
          </p>
          <p className="text-sm text-chanel-gray">{user.email}</p>
        </div>

        <div className="border border-chanel-gray-light p-6">
          <h2 className="mb-4 text-xs uppercase tracking-luxury text-chanel-black">Mes commandes</h2>
          <p className="text-xs text-chanel-gray">
            Exercise 8 — Historique des commandes à implémenter
          </p>
        </div>
      </div>
    </div>
  )
}
