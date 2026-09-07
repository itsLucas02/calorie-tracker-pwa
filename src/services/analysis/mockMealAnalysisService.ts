import { sumItems, type MacroTotals } from "@/lib/types";
import { uid, titleCase } from "@/lib/utils";
import { ALIAS_INDEX, type FoodEntry } from "./foodDatabase";
import type { MealAnalysis, MealAnalysisItem, MealAnalysisService } from "./mealAnalysisService";

/**
 * Local heuristic analyser ("good enough to demo, honest about it").
 * Recognises common Malaysian dishes, quantities ("2 roti canai") and
 * drink modifiers ("kurang manis", "kosong"); unknown food falls back
 * to an editable generic estimate instead of failing.
 */

const SEPARATORS = /[,;\n/]+|\s+(?:dan|and|with|dengan|plus|serta)\s+|\s*[+&]\s*/i;
const QTY_PREFIX = /^(\d+(?:[.,]\d+)?)\s*(?:x\s*)?(?:\s*(?:pcs?|biji|keping|pieces?|plates?|bowls?|cups?|glasses?|cawan|gelas|mangkuk|pinggan|slices?|sticks?|ketul))?\s+/i;
const QTY_SUFFIX = /(?:\s+x\s*(\d+))\s*$/i;
const FILLER_WORDS = new Set(["a", "an", "the", "of", "some", "sepinggan", "semangkuk", "secawan", "segelas", "sedikit"]);
const LESS_SWEET = /(kurang manis|less sweet|less sugar|tanpa gula|no sugar|sikit manis)/i;
const KOSONG = /kosong/i;

const round = (n: number) => Math.round(n);
const scale = (m: MacroTotals, f: number): MacroTotals => ({
  calories: round(m.calories * f),
  proteinG: round(m.proteinG * f),
  carbsG: round(m.carbsG * f),
  fatG: round(m.fatG * f),
});

function findMatch(text: string, used: Set<string>): { entry: FoodEntry; start: number; end: number } | null {
  const lower = ` ${text.toLowerCase()} `;
  for (const { alias, entry } of ALIAS_INDEX) {
    if (used.has(entry.name)) continue;
    const idx = lower.indexOf(` ${alias} `);
    if (idx !== -1) return { entry, start: idx, end: idx + alias.length + 1 };
    // allow alias at boundaries without surrounding spaces
    const loose = lower.indexOf(alias);
    if (loose !== -1) return { entry, start: loose, end: loose + alias.length };
  }
  return null;
}

function cleanLeftover(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w && !FILLER_WORDS.has(w))
    .join(" ")
    .trim();
}

function itemFromEntry(entry: FoodEntry, qty: number): MealAnalysisItem {
  const base: MacroTotals = { calories: entry.calories, proteinG: entry.proteinG, carbsG: entry.carbsG, fatG: entry.fatG };
  const macros = qty > 1 ? scale(base, qty) : base;
  return {
    id: uid(),
    name: entry.name,
    portion: qty > 1 ? `${qty} × ${entry.portion}` : entry.portion,
    ...macros,
    matched: true,
  };
}

function fallbackItem(name: string, qty: number): MealAnalysisItem {
  const base: MacroTotals = { calories: 250, proteinG: 9, carbsG: 30, fatG: 11 };
  const macros = qty > 1 ? scale(base, qty) : base;
  return {
    id: uid(),
    name: titleCase(name).slice(0, 42),
    portion: qty > 1 ? `${qty} servings` : "1 serving",
    ...macros,
    matched: false,
  };
}

/** Synchronous core — also used to seed demo history without fake latency. */
export function analyzeMealNow(description: string): MealAnalysis {
  const notes: string[] = [];
  const segments = description
    .toLowerCase()
    .split(SEPARATORS)
    .map((s) => s.trim())
    .filter(Boolean);

  const items: MealAnalysisItem[] = [];
  let unmatchedCount = 0;

  for (const segment of segments) {
    let text = segment.replace(/\s+/g, " ").trim();
    const lessSweet = LESS_SWEET.test(text);
    const kosong = KOSONG.test(text);

    let qty = 1;
    const prefix = text.match(QTY_PREFIX);
    if (prefix) {
      qty = Math.min(10, Math.max(1, parseFloat(prefix[1].replace(",", "."))));
      text = text.slice(prefix[0].length);
    } else {
      const suffix = text.match(QTY_SUFFIX);
      if (suffix) {
        qty = Math.min(10, Math.max(1, parseInt(suffix[1], 10)));
        text = text.slice(0, suffix.index).trim();
      }
    }

    const used = new Set<string>();
    const segmentItems: MealAnalysisItem[] = [];
    let guard = 0;
    while (text.length > 1 && guard++ < 6) {
      const match = findMatch(text, used);
      if (!match) break;
      used.add(match.entry.name);
      segmentItems.push(itemFromEntry(match.entry, 1));
      text = `${text.slice(0, match.start)} ${text.slice(match.end)}`;
    }

    if (segmentItems.length > 0) {
      segmentItems[0] = { ...segmentItems[0], ...scaleQty(segmentItems[0], qty), portion: qty > 1 ? `${qty} × ${segmentItems[0].portion}` : segmentItems[0].portion };
      for (const item of segmentItems) {
        if (kosong && item.matched) applyDrinkModifier(item, 0.15, "no sugar or milk");
        else if (lessSweet && item.matched) applyDrinkModifier(item, 0.62, "less sweet");
      }
      items.push(...segmentItems);
    } else {
      const leftover = cleanLeftover(segment);
      if (leftover.length >= 3) {
        items.push(fallbackItem(leftover, qty));
        unmatchedCount++;
      }
    }
  }

  if (items.length === 0) {
    const leftover = cleanLeftover(description) || "meal";
    items.push(fallbackItem(leftover, 1));
    unmatchedCount = 1;
  }

  if (unmatchedCount > 0) {
    notes.push(`${unmatchedCount} item${unmatchedCount > 1 ? "s" : ""} used a rough generic estimate — adjust before saving.`);
  }

  const capped = items.slice(0, 14);
  return { items: capped, totals: sumItems(capped), notes };
}

function scaleQty(item: MealAnalysisItem, qty: number): MacroTotals {
  if (qty <= 1) return { calories: item.calories, proteinG: item.proteinG, carbsG: item.carbsG, fatG: item.fatG };
  return scale(item, qty);
}

function applyDrinkModifier(item: MealAnalysisItem, factor: number, note: string) {
  const entry = FOOD_BY_NAME.get(item.name);
  if (!entry || (!entry.drink && !entry.sweet)) return;
  const scaled = scale(item, factor);
  item.calories = Math.max(5, scaled.calories);
  item.carbsG = scaled.carbsG;
  item.proteinG = scaled.proteinG;
  item.fatG = scaled.fatG;
  item.portion = `${item.portion}, ${note}`;
}

const FOOD_BY_NAME = new Map(ALIAS_INDEX.map(({ entry }) => [entry.name, entry]));

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** Simulates a network/AI round-trip so the UX can be developed honestly. */
export const mockMealAnalysisService: MealAnalysisService = {
  async analyze(description: string) {
    await sleep(900 + Math.random() * 700);
    const result = analyzeMealNow(description);
    result.totals = sumItems(result.items);
    return result;
  },
};
