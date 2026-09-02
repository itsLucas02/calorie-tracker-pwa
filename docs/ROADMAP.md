# KiraCal Roadmap

This roadmap is intentionally staged. KiraCal should earn complexity rather than starting with it.

## Phase 0 — Planning

- [x] Choose product name: **KiraCal**
- [x] Define the core user problem
- [x] Agree on KISS / MVP-first approach
- [x] Choose PWA as the initial app format
- [x] Choose local-first direction for the MVP
- [ ] Choose the initial frontend stack
- [ ] Decide the exact MVP data model
- [ ] Decide whether meal categories are included in v0.1
- [ ] Define a simple visual direction

## Phase 1 — Working MVP (v0.1)

Goal: make the smallest genuinely usable calorie tracker.

- [ ] Mobile-first app shell
- [ ] Installable PWA
- [ ] Offline-capable core experience
- [ ] Set daily calorie target
- [ ] Add food manually
- [ ] Edit food entries
- [ ] Delete food entries
- [ ] Calculate calories eaten
- [ ] Calculate calories remaining
- [ ] Daily progress display
- [ ] Browse previous days
- [ ] Persist data locally
- [ ] Basic empty/error states
- [ ] Verify usability on a real phone

## Phase 2 — Polish the core

Only after v0.1 works reliably.

Potential improvements:

- Faster repeat-food logging
- Recent foods
- Favorite foods
- Better meal grouping
- Better date navigation
- Search/filter local entries
- Portion/serving notes
- Export/import or local backup
- Accessibility improvements
- Install/update UX improvements for the PWA

## Phase 3 — Optional cloud layer

Only if accounts and cross-device use are actually valuable.

Potential features:

- Authentication
- Cloud database
- Cross-device sync
- Account backup/restore
- Migration from local-only data

The local-first experience should remain useful even if cloud features are added.

## Phase 4 — Nutrition expansion

Potential features, not commitments:

- Food nutrition database
- Macronutrients
- Barcode scanning
- Recipes and saved meals
- Weight tracking
- Goal/TDEE calculations
- Nutrition insights

## Phase 5 — Smart features and integrations

Potential future exploration:

- AI-assisted food entry
- Photo-based food recognition
- Natural-language logging
- Apple Health integration
- Google Health Connect integration
- Wearables

## Rule for adding features

Before adding a feature, ask:

1. Does this improve the core calorie-tracking workflow?
2. Is there evidence we actually need it?
3. Can we implement a simpler version first?
4. Will it make everyday logging slower or more confusing?

If a feature adds substantial complexity without improving the core workflow, defer it.
