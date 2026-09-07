import { createEmitter, type Unsubscribe } from "@/lib/emitter";
import { mealLabelForHour } from "@/lib/dates";
import { sumItems, type Meal, type MealItem } from "@/lib/types";
import { uid } from "@/lib/utils";

/**
 * Meal persistence seam.
 *
 * Production target: Supabase `meals` + `meal_items` tables (RLS),
 * with `subscribe` backed by Realtime. Swap `localMealRepository`
 * for a Supabase-backed implementation — screens don't change.
 */
export interface MealInput {
  /** Supply a fixed id to restore a previously deleted meal (Undo). */
  id?: string;
  dateKey: string;
  createdAt?: string;
  label?: string;
  originalDescription: string;
  items: MealItem[];
}

export interface MealRepository {
  subscribe(fn: () => void): Unsubscribe;
  listByDate(userId: string, dateKey: string): Promise<Meal[]>;
  listAll(userId: string): Promise<Meal[]>;
  getById(userId: string, id: string): Promise<Meal | null>;
  create(userId: string, input: MealInput): Promise<Meal>;
  update(
    userId: string,
    id: string,
    patch: Partial<Pick<Meal, "originalDescription" | "items" | "label" | "createdAt" | "dateKey">>
  ): Promise<Meal>;
  remove(userId: string, id: string): Promise<void>;
}

const emitter = createEmitter();
const keyFor = (userId: string) => `kiracal:v1:meals:${userId}`;

function readAll(userId: string): Meal[] {
  try {
    const raw = localStorage.getItem(keyFor(userId));
    const meals: Meal[] = raw ? JSON.parse(raw) : [];
    return meals.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  } catch {
    return [];
  }
}

function writeAll(userId: string, meals: Meal[]) {
  localStorage.setItem(keyFor(userId), JSON.stringify(meals));
  emitter.emit();
}

export const localMealRepository: MealRepository = {
  subscribe: emitter.subscribe,

  async listByDate(userId, dateKey) {
    return readAll(userId).filter((m) => m.dateKey === dateKey);
  },

  async listAll(userId) {
    return readAll(userId);
  },

  async getById(userId, id) {
    return readAll(userId).find((m) => m.id === id) ?? null;
  },

  async create(userId, input) {
    const createdAt = input.createdAt ?? new Date().toISOString();
    const meal: Meal = {
      id: input.id ?? uid(),
      userId,
      dateKey: input.dateKey,
      createdAt,
      label: input.label ?? mealLabelForHour(new Date(createdAt).getHours()),
      originalDescription: input.originalDescription,
      items: input.items,
      totals: sumItems(input.items),
    };
    writeAll(userId, [meal, ...readAll(userId).filter((m) => m.id !== meal.id)]);
    return meal;
  },

  async update(userId, id, patch) {
    const meals = readAll(userId);
    const idx = meals.findIndex((m) => m.id === id);
    if (idx === -1) throw new Error("Meal not found");
    const items = patch.items ?? meals[idx].items;
    const updated: Meal = {
      ...meals[idx],
      ...patch,
      items,
      totals: sumItems(items),
    };
    meals[idx] = updated;
    writeAll(userId, meals);
    return updated;
  },

  async remove(userId, id) {
    writeAll(
      userId,
      readAll(userId).filter((m) => m.id !== id)
    );
  },
};

export function newMealItem(partial: Omit<MealItem, "id">): MealItem {
  return { id: uid(), ...partial };
}
