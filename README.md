# solvpath — Senior Front-End take-home

Customer-facing post-purchase app: browse orders, then complete a guided return / exchange.

**Stack:** React 19 · TypeScript · Vite · React Router · Zustand · Vitest · Storybook · CSS (brand tokens)

## Install → run

```bash
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`).

```bash
npm run build
npm run preview
npm test
npm run storybook
```

Optional demo sign-in lives at `/login` (`maya.chen@example.com` / `jordan.lee@example.com`) — not required to use orders or returns.

## What's included

1. **Orders dashboard** — Horizon-style overview (metric cards, spend area chart, status donut, throughput bars) plus the searchable / filterable / paginated order list.
2. **Return / exchange flow** — items → reason → resolution (incl. exchange size/color) → review → submit.
3. **Draft persistence** — in-progress returns survive refresh.
4. **Resilient API client** — automatic retries for transient mock failures (without changing `mockApi` behavior).
5. **Money math** — integer cents; store credit **+10%** (`Math.round(subtotal * 1.1)`).
6. **Vitest** + **Storybook** for shared UI pieces.

## Architecture

Feature modules first; light atomic UI for shared presentational components.

```text
src/
├── api/mockApi.ts
├── components/{atoms,molecules,organisms,templates}
├── features/{auth,orders,returns}
├── pages/
└── styles/
```

## Decision log

### Chose to build
- Brief-first UX: calm customer account surface (Shop / Amazon returns inspired), not an admin analytics dashboard
- Auto-retry (2 attempts) around `listOrders` / `getOrder` / `submitReturn` so intermittent mock failures feel recoverable
- Status chips + deferred search + skeletons for perceived performance
- Step validation, store-credit bonus math, exchange inventory selection
- Offline return queue when `navigator.onLine` is false

### Deliberately skipped
- Forced authentication (brief says it isn’t required)
- Pixel-matching an external Figma admin dashboard — wrong product surface for this brief
- Exhaustive E2E suite

### Trade-offs
- Mock API failure rates left at starter values; resilience is client-side retry, not muted randomness
- Exchange preferences appended into `reason` because `ReturnRequest` has no dedicated field
- CSS co-located with components so brand tokens stay CSS variables

### With another day
- Focus-trap / route announcements polish in the wizard
- Visual regression snapshots for OrderCard + return steps

### Notes for reviewers
- Root starter files are unchanged in behavior (`mockApi.ts` contract preserved under `src/api/`)
- Returns only for **delivered** orders
