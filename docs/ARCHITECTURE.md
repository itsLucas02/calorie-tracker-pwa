# KiraCal Architecture

This document describes the current MVP architecture direction. It is intentionally small and should change only when the product needs more complexity.

## High-level architecture

```text
┌─────────────────────┐
│     KiraCal PWA     │
│  mobile-first web   │
└─────────┬───────────┘
          │
          ├──────────────────────────────┐
          │                              │
          ▼                              ▼
┌─────────────────────┐       ┌─────────────────────┐
│      Supabase       │       │     Railway API     │
│                     │       │                     │
│ • Google Auth       │       │ • Auth validation   │
│ • PostgreSQL        │       │ • AI meal analysis  │
│ • Row Level Security│       │ • Structured output │
└─────────────────────┘       └──────────┬──────────┘
                                        │
                                        ▼
                              ┌─────────────────────┐
                              │     AI provider     │
                              │   model TBD later   │
                              └─────────────────────┘
```

## Why this split?

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

Current direction: **Supabase Auth + Google provider**.

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

## Railway API authentication

The PWA should not expose the AI endpoint as an unauthenticated public proxy.

Conceptual request flow:

```text
KiraCal PWA
  │
  │ Supabase access token
  ▼
Railway API
  │
  ├── validate authenticated user
  ├── validate request body
  ├── call AI provider using server-side secret
  └── return structured meal analysis
```

Exact token-validation implementation will be chosen when the backend framework is selected.

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

Recommended flow:

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

For KISS, the frontend can perform the final save directly to Supabase after user confirmation rather than making Railway save every meal.

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

The exact schema is still open. We should choose the smallest model that supports editing, history, and totals cleanly.

## Security baseline

Every user-owned Supabase table exposed to the application must use Row Level Security.

Policies must restrict rows by authenticated user ownership rather than merely checking that a request is authenticated.

Server-only credentials such as AI API keys and any Supabase secret/service-role credentials must live only in Railway environment variables or another trusted server-side secret store.

The public repository must never contain real `.env` secrets.

## Offline behavior

KiraCal is a PWA, but AI analysis is inherently network-dependent in the planned MVP.

Therefore:

- The app shell can be installable/cacheable.
- Previously loaded state may be cached locally where useful.
- AI meal analysis requires connectivity.
- Network failures should produce a clear retry state rather than losing the user's typed meal description.

Full offline AI analysis is not an MVP goal.

## Current technology decisions

Accepted:

- PWA
- Google authentication
- Supabase Auth
- Supabase/PostgreSQL database
- Railway-hosted custom API
- Text-only AI meal analysis for MVP

Still open:

- Frontend framework
- Backend runtime/framework
- AI provider/model
- Nutrition grounding/data source
- Validation library/API contract tooling
- Exact Supabase schema
- Calorie target formula

## Architecture rule

Before adding infrastructure, ask:

> Can an existing component we already use solve this safely and simply?

Do not introduce another service merely because it is common in larger applications.
