# KiraCal API (scaffold)

Hono + TypeScript backend that will host the protected AI meal-analysis endpoint
on Railway. **Not connected yet** — the web app runs fully on a local
`MockMealAnalysisService` see `src/services/analysis/`.

## Run

```bash
cd apps/api
npm install
npm run dev          # http://localhost:8787
```

## Endpoints

| Method | Path | Status |
| --- | --- | --- |
| `GET` | `/health` | ✅ returns `{ "status": "ok" }` |
| `POST` | `/api/analyze-meal` | 🚧 returns `501` with the response contract until an AI provider is wired |

### `POST /api/analyze-meal` contract

Request:

```json
{ "description": "nasi putih, ayam kari, kangkung belacan" }
```

Response `200`:

```json
{
  "items": [
    {
      "name": "Nasi putih",
      "portion": "1 plate (~180 g)",
      "calories": 260,
      "proteinG": 5,
      "carbsG": 56,
      "fatG": 1
    }
  ],
  "totals": { "calories": 670, "proteinG": 34, "carbsG": 72, "fatG": 27 },
  "notes": []
}
```

## Production TODO

1. Supabase JWT verification middleware (`Authorization: Bearer <token>`).
2. Per-user rate limiting.
3. AI provider call with server-side secret (never in the PWA bundle).
4. `WEB_ORIGIN` locked to the deployed PWA origin.
