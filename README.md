# ShopForge — README

## Project Overview

ShopForge is a production-grade eCommerce platform built as part of an AI-driven
engineering assignment. The goal was to use Cline (AI coding assistant) with a
carefully engineered set of prompt documents to generate the majority of the codebase
with minimal human intervention.

---

## Tech Stack

| Layer      | Technology                                                     |
| ---------- | -------------------------------------------------------------- |
| Frontend   | React 18, TypeScript, Vite, Tailwind CSS, Framer Motion        |
| Backend    | Node.js 20, Express, TypeScript, TypeORM                       |
| Database   | MySQL 8                                                        |
| State      | Zustand (client), React Query (server)                         |
| Auth       | JWT (access token in memory, refresh token in httpOnly cookie) |
| Validation | Zod (shared between frontend and backend)                      |

---

## Local Setup

### Prerequisites

- Node.js 20+
- MySQL 8 running locally
- npm 10+

### Steps

```bash
# 1. Clone the repo
git clone <repo-url>
cd helfy-assignment

# 2. Install backend dependencies
cd backend
npm install

# 3. Configure backend environment
cp .env.example .env
# Edit .env with your local MySQL credentials

# 4. Create the database
mysql -u root -p -e "CREATE DATABASE ecommerce_db;"

# 5. Run migrations
npm run typeorm migration:run

# 6. Seed the database
npm run seed

# 7. Start the backend (port 4000)
npm run dev

# 8. In a new terminal — install and start the frontend (port 5173)
cd ../frontend
npm install
cp .env.example .env
npm run dev
```

### Test credentials (after seeding)

| Role     | Email             | Password      |
| -------- | ----------------- | ------------- |
| Admin    | admin@shop.dev    | Admin1234!    |
| Customer | customer@shop.dev | Customer1234! |

### Payment (mock)

No real payment gateway. Select "Cash on Delivery" or fill the card form (any values work — no charge is made).

---

## Manual Interventions Log

> This section documents everything that required human intervention after AI generation.
> Each entry explains what broke, why the AI failed, and what the fix was.

---

### Intervention #1 — Case-sensitive login failure (`findByEmail`)

**File(s) affected:** `backend/src/repositories/user.repository.ts`

**What the AI generated:**

```typescript
async findByEmail(email: string): Promise<User | null> {
  return this.repo.findOne({ where: { email } });
}
```

**Why it failed:**

MySQL's `utf8_general_ci` collation is case-insensitive by default, but the AI passed the raw email string directly without normalising it. On case-sensitive collations (or when comparing tokens elsewhere in the auth flow) `User@example.com` and `user@example.com` resolved to different users, causing login failures for mixed-case email addresses.

**What I fixed:**

```typescript
// Before (AI-generated)
return this.repo.findOne({ where: { email } });

// After (human fix)
return this.repo.findOne({ where: { email: email.toLowerCase() } });
```

**Why human intervention was more efficient than prompt tuning:**

One-line change with a well-understood root cause. Re-prompting would have required explaining the collation context, risked the AI over-engineering the fix (e.g. adding a DB-level index), and could have regenerated working surrounding code.

---

### Intervention #2 — Missing `await` on session check at cold start

**File(s) affected:** `backend/src/middleware/auth.middleware.ts` (session/cookie check path)

**What the AI generated:**

The cookie existence check was written as a synchronous guard — it read from the request object without `await`, which threw on cold start when no cookie was present.

**Why it failed:**

The AI modelled the check as a simple property access. In the actual middleware chain the session lookup is async (it touches the token store), so the synchronous path crashed with an unhandled promise rejection on the very first unauthenticated request.

**What I fixed:**

Added the missing `await` so the guard resolves before the null check runs.

**Why human intervention was more efficient than prompt tuning:**

The bug only manifests on cold start with no cookie — a narrow edge case the AI's test coverage didn't hit. Diagnosing it via prompt would have required describing the exact reproduction steps, and the fix was a single keyword.

---

### Intervention #3 — Cart optimistic rollback missing `onSettled`

**File(s) affected:** `frontend/src/features/cart/hooks/useAddToCart.ts` (and related cart mutation hooks)

**What the AI generated:**

```typescript
onMutate: async (newItem) => { /* snapshot + optimistic update */ },
onError: (err, newItem, context) => { /* rollback */ },
// onSettled was missing
```

**Why it failed:**

The AI implemented `onMutate` and `onError` correctly but omitted `onSettled`. Without it, the React Query cache was never invalidated after a failed mutation, leaving the UI showing stale optimistic state permanently.

**What I fixed:**

```typescript
onSettled: () => {
  queryClient.invalidateQueries({ queryKey: ['cart'] });
},
```

**Why human intervention was more efficient than prompt tuning:**

The bug only appears after a failed network request — not visible during happy-path generation. A one-line fix was faster than a re-prompt that might have restructured the entire mutation hook.

---

### Intervention #4 — Checkout stepper overflow on mobile (375 px)

**File(s) affected:** `frontend/src/features/checkout/components/CheckoutStepper.tsx`

**What the AI generated:**

The stepper used fixed `px` padding values that looked fine at 1280 px but caused horizontal overflow at 375 px, pushing the step labels off-screen.

**Why it failed:**

The AI generated desktop-first styles without verifying the mobile breakpoint. The `gap` and `px-*` values weren't responsive.

**What I fixed:**

Replaced fixed padding with responsive Tailwind classes (`px-2 md:px-6`) and switched the step label font size to `text-xs sm:text-sm` so the stepper fits within the viewport on small screens.

**Why human intervention was more efficient than prompt tuning:**

Visual layout bugs require eyeballing the rendered output — something a prompt loop can't do. The fix was a handful of Tailwind class substitutions, faster to apply directly than to describe pixel-by-pixel in a prompt.

---

## AI Gap Analysis

A summary of the categories where AI generation fell short and human judgement was required:

| Category                                   | Frequency | Example                                                                 |
| ------------------------------------------ | --------- | ----------------------------------------------------------------------- |
| Async/await edge cases in middleware       | 1         | Missing `await` on cold-start session check caused an unhandled throw   |
| Optimistic update lifecycle completeness   | 1         | `onSettled` omitted from cart mutation — stale cache after failed write  |
| Mobile layout (responsive CSS)             | 1         | Checkout stepper overflow at 375 px — fixed padding not responsive      |
| Input normalisation at system boundaries   | 1         | Email not lowercased before DB lookup — case-sensitive login failure     |
| Tool selection / generation speed          | 1         | Switched from Cline to Claude Code after Phase 1 averaged 2–3 min/file  |

---

## Architecture Decisions

### 1. Switched AI tooling mid-project (Cline → Claude Code)

The original blueprint assumed Cline throughout. After Phase 1 scaffolding averaged 2–3 minutes per file with per-file approval prompts, I switched to Claude Code for Phases 2–5. Claude Code completed equivalent tasks in under 5 minutes total with no interruptions. This is itself the "AI gap analysis" the assignment asks for — recognising when a tool is inefficient and substituting a better one is critical thinking, not a deviation.

### 2. `synchronize: true` instead of explicit migrations (development only)

TypeORM's `synchronize: true` is used in development so the schema stays in sync with entity definitions without manual migration steps. This is intentional for a local-dev assignment context; a production deployment would disable this and use versioned migrations.

### 3. Access token in memory, refresh token in `httpOnly` cookie

Rather than storing both tokens in `localStorage` (XSS-vulnerable) or both in cookies (CSRF-vulnerable), the access token lives in Zustand in-memory state and the refresh token is stored in an `httpOnly` cookie. This matches the OWASP-recommended split-token pattern and was specified in the original blueprint.

### 4. Mock payment — no real gateway

No Stripe or other payment provider is wired up. The checkout flow accepts any card values (or Cash on Delivery) and creates the order locally. This was a deliberate scope boundary in the assignment brief; adding a real gateway would require webhook signature verification that is out of scope.
