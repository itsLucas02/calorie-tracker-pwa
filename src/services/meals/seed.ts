import { addDays, keyToDate, mealLabelForHour, todayKey } from "@/lib/dates";
import { analyzeMealNow } from "@/services/analysis/mockMealAnalysisService";
import type { MealRepository } from "./mealRepository";

/**
 * One-time demo history so a fresh account isn't staring at empty
 * screens. Runs through the same repository + analyser pipeline the
 * UI uses. In production this simply disappears (server-side data).
 */

const seededKey = (userId: string) => `kiracal:v1:seeded:${userId}`;

const DEMO_MEALS: { daysAgo: number; hour: number; minute: number; description: string }[] = [
  { daysAgo: 1, hour: 8, minute: 20, description: "Nasi lemak and teh o" },
  { daysAgo: 1, hour: 13, minute: 5, description: "2 roti canai with dhal and teh tarik kurang manis" },
  { daysAgo: 1, hour: 19, minute: 40, description: "Nasi putih, ayam kari, kangkung belacan" },
  { daysAgo: 2, hour: 8, minute: 50, description: "Roti bakar, 2 telur rebus and kopi o kosong" },
  { daysAgo: 2, hour: 13, minute: 30, description: "Mee goreng mamak dengan telur mata" },
  { daysAgo: 3, hour: 12, minute: 45, description: "Nasi ayam and air kelapa" },
  { daysAgo: 3, hour: 20, minute: 10, description: "Nasi putih, ikan bakar, sayur campur" },
];

export async function seedDemoMeals(repo: MealRepository, userId: string): Promise<void> {
  if (localStorage.getItem(seededKey(userId))) return;
  for (const plan of DEMO_MEALS) {
    const key = addDays(todayKey(), -plan.daysAgo);
    const at = keyToDate(key);
    at.setHours(plan.hour, plan.minute, 0, 0);
    const analysis = analyzeMealNow(plan.description);
    await repo.create(userId, {
      dateKey: key,
      createdAt: at.toISOString(),
      label: mealLabelForHour(plan.hour),
      originalDescription: plan.description,
      items: analysis.items.map((it) => ({
        id: it.id,
        name: it.name,
        portion: it.portion,
        calories: it.calories,
        proteinG: it.proteinG,
        carbsG: it.carbsG,
        fatG: it.fatG,
      })),
    });
  }
  localStorage.setItem(seededKey(userId), "1");
}
