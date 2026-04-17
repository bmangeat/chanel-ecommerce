// ----------------------------------------------------------------
// EXERCISE 4 — Implémenter ce middleware
// ----------------------------------------------------------------
// Le middleware s'exécute côté Edge, avant le rendu de chaque page.
// Il a accès aux cookies (dont auth_token) et peut rediriger.
//
// TODO :
//   1. Importer NextResponse depuis 'next/server'
//   2. Dans la fonction middleware(request: NextRequest) :
//      a. Lire le cookie : request.cookies.get('auth_token')?.value
//      b. Si le cookie est absent → rediriger vers /login?next={pathname}
//      c. Vérifier la signature JWT avec jose (import { jwtVerify } from 'jose') :
//         const secret = new TextEncoder().encode(process.env.JWT_SECRET)
//         try { await jwtVerify(token, secret) }
//         catch { redirect to /login }
//      d. Si valide → return NextResponse.next()
//
//   3. Exporter le config.matcher pour protéger les routes privées :
//      export const config = {
//        matcher: ['/account/:path*', '/cart/:path*', '/orders/:path*'],
//      }
//
// Note : Le Edge Runtime ne peut pas utiliser node-jwt directement.
//        Utiliser 'jose' (npm install jose) qui est compatible Edge.
//
// 💡 C'est la réponse à la question d'entretien :
//    "Si j'utilise un cookie HttpOnly, comment mon SSR sait-il si
//     l'utilisateur est connecté avant d'afficher la page ?"
// ----------------------------------------------------------------

import { NextRequest, NextResponse } from "next/server"
import { jwtVerify } from 'jose';

export async function middleware(request: NextRequest) {
  const authToken = request.cookies.get('auth_token')?.value

  if (!authToken) {
    return NextResponse.redirect(new URL('/login?next=' + request.nextUrl.pathname, request.url))
  }
  const secret = new TextEncoder().encode(process.env.JWT_SECRET)
  try { await jwtVerify(authToken, secret)} catch {
    return NextResponse.redirect(new URL('/login?next=' + request.nextUrl.pathname, request.url))
  } 
  return NextResponse.next()
}

export const config = {
  matcher: ['/account/:path*', '/cart/:path*', '/orders/:path*'],
}
