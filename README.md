# solvpath — Senior Front-End take-home

Customer-facing slice of a post-purchase experience: browse orders, then start a guided return / exchange.

**Stack:** React 19 · TypeScript · Vite · React Router · CSS (brand tokens)

## Install → run

```bash
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`).

```bash
npm run build    # production build
npm run preview  # serve the build
```

## What's included

1. **Orders dashboard** — paginated list (page size 4), status filter, search by order number or product name, loading / empty / error + retry.
2. **Return / exchange flow** — items → reason → resolution → review → submit, against the provided mock API (latency + intermittent failures).

Money is handled in **integer cents**. Store credit applies a **+10% bonus** (`Math.round(subtotal * 1.1)`).

## Architecture

Hybrid structure — **feature modules first**, with a light **atomic UI layer** for shared presentational pieces:

```text
src/
├── api/mockApi.ts              # starter mock backend (behavior unchanged)
├── components/
│   ├── atoms/                  # Button, Input, Badge, …
│   ├── molecules/              # SearchField, Pagination, ErrorBanner, …
│   ├── organisms/              # AppHeader
│   └── templates/              # AppShell layout
├── features/
│   ├── orders/                 # dashboard UI + data hooks
│   └── returns/                # wizard UI + money helpers + flow state
├── pages/                      # route-level composition
├── hooks/                      # shared utilities (abort controller)
└── styles/                     # brand tokens + global styles
```

Atoms/molecules stay presentational (props in → UI out). Data fetching, validation, and money math live in `features/*`.

## Decision log

### Chose to build
- End-to-end orders + return flow against `listOrders` / `getOrder` / `submitReturn`
- Abortable fetches with retry on failure (mock API fails ~12% / ~25%)
- Step validation before advancing; sticky action bar on the return flow
- Responsive layout using the required solvpath palette + Inter
- Deferred search input (`useDeferredValue`) so typing stays responsive while requests settle
- Explicit empty / loading / error states as product UI, not afterthoughts

### Deliberately skipped
- Auth / accounts
- Storybook / exhaustive unit tests (time budget)
- Persisting an in-progress return across refresh
- Exchange inventory / size selection beyond the resolution choice

### Trade-offs
- **No global state library** — URL + local component/hook state is enough for two screens; Zustand would be overkill here.
- **CSS modules via co-located plain CSS** instead of Tailwind — keeps brand tokens as CSS variables (as provided) and avoids theme mapping noise in a short exercise.
- **Feature folders over pure Atomic Design** — Atomic naming is used only for the shared UI kit; domain logic is colocated under `features/` so returns money math and order fetching stay discoverable.
- Left `apiConfig` failure rates at starter values so reviewers see real failure handling (retry on list + submit).

### With another day
- Vitest coverage for `calculateStoreCreditCents` / step validation
- Optimistic UI + offline-friendly queue for submit
- Announced live regions for step changes; stronger focus management in the wizard
- Storybook for atoms/molecules

## Notes for reviewers

- Starter assets live at the repo root (`mockApi.ts`, `brand-tokens.css`, `solvpath-logo.png`, `CANDIDATE_BRIEF.pdf`). The app imports copies under `src/` — **mock API behavior was not changed**.
- Return is only offered for **delivered** orders, matching the brief.
