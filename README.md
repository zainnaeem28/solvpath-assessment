# solvpath — Senior Front-End take-home

Customer-facing post-purchase slice: sign in, browse orders, and complete a guided return / exchange — including draft persistence, exchange inventory selection, offline submit queue, tests, and Storybook.

**Stack:** React 19 · TypeScript · Vite · React Router · Zustand · Vitest · Storybook · CSS (brand tokens)

## Install → run

```bash
npm install --legacy-peer-deps
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`).

```bash
npm run build           # production build
npm run preview         # serve the build
npm test                # Vitest unit tests
npm run storybook       # component explorer on :6006
```

### Demo accounts

| Name | Email |
|------|--------|
| Maya Chen | `maya.chen@example.com` |
| Jordan Lee | `jordan.lee@example.com` |

No password — pick a demo email on `/login`.

## What's included

1. **Auth / accounts** — mock sign-in, persisted session (Zustand), protected routes, header/sidebar account + sign out.
2. **Orders dashboard** — Figma-aligned layout (icon sidebar, greeting + search, KPI cards, order stats table, right analytics rail) using solvpath brand tokens; search/filter/pagination still required by the brief.
3. **Return / exchange flow** — items → reason → resolution → review → submit.
4. **Draft persistence** — in-progress returns survive refresh (localStorage via Zustand).
5. **Exchange inventory** — size + color selection with out-of-stock combinations disabled.
6. **Money math** — integer cents; store credit applies **+10%** (`Math.round(subtotal * 1.1)`).
7. **Offline / flaky submit** — queues returns locally and flushes on `online` / next visit; optimistic messaging while submitting.
8. **A11y** — step live region + focus move to the step heading on change.
9. **Tests** — Vitest coverage for money helpers, step validation, and auth lookup.
10. **Storybook** — atoms/molecules (Button, Badge, SearchField, ErrorBanner, Pagination).

## Architecture

Hybrid: **feature modules first**, light **atomic UI** for shared presentational pieces.

```text
src/
├── api/mockApi.ts                 # starter mock backend (behavior unchanged)
├── components/{atoms,molecules,organisms,templates}
├── features/
│   ├── auth/                      # accounts, login, RequireAuth, Zustand session
│   ├── orders/                    # dashboard + data hooks
│   └── returns/                   # wizard, money, validation, drafts, offline queue
├── pages/
├── hooks/
└── styles/
```

## Decision log

### Chose to build
- Full brief requirements end-to-end against `listOrders` / `getOrder` / `submitReturn`
- Auth gate so the app feels like a real post-purchase account surface
- Zustand for session + return drafts (small global state with persistence)
- Exchange size/color inventory as part of the resolution step
- Abortable fetches, retries, offline queue flush on reconnect
- Deferred search (`useDeferredValue`), wizard focus + `aria-live`
- Vitest for the fiddly correctness bits; Storybook for the shared UI kit

### Trade-offs
- **Dashboard chrome inspired by common e-commerce dashboard patterns** (sidebar + KPI strip + activity table) while staying customer-facing and on the required solvpath palette — the brief provides no Figma; layout craft is ours, brand tokens are not.
- **Mock auth** (email-only demo accounts) instead of OAuth — no real backend in the kit
- **Exchange prefs encoded into the return `reason` string** when submitting — the mock `ReturnRequest` type has no dedicated field for size/color; called out here rather than silently dropping data
- **CSS co-located with components** (not Tailwind) so brand tokens stay CSS variables as provided
- **Feature folders + atomic shared UI** — domain logic stays under `features/`; atoms/molecules stay presentational
- **Storybook peer deps** — install with `npm install --legacy-peer-deps` because Storybook 9’s peer range lags Vite 8 (`.npmrc` sets this automatically)
- Left `apiConfig` failure rates at starter values so failure/retry UX is reviewable

### Notes for reviewers
- Starter assets remain at the repo root (`mockApi.ts`, `brand-tokens.css`, `solvpath-logo.png`, `CANDIDATE_BRIEF.pdf`). The app imports copies under `src/` — **mock API behavior was not changed**.
- Returns are only offered for **delivered** orders.
- Refresh mid-return to verify draft restore; toggle DevTools offline to exercise the queue.
