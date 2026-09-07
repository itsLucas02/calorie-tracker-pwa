# KiraCal Product Definition

## Product statement

KiraCal is a lightweight, AI-assisted nutrition-tracking PWA focused on making food logging fast and uncomplicated.

The MVP should answer two questions:

> **Can I describe what I just ate and quickly get a useful calorie and nutrition estimate?**
>
> **Can KiraCal give me a simple estimated daily calorie target based on my body and goal?**

KiraCal deliberately follows a KISS (Keep It Simple, Stupid) approach. AI is included because natural-language meal logging is part of the core experience, but advanced AI features are deferred.

## Core user scenario

A user opens KiraCal and types a natural description of their meal, for example:

```text
Nasi putih, ayam kari, kangkung belacan
```

A more detailed entry might be:

```text
1 plate nasi putih, 1 piece ayam kari, and one serving kangkung belacan
```

KiraCal sends the text to the backend for AI-assisted analysis. The result should be converted into a structured meal estimate containing individual foods and useful nutrition values.

Example result:

```text
Nasi putih
Estimated calories: ...
Protein: ...
Carbohydrates: ...
Fat: ...

Ayam kari
Estimated calories: ...
Protein: ...
Carbohydrates: ...
Fat: ...

Kangkung belacan
Estimated calories: ...
Protein: ...
Carbohydrates: ...
Fat: ...

Meal total
Calories: ...
Protein: ...
Carbohydrates: ...
Fat: ...
```

Nutrition values are estimates rather than medical-grade measurements. Portion size and preparation method can materially change the result, so the interface should make estimates clear and allow correction before or after saving.

## MVP scope

### 1. Google sign-in

Users sign in with Google.

The current direction is to use Supabase Auth with Google as the identity provider so authentication and database identity can remain closely integrated.

Email/password authentication and additional social providers are not required for v0.1.

### 2. Personal plan setup

KiraCal will include a basic onboarding/calorie-target calculator.

The user provides the minimum information needed to produce a reasonable daily energy estimate. Likely inputs include:

- Age
- Sex used by the chosen BMR formula
- Height
- Weight
- Activity level
- Goal: lose, maintain, or gain weight

KiraCal then calculates an **estimated daily calorie target**.

The exact formula and goal adjustments are still an implementation decision. The result must be presented as an estimate, not a medical recommendation.

Users should be able to manually adjust the calculated target if desired.

This feature is called a personal plan or calorie-target calculator in the MVP. A true meal planner that generates specific daily menus is a later feature.

### 3. AI-assisted text meal logging

Natural-language text input is the primary food logging method for the MVP.

The user describes a meal and KiraCal attempts to identify:

- Foods/dishes
- Approximate portions when supplied or reasonably inferable
- Estimated calories
- Estimated protein
- Estimated carbohydrates
- Estimated fat

Additional nutrition fields may be included only if they are reliable and do not complicate the initial implementation.

If portion information is too vague, the product may either use a clearly stated default serving estimate or ask for a simple clarification. The UX should favor speed rather than turning logging into a questionnaire.

### 4. Review before save

AI output should not silently become unquestionable truth.

Before or after saving, users should be able to correct important values such as:

- Food name
- Portion/serving description
- Calories
- Protein
- Carbohydrates
- Fat

This gives the MVP a practical fallback when AI estimates are wrong.

### 5. Daily diary

The main screen displays meals logged for the current day.

The first implementation may use a simple chronological list. Breakfast / Lunch / Dinner / Snacks grouping remains optional unless it materially improves the experience.

### 6. Daily summary

The home screen should make the user's daily position obvious.

Example:

```text
Goal       2,000 kcal
Eaten      1,420 kcal
Remaining    580 kcal
Protein       82 g
```

Calories are the primary metric. Basic macronutrient totals can be shown because the AI meal analysis already produces them, but the interface should remain uncluttered.

### 7. Edit and delete

Users must be able to correct or remove logged meals and nutrition estimates.

### 8. History

Users should be able to inspect previous days and their logged meals.

No advanced analytics dashboard is required for v0.1.

### 9. Persistence and account data

The current MVP direction uses Supabase as the database rather than a purely local-only store.

User data should be associated with the authenticated user and protected so one user cannot access another user's meals or profile.

Local browser state/cache may still be used for responsiveness, but Supabase is the source of persistent account data.

### 10. PWA behavior

KiraCal should remain mobile-first and installable as a PWA.

Because AI meal analysis requires a server/network call, the entire MVP cannot be fully offline. Previously loaded information can still be cached where useful, and the application should handle offline/network failure gracefully.

## MVP user flow

```text
Sign in with Google
        ↓
First-time plan setup
(age, height, weight, activity, goal)
        ↓
Estimated daily calorie target
        ↓
Home
├── Daily calorie/nutrition summary
├── Today's meals
└── + Log meal
        ↓
Describe meal in text
        ↓
AI analysis
        ↓
Review estimated foods + nutrition
        ↓
Save meal
        ↓
Daily totals update
```

## Initial screens

### Authentication

- KiraCal branding
- Continue with Google

### Plan Setup / Profile

- Body/profile inputs required by the selected calorie formula
- Activity level
- Weight goal
- Calculated daily calorie target
- Manual adjustment option

### Home

- Current date
- Daily calorie goal
- Calories eaten
- Calories remaining
- Basic macro summary
- Meals for the selected day
- Log Meal action
- Simple date navigation

### Log Meal

- Large natural-language text input
- Analyze action
- Loading/error state

### Review Meal

- Detected foods
- Estimated portions
- Estimated calories and basic macros
- Meal total
- Edit/correct action
- Save

### Settings / Profile

- Personal measurements
- Goal/activity settings
- Daily calorie target
- Sign out

## Explicitly out of MVP

The following should not block v0.1:

- Image/photo food analysis
- Camera recognition
- Barcode scanning
- Voice meal logging
- Advanced micronutrient analysis
- Medical or clinical nutrition recommendations
- Generated weekly meal plans
- Recipe generation
- Grocery lists
- Wearable integrations
- Apple Health
- Google Health Connect
- Social features
- Leaderboards
- Gamification/streak systems
- Subscriptions/payments
- Complex analytics

## Open product/technical questions

### Nutrition estimation source

We still need to choose how AI nutrition estimates are grounded.

Possible approaches include:

1. LLM-only estimates for the fastest prototype.
2. AI parses the meal into structured foods and a nutrition database/API provides nutrient values.
3. A hybrid approach where database values are preferred and AI estimates dishes that are missing.

This decision matters particularly for Malaysian foods and mixed dishes such as nasi lemak, ayam kari, sambal, and kangkung belacan.

### Exact nutrition fields

Calories and protein are definitely useful. Carbohydrates and fat are also reasonable MVP fields. Additional micronutrients should only be added if their estimates are sufficiently trustworthy.
