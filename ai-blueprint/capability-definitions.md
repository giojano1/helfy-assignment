# Capability Definitions

> This document describes every **functional building block** the AI can use while
> generating the application. Think of these as pre-approved "lego bricks." If a pattern
> is defined here, use it — do not invent alternatives.

---

## 1. Authentication Module (`features/auth`)

### Strategy

- **JWT dual-token** pattern: short-lived access token (memory) + long-lived refresh token
  (httpOnly cookie).
- Registration, login, logout, and silent token refresh are the four core flows.

### Backend capabilities

| Capability               | Implementation                                                                         |
| ------------------------ | -------------------------------------------------------------------------------------- |
| `registerUser`           | Hash password with bcrypt → insert User → return access + set refresh cookie           |
| `loginUser`              | Verify credentials → sign tokens → return access + set refresh cookie                  |
| `refreshToken`           | Read httpOnly cookie → verify refresh JWT → issue new access token                     |
| `logoutUser`             | Clear refresh cookie → (optionally) blacklist token in Redis/DB                        |
| `authMiddleware`         | Extract `Bearer` token from `Authorization` header → verify → attach `req.user`        |
| `optionalAuthMiddleware` | Same as above but does not reject unauthenticated requests (for public+private routes) |

### Frontend capabilities

| Capability             | Implementation                                                                              |
| ---------------------- | ------------------------------------------------------------------------------------------- |
| `useAuth` hook         | Returns `{ user, isAuthenticated, isLoading }` from Zustand auth slice                      |
| `useLogin` mutation    | POSTs credentials → stores access token in Zustand → redirects                              |
| `useRegister` mutation | POSTs new user data → auto-logs-in on success                                               |
| `useLogout` mutation   | Calls logout endpoint → clears Zustand state → redirects to `/`                             |
| `AuthGuard` component  | Wraps protected routes — redirects to `/login` if not authenticated                         |
| `GuestGuard` component | Redirects authenticated users away from `/login`, `/register`                               |
| Silent refresh         | Axios response interceptor catches `401` → calls `/auth/refresh` → retries original request |

### JWT Payload shape

```typescript
// backend/src/types/auth.types.ts  AND  frontend/src/types/auth.types.ts
export interface JwtPayload {
  sub: string; // user UUID
  email: string;
  role: "customer" | "admin";
  iat: number;
  exp: number;
}
```

---

## 2. Product Catalog Module (`features/catalog`)

### Data model

```
Product
  id           UUID (PK)
  name         varchar(255)
  slug         varchar(255) UNIQUE
  description  text
  price        decimal(10,2)
  comparePrice decimal(10,2) nullable   -- for "was / now" display
  stock        int
  categoryId   FK → Category
  images       OneToMany → ProductImage
  tags         ManyToMany → Tag
  rating       decimal(3,2) default 0
  reviewCount  int default 0
  isFeatured   boolean default false
  deletedAt    datetime nullable        -- soft delete

Category
  id   UUID
  name varchar(100)
  slug varchar(100) UNIQUE

ProductImage
  id        UUID
  productId FK
  url       varchar(500)
  isPrimary boolean
```

### Backend capabilities

| Endpoint                 | Capability                                                                                                                                                                                    |
| ------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `GET /products`          | Paginated list; filters: `categoryId`, `minPrice`, `maxPrice`, `tag`, `inStock`; sort: `price`, `rating`, `createdAt`; full-text search on `name` + `description` via MySQL `MATCH … AGAINST` |
| `GET /products/:slug`    | Single product with images, category, and average rating                                                                                                                                      |
| `GET /categories`        | Flat list of all categories                                                                                                                                                                   |
| `GET /products/featured` | Returns products where `isFeatured = true` (used on homepage)                                                                                                                                 |

### Frontend capabilities

| Capability          | Implementation                                                                                      |
| ------------------- | --------------------------------------------------------------------------------------------------- |
| `useProducts`       | React Query hook wrapping `GET /products` — accepts filter/sort/page params                         |
| `useProduct(slug)`  | React Query hook for single product detail                                                          |
| `useCategories`     | React Query hook for category list                                                                  |
| `ProductCard`       | Reusable card: image, name, price, compare-price strike-through, rating stars, "Add to Cart" button |
| `ProductGrid`       | Responsive grid of `ProductCard` components with skeleton loading state                             |
| `ProductFilters`    | Sidebar/drawer with category checkboxes, price range slider, in-stock toggle                        |
| `ProductSearch`     | Debounced search input (300 ms) that updates the `q` query param                                    |
| `ProductDetailPage` | Image gallery (lightbox), description, price, stock badge, quantity picker, add-to-cart CTA         |
| `SortDropdown`      | Controlled dropdown wired to sort query params                                                      |

---

## 3. Cart Module (`features/cart`)

### Strategy

- Cart is **persisted in the database** for authenticated users.
- Cart is **persisted in `localStorage`** for guests and merged into the DB cart on login.
- Zustand cart slice mirrors the DB state and is the single source of truth in the UI.

### Data model

```
Cart
  id        UUID (PK)
  userId    FK → User (nullable for guest)
  sessionId varchar(128) nullable
  updatedAt datetime

CartItem
  id        UUID (PK)
  cartId    FK → Cart
  productId FK → Product
  quantity  int
  price     decimal(10,2)   -- snapshot of price at time of add
```

### Backend capabilities

| Endpoint                 | Capability                                                         |
| ------------------------ | ------------------------------------------------------------------ |
| `GET /cart`              | Return current cart with items + product details (auth or session) |
| `POST /cart/items`       | Add item; if item exists, increment quantity                       |
| `PATCH /cart/items/:id`  | Update quantity                                                    |
| `DELETE /cart/items/:id` | Remove item                                                        |
| `POST /cart/merge`       | Merge guest cart into authenticated user cart on login             |
| `DELETE /cart`           | Clear entire cart                                                  |

### Frontend capabilities

| Capability           | Implementation                                                       |
| -------------------- | -------------------------------------------------------------------- |
| `useCart`            | Returns `{ items, totalItems, totalPrice, isLoading }`               |
| `useAddToCart`       | Mutation: optimistic update → API call                               |
| `useUpdateCartItem`  | Mutation: optimistic quantity change                                 |
| `useRemoveCartItem`  | Mutation: optimistic removal                                         |
| `CartDrawer`         | Slide-in drawer (Framer Motion) from the right showing cart items    |
| `CartItem` component | Product thumbnail, name, quantity stepper, line total, remove button |
| `CartSummary`        | Subtotal, estimated tax, total; "Proceed to Checkout" CTA            |
| `MiniCartBadge`      | Header icon with animated item count badge                           |

---

## 4. Checkout Module (`features/checkout`)

### Multi-step flow

```
Step 1: Shipping Address
Step 2: Shipping Method
Step 3: Payment Method (mock — Cash on Delivery or Credit Card form UI only, no gateway)
Step 4: Review & Place Order
Step 5: Order Confirmation (success page)
```

> **Note:** No real payment gateway is integrated. The payment step collects card details
> as a UI exercise only (no real charge). Order is placed directly on "Place Order" click
> and status is set to `pending`. This keeps the flow realistic without requiring Stripe.

### Data model

```
Order
  id              UUID
  userId          FK → User
  status          enum('pending','processing','shipped','delivered','cancelled')
  subtotal        decimal(10,2)
  shippingCost    decimal(10,2)
  tax             decimal(10,2)
  total           decimal(10,2)
  shippingAddress JSON
  paymentMethod   enum('cod','card') default 'cod'
  createdAt, updatedAt, deletedAt

OrderItem
  id        UUID
  orderId   FK
  productId FK
  quantity  int
  unitPrice decimal(10,2)
  total     decimal(10,2)
```

### Backend capabilities

| Endpoint          | Capability                                                                                                     |
| ----------------- | -------------------------------------------------------------------------------------------------------------- |
| `POST /orders`    | Validate cart → create Order + OrderItems → decrement stock → clear cart → set status `pending` → return order |
| `GET /orders/:id` | Return order detail (authenticated, owner only)                                                                |

### Frontend capabilities

| Capability               | Implementation                                                                                                                                                                                             |
| ------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `useCheckout`            | Zustand slice managing step, form data, and order result                                                                                                                                                   |
| `CheckoutStepper`        | Visual step indicator with completed/active/upcoming states                                                                                                                                                |
| `AddressForm`            | React Hook Form + Zod: name, address, city, country, ZIP                                                                                                                                                   |
| `ShippingMethodSelector` | Radio cards: Standard (free), Express ($9.99), Overnight ($24.99)                                                                                                                                          |
| `PaymentMethodSelector`  | Radio cards: "Cash on Delivery" and "Credit Card". If Credit Card selected, show a styled (non-functional) card UI form (cardholder name, card number masked input, expiry, CVV) — UI only, no real charge |
| `OrderReview`            | Summary of items, address, shipping method, payment method, totals before confirm                                                                                                                          |
| `OrderConfirmation`      | Animated success screen with order number and "Continue Shopping" CTA                                                                                                                                      |

---

## 5. Account Module (`features/account`)

### Pages

```
/account                → redirect to /account/profile
/account/profile        → edit name, email, avatar URL; change password
/account/orders         → paginated order history
/account/orders/:id     → order detail with status timeline
```

### Backend capabilities

| Endpoint                   | Capability                               |
| -------------------------- | ---------------------------------------- |
| `GET /users/me`            | Return authenticated user profile        |
| `PATCH /users/me`          | Update name, email, avatar               |
| `PATCH /users/me/password` | Verify old password → hash new → update  |
| `GET /orders`              | Paginated order history for current user |
| `GET /orders/:id`          | Single order detail                      |

### Frontend capabilities

| Capability            | Implementation                                                  |
| --------------------- | --------------------------------------------------------------- |
| `useProfile`          | React Query hook for `/users/me`                                |
| `useUpdateProfile`    | Mutation with optimistic update                                 |
| `useOrders`           | Paginated React Query hook for order history                    |
| `ProfileForm`         | React Hook Form: name, email, avatar URL; inline edit pattern   |
| `PasswordForm`        | Current password + new password + confirm; strength indicator   |
| `OrderHistoryTable`   | Sortable table: order ID, date, status chip, total, "View" link |
| `OrderStatusTimeline` | Visual vertical timeline of order status transitions            |

---

## 6. Shared UI Component Library (`components/ui`)

These are **design-system primitives** — use them everywhere instead of raw HTML.

| Component    | Props                                                                                    | Notes                                       |
| ------------ | ---------------------------------------------------------------------------------------- | ------------------------------------------- |
| `Button`     | `variant` (primary/secondary/ghost/danger), `size`, `isLoading`, `leftIcon`, `rightIcon` | Loading state shows spinner, disables click |
| `Input`      | `label`, `error`, `leftAddon`, `rightAddon`                                              | Floating label animation                    |
| `Select`     | `label`, `options`, `error`                                                              | Custom styled, not native `<select>`        |
| `Badge`      | `color` (green/red/yellow/blue/gray)                                                     | Status chips                                |
| `Spinner`    | `size` (sm/md/lg)                                                                        | Tailwind animate-spin                       |
| `Modal`      | `isOpen`, `onClose`, `title`                                                             | Framer Motion scale-in                      |
| `Toast`      | (via `react-hot-toast`)                                                                  | Top-right, dark theme                       |
| `Skeleton`   | `width`, `height`, `rounded`                                                             | Shimmer loading placeholder                 |
| `Pagination` | `page`, `totalPages`, `onPageChange`                                                     | Numbered + prev/next                        |
| `Rating`     | `value`, `max`, `readonly`                                                               | Star icons, half-star support               |
| `Breadcrumb` | `items: {label, href}[]`                                                                 | Slash-separated, last item not linked       |
| `EmptyState` | `icon`, `title`, `description`, `action`                                                 | Illustrated empty list states               |

---

## 7. Data Access Layer (Backend Repositories)

Each repository wraps TypeORM and exposes a clean interface to the service layer.
Repositories **never** receive `req` or `res`. They deal only with data.

```typescript
// Pattern example
export class ProductRepository {
  constructor(private readonly repo: Repository<Product>) {}

  async findBySlug(slug: string): Promise<Product | null> { … }
  async findPaginated(filters: ProductFilters): Promise<[Product[], number]> { … }
  async create(dto: CreateProductDto): Promise<Product> { … }
  async update(id: string, dto: UpdateProductDto): Promise<Product> { … }
  async softDelete(id: string): Promise<void> { … }
}
```

Repositories to implement: `UserRepository`, `ProductRepository`, `CategoryRepository`,
`CartRepository`, `OrderRepository`.

---

## 8. Validation Schemas (Zod)

**Backend** owns the Zod schemas — they live in `backend/src/schemas/` and are used for
request body validation in every controller.

**Frontend** uses its own Zod schemas in `frontend/src/features/<name>/schemas/` purely
for form validation. These mirror the backend schemas but are defined independently —
no shared package required.

```
backend/src/schemas/
├── auth.schema.ts       (RegisterDto, LoginDto)
├── product.schema.ts    (ProductFilters)
├── cart.schema.ts       (AddToCartDto, UpdateCartItemDto)
├── order.schema.ts      (CreateOrderDto)
└── user.schema.ts       (UpdateProfileDto, ChangePasswordDto)

frontend/src/features/auth/schemas/
├── login.schema.ts      (mirrors backend LoginDto)
└── register.schema.ts   (mirrors backend RegisterDto)

frontend/src/features/checkout/schemas/
└── address.schema.ts    (shipping address form validation)

frontend/src/features/account/schemas/
└── profile.schema.ts    (mirrors backend UpdateProfileDto)
```

---

## 9. HTTP Client (Frontend)

A pre-configured Axios instance in `lib/axios.ts`:

- `baseURL` from `VITE_API_BASE_URL`.
- Request interceptor: attaches `Authorization: Bearer <accessToken>` from Zustand store.
- Response interceptor: on `401` → attempts silent refresh → retries once → on second
  failure clears auth state and redirects to `/login`.

---

## 10. Seed Data

The backend must include a seed script (`npm run seed`) that inserts:

- 3 categories: **Electronics**, **Apparel**, **Home & Living**
- 20 realistic products spread across categories with multiple images (use
  `https://picsum.photos/seed/<slug>/800/600` for image URLs).
- 1 admin user: `admin@shop.dev` / `Admin1234!`
- 1 customer user: `customer@shop.dev` / `Customer1234!`

---

## 11. Page Layout Capabilities

| Layout           | Usage                                                            |
| ---------------- | ---------------------------------------------------------------- |
| `PublicLayout`   | Header + Footer; used by catalog, product detail, home           |
| `AuthLayout`     | Centered card, no header/footer; used by login, register         |
| `AccountLayout`  | Sidebar nav + main content area; used by all `/account/*` pages  |
| `CheckoutLayout` | Clean, minimal header (logo only) + stepper; used by `/checkout` |

Page transitions: wrap `<Routes>` with Framer Motion `<AnimatePresence>` and apply a
`fadeSlideUp` variant on every page component.
