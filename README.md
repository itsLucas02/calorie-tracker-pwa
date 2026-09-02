# KiraCal

**A simple, fast, installable calorie tracker built as a Progressive Web App (PWA).**

KiraCal starts with one job:

> **Quickly log what you ate today and see how many calories you have left.**

The project deliberately follows a **KISS (Keep It Simple, Stupid)** approach. The first release should work well before it becomes feature-rich.

## Status

🚧 **Early planning / MVP**

The repository is starting from a blank canvas. Product decisions and scope will be documented here as the project evolves.

## MVP

The first usable version of KiraCal should let a user:

- Set a daily calorie target
- Add food manually with a name and calorie value
- Edit and delete food entries
- See calories consumed today
- See calories remaining for the day
- Review entries from previous days
- Keep data persisted on the device
- Install the app as a PWA
- Use the core tracker offline

The initial user experience should be roughly:

```text
Home
├── Daily calorie summary
├── Today's food entries
└── + Add food

Add Food
├── Food name
├── Calories
└── Save

Settings
└── Daily calorie goal
```

## Product principles

1. **Working before clever** — ship the smallest useful tracker first.
2. **Fast logging** — adding food should take very little effort.
3. **Mobile first** — this is primarily something people will use from their phones.
4. **Local first** — the MVP should not require an account or backend just to track calories.
5. **Offline capable** — core tracking should continue to work without an internet connection.
6. **Grow deliberately** — features such as cloud sync, food databases, barcode scanning, macros, AI, and integrations come later only when they earn their complexity.

## Initial architecture direction

For the MVP, KiraCal is intended to remain extremely small:

```text
PWA frontend
    ↓
Local browser storage
```

No backend, authentication, or cloud database is required for the first working version.

A cloud-backed architecture can be introduced later if cross-device sync or accounts become necessary.

## Documentation

- [`docs/PRODUCT.md`](docs/PRODUCT.md) — product definition and MVP behavior
- [`docs/ROADMAP.md`](docs/ROADMAP.md) — staged feature roadmap
- [`docs/DECISIONS.md`](docs/DECISIONS.md) — important product and technical decisions

## Collaboration

KiraCal is being built collaboratively. Keep changes small, understandable, and easy for another contributor to pick up.

## License

Not decided yet.
