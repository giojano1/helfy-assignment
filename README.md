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
| Payments   | Stripe (test mode)                                             |
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
cd shopforge

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

### Intervention #1 — [Title]

**File(s) affected:** `backend/src/...`

**What the AI generated:**

> Describe what Cline produced

**Why it failed:**

> Explain the root cause — e.g., "Cline hallucinated a non-existent TypeORM method"

**What I fixed:**

```typescript
// Before (AI-generated)

// After (human fix)
```

**Why human intervention was more efficient than prompt tuning:**

> e.g., "The fix was a 2-line change. Re-prompting would have taken 3 more rounds and
> risked regenerating working code."

---

### Intervention #2 — [Title]

_(Copy the template above for each intervention)_

---

## AI Gap Analysis

A summary of the categories where AI generation fell short and human judgement was required:

| Category                              | Frequency | Example |
| ------------------------------------- | --------- | ------- |
| TypeORM query builder edge cases      | -         | -       |
| Stripe webhook signature verification | -         | -       |
| CSS layout edge cases (mobile)        | -         | -       |
| Cross-feature state coordination      | -         | -       |
| Migration generation                  | -         | -       |

---

## Architecture Decisions

_(Document any decisions made during development that deviate from the original blueprint
and why.)_
