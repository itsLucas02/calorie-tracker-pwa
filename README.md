# KiraCal

**A simple AI-assisted calorie and nutrition tracker built as a Progressive Web App (PWA).**

KiraCal's core experience is straightforward:

> **Describe what you ate. KiraCal estimates the calories and nutrition, logs it, and shows how it fits your daily target.**

Example:

```text
Nasi putih, ayam kari, kangkung belacan
```

KiraCal analyzes the text, identifies the foods, estimates calories and basic macronutrients, lets the user review the result, and then adds the meal to the day.

The project deliberately follows **KISS (Keep It Simple, Stupid)**. AI is part of the MVP because it removes friction from food logging, but advanced AI features are not.

## Status

🚧 **MVP scope locked / implementation starting**

The first implementation should now focus on making KiraCal runnable rather than adding more product scope.

## MVP

The first usable version should let a user:

- Sign in with Google
- Enter basic body/profile information
- Get an estimated daily calorie target
- Adjust that target manually if desired
- Describe a meal using natural-language text
- Have AI identify the foods and estimate nutrition
- Review/correct the AI result
- Track calories consumed and remaining
- Track basic macros such as protein, carbohydrates, and fat
- Edit/delete logged meals
- Review previous days
- Use KiraCal fully from a supported mobile browser without installing it
- Optionally install KiraCal as a PWA

### Example flow

```text
Google Sign-in
      ↓
Personal plan setup
      ↓
Daily calorie target
      ↓
Home
      ↓
"Nasi putih, ayam kari, kangkung belacan"
      ↓
AI meal analysis
      ↓
Review calories + macros
      ↓
Save
      ↓
Daily totals update
```

## Locked MVP stack

### Web / PWA

- React
- TypeScript
- Vite
- Tailwind CSS
- shadcn/ui
- Web app manifest + service worker/PWA support

### API

- Node.js
- TypeScript
- Hono
- Deployed on Railway

### Auth and data

- Supabase Auth with Google
- Supabase PostgreSQL
- Row Level Security for user-owned data

### AI

- Text-only meal analysis for v0.1
- AI provider/model intentionally **TBD** until we test real Malaysian meal inputs

## Repository direction

KiraCal stays in one repository:

```text
calorie-tracker-pwa/
├── apps/
│   ├── web/            # React/Vite PWA
│   └── api/            # Hono API for Railway
├── supabase/
│   └── migrations/     # database migrations
├── docs/
├── package.json
└── README.md
```

Do not add shared-package layers, extra services, or complex infrastructure until the project actually needs them.

## First implementation milestone

**Milestone 0: KiraCal boots.**

Before authentication, AI, or real database data, the repository should reach a state where a contributor can run:

```bash
npm install
npm run dev
```

and get:

- a mobile-first KiraCal web screen using placeholder data
- a meal-description input
- a basic daily calorie summary
- an `apps/api` service with a working `GET /health` endpoint

After that, implementation proceeds vertically: Google auth → personal plan → AI meal analysis → Supabase persistence → real daily dashboard/history → mobile/PWA hardening.

## Product principles

1. **Working before clever** — ship the smallest useful version first.
2. **Describe, don't database-search** — natural-language meal logging is the primary MVP interaction.
3. **Estimates, not false precision** — nutrition depends on portions and preparation, so AI results should be clearly editable estimates.
4. **Mobile first** — KiraCal is primarily used from a phone.
5. **Browser first** — the full product works in supported mobile browsers; PWA installation is optional.
6. **Keep the backend small** — use managed services where they remove unnecessary infrastructure work.
7. **AI where it earns its place** — text meal analysis is MVP; image analysis and other expensive complexity come later.
8. **Grow deliberately** — a feature idea is not automatically an MVP requirement.

## Architecture direction

```text
KiraCal React/Vite PWA
│
├── Supabase
│   ├── Google authentication
│   └── PostgreSQL database + RLS
│
└── Railway
    └── Hono API
        └── AI meal analysis
```

The PWA can access user-owned Supabase data directly under RLS. Railway is reserved for trusted server-side work such as protecting AI credentials and performing meal analysis; it should not become a pass-through layer for every database operation.

## Not in the MVP

- Photo/image food recognition
- Camera analysis
- Barcode scanning
- Voice logging
- Full generated meal plans
- Grocery lists
- Advanced micronutrients
- Health/wearable integrations
- Social features
- Payments/subscriptions

## Current open decisions

- AI model/provider
- Nutrition data/grounding strategy
- Exact calorie-target calculation formula
- Exact Supabase schema
- Meal categories in v0.1
- Visual design direction

## Documentation

- [`docs/PRODUCT.md`](docs/PRODUCT.md) — product definition and MVP behavior
- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) — current system architecture and responsibilities
- [`docs/IMPLEMENTATION_PLAN.md`](docs/IMPLEMENTATION_PLAN.md) — implementation milestones and build order
- [`docs/ROADMAP.md`](docs/ROADMAP.md) — staged feature roadmap
- [`docs/DECISIONS.md`](docs/DECISIONS.md) — important product and technical decisions

## Collaboration

KiraCal is being built collaboratively. Keep changes small, understandable, and easy for another contributor to pick up.

## License

Not decided yet.
