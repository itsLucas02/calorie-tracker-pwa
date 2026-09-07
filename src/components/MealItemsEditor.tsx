import { useRef } from "react";
import { Plus, Trash2 } from "lucide-react";
import type { MacroTotals, MealItem } from "@/lib/types";
import { haptic, uid } from "@/lib/utils";
import { Input, NumField } from "./ui";
import { cn } from "@/utils/cn";

type Preset = "small" | "regular" | "large";
const PRESETS: { id: Preset; label: string; factor: number }[] = [
  { id: "small", label: "Small", factor: 0.75 },
  { id: "regular", label: "Regular", factor: 1 },
  { id: "large", label: "Large", factor: 1.5 },
];

interface ItemMeta {
  base: MacroTotals;
  basePortion: string;
  preset: Preset;
}

const macrosOf = (it: MealItem): MacroTotals => ({ calories: it.calories, proteinG: it.proteinG, carbsG: it.carbsG, fatG: it.fatG });
const decoratePortion = (base: string, preset: Preset) =>
  preset === "small" ? `Small · ${base}` : preset === "large" ? `Large · ${base}` : base;

/**
 * Fully editable list of detected food items — "AI is a draft, you are
 * the editor". Each item carries Small/Regular/Large presets that scale
 * its estimated macros from a captured baseline; manual number edits
 * reset the baseline so presets always behave predictably.
 */
export function MealItemsEditor({ items, onChange }: { items: MealItem[]; onChange: (items: MealItem[]) => void }) {
  const metaRef = useRef(new Map<string, ItemMeta>());

  const metaFor = (item: MealItem): ItemMeta => {
    let meta = metaRef.current.get(item.id);
    if (!meta) {
      meta = { base: macrosOf(item), basePortion: item.portion, preset: "regular" };
      metaRef.current.set(item.id, meta);
    }
    return meta;
  };

  const patch = (id: string, p: Partial<MealItem>) => onChange(items.map((it) => (it.id === id ? { ...it, ...p } : it)));

  /** Manual number edit → this becomes the new baseline. */
  const patchNumber = (item: MealItem, p: Partial<MacroTotals>) => {
    const next = { ...item, ...p };
    const meta = metaFor(item);
    meta.base = macrosOf(next);
    meta.preset = "regular";
    patch(item.id, { calories: next.calories, proteinG: next.proteinG, carbsG: next.carbsG, fatG: next.fatG });
  };

  const patchPortion = (item: MealItem, portion: string) => {
    const meta = metaFor(item);
    meta.basePortion = portion;
    patch(item.id, { portion: decoratePortion(portion, meta.preset) });
  };

  const applyPreset = (item: MealItem, preset: Preset) => {
    const meta = metaFor(item);
    // Manually-added items start at zero — adopt current values first.
    if (meta.base.calories === 0 && item.calories > 0) meta.base = macrosOf(item);
    const { factor } = PRESETS.find((p) => p.id === preset)!;
    meta.preset = preset;
    haptic(6);
    patch(item.id, {
      calories: Math.round(meta.base.calories * factor),
      proteinG: Math.round(meta.base.proteinG * factor),
      carbsG: Math.round(meta.base.carbsG * factor),
      fatG: Math.round(meta.base.fatG * factor),
      portion: decoratePortion(meta.basePortion, preset),
    });
  };

  const remove = (id: string) => {
    metaRef.current.delete(id);
    onChange(items.filter((it) => it.id !== id));
  };

  const add = () =>
    onChange([...items, { id: uid(), name: "", portion: "1 serving", calories: 0, proteinG: 0, carbsG: 0, fatG: 0 }]);

  return (
    <div className="space-y-3">
      {items.map((item, idx) => {
        const meta = metaFor(item);
        return (
          <div key={item.id} className="rounded-2xl border border-line bg-card p-3.5">
            <div className="flex items-start gap-2">
              <div className="min-w-0 flex-1">
                <Input
                  value={item.name}
                  onChange={(e) => patch(item.id, { name: e.target.value })}
                  placeholder={`Food item ${idx + 1}`}
                  aria-label="Food name"
                  className="h-10 border-transparent bg-transparent px-0 font-semibold shadow-none focus:border-transparent focus:ring-0"
                />
                <Input
                  value={item.portion}
                  onChange={(e) => patchPortion(item, e.target.value)}
                  placeholder="Portion, e.g. 1 plate"
                  aria-label="Portion"
                  className="-mt-1.5 h-8 border-transparent bg-transparent px-0 text-[13px] text-muted shadow-none focus:border-transparent focus:ring-0"
                />
              </div>
              <button
                type="button"
                onClick={() => remove(item.id)}
                aria-label={`Remove ${item.name || "item"}`}
                className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-faint transition-colors hover:bg-bad-soft hover:text-bad"
              >
                <Trash2 size={15} />
              </button>
            </div>

            {/* portion presets — correcting the dimension Kira actually guessed */}
            <div className="mt-1 grid grid-cols-3 gap-0.5 rounded-lg bg-cream-deep p-0.5">
              {PRESETS.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => applyPreset(item, p.id)}
                  className={cn(
                    "h-7 rounded-md text-[11.5px] font-semibold transition-all",
                    meta.preset === p.id ? "bg-card text-pine shadow-[0_1px_4px_rgba(23,34,28,0.12)]" : "text-faint hover:text-muted"
                  )}
                >
                  {p.label}
                </button>
              ))}
            </div>

            <div className="mt-2 grid grid-cols-4 gap-2">
              <NumField label="Kcal" suffix="kcal" value={item.calories} onChange={(v) => patchNumber(item, { calories: v })} accent />
              <NumField label="Prot" suffix="g" value={item.proteinG} onChange={(v) => patchNumber(item, { proteinG: v })} />
              <NumField label="Carb" suffix="g" value={item.carbsG} onChange={(v) => patchNumber(item, { carbsG: v })} />
              <NumField label="Fat" suffix="g" value={item.fatG} onChange={(v) => patchNumber(item, { fatG: v })} />
            </div>
          </div>
        );
      })}

      <button
        type="button"
        onClick={add}
        className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-line-strong text-sm font-semibold text-muted transition-all hover:border-leaf/50 hover:bg-mint/50 hover:text-pine"
      >
        <Plus size={16} />
        Add another food
      </button>
    </div>
  );
}
