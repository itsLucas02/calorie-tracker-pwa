# KiraCal

[![Live demo](https://img.shields.io/badge/live-demo-4f8cff?style=flat-square)](https://kiracal.vercel.app/)

**Say what you ate. We'll kira the rest.**

KiraCal is a mobile-first PWA for simple AI-assisted calorie and nutrition
tracking. Describe a meal in plain words â€” *"nasi putih, ayam kari, kangkung
belacan*" â€” and KiraCal estimates calories and macros, lets you correct every
number, logs the meal, and shows how it fits your day.

*(Kira = "count" in Malay. Yes, teh tarik kurang manis works.)*

## Run it

```bash
npm install
npm run dev        # local dev server
npm run build      # production build â†’ dist/
```

No environment variables, keys or accounts needed â€” the whole product loop
works locally with demo data.

**Demo path:** Continue with Google (demo account) â†’ quick plan setup â†’ type a
meal â†’ Analyse â†’ review/edit items â†’ Save â†’ watch Today update â†’ browse
History â†’ tweak your plan in Profile â†’ refresh: everything persists.

## What's inside

- **React 19 + TypeScript + Vite + Tailwind v4**, HashRouter (works from any
  static host), lucide icons. No backend required to run the frontend.
- **Mobile-first app shell**: bottom tab bar with emphasized *Log* action on
  phones, compact sidebar + centered column on desktop. Safe-area aware,
  `100dvh` layouts, keyboard-friendly inputs.
- **Local-first domain layer**: auth session, profile, calorie target, meals
  and items persist in `localStorage` behind repository interfaces.
- **Mock AI analysis** with a Malaysian-food-first database and parsing
  heuristics (quantities, `kurang manis`, `kosong`, graceful fallbacks).
- **Mifflin-St Jeor** target calculation with manual override; macro targets
  derived per goal. Clearly labelled estimates â€” never medical advice.
- **PWA foundation**: manifest, icons, theme color. Service worker deferred to
  production hardening.

## Architecture seams

Everything external lives behind a small interface in `src/services/`, with
`src/services/index.ts` as the single swap point:

| Now (local) | Later (production) |
| --- | --- |
| `MockAuthService` | `SupabaseAuthService` (Google OAuth) |
| `LocalProfileRepository` | `SupabaseProfileRepository` |
| `LocalMealRepository` | `SupabaseMealRepository` |
| `MockMealAnalysisService` | `ApiMealAnalysisService` â†’ `POST /api/analyze-meal` |

- `apps/api/` â€” Hono + TypeScript API scaffold (`GET /health`, documented
  `/api/analyze-meal` contract; AI provider intentionally not wired).
- `supabase/migrations/0001_init.sql` â€” table + RLS sketch mirroring
  `src/lib/types.ts`.
- `docs/architecture.md` â€” the full handoff map.

## Notes & scope

Nutrition values are rounded human estimates â€” no fake decimal precision, AI
output is always editable before saving. Out of scope on purpose: photo/barcode
logging, meal plans, social features, streaks, payments, and heavy analytics.
