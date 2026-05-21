### Prompt #1

**Phase:** Project Scaffolding  
**Tool:** Cline  
**Model:** Claude Sonnet 4  
**Goal:** Initialize frontend/backend structure

**Prompt:**

> Before writing any code, read:
>
> - ai-blueprint/engineering-guidelines.md
> - ai-blueprint/capability-definitions.md
> - ai-blueprint/initial.md
>
> Execute Phase 1 only.
> Scaffold frontend and backend structure.
> Do not implement database or APIs yet.

**Result:**  
✅ Frontend/backend scaffolded  
✅ TypeScript + Tailwind configured  
✅ Routes and utility layers initialized

**Manual Fixes:**

- Gave prompt to skip creating any placeholder files, .gitkeep files, or empty folders.
  All feature folders are already created manually as ai was taking way too much time for implementing placeholders.

Switched from Cline to Claude Code for Phase 2-3 due to speed constraints.
Cline was averaging 2-3 minutes per file on Phase 1 scaffolding.
Claude Code completes the same tasks in under 5 minutes total.

Decision: Use the right tool for each job. This IS the AI Gap analysis
the assignment asks for — recognizing when a tool is inefficient and
switching to a better one is exactly "Critical Thinking."

---

### Prompt #2

**Phase:** Database & Entities  
**Tool:** Claude Code (terminal)  
**Model:** Claude (latest)  
**Goal:** Create all TypeORM entities, seed script, and database config

**Prompt:**

> Read ai-blueprint/engineering-guidelines.md and ai-blueprint/capability-definitions.md first.
>
> Execute Phase 2:
>
> 1. Create all TypeORM entities in backend/src/models/: User, Product, Category, ProductImage, Tag, Cart, CartItem, Order, OrderItem with all relations, decorators, and fields
> 2. Create backend/src/config/database.ts with synchronize: true
> 3. Create backend/src/seed.ts with 3 categories, 20 realistic products, admin@shop.dev / Admin1234!, customer@shop.dev / Customer1234!
>
> Do not stop between steps. Fix all TypeScript errors before finishing.

**Result:**  
✅ All TypeORM entities created with relations  
✅ Database config with synchronize: true  
✅ Seed script with realistic data

**Why Claude Code instead of Cline:**  
Cline spent 50+ minutes on Phase 1 scaffolding. Claude Code completed Phase 2 in under
5 minutes with no per-file approval prompts. Switched tools to meet the 6-hour deadline.

---

### Prompt #3

**Phase:** Backend API  
**Tool:** Claude Code (terminal)  
**Model:** Claude (latest)  
**Goal:** Build complete REST API with all routes, controllers, services, repositories

**Prompt:**

> Read ai-blueprint/capability-definitions.md first.
>
> Execute Phase 3 — build the complete backend API.
> Create the full stack (route → controller → service → repository) for:
>
> 1. AUTH — POST /api/v1/auth/register, /login, /refresh, /logout, GET /api/v1/auth/me
> 2. PRODUCTS — GET /api/v1/products (paginated, search, filter by category/price/stock), GET /api/v1/products/featured, GET /api/v1/products/:slug
> 3. CATEGORIES — GET /api/v1/categories
> 4. CART — GET /api/v1/cart, POST /api/v1/cart/items, PATCH /api/v1/cart/items/:id, DELETE /api/v1/cart/items/:id, DELETE /api/v1/cart, POST /api/v1/cart/merge
> 5. ORDERS — POST /api/v1/orders, GET /api/v1/orders, GET /api/v1/orders/:id
> 6. USERS — GET /api/v1/users/me, PATCH /api/v1/users/me, PATCH /api/v1/users/me/password
>
> Rules:
>
> - Every response uses this envelope: { success: true, data: ... } or { success: false, error: { code, message } }
> - Every route that needs auth uses authMiddleware
> - Every request body validated with Zod before hitting the service
> - Passwords hashed with bcrypt cost 12
> - JWT access token 15min, refresh token 7 days in httpOnly cookie
>
> After all routes are created:
>
> 1. Wire all routers into src/app.ts
> 2. Run tsc --noEmit and fix every TypeScript error
> 3. Start the server and confirm it runs on port 4000

**Result:**  
✅ All 6 route groups implemented with full stack (route → controller → service → repository)  
✅ Consistent envelope format across all endpoints  
✅ JWT auth with httpOnly refresh token cookie  
✅ Zod validation on all request bodies  
✅ Server running on port 4000 with no TypeScript errors

**Manual Fixes:**

- Tweaked the user repository query in `backend/src/repositories/user.repository.ts` — the AI-generated `findByEmail` was missing a `.toLowerCase()` call, causing case-sensitive login failures.

---

### Prompt #4

**Phase:** Frontend — Global Setup  
**Tool:** Claude Code (terminal)  
**Model:** Claude (latest)  
**Goal:** Build shared store, layout components, and UI primitives

**Prompt:**

> Read ai-blueprint/capability-definitions.md first.
>
> Build the frontend global setup only:
>
> - src/store/authStore.ts — Zustand slice: user, accessToken, isAuthenticated, setAuth, clearAuth
> - src/components/layout/Header.tsx — logo, nav links, cart icon with badge, user dropdown or login link
> - src/components/layout/Footer.tsx — 4 columns: brand, shop links, account links, newsletter input
> - src/components/ui/ — Button, Input, Badge, Spinner, Skeleton, Modal, Pagination, EmptyState, Rating
>
> Dark premium theme: background #0F0F1A, primary #6C63FF, accent #E94560
> Stop after this. Do not build any features yet.

**Result:**  
✅ Zustand auth store with all actions  
✅ Header with cart badge and user dropdown  
✅ Footer with 4-column layout  
✅ Full UI primitive library in src/components/ui/

**Manual Fixes:**

- Removed `text-brand-primary` class from the logo link in Header.tsx — the color was too saturated against the dark background.
- Reformatted a few JSX blocks in Header.tsx for readability (multi-line onClick, Link formatting).
- Adjusted CSS variables in `src/index.css` — softened the accent color from `#aa3bff` to `#6d5efc`, reduced shadow intensity, added a `--surface` token the AI forgot to include.

---

### Prompt #5

**Phase:** Frontend — Auth Feature  
**Tool:** Claude Code (terminal)  
**Model:** Claude (latest)  
**Goal:** Login, register, guards

**Prompt:**

> Build src/features/auth/ only:
>
> - hooks: useLogin, useRegister, useLogout
> - AuthGuard and GuestGuard components
> - LoginPage — split layout, left: brand gradient with logo, right: login form
> - RegisterPage — same split layout mirrored
>
> Wire AuthGuard and GuestGuard into App.tsx routes.
> Stop after this.

**Result:**  
✅ useLogin, useRegister, useLogout hooks with loading/error state  
✅ AuthGuard redirects unauthenticated users to /login  
✅ GuestGuard redirects logged-in users away from /login and /register  
✅ LoginPage and RegisterPage with split layout  
✅ Routes wired in App.tsx

**Manual Fixes:**

- None — this phase came out clean.

---

### Debug #1 — Infinite 401 Redirect Loop + Login Loading State

**Phase:** Frontend — Auth Feature  
**Tool:** Claude Code (terminal)  
**Model:** Claude (latest)

**Errors observed:**
```
GET /api/v1/auth/me → 401
POST /refresh → 401
GET /api/v1/auth/me → 401
POST /refresh → 401
... repeating infinitely
```

**Root cause:**  
Axios interceptor had no `isRefreshing` guard, refresh URL was wrong (`/refresh` instead of `/api/v1/auth/refresh`), and `useLogin` hook was not resetting loading state on error.

**Fix prompt:**

> Fix two bugs in the frontend:
>
> BUG 1 — Infinite 401 redirect loop
> The Axios response interceptor in src/lib/axios.ts is causing an infinite loop.
> Fix with these rules:
>
> 1. Add an isRefreshing flag and failedQueue to prevent concurrent refresh calls
> 2. If refresh fails → call clearAuth() → redirect to /login ONCE → stop retrying
> 3. Never intercept 401s from the refresh endpoint itself
> 4. Never intercept 401s from /auth/login or /auth/register
>
> BUG 2 — Login page stuck on loading state
> The login button stays loading after a failed attempt.
> Fix the useLogin hook so isLoading resets to false on error.
>
> After fixing: confirm isRefreshing guard exists, confirm refresh URL is
> /api/v1/auth/refresh, run tsc --noEmit and fix any errors.

**Files changed:**

- `frontend/src/lib/axios.ts`
- `frontend/src/features/auth/hooks/useLogin.ts`

---

### Prompt #6 (was #7)

**Phase:** Frontend — Catalog Feature  
**Tool:** Claude Code (terminal)  
**Model:** Claude (latest)  
**Goal:** Product listing, search, filters, detail page

**Prompt:**

> Build src/features/catalog/ only:
>
> - hooks: useProducts, useProduct, useCategories
> - Components: ProductCard, ProductGrid, ProductFilters, ProductSearch, SortDropdown
> - HomePage — hero banner, featured products grid, category cards
> - CatalogPage — sidebar filters + product grid, all filters synced to URL params
> - ProductDetailPage — image gallery, price, stock badge, quantity picker, add to cart button
>
> Every list shows Skeleton while loading. Empty state when no products found.
> Stop after this.

**Result:**  
✅ All catalog hooks with React Query  
✅ ProductCard, ProductGrid, ProductFilters, SortDropdown components  
✅ HomePage with hero + featured grid + category cards  
✅ CatalogPage with URL-synced filters  
✅ ProductDetailPage with image gallery and add-to-cart

---

### Prompt #7 (was #8)

**Phase:** Frontend — Cart Feature  
**Tool:** Claude Code (terminal)  
**Model:** Claude (latest)  
**Goal:** Cart drawer, cart page, optimistic updates

**Prompt:**

> Build src/features/cart/ only:
>
> - store: cartStore.ts with Zustand
> - hooks: useCart, useAddToCart, useUpdateCartItem, useRemoveCartItem
> - CartDrawer — slides in from right using Framer Motion, shows EmptyState when empty
> - CartPage — full page cart, items list on left, order summary sticky on right
>
> Add to cart must use optimistic updates with rollback on error.
> Stop after this.

**Result:**  
✅ Zustand cart store  
✅ Cart hooks with optimistic update + rollback pattern  
✅ CartDrawer with Framer Motion slide-in animation  
✅ CartPage with sticky order summary

**Manual Fixes:**

- Optimistic rollback was missing the `onSettled` call to invalidate the query cache — added manually to avoid stale cart state after a failed request.

---

### Prompt #8 (was #9)

**Phase:** Frontend — Checkout Feature  
**Tool:** Claude Code (terminal)  
**Model:** Claude (latest)  
**Goal:** Multi-step checkout flow

**Prompt:**

> Build src/features/checkout/ only:
>
> - Multi-step flow: Shipping Address → Shipping Method → Payment → Review → Confirmation
> - CheckoutStepper — visual step indicator
> - AddressForm — React Hook Form + Zod validation
> - ShippingMethodSelector — radio cards: Standard (free), Express ($9.99), Overnight ($24.99)
> - PaymentMethodSelector — Cash on Delivery or Credit Card (UI only, no real charge)
> - OrderReview — summary of everything before placing order
> - OrderConfirmation — animated success screen with Framer Motion checkmark
>
> On Place Order call POST /api/v1/orders then redirect to /account/orders/:id.
> Stop after this.

**Result:**  
✅ 5-step checkout flow with stepper UI  
✅ AddressForm with Zod validation and inline field errors  
✅ ShippingMethodSelector and PaymentMethodSelector as radio card components  
✅ OrderConfirmation with Framer Motion checkmark animation  
✅ Order placed via POST /api/v1/orders, redirects to order detail

---

### Prompt #9 (was #10)

**Phase:** Frontend — Debug API Data Flow  
**Tool:** Claude Code (terminal)  
**Model:** Claude (latest)  
**Goal:** Fix /products route showing empty data

**Prompt:**

> Debug and fix why /products route is rendering no data.
>
> 1. Investigate data flow — trace full flow from API → service layer → React Query → UI. Confirm GET /api/v1/products is being called correctly. Check response shape and ensure it matches frontend expectations.
> 2. Backend response shape (IMPORTANT)
>
> The backend returns:
> ```
> { data: Product[], meta: { page, limit, total, totalPages } }
> ```
> This must be mapped into the frontend's expected structure:
> ```
> { items: Product[], total: number, page: number, totalPages: number }
> ```
> Ensure this mapping happens in the service layer, not in UI components.
>
> 3. Possible issues to check: API returns empty array vs frontend filtering everything out, incorrect query keys, broken loading/error states, auth issues causing silent 401 fallback, wrong mapping in ProductGrid, data transformation bug (e.g. res.data.data vs res.data).
> 4. Frontend rendering — ensure ProductGrid always renders safely even with empty state. Add temporary debug logs for raw API response, transformed products array, and query status.
> 5. Edge cases — if meta is missing, fallback safely. If data is undefined/null, return empty array.
>
> Stop after implementing the fix and briefly confirm the root cause was the mismatched response mapping.

**Root cause:**  
The service layer was passing `res.data.data` directly instead of mapping `{ data, meta }` → `{ items, total, page, totalPages }`. Frontend was receiving an object where it expected an array.

**Result:**  
✅ Service layer now maps backend envelope to `PaginatedProducts` structure  
✅ /products page renders correctly with data  
✅ Empty state shown properly when API returns no results

---

### Prompt #10 (was #11)

**Phase:** Frontend — Runtime Crash Fix  
**Tool:** Claude Code (terminal)  
**Model:** Claude (latest)  
**Goal:** Fix OrdersPage crash (undefined length error)

**Prompt:**

> Fix runtime crash in OrdersPage.tsx.
>
> Error: `Cannot read properties of undefined (reading 'length')`
>
> 1. Find where .length is accessed on a possibly undefined value. Trace orders data flow (API → hook → state → component). Check if orders is undefined during initial render.
> 2. Ensure orders always has a safe default value ([]). Fix data destructuring from API/hook if needed.
> 3. Never assume API data exists before loading completes. Prevent UI crash even if API fails or returns null.
> 4. If orders.length === 0, show empty state UI instead of crashing.
>
> Stop after fixing and briefly confirm the cause was missing default array initialization.

**Root cause:**  
`orders` was destructured without a default value — `const { orders } = useOrders()` returned `undefined` on first render before the query resolved.

**Result:**  
✅ `orders` defaulted to `[]` in the hook  
✅ OrdersPage loads cleanly with empty state when no orders exist  
✅ No runtime crash on first render

---

### Prompt #11 (was #12)

**Phase:** Frontend — Production Polish (Phase 5)  
**Tool:** Claude Code (terminal)  
**Model:** Claude (latest)  
**Goal:** Add loading, empty, error states + performance + UX polish

**Prompt:**

> Implement Phase 5 — Production Readiness across the frontend app. Do NOT add new features or change backend logic.
>
> 1. Loading states — every API-driven page/component must show a Skeleton loader while isLoading === true. Apply to: products, orders, cart, dashboard lists.
> 2. Empty states — if any list is empty, show EmptyState component. Apply to: products, cart, orders, search results. Never show blank UI.
> 3. Error states — add error handling for every data-fetching screen. Show a friendly error card with error message and "Try Again" button that triggers refetch().
> 4. Optimistic updates (Cart only) — implement React Query optimistic updates for add to cart, update quantity, remove item using onMutate / onError (rollback) / onSettled.
> 5. Accessibility — all buttons/icons must have aria-label, modals must trap focus, WCAG AA contrast, all form inputs must have proper labels.
> 6. Performance — React.lazy + Suspense for all route-level pages, product images use loading="lazy", React Query cache time for product lists set to 5 minutes.
>
> Do NOT redesign UI. Do NOT add new features. Fix only robustness, UX states, and performance.

**Result:**  
✅ Skeleton loaders on all API-driven pages  
✅ EmptyState shown on products, cart, orders, search  
✅ Error cards with refetch on every data-fetching screen  
✅ Cart optimistic updates with rollback  
✅ React.lazy + Suspense on all route pages  
✅ 5-minute React Query cache on product lists

---

### Prompt #12 (was #13)

**Phase:** Final QA — Full Stack Production Checklist  
**Tool:** Claude Code (terminal)  
**Model:** Claude (latest)  
**Goal:** Verify full system readiness + fix blocking issues before release

**Prompt:**

> Run a full production readiness audit for both frontend and backend and fix any issues preventing deployment.
>
> 1. Backend — ensure `npm run dev` starts cleanly on port 4000, no runtime or TypeScript errors, `npm run seed` works and populates realistic data. All API routes return consistent `{ data, meta }` envelope.
> 2. Frontend — ensure `npm run dev` runs on port 5173 without errors, no TypeScript errors, no console runtime crashes.
> 3. Core flows — auth flow (register → login → protected routes → logout) and e-commerce flow (browse → filter → detail → cart → checkout → confirmation → order history).
> 4. Data & state — all API responses use standard envelope, Zod validation on all forms, cart persists to database for auth users and localStorage for guests.
> 5. UI/UX — mobile responsiveness at 375px, no overflow issues, empty/loading/error states everywhere.
> 6. Documentation — .env.example for both apps, README.md with setup, installation, seed instructions, dev server commands.
>
> Fix issues directly. Do NOT change architecture unless necessary. Do NOT add new features.

**Result:**  
✅ Both apps start cleanly with no TypeScript errors  
✅ Full auth and e-commerce flows verified end-to-end  
✅ .env.example files added for frontend and backend  
✅ README.md updated with complete setup instructions

**Manual Fixes:**

- Fixed a missing `await` on the session check when no cookie is set — the AI-generated check was synchronous and threw on cold start.
- Verified mobile layout at 375px; manually adjusted a few padding values in the checkout stepper that were overflowing on small screens.
