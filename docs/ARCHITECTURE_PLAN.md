# KiraCal Architecture

This document describes the current MVP architecture. It is intentionally small and should gain complexity only when the product needs it.

## Locked technology stack

### Web / PWA

- React
- TypeScript
- Vite
- Tailwind CSS
- shadcn/ui
- Web app manifest and service worker/PWA support

### API

- Node.js
- TypeScript
- Hono
- Railway hosting

### Auth and data

- Supabase Auth
- Google OAuth provider
- Supabase PostgreSQL
- Row Level Security for user-owned data

### AI

- Natural-language text meal analysis is part of the MVP
- Image analysis is deferred
- AI provider/model remains intentionally open until a small Malaysian-food bake-off is performed

## High-level architecture

```text
┌─────────────────────────┐
│   KiraCal React/Vite    │
│      Web / PWA          │
└───────────┬─────────────┘
            │
            ├───────────────────────────────┐
            │                               │
            ▼                               ▼
┌──────────────────────┐       ┌──────────────────────┐
│       Supabase       │       │       Railway        │
│                      │       │       Hono API       │
│ • Google Auth        │       │                      │
│ • PostgreSQL         │       │ • Auth validation    │
│ • Row Level Security │       │ • AI meal analysis   │
└──────────────────────┘       │ • Structured output  │
                               └───────────┬──────────┘
                                           │
                                           ▼
                                ┌──────────────────────┐
                                │     AI provider      │
                                │      TBD later       │
                                └──────────────────────┘
```

## Repository structure

KiraCal uses one repository for the web app, API, database migrations, and documentation.

```text
calorie-tracker-pwa/
├── apps/
│   ├── web/                 # React + Vite mobile-first PWA
│   └── api/                 # Hono + Node API deployed to Railway
├── supabase/
│   └── migrations/          # schema migration history
├── docs/
│   ├── PRODUCT.md
│   ├── ARCHITECTURE.md
│   ├── IMPLEMENTATION_PLAN.md
│   ├── ROADMAP.md
│   └── DECISIONS.md
├── package.json
└── README.md
```

This is intentionally not a large monorepo architecture. Do not add shared-package layers, microservices, queues, separate worker services, or extra infrastructure unless a concrete requirement appears.

## Browser-first distribution

KiraCal is being distributed primarily through the web because native App Store and Google Play Store distribution is not part of the initial budget.

The product must therefore work completely as a normal mobile website. PWA installation enhances the experience but is never required for core functionality.

Priority mobile browser targets for the MVP:

- Safari on iPhone/iPad
- Chrome on Android
- Brave on Android and iOS where practical

Core functionality that must work both in-browser and when installed:

- Google sign-in/session handling
- Personal calorie-plan setup
- Natural-language meal entry
- AI analysis requests
- Review/edit before save
- Daily calorie and macro totals
- Meal history and editing

The implementation should use progressive enhancement. Browser-specific PWA features must not become dependencies for the main application workflow.

### Mobile web UX baseline

The UI should account for:

- narrow phone viewports
- iPhone safe-area insets
- browser address/navigation bars changing viewport height
- touch-sized controls
- on-screen keyboard behavior around meal text input
- portrait-first use, while remaining functional in landscape
- responsive layout without horizontal scrolling

Avoid designing the application as a desktop page that merely shrinks down to mobile.

### Installation behavior

KiraCal should provide a valid web app manifest, appropriate icons, and a safe caching/service-worker strategy.

Installation wording and UI differ by browser and operating system. The app should not assume a universal JavaScript install prompt exists.

When useful, KiraCal can provide platform-specific guidance for adding the app to the Home Screen, but the browser version must remain fully usable without doing so.

## Why React + Vite?

KiraCal is a client-focused application and does not currently need server-side rendering or a full-stack web framework.

React + Vite keeps the frontend familiar, fast to start, easy to collaborate on, and suitable for a browser-first PWA. TypeScript is used across both frontend and backend to reduce context switching and make data contracts easier to reason about.

Tailwind CSS and shadcn/ui provide reusable UI behavior while still allowing KiraCal to establish its own visual identity.

## Why Hono on Railway?

The custom API is intentionally tiny. Its first meaningful responsibility is the authenticated meal-analysis endpoint.

Hono provides a small TypeScript HTTP layer without introducing a large backend framework. Node.js keeps the runtime familiar and Railway provides the deployment environment.

The backend should remain small enough that a new contributor can understand it quickly.

## Why this service split?

KiraCal needs a backend because AI provider credentials must never be shipped inside a public PWA.

However, having a backend does not mean every request needs to pass through it.

Supabase already provides:

- Authentication
- PostgreSQL
- Authenticated client access
- Row Level Security

For ordinary user-owned data, the PWA can communicate directly with Supabase under strict RLS policies.

Railway is reserved for trusted server-side operations that genuinely need secrets or controlled execution. For v0.1, that primarily means AI meal analysis.

This keeps the custom backend easy to understand, cheap to run, and easy for two contributors to maintain.

## Authentication flow

KiraCal uses **Supabase Auth + Google provider**.

```text
User
  ↓
Continue with Google
  ↓
Supabase Auth
  ↓
Google OAuth
  ↓
Supabase session returned to KiraCal
```

The browser should use a Supabase publishable/public client key only.

Never expose a Supabase secret/service-role key in frontend code.

OAuth redirect behavior must be tested in both ordinary browser tabs and installed-PWA mode on the priority mobile platforms.

## Railway API authentication

The PWA should not expose the AI endpoint as an unauthenticated public proxy.

Conceptual request flow:

```text
KiraCal PWA
  │
  │ Supabase access token
  ▼
Railway Hono API
  │
  ├── validate authenticated user
  ├── validate request body
  ├── call AI provider using server-side secret
  └── return structured meal analysis
```

Exact token-validation and validation-library details can be chosen during implementation, but the security boundary is already decided.

## API starting point

Before AI integration, the API needs only one proof-of-life route:

```text
GET /health
→ { "status": "ok" }
```

The first real product endpoint will conceptually be:

```text
POST /api/analyze-meal
```

Its job is to accept an authenticated meal description and return validated structured nutrition estimates.

## AI meal-analysis flow

Example user input:

```text
Nasi putih, ayam kari, kangkung belacan
```

Desired backend output shape conceptually:

```json
{
  "items": [
    {
      "name": "Nasi putih",
      "portion": "estimated serving",
      "calories": 0,
      "protein_g": 0,
      "carbs_g": 0,
      "fat_g": 0
    }
  ],
  "totals": {
    "calories": 0,
    "protein_g": 0,
    "carbs_g": 0,
    "fat_g": 0
  }
}
```

The numbers above are placeholders showing structure only.

The API contract should use structured validation rather than trusting arbitrary model prose.

## Review-before-save workflow

AI analysis is an estimate, not authoritative nutrition measurement.

```text
User describes meal
        ↓
Railway analyzes it
        ↓
Structured estimate returned
        ↓
User reviews / corrects
        ↓
Confirmed meal saved to Supabase
```

For KISS, the frontend performs the final save directly to Supabase after user confirmation rather than making Railway save every meal.

## Persistent data

Likely data areas include:

### Profile / plan

- User ID
- Age
- Height
- Weight
- Activity level
- Goal
- Calculated calorie target
- User-adjusted calorie target, if any

### Meals

- User ID
- Date/time
- Original text description
- Total calories
- Total protein
- Total carbohydrates
- Total fat
- AI analysis metadata if useful

### Meal items

Potentially separate meal-item rows containing:

- Meal ID
- Food name
- Portion description
- Calories
- Protein
- Carbohydrates
- Fat

The exact schema is still open. Choose the smallest model that supports editing, history, and totals cleanly.

## Security baseline

Every user-owned Supabase table exposed to the application must use Row Level Security.

Policies must restrict rows by authenticated user ownership rather than merely checking that a request is authenticated.

Server-only credentials such as AI API keys and any Supabase secret/service-role credentials must live only in Railway environment variables or another trusted server-side secret store.

The public repository must never contain real `.env` secrets.

## Offline behavior

KiraCal is a PWA, but AI analysis is network-dependent in the planned MVP.

Therefore:

- The app shell can be installable/cacheable.
- Previously loaded state may be cached locally where useful.
- AI meal analysis requires connectivity.
- Network failures should produce a clear retry state rather than losing the user's typed meal description.
- The service worker must not serve stale API/auth responses in ways that break sessions or nutrition data.

Full offline AI analysis is not an MVP goal.

## Current technology decisions

Accepted:

- React
- TypeScript
- Vite
- Tailwind CSS
- shadcn/ui
- PWA/browser-first distribution
- Safari, Chrome, and Brave mobile compatibility as an MVP requirement
- Google authentication through Supabase Auth
- Supabase/PostgreSQL database
- Node.js + TypeScript + Hono API
- Railway deployment for the custom API
- Text-only AI meal analysis for MVP
- Single-repository `apps/web` + `apps/api` structure

Still open:

- AI provider/model
- Nutrition grounding/data source
- Validation library/API contract tooling
- Exact Supabase schema
- Calorie target formula
- Visual design details

## Architecture rule

Before adding infrastructure, ask:

> Can an existing component we already use solve this safely and simply?

Do not introduce another service merely because it is common in larger applications.
