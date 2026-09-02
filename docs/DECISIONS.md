# KiraCal Decision Log

This file records product and technical decisions that should remain easy to revisit later.

## D-001 — Product name

**Status:** Accepted  
**Decision:** The application is called **KiraCal**.

The GitHub repository remains `calorie-tracker-pwa` for now. The product name does not need to match the repository slug.

## D-002 — Start with a working MVP

**Status:** Accepted  
**Decision:** Follow KISS (Keep It Simple, Stupid) and prioritize a small working product over a broad feature set.

The MVP should remain intentionally narrow even though AI is part of the core product.

## D-003 — Build KiraCal as a PWA

**Status:** Accepted  
**Decision:** The initial application will be a Progressive Web App rather than a native mobile application.

The product should be mobile-first and installable from a browser.

## D-004 — Local-only MVP

**Status:** Superseded  
**Previous decision:** Use only local browser storage and avoid authentication/backend infrastructure.

**Superseded because:** The MVP now includes Google sign-in, AI meal analysis, and persistent account data through Supabase. Local state/cache may still improve responsiveness, but it is no longer the source of truth.

## D-005 — Manual calorie goal only

**Status:** Superseded  
**Previous decision:** Users manually enter a daily calorie target.

**New direction:** KiraCal will calculate a basic estimated daily calorie target from personal measurements, activity level, and goal. The user should still be able to override the result manually.

## D-006 — Manual food entry first

**Status:** Superseded  
**Previous decision:** Food is logged by manually entering a food name and calorie value.

**New direction:** Natural-language AI meal analysis is a core MVP feature. Manual editing remains the fallback for correcting AI estimates.

## D-007 — Broader product direction

**Status:** Partially resolved  
**Decision:** KiraCal is more than a bare calorie counter: the product direction includes AI-assisted nutrition tracking and personal calorie planning.

This still does not mean every nutrition feature belongs in the MVP. Advanced planning, integrations, image recognition, and other expansion features remain deferred.

## D-008 — Meal categories in v0.1

**Status:** Open  
**Question:** Should Breakfast / Lunch / Dinner / Snacks be included from the first implementation, or should v0.1 use one chronological daily list?

Default bias: choose the simpler option unless meal grouping materially improves the first user experience.

## D-009 — Frontend stack

**Status:** Accepted  
**Decision:** Use **React + TypeScript + Vite** for the KiraCal web/PWA frontend.

Use **Tailwind CSS + shadcn/ui** as the initial UI layer.

Rationale:

- KiraCal is primarily a client-side application and does not currently require server-side rendering.
- Vite keeps development setup small and fast.
- React is familiar, maintainable, and easy for collaborators to work with.
- TypeScript can be shared conceptually across frontend and backend.
- Tailwind and shadcn/ui provide reusable UI behavior without forcing KiraCal into a generic visual identity.

Do not introduce Next.js or another full-stack web framework unless a future requirement clearly justifies it.

## D-010 — Natural-language AI meal analysis is MVP

**Status:** Accepted  
**Decision:** The primary MVP meal-entry experience is text based.

Example input:

```text
Nasi putih, ayam kari, kangkung belacan
```

The AI should convert the description into structured foods and return estimated calories plus basic macronutrients.

Image/photo meal analysis is explicitly deferred.

## D-011 — Nutrition values are estimates and editable

**Status:** Accepted  
**Decision:** AI-generated nutrition values must be treated as estimates rather than exact measurements.

Users should be able to review and correct important meal values before or after saving. Preparation method and portion size can substantially change calories and nutrients, so the UI must not imply false precision.

## D-012 — Basic personal calorie plan is MVP

**Status:** Accepted  
**Decision:** KiraCal will collect basic body/profile information and calculate an estimated daily calorie target.

The MVP plan is a calorie-target calculator, not a full generated meal planner.

A true meal planner that suggests specific meals is deferred until after the core tracker works.

The exact BMR/TDEE formula and goal adjustment are still open implementation decisions.

## D-013 — Google sign-in

**Status:** Accepted  
**Decision:** Google will be the authentication method for the MVP.

Use **Supabase Auth with the Google provider**, rather than building a separate custom OAuth/session system.

Additional login methods are not required for v0.1.

## D-014 — Supabase for persistent application data

**Status:** Accepted  
**Decision:** Supabase will provide the project database and authentication layer.

User-owned data such as profile/plan settings and meal history must be protected with Row Level Security and ownership policies.

The public PWA must never receive a Supabase secret/service-role key.

## D-015 — Railway for the custom backend/API

**Status:** Accepted  
**Decision:** KiraCal's custom backend/API will be deployed on Railway using **Node.js + TypeScript + Hono**.

The Railway service should remain intentionally small. Its first product responsibility is to handle server-side AI meal analysis and protect AI provider credentials.

The initial proof-of-life route is:

```text
GET /health
→ { "status": "ok" }
```

The first real product endpoint will conceptually be:

```text
POST /api/analyze-meal
```

## D-016 — Minimal backend responsibility

**Status:** Accepted  
**Decision:** Do not route every database operation through Railway simply because a backend exists.

Preferred KISS architecture for the MVP:

```text
KiraCal PWA
├── Supabase Auth (Google sign-in)
├── Supabase Database (user/profile/meal data, protected by RLS)
└── Railway Hono API
    └── AI meal-analysis provider
```

The frontend can use Supabase directly for authenticated user data where RLS safely enforces ownership. Railway exists for operations that genuinely require trusted server-side code or secrets, starting with AI analysis.

Requests to the Railway API should be authenticated using the user's Supabase session/token and validated server-side.

## D-017 — AI provider and nutrition grounding

**Status:** Open  
**Question:** Which model/provider should perform meal parsing, and where should nutrition values come from?

Potential strategies:

1. LLM-only nutrition estimates for the fastest prototype.
2. LLM extracts foods/portions; a nutrition database/API supplies nutrient values.
3. Hybrid: use authoritative/database values where available and AI estimation for dishes not well represented in the database.

Support for Malaysian foods is an important selection criterion.

The provider should be selected after testing a small set of affordable candidate models against realistic Malaysian meal descriptions rather than choosing from marketing benchmarks alone.

## D-018 — Railway cost posture

**Status:** Accepted  
**Decision:** Start on Railway's lowest-cost/free experimentation tier and only pay for more capacity when actual usage requires it.

Pricing should be rechecked before production launch because platform pricing can change.

## D-019 — Mobile browser support is an MVP requirement

**Status:** Accepted  
**Decision:** KiraCal must work well as a normal mobile website even when the user never installs it as a PWA.

Priority browser targets for v0.1:

- Safari on iPhone/iPad
- Chrome on Android
- Brave on Android and iOS where practical

The browser experience and installed-PWA experience should share the same core functionality. Installation must never be required to log meals, view nutrition totals, manage the user's plan, or use Google sign-in.

Because there is no initial App Store or Google Play Store budget, the mobile web/PWA distribution path is the product's primary distribution channel, not a temporary secondary experience.

Safari should be treated as a first-class compatibility target rather than assuming Chromium behavior. Browser-specific install UI and PWA capabilities may differ, so KiraCal should use progressive enhancement and avoid depending on optional PWA APIs for core functionality.

## D-020 — Keep web and API in one repository

**Status:** Accepted  
**Decision:** Use one repository with a small app-oriented structure:

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

Do not create a separate backend repository for the MVP.

Do not introduce shared-package layers, microservices, queues, or additional infrastructure until a concrete need appears.

## D-021 — Build vertically, starting with a runnable shell

**Status:** Accepted  
**Decision:** The first coding milestone is **Milestone 0: KiraCal boots**.

Before real auth, database tables, or AI integration, the repository should produce:

- a locally runnable React/Vite mobile-first screen using placeholder data
- a meal-description input
- a placeholder daily calorie summary
- a locally runnable Hono API
- a successful `GET /health`

After Milestone 0, build in this order:

1. Google authentication
2. Personal calorie plan
3. AI meal analysis
4. Supabase meal persistence + RLS
5. Real daily dashboard/history
6. Mobile-browser/PWA hardening

This sequence is intended to keep debugging focused and make progress visible.

## D-022 — Do not choose the AI provider yet

**Status:** Accepted  
**Decision:** Defer the final AI provider/model selection until the API skeleton exists and a small model comparison can be run with realistic Malaysian meals.

Representative tests should include dishes such as:

```text
nasi putih, ayam kari, kangkung belacan
roti canai dua keping dengan dhal
nasi kandar ayam goreng, kuah campur, telur masin
mee goreng mamak dengan telur mata
```

Selection criteria should include Malaysian-food understanding, structured-output reliability, useful nutrition estimation, latency, and cost.
