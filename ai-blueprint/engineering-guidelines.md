# Engineering Guidelines & Constraints

> These guidelines are **mandatory**. Every file you generate must conform to every rule
> defined here. Do not deviate unless explicitly instructed in a follow-up prompt.

---

## 1. Language & Runtime

| Layer           | Language                  | Version |
| --------------- | ------------------------- | ------- |
| Frontend        | TypeScript (strict mode)  | 5.x     |
| Backend         | TypeScript (strict mode)  | 5.x     |
| Runtime         | Node.js                   | 20 LTS  |
| Package manager | npm workspaces (monorepo) | 10.x    |

- `"strict": true` must be set in every `tsconfig.json`.
- No `any` types. Use `unknown` and narrow with type guards where the type is genuinely
  unknown.
- All async functions must be `async/await`. No raw `.then()` chains.

---

## 2. Project Structure

```
/
├── frontend/          # React SPA (standalone)
├── backend/           # Express API (standalone)
├── ai-blueprint/      # All AI guideline files (not deployed)
├── README.md
└── AI-interactions.md
```

No monorepo. No shared workspace. `frontend/` and `backend/` are completely independent
projects, each with their own `package.json`, `tsconfig.json`, and `node_modules`.
Types that appear in both (e.g. API response shapes) are defined in `backend/src/types/`
and manually mirrored in `frontend/src/types/` — kept in sync by convention, not by
a build step.

### 2.1 Frontend folder structure

```
frontend/
├── public/
├── src/
│   ├── assets/            # Static images, fonts, icons
│   ├── components/
│   │   ├── ui/            # Pure, reusable UI primitives (Button, Input, Badge…)
│   │   └── layout/        # Header, Footer, Sidebar, PageWrapper
│   ├── features/          # Feature-scoped modules (see §4)
│   │   ├── auth/
│   │   ├── catalog/
│   │   ├── cart/
│   │   ├── checkout/
│   │   └── account/
│   ├── hooks/             # Global custom hooks
│   ├── lib/               # Axios instance, query client, utility functions
│   ├── pages/             # Route-level components (thin wrappers)
│   ├── routes/            # React Router v6 route definitions
│   ├── store/             # Zustand slices
│   ├── styles/            # Global CSS / Tailwind base overrides
│   └── types/             # All frontend TypeScript types and API response shapes
├── index.html
├── tailwind.config.ts
├── vite.config.ts
└── tsconfig.json
```

### 2.2 Backend folder structure

```
backend/
├── src/
│   ├── config/            # env validation, db config, jwt config
│   ├── controllers/       # Express route handlers (thin — delegate to services)
│   ├── middleware/        # auth, error handler, request logger, rate limiter
│   ├── models/            # TypeORM entities
│   ├── repositories/      # Data-access layer (wraps TypeORM repos)
│   ├── routes/            # Express router definitions
│   ├── schemas/           # Zod validation schemas for all request bodies
│   ├── services/          # Business logic (pure functions, no req/res)
│   ├── types/             # TypeScript interfaces & DTOs (API shapes)
│   ├── utils/             # Shared helpers (hash, token, paginate…)
│   └── app.ts             # Express app factory (no listen() call here)
├── server.ts              # Entry point — calls app.listen()
├── ormconfig.ts           # TypeORM data source
└── tsconfig.json
```

---

## 3. Naming Conventions

| Artefact              | Convention                 | Example                            |
| --------------------- | -------------------------- | ---------------------------------- |
| Files & folders       | `kebab-case`               | `product-card.tsx`                 |
| React components      | `PascalCase`               | `ProductCard`                      |
| Functions & variables | `camelCase`                | `fetchProducts`                    |
| Constants             | `SCREAMING_SNAKE_CASE`     | `MAX_CART_ITEMS`                   |
| TypeORM entities      | `PascalCase` singular      | `Product`, `OrderItem`             |
| DB table names        | `snake_case` plural        | `order_items`                      |
| DB column names       | `snake_case`               | `created_at`                       |
| API routes            | `kebab-case`, plural nouns | `/api/products`, `/api/cart-items` |
| Env variables         | `SCREAMING_SNAKE_CASE`     | `JWT_SECRET`                       |

---

## 4. Feature Module Pattern (Frontend)

Every feature under `src/features/<name>/` **must** contain:

```
features/auth/
├── components/       # UI components used only by this feature
├── hooks/            # Feature-scoped hooks (useAuth, useLogin…)
├── services/         # API call functions (axios wrappers)
├── store/            # Zustand slice for this feature
├── types.ts          # Feature-local TypeScript types
└── index.ts          # Public barrel export
```

- Components in `features/` may import from `components/ui/` but **never** from another
  feature directly. Cross-feature communication goes through the global store.
- Pages in `pages/` import from `features/` via the barrel `index.ts`.

---

## 5. API Design

- All routes are prefixed `/api/v1/`.
- REST conventions: `GET /products`, `POST /products`, `PATCH /products/:id`,
  `DELETE /products/:id`.
- Every response is wrapped in a consistent envelope:

```json
// Success
{ "success": true, "data": { ... }, "meta": { "page": 1, "total": 100 } }

// Error
{ "success": false, "error": { "code": "VALIDATION_ERROR", "message": "..." } }
```

- HTTP status codes must be semantically correct (200, 201, 400, 401, 403, 404, 409, 422,
  500).
- All list endpoints support `?page=1&limit=20&sort=createdAt&order=desc`.

---

## 6. Error Handling

### Backend

- A single global `errorHandler` middleware catches **all** errors.
- Controllers never send `res.json()` on error — they call `next(error)`.
- Create a typed `AppError` class:

```typescript
export class AppError extends Error {
  constructor(
    public readonly message: string,
    public readonly statusCode: number,
    public readonly code: string,
  ) {
    super(message);
  }
}
```

- Validation errors (Zod) are mapped to `422 Unprocessable Entity`.
- Unhandled promise rejections and uncaught exceptions must be logged and must **not**
  crash the process silently.

### Frontend

- All API calls are wrapped in React Query (`@tanstack/react-query`).
- Every query/mutation has an `onError` handler that calls `toast.error(message)`.
- Route-level error boundaries catch render errors and show a fallback UI.
- Never expose raw error stack traces to the user.

---

## 7. Authentication & Security

- JWT access tokens: 15-minute expiry, stored in **memory** (Zustand store).
- JWT refresh tokens: 7-day expiry, stored in **httpOnly, SameSite=Strict cookie**.
- Passwords hashed with **bcrypt**, cost factor 12.
- All authenticated routes protected by `authMiddleware` that validates the access token.
- CORS: only allow the frontend origin (read from `ALLOWED_ORIGIN` env var).
- Helmet.js enabled on all responses.
- Rate limiting: 100 requests / 15 min on `/api/v1/auth/*` routes.
- Input validation with **Zod** on every controller — validate before touching the DB.

---

## 8. Database

- ORM: **TypeORM** with MySQL driver.
- Migrations: all schema changes via TypeORM migrations (never `synchronize: true` in
  production).
- Relationships must use TypeORM decorators (`@OneToMany`, `@ManyToOne`, etc.).
- All queries go through the **repository layer** — no raw SQL in controllers or services
  unless absolutely necessary (complex aggregation). Document why when you do.
- Soft deletes (`@DeleteDateColumn`) on `User`, `Product`, `Order`.
- All tables include `created_at` and `updated_at` (`@CreateDateColumn`,
  `@UpdateDateColumn`).

---

## 9. State Management (Frontend)

- **Zustand** for client state (auth, cart, UI state).
- **React Query** for all server state (products, orders, user profile).
- Do **not** store server data in Zustand — that is React Query's job.
- Zustand stores must be split by feature slice and composed via `create` with the
  `immer` middleware.

---

## 10. Styling Rules

- **Tailwind CSS v3** is the primary styling system.
- **Framer Motion** for all animations (page transitions, modals, cart drawer).
- Custom design tokens defined in `tailwind.config.ts`:
  - Primary brand colour: `#6C63FF` (indigo-violet)
  - Surface/card background: `#1A1A2E` (dark navy)
  - Accent: `#E94560` (coral red)
  - Text primary: `#EAEAEA`
  - Text muted: `#8892A4`
- All interactive elements must have visible focus rings (accessibility).
- Mobile-first: every component is responsive. Breakpoints: `sm=640 md=768 lg=1024 xl=1280`.
- No inline styles except for dynamic values that cannot be expressed as Tailwind classes.

---

## 11. Code Quality

- **ESLint** with `@typescript-eslint/recommended` + `eslint-plugin-react-hooks`.
- **Prettier** with `printWidth: 100`, `singleQuote: true`, `trailingComma: 'all'`.
- Husky pre-commit hook runs `lint` and `type-check` before every commit.
- No `console.log` in committed code — use the `logger` utility (Winston on backend,
  no-op shim on frontend).
- Every exported function must have a JSDoc comment describing its purpose and params.

---

## 12. Environment Variables

All env vars are validated at startup using Zod. The app **must not start** if a required
variable is missing.

### Backend `.env.example`

```
NODE_ENV=development
PORT=4000
DB_HOST=localhost
DB_PORT=3306
DB_NAME=ecommerce_db
DB_USER=root
DB_PASSWORD=secret
JWT_ACCESS_SECRET=changeme_access
JWT_REFRESH_SECRET=changeme_refresh
ALLOWED_ORIGIN=http://localhost:5173
```

### Frontend `.env.example`

```
VITE_API_BASE_URL=http://localhost:4000/api/v1
```

---

## 13. Git Conventions

- Branch strategy: `main` (production), `develop` (integration), `feature/<name>`.
- Commit messages follow **Conventional Commits**:
  `feat:`, `fix:`, `chore:`, `refactor:`, `docs:`, `style:`, `test:`
- Every logical unit of work is a separate commit. No "WIP" commits on `main`.

---

## 14. What the AI Must NOT Do

- Do not use `create-react-app`. Use **Vite**.
- Do not use `class` components in React. Functional components + hooks only.
- Do not use `var`. Use `const` by default, `let` only when reassignment is needed.
- Do not hardcode secrets or credentials anywhere in source files.
- Do not skip error handling — every `async` function must have try/catch or be wrapped
  by a higher-order error handler.
- Do not generate placeholder/lorem-ipsum data in the final UI — use realistic seed data.
- Do not generate a monolithic single-file backend. Follow the layered architecture in §2.2.
