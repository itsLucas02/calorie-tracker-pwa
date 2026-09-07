import type { MacroTotals } from "@/lib/types";

/**
 * Meal-analysis seam.
 *
 * Production target: `ApiMealAnalysisService` calling
 *   POST /api/analyze-meal  { description } → MealAnalysis
 * on the Railway-hosted Hono API (see apps/api). The mock below keeps
 * the full product loop working offline with demo-estimate data —
 * values are approximate, never medical-grade.
 */
export interface MealAnalysisItem extends MacroTotals {
  id: string;
  name: string;
  portion: string;
  /** False when the item fell back to a generic estimate. */
  matched: boolean;
}

export interface MealAnalysis {
  items: MealAnalysisItem[];
  totals: MacroTotals;
  notes: string[];
}

export interface MealAnalysisService {
  analyze(description: string): Promise<MealAnalysis>;
}
