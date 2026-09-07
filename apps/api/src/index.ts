import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";

/**
 * KiraCal API scaffold (scaffold only — no AI provider wired yet).
 *
 * The web app currently uses a fully local `MockMealAnalysisService`.
 * When this API goes live on Railway, the frontend swap is:
 *
 *   MockMealAnalysisService → ApiMealAnalysisService (src/services/)
 *
 * with `ApiMealAnalysisService.analyze()` performing:
 *   POST /api/analyze-meal
 *   Authorization: Bearer <supabase access token>
 *   { "description": string }
 *   → 200 { "items": MealAnalysisItem[], "totals": Totals, "notes": string[] }
 */

interface AnalyzeMealRequest {
  description: string;
}

interface MealAnalysisItem {
  name: string;
  portion: string;
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
}

interface AnalyzeMealResponse {
  items: MealAnalysisItem[];
  totals: { calories: number; proteinG: number; carbsG: number; fatG: number };
  notes: string[];
}

const app = new Hono();

app.use(
  "*",
  cors({
    origin: process.env.WEB_ORIGIN ?? "*", // tighten to the PWA origin in production
    allowHeaders: ["Authorization", "Content-Type"],
  })
);

app.get("/health", (c) => c.json({ status: "ok" }));

app.post("/api/analyze-meal", async (c) => {
  // TODO(production):
  //   1. Verify Supabase JWT from Authorization header (auth middleware).
  //   2. Rate-limit per user.
  //   3. Call the AI provider with `body.description` (server-side key).
  //   4. Return AnalyzeMealResponse below.
  const body = (await c.req.json().catch(() => null)) as AnalyzeMealRequest | null;
  if (!body?.description?.trim()) {
    return c.json({ error: "description is required" }, 400);
  }
  return c.json(
    {
      error: "not_implemented",
      message: "AI provider not connected yet. The web app uses MockMealAnalysisService until this is wired.",
      contract: "AnalyzeMealResponse",
    } satisfies Record<string, string>,
    501
  );
});

const port = Number(process.env.PORT ?? 8787);
serve({ fetch: app.fetch, port }, (info) => {
  console.log(`KiraCal API listening on http://localhost:${info.port}`);
});

export type { AnalyzeMealRequest, AnalyzeMealResponse, MealAnalysisItem };
