import { useCallback, useEffect, useState } from "react";
import { sumItems, ZERO_TOTALS, type DaySummary, type Meal } from "@/lib/types";
import { mealRepository } from "@/services";
import { todayKey } from "@/lib/dates";
import { haptic, num, uid } from "@/lib/utils";
import { useSession } from "@/state/session";
import { useToast } from "@/state/toast";

/** One-tap "log this again" — copies a meal onto today with fresh item ids. */
export function useRepeatMeal() {
  const { session } = useSession();
  const toast = useToast();
  return useCallback(
    async (meal: Meal) => {
      if (!session) return;
      await mealRepository.create(session.user.id, {
        dateKey: todayKey(),
        originalDescription: meal.originalDescription,
        items: meal.items.map((i) => ({ ...i, id: uid() })),
      });
      haptic();
      toast.show(`Logged again · +${num(meal.totals.calories)} kcal`);
    },
    [session, toast]
  );
}

/** Meals for one calendar day, live-updating on any repository change. */
export function useMeals(userId: string | undefined, dateKey: string) {
  const [meals, setMeals] = useState<Meal[] | null>(null);

  const load = useCallback(async () => {
    if (!userId) return;
    const data = await mealRepository.listByDate(userId, dateKey);
    setMeals(data);
  }, [userId, dateKey]);

  useEffect(() => {
    let alive = true;
    setMeals(null);
    const safeLoad = async () => {
      if (!userId) return;
      const data = await mealRepository.listByDate(userId, dateKey);
      if (alive) setMeals(data);
    };
    void safeLoad();
    const unsub = mealRepository.subscribe(() => void safeLoad());
    return () => {
      alive = false;
      unsub();
    };
  }, [userId, dateKey]);

  const totals = meals ? sumItems(meals.map((m) => m.totals)) : ZERO_TOTALS;

  return { meals, loading: meals === null, totals, reload: load };
}

/** A single meal by id, live-updating (used on the detail screen). */
export function useMeal(userId: string | undefined, id: string | undefined) {
  const [meal, setMeal] = useState<Meal | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId || !id) return;
    let alive = true;
    const load = async () => {
      const data = await mealRepository.getById(userId, id);
      if (!alive) return;
      setMeal(data);
      setLoading(false);
    };
    void load();
    const unsub = mealRepository.subscribe(() => void load());
    return () => {
      alive = false;
      unsub();
    };
  }, [userId, id]);

  return { meal, loading };
}

/** Per-day summaries across all logged days — for the history date strip. */
export function useMealDates(userId: string | undefined) {
  const [byDate, setByDate] = useState<Record<string, DaySummary>>({});

  useEffect(() => {
    if (!userId) return;
    let alive = true;
    const load = async () => {
      const meals = await mealRepository.listAll(userId);
      if (!alive) return;
      const map: Record<string, DaySummary> = {};
      for (const m of meals) {
        const day = (map[m.dateKey] ??= {
          dateKey: m.dateKey,
          mealCount: 0,
          calories: 0,
          proteinG: 0,
          carbsG: 0,
          fatG: 0,
        });
        day.mealCount += 1;
        day.calories += m.totals.calories;
        day.proteinG += m.totals.proteinG;
        day.carbsG += m.totals.carbsG;
        day.fatG += m.totals.fatG;
      }
      setByDate(map);
    };
    void load();
    const unsub = mealRepository.subscribe(() => void load());
    return () => {
      alive = false;
      unsub();
    };
  }, [userId]);

  return byDate;
}
