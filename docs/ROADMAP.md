# KiraCal Roadmap

This roadmap is intentionally staged. KiraCal should earn complexity rather than starting with it.

## Phase 0 — Planning

- [x] Choose product name: **KiraCal**
- [x] Define the core user problem
- [x] Agree on KISS / MVP-first approach
- [x] Choose PWA as the initial app format
- [x] Make natural-language AI meal analysis part of the MVP
- [x] Choose Google OAuth for sign-in
- [x] Choose Supabase for authentication/data persistence
- [x] Choose Railway to host the application backend/API
- [x] Define a basic personal calorie-plan calculator as MVP scope
- [ ] Choose the initial frontend stack
- [ ] Choose the backend framework/runtime for Railway
- [ ] Choose the AI model/provider
- [ ] Choose the nutrition estimation strategy/data source
- [ ] Decide the exact Supabase data model
- [ ] Choose the calorie-target/BMR/TDEE calculation formula
- [ ] Decide whether meal categories are included in v0.1
- [ ] Define a simple visual direction

## Phase 1 — Working MVP (v0.1)

Goal: make the smallest genuinely useful AI-assisted nutrition tracker.

### PWA and authentication

- [ ] Mobile-first app shell
- [ ] Installable PWA
- [ ] Graceful offline/network error states
- [ ] Google sign-in
- [ ] Authenticated session handling
- [ ] Sign out

### Personal plan

- [ ] Collect required body/profile measurements
- [ ] Collect activity level
- [ ] Collect goal: lose / maintain / gain
- [ ] Calculate an estimated daily calorie target
- [ ] Let the user manually adjust the target
- [ ] Save profile/plan to Supabase

### AI meal logging

- [ ] Natural-language meal input
- [ ] Send meal description to Railway backend
- [ ] Analyze text using an AI model
- [ ] Return structured detected foods
- [ ] Estimate calories per food and meal total
- [ ] Estimate protein
- [ ] Estimate carbohydrates
- [ ] Estimate fat
- [ ] Show a review screen before saving
- [ ] Allow correction of AI estimates
- [ ] Save confirmed meal to Supabase

### Daily tracking

- [ ] Show daily calorie target
- [ ] Calculate calories eaten
- [ ] Calculate calories remaining
- [ ] Show basic macro totals
- [ ] Show meals for the selected day
- [ ] Edit logged meals
- [ ] Delete logged meals
- [ ] Browse previous days

### Backend and data

- [ ] Create Supabase project/schema
- [ ] Configure Supabase Auth with Google
- [ ] Enable RLS on user-owned tables
- [ ] Add ownership policies for user data
- [ ] Create minimal Railway API service
- [ ] Keep AI/provider secrets server-side on Railway
- [ ] Authenticate requests from the PWA to the Railway API
- [ ] Add basic request validation and error handling

### MVP verification

- [ ] Test common Malaysian meal descriptions
- [ ] Test vague and specific portion descriptions
- [ ] Test failed AI/network requests
- [ ] Verify one user cannot access another user's data
- [ ] Verify usability on a real phone
- [ ] Verify installability as a PWA

## Phase 2 — Polish the core

Only after v0.1 works reliably.

Potential improvements:

- Faster repeat-meal logging
- Recent meals
- Favorite foods
- Saved/common meals
- Better meal grouping
- Better date navigation
- Portion presets
- AI clarification when portions are ambiguous
- Better confidence/estimate messaging
- Better nutrition source grounding
- Accessibility improvements
- PWA install/update UX improvements

## Phase 3 — Real meal planning

The MVP personal plan only calculates a calorie target. A true meal planner comes later.

Potential features:

- Suggested meals based on remaining calories/macros
- Daily meal plans
- Weekly meal plans
- Dietary preferences
- Excluded foods/allergies
- Saved meal-plan templates
- Recipe suggestions
- Grocery lists

## Phase 4 — Nutrition expansion

Potential features, not commitments:

- Dedicated food/nutrition database
- Richer macro targets
- Micronutrients
- Barcode scanning
- Recipes and saved meals
- Weight tracking/history
- Goal progress
- Nutrition insights
- Data export

## Phase 5 — Smart input and integrations

Potential future exploration:

- Photo-based food recognition
- Camera meal analysis
- Voice meal logging
- Apple Health integration
- Google Health Connect integration
- Wearables

## Rule for adding features

Before adding a feature, ask:

1. Does this improve the core meal-logging or daily-planning workflow?
2. Is there evidence we actually need it?
3. Can we implement a simpler version first?
4. Will it make everyday logging slower or more confusing?
5. Does AI add real value here, or are we adding AI for its own sake?

If a feature adds substantial complexity without improving the core workflow, defer it.
