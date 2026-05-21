# initial.md — AI Bootstrap Prompt

> **Instructions for the AI (Cline):**
> Read this entire file before writing a single line of code.
> Also read `engineering-guidelines.md` and `capability-definitions.md` in full.
> Those two documents are your law. This file is your task list.
> Build everything described. Do not skip sections. Do not summarise — generate real code.

---

## Mission

You are building **ShopForge** — a production-grade, full-stack eCommerce platform.

The stack:

- **Frontend**: React 18 + TypeScript + Vite + Tailwind CSS + Framer Motion + Zustand + React Query
- **Backend**: Node.js 20 + Express + TypeScript + TypeORM + MySQL
- **Structure**: Two independent folders — `frontend/` and `backend/`. No monorepo, no shared workspace.

Visual identity:

- Dark, premium aesthetic. Primary `#6C63FF`, surface `#1A1A2E`, accent `#E94560`.
- Every page must look like a real, polished SaaS product — not a tutorial project.
- Smooth Framer Motion transitions everywhere.

---

## Phase 1 — Project Scaffolding

### Step 1.1 — Root files

Create at the repo root:

- `.gitignore` covering `node_modules`, `dist`, `.env`, `*.local`
- `README.md` (placeholder — will be filled in later)

---

### Step 1.2 — Backend scaffolding

Scaffold `backend/` following the exact folder structure in **Engineering Guidelines §2.2**.

Create `backend/package.json`:

```json
{
  "name": "shopforge-backend",
  "version": "1.0.0",
  "scripts": {
    "dev": "ts-node-dev --respawn --transpile-only src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js",
    "type-check": "tsc --noEmit",
    "seed": "ts-node src/seed.ts",
    "typeorm": "ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js"
  }
}
```

Install these dependencies inside `backend/`:

```
express @types/express
typescript ts-node ts-node-dev @types/node tsconfig-paths
typeorm reflect-metadata mysql2
bcrypt @types/bcrypt
jsonwebtoken @types/jsonwebtoken
zod
helmet cors @types/cors
express-rate-limit
winston
dotenv
```

Create:

- `tsconfig.json` with `"emitDecoratorMetadata": true`, `"experimentalDecorators": true`, `strict: true`
- `src/config/env.ts` — Zod-validated env loader (app must not start if vars are missing)
- `src/config/database.ts` — TypeORM DataSource config
- `src/utils/logger.ts` — Winston logger (info/warn/error, JSON format in production)
- `src/utils/AppError.ts` — typed error class per Engineering Guidelines §6
- `src/middleware/errorHandler.ts` — global error handler middleware
- `src/middleware/requestLogger.ts` — logs method, path, status, duration
- `src/middleware/authMiddleware.ts` — JWT validation, attaches `req.user`
- `src/app.ts` — Express app factory (helmet, cors, json body parser, routes, error handler)
- `server.ts` — entry point, connects DB then listens

---

### Step 1.3 — Frontend scaffolding

Bootstrap with Vite:

```
npm create vite@latest frontend -- --template react-ts
```

Install:

```
tailwindcss postcss autoprefixer
framer-motion
zustand immer
@tanstack/react-query @tanstack/react-query-devtools
axios
react-router-dom
react-hook-form @hookform/resolvers zod @hookform/resolvers
react-hot-toast
lucide-react
```

Set up:

- `tailwind.config.ts` with the design tokens from Engineering Guidelines §10
- `src/lib/axios.ts` — configured Axios instance per Capability Definitions §9
- `src/lib/queryClient.ts` — React Query client with retry: 1, staleTime: 30s
- `src/styles/globals.css` — Tailwind directives + CSS custom properties for the palette
- `src/App.tsx` — Router setup with `<AnimatePresence>`, all routes declared
- Route structure (declare all routes now, pages can be stubs):
  ```
  /                    → HomePage
  /products            → CatalogPage
  /products/:slug      → ProductDetailPage
  /cart                → CartPage
  /checkout            → CheckoutPage  [AuthGuard]
  /login               → LoginPage     [GuestGuard]
  /register            → RegisterPage  [GuestGuard]
  /account             → AccountLayout [AuthGuard]
    /account/profile   → ProfilePage
    /account/orders    → OrdersPage
    /account/orders/:id → OrderDetailPage
  *                    → NotFoundPage
  ```

---

## Phase 2 — Database Schema & Migrations

Create TypeORM entities for all models defined in **Capability Definitions §2, §3, §4**:

- `User` entity: id (UUID), email (unique), passwordHash, firstName, lastName, avatarUrl,
  role (enum), createdAt, updatedAt, deletedAt
- `Category` entity: id, name, slug (unique), createdAt
- `Product` entity: all fields from §2 including relations to Category, ProductImage, and
  CartItem
- `ProductImage` entity: id, url, isPrimary, productId
- `Tag` entity: id, name, slug; ManyToMany with Product
- `Cart` entity: id, userId (nullable), sessionId, cartItems, updatedAt
- `CartItem` entity: id, cartId, productId, quantity, price
- `Order` entity: all fields from §4
- `OrderItem` entity: all fields from §4

After creating entities, generate an **initial migration** file:

```
npm run typeorm migration:generate -- -n InitialSchema
```

Create a **seed script** at `backend/src/seed.ts` per Capability Definitions §10.
Add `"seed": "ts-node src/seed.ts"` to backend package.json scripts.

---

## Phase 3 — Backend API Implementation

Implement the full backend API. For each module below, create the full stack:
`route → controller → service → repository`.

### 3.1 Auth routes (`/api/v1/auth`)

Implement all capabilities from **Capability Definitions §1 Backend**.

- `POST /auth/register` — validate with `RegisterDto` schema, call `AuthService.register`
- `POST /auth/login` — validate with `LoginDto`, return access token + set httpOnly cookie
- `POST /auth/refresh` — read cookie, verify refresh JWT, return new access token
- `POST /auth/logout` — clear cookie
- `GET /auth/me` — [authMiddleware] return `req.user`

### 3.2 Product routes (`/api/v1/products`, `/api/v1/categories`)

Implement all capabilities from **Capability Definitions §2 Backend**.

Full-text search: use MySQL `MATCH(name, description) AGAINST(? IN BOOLEAN MODE)`.
When `q` param is empty, fall back to `LIKE` or return all.

### 3.3 Cart routes (`/api/v1/cart`)

Implement all capabilities from **Capability Definitions §3 Backend**.

The cart merge endpoint is critical: on login, the frontend sends the guest `sessionId`;
the backend moves all guest cart items to the authenticated user's cart.

### 3.4 Order routes (`/api/v1/orders`)

Implement all capabilities from **Capability Definitions §4 Backend**.

- `POST /orders`: validate cart is not empty → create Order record → create OrderItems →
  decrement product stock for each item → clear the user's cart → return the created order.
- `GET /orders` and `GET /orders/:id` are protected by `authMiddleware`; users can only
  access their own orders.

### 3.5 User routes (`/api/v1/users`)

Implement all capabilities from **Capability Definitions §5 Backend**.

Password change: verify current password with bcrypt before updating.

---

## Phase 4 — Frontend Implementation

### 4.1 Auth feature (`src/features/auth`)

Implement everything from **Capability Definitions §1 Frontend**.

The auth Zustand slice shape:

```typescript
interface AuthState {
  user: UserDto | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  setAuth: (user: UserDto, token: string) => void;
  clearAuth: () => void;
}
```

`LoginPage` design: full-screen split layout. Left half: brand gradient with logo and
tagline. Right half: centered login form. Smooth entrance animation.

`RegisterPage` design: same split layout, mirrored.

### 4.2 Catalog feature (`src/features/catalog`)

Implement everything from **Capability Definitions §2 Frontend**.

`HomePage`:

- Hero section: full-width gradient banner with animated headline + "Shop Now" CTA
- Featured products grid (6 products)
- Category showcase: horizontal scroll of category cards
- Promotional banner: "Free shipping on orders over $50"

`CatalogPage` layout:

- Left sidebar (collapsible on mobile): `ProductFilters`
- Right main area: `ProductSearch` + `SortDropdown` + `ProductGrid`
- URL-driven state: all filters/sort/page synced to URL search params via
  `useSearchParams`

`ProductDetailPage` layout:

- Left: image gallery. Main image large, thumbnails below. Click thumbnail → swap main.
  Click main → lightbox modal.
- Right: breadcrumb, name, rating summary, price (with compare-price if set), stock
  badge, description, quantity picker, "Add to Cart" button (animated on add), "Add to
  Wishlist" ghost button.
- Below the fold: tabbed section with Description / Specifications / Reviews

### 4.3 Cart feature (`src/features/cart`)

Implement everything from **Capability Definitions §3 Frontend**.

`CartDrawer`: slides in from the right using Framer Motion `x: '100%' → x: 0`.
When empty: show `EmptyState` with shopping bag icon and "Start Shopping" link.

`CartPage` (`/cart`): full-page version of the cart for mobile or when drawer isn't ideal.
Two-column desktop layout: items list (left) + order summary card (right, sticky).

### 4.4 Checkout feature (`src/features/checkout`)

Implement the full multi-step checkout from **Capability Definitions §4 Frontend**.

- Use React Hook Form with Zod resolver on the address form.
- Payment step: show two radio-card options — "Cash on Delivery" and "Credit Card".
  If "Credit Card" is selected, show a beautifully styled card form (cardholder name,
  card number with auto-spacing mask, MM/YY expiry, CVV). This is UI-only — no real charge.
- On "Place Order" click, call `POST /orders` with cart contents, address, shipping method,
  and payment method. On success, navigate to `/account/orders/:id`.
- The `OrderConfirmation` component should be a full animated success page with the order
  number, a checkmark animation (Framer Motion), and a "Continue Shopping" CTA button.

### 4.5 Account feature (`src/features/account`)

Implement everything from **Capability Definitions §5 Frontend**.

`AccountLayout`: left sidebar with nav links (Profile, Orders, Settings), user avatar +
name at top of sidebar. Active link highlighted with accent colour.

`OrderHistoryTable`: each row has a subtle hover state. Status chips use `Badge` component:

- `pending` → yellow
- `paid` / `processing` → blue
- `shipped` → indigo
- `delivered` → green
- `cancelled` → red

`OrderDetailPage`: show `OrderStatusTimeline` at top, then itemised order table, then
shipping address card and payment summary card side by side.

### 4.6 Global Layout & Navigation

`Header`:

- Logo (left): "ShopForge" wordmark in gradient text
- Nav links (centre): Home, Products, (more if needed)
- Right actions: search icon, cart icon with `MiniCartBadge`, user avatar dropdown
  (if authenticated) or Login/Register links
- Sticky, with backdrop blur on scroll
- Mobile: hamburger menu → slide-down drawer with all nav links

`Footer`:

- 4-column grid: brand info, shop links, account links, newsletter signup
- Bottom bar: copyright + social icons

`NotFoundPage`: animated 404 illustration, "Go Home" button.

---

## Phase 5 — Polish & Production Readiness

### 5.1 Loading states

Every data-fetching component must show a skeleton loader while `isLoading` is true.
Use the `Skeleton` component from the UI library.

### 5.2 Empty states

Every list (products, orders, cart) must show `EmptyState` when the data array is empty.

### 5.3 Error states

Every page that fetches data must have an error boundary or `isError` handler that shows
a friendly error card with a "Try Again" button that calls `refetch()`.

### 5.4 Optimistic updates

Cart add/update/remove must use React Query's `onMutate` / `onError` / `onSettled` for
instant UI feedback with rollback on failure.

### 5.5 Accessibility

- All interactive elements have `aria-label` or visible text.
- Modals trap focus and restore on close.
- Colour contrast meets WCAG AA.
- Form fields have associated `<label>` elements.

### 5.6 Performance

- `React.lazy` + `Suspense` on all route-level page components.
- Product images use `loading="lazy"`.
- React Query caches product lists for 5 minutes.

---

## Phase 6 — Final Checklist

Before considering the build complete, verify:

- [ ] `cd backend && npm run dev` starts the API on port 4000 without errors
- [ ] `cd frontend && npm run dev` starts the React app on port 5173 without errors
- [ ] `cd backend && npm run seed` populates the database with realistic data
- [ ] Full auth flow: register → login → protected routes → logout
- [ ] Full purchase flow: browse → filter → product detail → add to cart → checkout →
      order confirmation → order visible in account
- [ ] All API routes return the standard envelope format
- [ ] All forms validate with Zod and display field-level errors
- [ ] Cart persists across page refreshes (DB for auth, localStorage for guest)
- [ ] Mobile layout tested at 375px width — nothing overflows
- [ ] No TypeScript errors in backend (`npm run type-check` inside `backend/`)
- [ ] No TypeScript errors in frontend (`npm run type-check` inside `frontend/`)
- [ ] `.env.example` files exist for both frontend and backend
- [ ] `README.md` documents how to set up and run the project locally

---

## Execution Order

Follow this sequence. Do not jump ahead.

```
1. Phase 1 (scaffolding) — get both frontend and backend compiling with no errors
2. Phase 2 (DB schema) — entities + migration + seed
3. Phase 3 (backend API) — implement and manually test with curl/Postman
4. Phase 4 (frontend) — implement feature by feature: auth → catalog → cart → checkout → account
5. Phase 5 (polish) — add loading/empty/error states, a11y, performance
6. Phase 6 (checklist) — verify everything end-to-end
```

At each phase boundary, ensure the project **compiles and runs** before moving to the
next phase. A partially working app is better than a fully written but broken one.
