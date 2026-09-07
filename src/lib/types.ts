/**
 * KiraCal domain model — intentionally flat and local-storage friendly.
 * These shapes map 1:1 onto the future Supabase tables
 * (profiles / meals / meal_items) so persistence can be swapped
 * without touching screens.
 */

export type Sex = "female" | "male";
export type ActivityLevel = "sedentary" | "light" | "moderate" | "active" | "very_active";
export type Goal = "lose" | "maintain" | "gain";

export interface SessionUser {
  id: string;
  email: string;
  name: string;
}

export interface Session {
  user: SessionUser;
  /** Stand-in for a real access token (Supabase JWT later). */
  accessToken: string;
  createdAt: string;
}

export interface UserProfile {
  id: string;
  userId: string;
  name: string;
  createdAt: string;
  age: number;
  sex: Sex;
  heightCm: number;
  weightKg: number;
  activityLevel: ActivityLevel;
  goal: Goal;
  /** Result of the Mifflin-St Jeor + activity + goal calculation. */
  calculatedCalorieTarget: number;
  /** User override. When null, the calculated target is used. */
  customCalorieTarget: number | null;
}

export interface MacroTotals {
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
}

export interface MealItem extends MacroTotals {
  id: string;
  name: string;
  portion: string;
}

export interface Meal {
  id: string;
  userId: string;
  /** Local calendar day, "YYYY-MM-DD" — the unit history is grouped by. */
  dateKey: string;
  /** ISO timestamp of when the meal was eaten/logged. */
  createdAt: string;
  /** Display label derived from time of day: "Lunch", "Dinner"… */
  label: string;
  /** Raw text the user typed. */
  originalDescription: string;
  items: MealItem[];
  totals: MacroTotals;
}

export interface MealDraftItem extends Omit<MealItem, "id"> {
  id: string;
  /** True when the mock analyser did not recognise the food. */
  estimated?: boolean;
}

export interface DaySummary extends MacroTotals {
  dateKey: string;
  mealCount: number;
}

export const ZERO_TOTALS: MacroTotals = { calories: 0, proteinG: 0, carbsG: 0, fatG: 0 };

export function sumItems(items: MacroTotals[]): MacroTotals {
  return items.reduce(
    (acc, it) => ({
      calories: acc.calories + it.calories,
      proteinG: acc.proteinG + it.proteinG,
      carbsG: acc.carbsG + it.carbsG,
      fatG: acc.fatG + it.fatG,
    }),
    { ...ZERO_TOTALS }
  );
}

export function effectiveTarget(p: UserProfile): number {
  return p.customCalorieTarget ?? p.calculatedCalorieTarget;
}
