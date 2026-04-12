# Feuille de route — Exercices d'entraînement

Projet : E-commerce headless CHANEL — Next.js 15 + Fastify 5 + PostgreSQL

---

## Démarrage rapide

```bash
# 1. Lancer la base de données
docker compose up -d

# 2. Backend
cd backend
cp .env.example .env     # (déjà fait, .env présent)
pnpm install
pnpm dev                 # http://localhost:3001
                         # Swagger : http://localhost:3001/docs

# 3. Frontend
cd frontend
pnpm install
pnpm dev                 # http://localhost:3000
```

---

## Exercice 1 — Affichage du stock en temps réel ⭐⭐

**Fichier** : `frontend/src/components/product/ProductStock.tsx`

**Concept** : Hybrid rendering — le squelette SSR + données dynamiques client.

**Ce que tu vas implémenter** :
- Utiliser `useProductStock(productId)` (hook déjà fourni)
- Afficher un skeleton pendant `isLoading`
- Afficher le stock avec une couleur contextuelle (vert / orange / rouge)
- Pour les éditions limitées : "Plus que X exemplaire(s)"
- Si l'API ne répond pas : "Disponibilité sur demande" (graceful degradation)

**Tester** : Lance le backend, va sur `/products/:id`. Le skeleton doit apparaître brièvement puis afficher le stock réel. Coupe le backend — le message de fallback doit s'afficher.

---

## Exercice 2 — Ajouter au panier (Fastify + Optimistic UI) ⭐⭐⭐

**Fichiers** :
- `backend/src/routes/cart/index.ts` → route `POST /api/cart/items`
- `frontend/src/components/product/AddToCartButton.tsx`

**Ce que tu vas implémenter côté backend** :
1. Récupérer ou créer le panier via `getOrCreateCart()`
2. Vérifier que le produit existe et que `stock >= quantity`
3. Gérer le cas "produit déjà dans le panier" (UPDATE quantity)
4. Décrémenter le stock dans `products`
5. Utiliser une **transaction PostgreSQL** (`BEGIN / COMMIT / ROLLBACK`) pour l'atomicité
6. Pour les éditions limitées : vérifier la colonne `version` (optimistic locking)

**Ce que tu vas implémenter côté frontend** :
- Connecter `AddToCartButton` au hook `useAddToCart` (Exercise 3)
- Gérer les états loading, success, error (409 = rupture de stock)

**Question d'entretien associée** : "Comment gérer les race conditions lors d'un lancement de produit limité ?"

---

## Exercice 3 — Gestion complète du panier ⭐⭐⭐

**Fichiers** :
- `backend/src/routes/cart/index.ts` → `PUT /api/cart/items/:itemId` et `DELETE /api/cart/items/:itemId`
- `frontend/src/lib/hooks/useCart.ts`
- `frontend/src/app/(shop)/cart/page.tsx`

**Ce que tu vas implémenter** :
1. Le hook `useCart.ts` complet avec TanStack Query :
   - `useCart()` — query GET /api/cart
   - `useAddToCart()` — mutation avec **optimistic update** (⚠️ clé de l'exercice)
   - `useRemoveFromCart()` — mutation avec optimistic update
   - `useUpdateCartItem()` — mutation avec optimistic update
2. La page `/cart` avec liste d'articles, quantités, total, bouton commander
3. Les routes Fastify manquantes (PUT/DELETE avec ajustement du stock)

**Concept clé** : Dans `onMutate`, sauvegarder le snapshot du cache (`queryClient.getQueryData`), mettre à jour optimistement, puis `onError` rollback avec `queryClient.setQueryData(snapshot)`.

---

## Exercice 4 — Middleware d'authentification Next.js ⭐⭐

**Fichier** : `frontend/middleware.ts`

**Ce que tu vas implémenter** :
```bash
# Installer jose (compatible Edge Runtime)
cd frontend && pnpm add jose
```

1. Lire `request.cookies.get('auth_token')`
2. Vérifier la signature JWT avec `jwtVerify` de `jose`
3. Rediriger vers `/login?next={pathname}` si invalide ou absent
4. Configurer le `matcher` pour `/account/:path*`, `/cart/:path*`

**Tester** : Va sur `/account` sans être connecté → tu dois être redirigé vers `/login?next=/account`. Après connexion, tu dois atterrir sur `/account`.

**Question d'entretien associée** : "Si le JWT est dans un cookie HttpOnly, comment le SSR sait-il si l'utilisateur est connecté ?"

---

## Exercice 5 — Rate Limiting sur les routes d'auth ⭐

**Fichier** : `backend/src/app.ts`

**Ce que tu vas implémenter** :
```typescript
import rateLimit from '@fastify/rate-limit'

// Global : 200 req/min
fastify.register(rateLimit, { max: 200, timeWindow: '1 minute' })

// Sur /api/auth/* : 10 req/15min (config par route dans routes/auth/index.ts)
fastify.register(rateLimit, { max: 10, timeWindow: '15 minutes', keyGenerator: (req) => req.ip })
```

**Tester** : Faire 11 requêtes POST `/api/auth/login` rapidement → la 11e doit retourner 429 Too Many Requests.

---

## Exercice 6 — Verrouillage optimiste pour les éditions limitées ⭐⭐⭐⭐

**Fichier** : `backend/src/routes/cart/index.ts` (dans POST /api/cart/items)

**Concept** : Éviter que deux clients n'achètent le dernier exemplaire simultanément.

**Ce que tu vas implémenter** :
```sql
-- Lecture avec version
SELECT stock, version FROM products WHERE id = $1 AND is_limited_edition = true

-- Mise à jour avec vérification de version (atomic check)
UPDATE products
SET stock = stock - $1, version = version + 1
WHERE id = $2 AND version = $3 AND stock >= $1
RETURNING stock
```
Si `rowCount === 0` → le stock a changé entre la lecture et l'écriture → retourner `409 Conflict`.

**Question d'entretien associée** : "Comment gérer la race condition lors du lancement du Sac Boy édition limitée ?"

---

## Exercice 7 — Graceful Degradation + ErrorBoundary ⭐⭐⭐

**Fichiers** :
- `frontend/src/components/product/ProductStock.tsx` (extension de l'Ex. 1)
- Créer `frontend/src/components/ErrorBoundary.tsx`

**Ce que tu vas implémenter** :
1. Un `ErrorBoundary` React (class component avec `componentDidCatch`)
2. Entourer `<ProductStock>` et `<AddToCartButton>` avec l'ErrorBoundary
3. Fallback : Si API down → "Disponibilité sur demande" + bouton "Contactez une boutique"
4. Simuler la panne : couper le backend et vérifier que la page produit reste utilisable

**Concept** : Circuit Breaker pattern côté frontend — l'UX se dégrade gracieusement plutôt que de crasher.

---

## Exercice 8 — Checkout (POST /api/orders) ⭐⭐⭐

**Fichier** : `backend/src/routes/orders/index.ts`

**Ce que tu vas implémenter** :
1. Récupérer le panier de l'utilisateur
2. Dans une transaction PostgreSQL :
   - Re-vérifier chaque stock (last check)
   - Créer l'ordre avec `status = 'confirmed'`
   - Créer les `order_items` avec **le prix de la DB au moment de l'achat**
   - Décrémenter les stocks
   - Vider le panier
3. Retourner l'ordre créé (201)

**La réponse à la question d'entretien** : "Le prix définitif est toujours calculé par le backend lors du checkout, jamais depuis le frontend."

---

## Exercice 9 — ISR avec cache tags ⭐⭐

**Fichiers** :
- `frontend/src/app/(shop)/products/page.tsx`
- `frontend/src/app/(shop)/products/[id]/page.tsx`
- `backend/src/routes/products/index.ts` (ajouter route de revalidation)

**Ce que tu vas implémenter** :
1. Remplacer `next: { revalidate: 30 }` par des tags : `next: { tags: ['products', \`product-${id}\`] }`
2. Créer une route Fastify `POST /api/revalidate` (protégée par token secret) qui appelle `revalidateTag` de Next.js
3. Ajouter `revalidatePath('/products')` après chaque modification de stock

**Concept** : ISR on-demand — invalider le cache ciblément plutôt que d'attendre le timeout.

---

## Exercice 10 — Protection CSRF ⭐⭐

**Fichier** : `backend/src/app.ts` + `backend/src/plugins/`

**Ce que tu vas implémenter** :
```bash
cd backend && pnpm add @fastify/csrf-protection
```

1. Enregistrer `@fastify/csrf-protection` dans l'app
2. Exposer `GET /api/csrf-token` qui retourne un token
3. Côté frontend, fetch ce token au montage et l'ajouter dans les headers des mutations : `'x-csrf-token': token`
4. Tester avec curl sans le header → doit retourner 403

---

## Récapitulatif

| # | Exercice | Concept clé | Difficulté |
|---|----------|-------------|-----------|
| 1 | Stock temps réel | TanStack Query + Hybrid rendering | ⭐⭐ |
| 2 | Add to cart (backend) | Fastify + Transaction SQL | ⭐⭐⭐ |
| 3 | Panier complet | Optimistic UI + CRUD | ⭐⭐⭐ |
| 4 | Middleware auth | JWT + Edge Runtime | ⭐⭐ |
| 5 | Rate limiting | @fastify/rate-limit | ⭐ |
| 6 | Optimistic locking | Race conditions | ⭐⭐⭐⭐ |
| 7 | Graceful degradation | ErrorBoundary + Circuit Breaker | ⭐⭐⭐ |
| 8 | Checkout | Transactions + business logic | ⭐⭐⭐ |
| 9 | ISR on-demand | Cache tags + revalidation | ⭐⭐ |
| 10 | CSRF | Sécurité | ⭐⭐ |

**Ordre conseillé** : 1 → 4 → 2 → 3 → 5 → 6 → 7 → 8 → 9 → 10
