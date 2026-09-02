# KiraCal Decision Log

This file records product and technical decisions that should remain easy to revisit later.

## D-001 — Product name

**Status:** Accepted  
**Decision:** The application is called **KiraCal**.

The GitHub repository remains `calorie-tracker-pwa` for now. The product name does not need to match the repository slug.

## D-002 — Start with a working MVP

**Status:** Accepted  
**Decision:** Follow KISS (Keep It Simple, Stupid) and prioritize a small working product over a broad feature set.

The MVP's core job is:

> Quickly log what you ate today and see how many calories you have left.

Features that do not materially help this workflow should not block v0.1.

## D-003 — Build KiraCal as a PWA

**Status:** Accepted  
**Decision:** The initial application will be a Progressive Web App rather than a native mobile application.

The product should be mobile-first, installable, and capable of supporting the core tracker offline.

## D-004 — Local-first MVP

**Status:** Accepted  
**Decision:** The first working version does not require authentication, a backend, or a cloud database.

The initial architecture direction is:

```text
PWA frontend
    ↓
Local browser storage
```

This keeps infrastructure and operating cost close to zero while reducing implementation complexity.

A cloud layer may be added later for accounts, backup, or cross-device sync if needed.

## D-005 — Manual calorie goal

**Status:** Accepted  
**Decision:** Users enter their own daily calorie target in the MVP.

Automatic TDEE/BMR calculations and personalized calorie recommendations are deferred.

## D-006 — Manual food entry first

**Status:** Accepted  
**Decision:** Food can initially be logged with a simple name and calorie value.

Barcode scanning, food databases, AI recognition, and other automated entry methods are deferred until the manual workflow works well.

## D-007 — Product direction after MVP remains open

**Status:** Open  
**Question:** Should KiraCal remain intentionally lightweight, or eventually grow into a broader nutrition platform?

This does not need to be decided before v0.1. We should avoid architecture choices that unnecessarily prevent future growth, but we should not build speculative infrastructure for hypothetical features either.

## D-008 — Meal categories in v0.1

**Status:** Open  
**Question:** Should Breakfast / Lunch / Dinner / Snacks be included from the first implementation, or should v0.1 use one chronological daily list?

Default bias: choose the simpler option unless meal grouping materially improves the first user experience.

## D-009 — Frontend stack

**Status:** Open  
**Question:** Which frontend stack should KiraCal use?

No framework or library has been selected yet. The decision should favor a simple PWA development experience, good mobile UX, maintainability, and easy collaboration.
