# KiraCal architecture

A mobile-first PWA for AI-assisted calorie tracking. The MVP runs **fully
locally** behind the same interfaces the production services will implement.

## Product loop

```
Welcome (mock Google sign-in)
  → Onboarding (body stats → Mifflin-St Jeor target, user-adjustable)
  → Today (calorie ring + macros + meal list)
  → Log meal (natural language: "nasi putih, ayam kari, kangkung belacan")
  → Analyse (MealAnalysisService → structured items + totals)
  → Review (every value editable; add/remove items) → Save
  → Today updates instantly · History by day · Profile/settings
```

## Capability seams (the important part)

Screens and hooks never import concrete services. Everything goes through
`src/services/index.ts` — the single swap point:

| Interface | Local implementation (now) | Production target (later) |
| --- | --- | --- |
| `AuthService` | `mockAuthService` (localStorage session) | `SupabaseAuthService` (Google OAuth) |
| `ProfileRepository` | `localProfileRepository` | `SupabaseProfileRepository` (`profiles` table) |
| `MealRepository` | `localMealRepository` (+ `subscribe` change events) | `SupabaseMealRepository` (`meals` + `meal_items`, Realtime for `subscribe`) |
| `MealAnalysisService` | `mockMealAnalysisService` (local food DB + heuristics) | `ApiMealAnalysisService` → `POST /api/analyze-meal` on the Hono API |

`src/lib/types.ts` mirrors `supabase/migrations/0001_init.sql` one-to-one.

## Frontend layout

```
src/
├── lib/            types, calorie math (isolated), dates, utils
├── services/       auth / profile / meals / analysis (interfaces + local impls)
├── state/          session, profile, toast providers (React context)
├── hooks/          useMeals / useMeal / useMealDates / useAnimatedNumber
├── components/     ui kit, CalorieRing, MacroBars, MealCard, MealItemsEditor,
│                   PlanFields, layout/AppShell (mobile bottom nav / desktop sidebar)
└── screens/        Welcome, Onboarding, Today, LogMeal, MealDetail, History, Profile
```

Data flow: repositories own persistence and emit change events;
`useMeals*` hooks subscribe and re-query; screens render. Saving a meal in
the review flow re-renders Today/History automatically — no page reloads,
no store framework.

## Mock meal analysis

`mockMealAnalysisService` = `foodDatabase` (~80 entries, Malaysian-first)
+ a heuristic parser (`analyzeMealNow`):

- splits on commas / "dan" / "and" / "with" / "dengan" / "+" / "&"
- quantities: `"2 roti canai"`, `"roti canai x2"`
- modifiers: `kurang manis`, `less sugar`, `kosong` scale sweetened drinks
- unknown food → graceful generic estimate (`matched: false`), flagged in
  the review screen so the user can correct it — the product never hard-fails

`analyzeMealNow` is synchronous and reused to seed realistic demo history on
first sign-in (`services/meals/seed.ts`).

## Calorie targets

`src/lib/calories.ts` — Mifflin-St Jeor BMR × activity factor, ±500/+300 kcal
per goal, clamped to a sane band, macro split per goal. Pure functions; UI only
reads `effectiveTarget(profile)` (custom override ?? calculated).

## PWA

`manifest.webmanifest`, icons, theme color, safe-area-aware fixed chrome,
`100dvh` layouts. A service worker is intentionally **not** registered in this
preview build (avoids stale-cache pain during development); add one with a
versioned cache strategy at production build time.

## Backend scaffold

`apps/api` — Hono + TypeScript with `GET /health` and the documented
`POST /api/analyze-meal` contract (501 until an AI provider is wired). See
`apps/api/README.md`.
