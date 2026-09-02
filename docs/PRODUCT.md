# KiraCal Product Definition

## Product statement

KiraCal is a lightweight calorie-tracking PWA focused on making daily calorie logging fast and uncomplicated.

The MVP answers one question:

> **Can I quickly log what I ate today and see how many calories I have left?**

If the app does that reliably and pleasantly, the MVP succeeds.

## Target experience

KiraCal should feel closer to a tiny personal utility than a large nutrition platform.

For the first release, a user should be able to open the app, understand their calorie status immediately, log food in seconds, and leave.

## MVP scope

### 1. Daily calorie target

The user manually sets a daily calorie target, for example `2,000 kcal`.

The MVP does **not** calculate TDEE, BMR, weight-loss targets, or personalized recommendations.

### 2. Manual food logging

A food entry needs only the information required to make calorie tracking work:

- Food name
- Calories
- Date/time or associated day
- Optional meal category if we decide it improves the UX without adding friction

Example:

```text
Nasi lemak
650 kcal
```

Quantity or serving notes can remain optional.

### 3. Today's diary

The main screen displays the foods logged for the current day.

Possible meal groups are:

- Breakfast
- Lunch
- Dinner
- Snacks

Meal grouping is not mandatory for the earliest implementation. If it makes the first build unnecessarily complicated, a simple chronological list is preferred.

### 4. Daily summary

The home screen should make the user's calorie position obvious.

Example:

```text
Goal       2,000 kcal
Eaten      1,420 kcal
Remaining    580 kcal
```

A simple progress indicator may complement these numbers, but clarity is more important than decoration.

### 5. Edit and delete

Users must be able to correct or remove food entries. Manual calorie tracking becomes frustrating quickly if mistakes cannot be fixed.

### 6. History

Users should be able to inspect previous days and their logged food.

The first implementation can use very simple date navigation such as:

```text
← Previous day    Today    Next day →
```

No analytics dashboard is required for the MVP.

### 7. Local persistence

Entries and settings must survive page refreshes and reopening the PWA.

The intended MVP is local-first and should use browser storage rather than requiring a server.

### 8. PWA and offline behavior

KiraCal should be installable to a phone/home screen and its core tracking experience should remain usable without an internet connection.

## Initial screens

### Home

- Current date
- Daily calorie goal
- Calories eaten
- Calories remaining
- Progress indicator
- Food entries for the selected day
- Add Food action
- Simple date navigation

### Add / Edit Food

- Food name
- Calories
- Optional meal/serving information if retained
- Save
- Cancel

### Settings

- Daily calorie target

That is enough for the first usable version.

## Explicitly out of MVP

The following are useful ideas, but they should **not** block the first release:

- User accounts
- Cloud sync
- Barcode scanning
- Food/nutrition databases
- AI food recognition
- Photo calorie estimation
- Macronutrient tracking
- Micronutrients
- Recipes
- Meal planning
- TDEE/BMR calculators
- Weight tracking
- Apple Health
- Google Health Connect
- Wearable integrations
- Social features
- Leaderboards
- Gamification or streak systems
- Subscriptions/payments
- Complex analytics

## Open product direction

One strategic question remains intentionally undecided:

> Should KiraCal remain an intentionally lightweight calorie tracker, or eventually grow into a broader nutrition product with food databases, macros, barcode scanning, AI recognition, and integrations?

We do not need to answer this before building the MVP. The architecture should avoid needless constraints while also avoiding speculative complexity.
