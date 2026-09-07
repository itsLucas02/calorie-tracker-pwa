import type { ActivityLevel, Goal, MacroTotals, Sex } from "./types";

/**
 * Energy-target calculation.
 *
 * Mifflin-St Jeor BMR → activity multiplier (TDEE) → goal adjustment.
 * Pure + isolated: swap this module or move it server-side later
 * without any UI changes.
 */

export interface CalcInput {
  sex: Sex;
  age: number;
  heightCm: number;
  weightKg: number;
  activityLevel: ActivityLevel;
  goal: Goal;
}

export interface CalcResult {
  bmr: number;
  tdee: number;
  calorieTarget: number;
  macros: MacroTotals;
}

export const ACTIVITY_LEVELS: {
  id: ActivityLevel;
  title: string;
  desc: string;
  factor: number;
}[] = [
  { id: "sedentary", title: "Mostly sitting", desc: "Desk job, little exercise", factor: 1.2 },
  { id: "light", title: "Lightly active", desc: "Walks or light exercise 1–3× / week", factor: 1.375 },
  { id: "moderate", title: "Moderately active", desc: "Exercise 3–5× / week", factor: 1.55 },
  { id: "active", title: "Very active", desc: "Hard exercise 6–7× / week", factor: 1.725 },
  { id: "very_active", title: "Athlete level", desc: "Physical job + daily training", factor: 1.9 },
];

export const GOALS: {
  id: Goal;
  title: string;
  desc: string;
  delta: number;
}[] = [
  { id: "lose", title: "Lose weight", desc: "Gentle deficit, about 0.5 kg / week", delta: -500 },
  { id: "maintain", title: "Maintain", desc: "Stay where you are, feel good", delta: 0 },
  { id: "gain", title: "Gain weight", desc: "Small surplus for steady gain", delta: 300 },
];

/** Macro split of the calorie target, tuned per goal. */
const MACRO_SPLIT: Record<Goal, { protein: number; carbs: number; fat: number }> = {
  lose: { protein: 0.35, carbs: 0.35, fat: 0.3 },
  maintain: { protein: 0.3, carbs: 0.4, fat: 0.3 },
  gain: { protein: 0.3, carbs: 0.45, fat: 0.25 },
};

const round10 = (n: number) => Math.round(n / 10) * 10;

export function calculateTargets(input: CalcInput): CalcResult {
  const { sex, age, heightCm, weightKg, activityLevel, goal } = input;

  const bmrCalc =
    10 * weightKg + 6.25 * heightCm - 5 * age + (sex === "male" ? 5 : -161);
  const bmr = Math.max(900, Math.round(bmrCalc));

  const factor = ACTIVITY_LEVELS.find((a) => a.id === activityLevel)?.factor ?? 1.2;
  const tdee = Math.round(bmr * factor);

  const delta = GOALS.find((g) => g.id === goal)?.delta ?? 0;
  // Keep targets inside a sane band — estimates, not prescriptions.
  const calorieTarget = Math.min(4500, Math.max(1200, round10(tdee + delta)));

  const split = MACRO_SPLIT[goal];
  const macros: MacroTotals = {
    calories: calorieTarget,
    proteinG: Math.round((calorieTarget * split.protein) / 4),
    carbsG: Math.round((calorieTarget * split.carbs) / 4),
    fatG: Math.round((calorieTarget * split.fat) / 9),
  };

  return { bmr, tdee, calorieTarget, macros };
}

/** Daily macro targets for an arbitrary calorie target (uses the goal split). */
export function macrosForTarget(calories: number, goal: Goal): MacroTotals {
  const split = MACRO_SPLIT[goal];
  return {
    calories,
    proteinG: Math.round((calories * split.protein) / 4),
    carbsG: Math.round((calories * split.carbs) / 4),
    fatG: Math.round((calories * split.fat) / 9),
  };
}
