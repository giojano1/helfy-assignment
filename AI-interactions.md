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
_(fill in after Claude Code finishes)_

**Manual Fixes:**
_(fill in any errors you had to fix)_

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
_(fill in)_

**Manual Fixes:**
_(fill in)_

---

### Prompt #6

### Debug #1 — Infinite 401 Redirect Loop + Login Loading State

**Phase:** Frontend — Auth Feature
**Tool:** Claude Code (terminal)
**Model:** Claude (latest)

**Errors observed:**
GET /api/v1/auth/me → 401
POST /refresh → 401
GET /api/v1/auth/me → 401
POST /refresh → 401
... repeating infinitely

### Prompt #7

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

**Root cause:**
Axios interceptor had no isRefreshing guard, refresh URL was wrong (/refresh instead of /api/v1/auth/refresh), and useLogin hook was not resetting loading state on error.

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

### Prompt #8

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
_(fill in)_

**Manual Fixes:**
_(fill in)_

---

### Prompt #9

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
_(fill in)_

**Manual Fixes:**
_(fill in)_

---

## Prompt #10

Phase: Frontend — Debug API Data Flow
Tool: Claude Code (terminal)
Model: Claude (latest)
Goal: Fix /products route showing empty data

**Prompt:**

Debug and fix why /products route is rendering no data.

1. Investigate data flow
   Trace full flow from API → service layer → React Query (or state) → UI
   Confirm GET /api/v1/products is being called correctly
   Check response shape and ensure it matches frontend expectations
2. Backend response shape (IMPORTANT)

The backend returns:

{
data: Product[],
meta: {
page,
limit,
total,
totalPages
}
}

This must be mapped into the frontend’s expected structure:

{
items: Product[],
total: number,
page: number,
totalPages: number
}

Ensure this mapping happens in the service layer, not in UI components.

3. Possible issues to check
   API returns empty array vs frontend filtering everything out
   Incorrect query keys (React Query cache mismatch)
   Broken loading/error states blocking render
   Auth issues causing silent 401 fallback (check if products require auth)
   Wrong mapping in ProductGrid / ProductList components
   Data transformation bug (e.g. res.data.data vs res.data)
4. Frontend rendering
   Ensure ProductGrid always renders safely even with empty state
   Add temporary debug logs:
   raw API response
   transformed products array
   query status (loading/error/success)
5. Edge cases
   If meta is missing, fallback safely with default pagination values
   If data is undefined/null, return empty array instead of crashing
6. Output expectations
   /products must show data if API returns products
   If API is empty, show proper empty state UI (not blank screen)
   No UI redesign or new features
   Ensure transformed response matches PaginatedProducts structure used across frontend

The backend's response shape { data: Product[], meta: { page, limit, total, totalPages } } is now correctly mapped into the PaginatedProducts structure the rest of the frontend expects. The catalog page should show products now.

Stop after implementing the fix and briefly confirm the root cause was the mismatched response mapping.

## Prompt #11

Phase: Frontend — Runtime Crash Fix
Tool: Claude Code (terminal)
Model: Claude (latest)
Goal: Fix OrdersPage crash (undefined length error)

Prompt:

Fix runtime crash in OrdersPage.tsx.

Error
Cannot read properties of undefined (reading 'length')

1. Root cause investigation
   Find where .length is accessed on a possibly undefined value
   Trace orders data flow (API → hook → state → component)
   Check if orders is undefined during initial render (loading state issue)
2. Required fix
   Ensure orders always has a safe default value ([])
   Fix data destructuring from API/hook if needed
   Add safe rendering:
   orders?.length ?? 0
   or default parameter in state/hook
3. Data safety rules
   Never assume API data exists before loading completes
   Ensure loading state is handled before rendering list logic
   Prevent UI crash even if API fails or returns null
4. Rendering fix
   If orders.length === 0, show empty state UI instead of crashing
   Keep UI unchanged otherwise
   Output expectations
   No runtime crashes
   /orders page loads even with empty or missing data
   Fix only data handling, not UI redesign

The backend data is valid — issue is frontend unsafe access to undefined.length.

Stop after fixing and briefly confirm the cause was missing default array initialization.

## Prompt #12

Phase: Frontend — Production Polish (Phase 5)
Tool: Claude Code (terminal)
Model: Claude (latest)
Goal: Add loading, empty, error states + performance + UX polish

Prompt:

Implement Phase 5 — Production Readiness across the frontend app. Do NOT add new features or change backend logic.

1. Loading states
   Every API-driven page/component must show a Skeleton loader while isLoading === true
   Use existing UI Skeleton component only
   Apply to: products, orders, cart, dashboard lists
2. Empty states
   If any list is empty ([].length === 0), show EmptyState component
   Apply to: products, cart, orders, search results
   Never show blank UI
3. Error states
   Add error handling for every data-fetching screen
   Use isError or React Query error state
   Show a friendly error card with:
   error message
   “Try Again” button → triggers refetch()
   Ensure no page crashes on API failure
4. Optimistic updates (Cart only)
   Implement React Query optimistic updates for:
   add to cart
   update quantity
   remove item
   Use:
   onMutate
   onError (rollback)
   onSettled
   UI must update instantly before server response
5. Accessibility improvements
   All buttons/icons must have aria-label or visible text
   Ensure modals:
   trap focus
   restore focus on close
   Ensure WCAG AA contrast compliance (no visual redesign, just fix obvious issues)
   All form inputs must have proper <label>
6. Performance
   Add React.lazy + Suspense for all route-level pages
   Ensure product images use loading="lazy"
   Set React Query cache time for product lists to 5 minutes
   Constraints
   Do NOT redesign UI
   Do NOT add new features
   Only improve robustness, UX states, and performance
   Keep changes minimal and consistent with existing architecture
   Output expectations
   No blank screens anywhere in app
   Smooth loading UX across all pages
   Stable cart with optimistic updates
   Improved performance (lazy loading + caching)
   Fully production-ready frontend behavior

Stop after implementing Phase 5 and summarize what was improved (loading, empty, error, performance, a11y).

## Prompt #13

Phase: Final QA — Full Stack Production Checklist
Tool: Claude Code (terminal)
Model: Claude (latest)
Goal: Verify full system readiness + fix blocking issues before release

Prompt:

Run a full production readiness audit for both frontend and backend and fix any issues preventing deployment.

1. Backend verification
   Ensure cd backend && npm run dev starts cleanly on port 4000
   Ensure no runtime or TypeScript errors (npm run type-check)
   Ensure npm run seed works and populates realistic data

Verify all API routes return consistent envelope format:

{ data, meta } 2. Frontend verification
Ensure cd frontend && npm run dev runs on port 5173 without errors
Ensure no TypeScript errors (npm run type-check)
Ensure no console runtime crashes anywhere in app 3. Core flows validation
Auth flow:
register → login → protected routes → logout
E-commerce flow:
browse products → filter → product details → add to cart → checkout → order confirmation → order appears in account 4. Data & state correctness
All API responses use standard envelope format (data + meta)
Zod validation applied to all forms with proper field errors
Cart state persists:
authenticated users → database
guest users → localStorage 5. UI/UX validation
Mobile responsiveness tested at 375px width
No overflow issues or broken layouts
Empty/loading/error states exist everywhere 6. Documentation
Ensure .env.example exists for both frontend and backend
Ensure README.md includes:
setup steps
installation
seed instructions
dev server commands
Constraints
Fix issues directly (do not just report them)
Do NOT change architecture unless necessary to fix blocking bugs
Do NOT add new features
Keep behavior identical, only stabilize system
Output expectations
Both apps run cleanly with zero critical errors
All flows work end-to-end without crashes
Project is fully production-ready

Stop after completing checklist and summarize any fixes applied + remaining risks (if any).
