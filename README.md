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

🚧 **Early planning / MVP**

Product and technical decisions are documented in this repository as the project evolves.

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
- Install KiraCal as a PWA

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

## Product principles

1. **Working before clever** — ship the smallest useful version first.
2. **Describe, don't database-search** — natural-language meal logging is the primary MVP interaction.
3. **Estimates, not false precision** — nutrition depends on portions and preparation, so AI results should be clearly editable estimates.
4. **Mobile first** — KiraCal is primarily used from a phone.
5. **Keep the backend small** — use managed services where they remove unnecessary infrastructure work.
6. **AI where it earns its place** — text meal analysis is MVP; image analysis and other expensive complexity come later.
7. **Grow deliberately** — a feature idea is not automatically an MVP requirement.

## Architecture direction

```text
KiraCal PWA
│
├── Supabase
│   ├── Google authentication
│   └── PostgreSQL database + RLS
│
└── Railway API
    └── AI meal analysis
```

### Responsibilities

**PWA**
- Mobile UI
- Google sign-in flow
- Meal text input
- Review/edit AI estimates
- Daily tracking experience

**Supabase**
- Authentication
- User/profile data
- Personal calorie plan
- Meal history
- Row Level Security for user-owned data

**Railway backend**
- Receive authenticated meal-analysis requests
- Protect AI provider credentials
- Call the AI/model layer
- Validate and return structured nutrition estimates

The PWA can access user-owned Supabase data directly under RLS. Railway does not need to become a pass-through layer for every database operation.

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

- Frontend framework/tooling
- Railway backend framework/runtime
- AI model/provider
- Nutrition data/grounding strategy
- Exact calorie-target calculation formula
- Supabase schema
- Meal categories in v0.1
- Visual design direction

## Documentation

- [`docs/PRODUCT.md`](docs/PRODUCT.md) — product definition and MVP behavior
- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) — current system architecture and responsibilities
- [`docs/ROADMAP.md`](docs/ROADMAP.md) — staged feature roadmap
- [`docs/DECISIONS.md`](docs/DECISIONS.md) — important product and technical decisions

## Collaboration

KiraCal is being built collaboratively. Keep changes small, understandable, and easy for another contributor to pick up.

## License

Not decided yet.
