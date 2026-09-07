# KiraCal MVP Implementation Plan

This document turns the agreed MVP into a build sequence.

The rule is simple: **build one working vertical slice at a time and avoid adding infrastructure before the current milestone needs it.**

## Milestone 0 — KiraCal boots

Goal: turn the repository from documentation into a runnable application without introducing real auth, AI, or database complexity yet.

### Repository scaffold

Create:

```text
calorie-tracker-pwa/
├── apps/
│   ├── web/
│   └── api/
├── supabase/
│   └── migrations/
├── docs/
├── package.json
└── README.md
```

### Web

Scaffold `apps/web` with:

- React
- TypeScript
- Vite
- Tailwind CSS
- shadcn/ui
- basic PWA manifest/service-worker setup

Build one mobile-first screen using placeholder data. It should demonstrate the intended core interaction rather than becoming a full visual-design exercise.

Conceptually:

```text
KiraCal

1,420 / 2,000 kcal
580 kcal remaining

[ Describe your meal...        ]
[ Analyse meal ]

Today's meals
```

Requirements:

- usable at narrow mobile widths
- no horizontal scrolling
- touch-friendly controls
- normal browser usage works without PWA installation
- placeholder meal/calorie data is clearly temporary

### API

Scaffold `apps/api` with:

- Node.js
- TypeScript
- Hono

Initial route:

```text
GET /health
→ { "status": "ok" }
```

No AI provider is required for Milestone 0.

### Milestone 0 definition of done

A fresh contributor should be able to clone the repository and reach a working local development state with a small number of documented commands.

At minimum:

```bash
npm install
npm run dev
```

The exact root scripts may evolve during scaffolding, but local development should remain simple.

Milestone 0 is done when:

- the web app starts locally
- the API starts locally
- the mobile-first placeholder KiraCal screen renders
- `GET /health` returns success
- the repository contains no real secrets

---

## Milestone 1 — Google authentication

Goal: establish a real user identity before building user-owned data.

Implement:

- Supabase project configuration
- Supabase client in the PWA
- Google OAuth through Supabase Auth
- session persistence
- protected authenticated app state
- sign out

Verify:

- login from desktop browser
- login from iPhone Safari
- login from Android Chrome
- Brave where practical
- OAuth redirects in normal browser mode
- OAuth redirects in installed-PWA mode where applicable

Do not add additional auth providers in v0.1.

---

## Milestone 2 — Personal calorie plan

Goal: give the user a usable daily target.

Implement first-time/profile setup with only the inputs needed by the selected calorie formula.

Likely fields:

- age
- sex used by the selected formula
- height
- weight
- activity level
- goal: lose / maintain / gain

Then:

- calculate estimated daily calorie target
- explain that it is an estimate
- allow manual override
- persist the profile/plan in Supabase

Before implementation, lock the BMR/TDEE formula and goal adjustment approach.

---

## Milestone 3 — AI meal analysis

Goal: make KiraCal's primary product interaction real.

User input example:

```text
Nasi putih, ayam kari, kangkung belacan
```

Implement:

1. large natural-language meal input
2. authenticated request to Railway
3. `POST /api/analyze-meal`
4. AI parsing/estimation
5. structured response validation
6. review screen
7. manual correction of estimated values

Minimum structured values:

- detected food name
- estimated portion/serving description
- calories
- protein
- carbohydrates
- fat
- meal totals

### AI provider selection

Do not choose the provider only from benchmarks or marketing.

Before integration, compare a small set of affordable candidate models using representative Malaysian meal inputs such as:

```text
nasi putih, ayam kari, kangkung belacan
roti canai dua keping dengan dhal
nasi kandar ayam goreng, kuah campur, telur masin
mee goreng mamak dengan telur mata
```

Compare:

- Malaysian-food understanding
- structured-output reliability
- nutrition-estimation usefulness
- latency
- cost

The MVP may begin with LLM-only estimates if that is the fastest acceptable prototype. Nutrition database grounding can be introduced when it proves necessary.

---

## Milestone 4 — Supabase meal persistence

Goal: turn reviewed AI output into durable user data.

Create the minimum schema needed for:

- profile/plan
- meals
- meal items if needed

Requirements:

- migrations are tracked in `supabase/migrations`
- every exposed user-owned table has Row Level Security
- policies enforce ownership by user ID
- one authenticated user cannot read or modify another user's data

Flow:

```text
AI result
   ↓
Review / correction
   ↓
User confirms
   ↓
PWA saves directly to Supabase under RLS
```

Railway should not become a database pass-through for ordinary CRUD operations.

---

## Milestone 5 — Real daily dashboard and history

Goal: replace placeholder numbers with real tracking.

Implement:

- daily calorie target
- calories consumed
- calories remaining
- protein total
- carbohydrate total
- fat total
- meals for selected day
- edit meal
- delete meal
- previous-day navigation/history

Keep the UI focused on daily usefulness rather than analytics.

Meal categories remain optional for v0.1 unless they clearly improve the experience.

---

## Milestone 6 — Mobile browser and PWA hardening

Goal: verify KiraCal's actual distribution strategy.

Test and fix:

- Safari on a real iPhone/iPad
- Chrome on a real Android device
- Brave on representative mobile devices where practical
- normal browser mode
- installed PWA mode
- Add to Home Screen/install behavior
- OAuth redirects
- mobile keyboards and meal text input
- safe-area insets
- changing mobile viewport height/browser chrome
- service-worker caching
- failed/slow network states

Critical rule:

> Installing the PWA must never be required to use the full core product.

---

## MVP release gate

KiraCal v0.1 is ready when a real user can:

1. open KiraCal from a supported mobile browser
2. sign in with Google
3. create a basic personal calorie plan
4. describe a Malaysian meal in natural language
5. receive an editable calorie/macro estimate
6. save the meal
7. see their daily totals update
8. revisit/edit/delete the meal later
9. use the same core workflow whether or not the PWA is installed

Anything not required for that flow should be treated as post-MVP unless a concrete blocker appears.
