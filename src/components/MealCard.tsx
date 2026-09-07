import { Coffee, Moon, MoonStar, RotateCcw, Sun, Sunrise } from "lucide-react";
import type { Meal } from "@/lib/types";
import { formatTime } from "@/lib/dates";
import { num } from "@/lib/utils";

const LABEL_ICON: Record<string, typeof Sun> = {
  Breakfast: Sunrise,
  Lunch: Sun,
  Snack: Coffee,
  Dinner: MoonStar,
  Supper: Moon,
};

export function MealCard({ meal, onClick, onRepeat }: { meal: Meal; onClick?: () => void; onRepeat?: (meal: Meal) => void }) {
  const Icon = LABEL_ICON[meal.label] ?? Sun;
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onClick?.();
      }}
      className="w-full cursor-pointer rounded-2xl border border-line bg-card p-4 text-left transition-all duration-150 hover:border-line-strong hover:shadow-[0_10px_28px_-14px_rgba(23,34,28,0.25)] active:scale-[0.99]"
    >
      <div className="flex items-center justify-between gap-3">
        <span className="flex min-w-0 items-center gap-2 text-[13px] font-semibold text-ink-soft">
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-mint text-leaf">
            <Icon size={13.5} strokeWidth={2.4} />
          </span>
          <span className="truncate">{meal.label}</span>
          <span className="shrink-0 font-medium text-faint">· {formatTime(meal.createdAt)}</span>
        </span>
        <span className="flex shrink-0 items-baseline gap-1">
          <span className="tnum text-[17px] font-bold text-ink">{num(meal.totals.calories)}</span>
          <span className="text-[11px] font-semibold text-faint">kcal</span>
        </span>
      </div>
      <p className="clamp-1 mt-2 pr-2 text-sm text-muted">{meal.originalDescription}</p>
      <div className="mt-2.5 flex items-center gap-3 text-[11.5px] font-semibold">
        <span className="tnum flex items-center gap-1 text-muted">
          <span className="h-1.5 w-1.5 rounded-full bg-protein" />
          {num(meal.totals.proteinG)}g
        </span>
        <span className="tnum flex items-center gap-1 text-muted">
          <span className="h-1.5 w-1.5 rounded-full bg-carb" />
          {num(meal.totals.carbsG)}g
        </span>
        <span className="tnum flex items-center gap-1 text-muted">
          <span className="h-1.5 w-1.5 rounded-full bg-fat" />
          {num(meal.totals.fatG)}g
        </span>
        <span className="ml-auto font-medium text-faint">
          {meal.items.length} item{meal.items.length !== 1 ? "s" : ""}
        </span>
        {onRepeat && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              void onRepeat(meal);
            }}
            title="Log this again today"
            aria-label={`Log ${meal.label} again today`}
            className="-my-1.5 flex h-9 w-9 items-center justify-center rounded-full text-faint transition-colors hover:bg-lime-soft hover:text-pine active:scale-90"
          >
            <RotateCcw size={15} strokeWidth={2.2} />
          </button>
        )}
      </div>
    </div>
  );
}
