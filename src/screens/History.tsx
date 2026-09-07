import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CalendarOff, ChevronLeft, ChevronRight } from "lucide-react";
import { useSession } from "@/state/session";
import { useProfile } from "@/state/profile";
import { useMealDates, useMeals, useRepeatMeal } from "@/hooks/useMeals";
import { effectiveTarget } from "@/lib/types";
import { macrosForTarget } from "@/lib/calories";
import { addDays, formatDayLabel, formatFullDate, keyToDate, todayKey, weekOf } from "@/lib/dates";
import { num } from "@/lib/utils";
import { MacroBars } from "@/components/MacroBars";
import { MealCard } from "@/components/MealCard";
import { cn } from "@/utils/cn";

export default function HistoryScreen() {
  const { session } = useSession();
  const { profile } = useProfile();
  const navigate = useNavigate();
  const [selected, setSelected] = useState(todayKey());
  const week = useMemo(() => weekOf(selected), [selected]);
  const byDate = useMealDates(session?.user.id);
  const { meals, loading, totals } = useMeals(session?.user.id, selected);
  const repeatMeal = useRepeatMeal();

  const target = profile ? effectiveTarget(profile) : 2000;
  const macroTargets = profile ? macrosForTarget(target, profile.goal) : { calories: 2000, proteinG: 150, carbsG: 200, fatG: 67 };
  const monthLabel = keyToDate(week[3].key).toLocaleString("en-US", { month: "long", year: "numeric" });
  const isToday = selected === todayKey();
  const pct = Math.min(100, (totals.calories / Math.max(1, target)) * 100);

  return (
    <div className="screen mx-auto w-full max-w-xl px-5 pt-6 md:max-w-2xl md:px-8 md:pt-10">
      <header className="flex items-end justify-between">
        <div>
          <h1 className="font-display text-[27px] leading-tight font-semibold tracking-tight text-ink">History</h1>
          <p className="mt-0.5 text-[13px] text-muted">Every kira, day by day.</p>
        </div>
        {!isToday && (
          <button
            onClick={() => setSelected(todayKey())}
            className="rounded-lg border border-line bg-card px-3 py-2 text-[12px] font-bold whitespace-nowrap text-pine transition-colors hover:border-line-strong active:scale-[0.97]"
          >
            Jump to today
          </button>
        )}
      </header>

      {/* week navigator */}
      <section className="mt-5 rounded-2xl border border-line bg-card p-4">
        <div className="mb-2 flex items-center justify-between">
          <button
            onClick={() => setSelected(addDays(selected, -7))}
            aria-label="Previous week"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-muted transition-colors hover:bg-cream-deep hover:text-ink"
          >
            <ChevronLeft size={17} />
          </button>
          <span className="text-[13.5px] font-bold text-ink">{monthLabel}</span>
          <button
            onClick={() => setSelected(addDays(selected, 7))}
            aria-label="Next week"
            disabled={week.every((d) => d.key >= todayKey()) || addDays(selected, 7) > todayKey()}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-muted transition-colors hover:bg-cream-deep hover:text-ink disabled:opacity-30"
          >
            <ChevronRight size={17} />
          </button>
        </div>
        <div className="grid grid-cols-7 gap-1">
          {week.map((day) => {
            const logged = byDate[day.key];
            const isSelected = day.key === selected;
            return (
              <button
                key={day.key}
                onClick={() => !day.isFuture && setSelected(day.key)}
                disabled={day.isFuture}
                className={cn(
                  "flex flex-col items-center rounded-xl py-1.5 transition-colors",
                  isSelected ? "bg-pine text-white" : day.isFuture ? "opacity-30" : "hover:bg-cream-deep"
                )}
              >
                <span className={cn("text-[10px] font-bold", isSelected ? "text-white/70" : "text-faint")}>{day.weekdayLetter}</span>
                <span
                  className={cn(
                    "tnum mt-0.5 flex h-8 w-8 items-center justify-center rounded-full text-[13.5px] font-bold",
                    !isSelected && day.isToday && "ring-2 ring-lime-deep",
                    !isSelected && "text-ink"
                  )}
                >
                  {day.dayNum}
                </span>
                <span className={cn("mt-0.5 h-1.5 w-1.5 rounded-full", logged ? (isSelected ? "bg-lime" : "bg-leaf") : "bg-transparent")} />
              </button>
            );
          })}
        </div>
      </section>

      {/* day summary */}
      <section className="mt-3 rounded-2xl border border-line bg-card p-5">
        <div className="flex items-baseline justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[11.5px] font-bold tracking-[0.1em] text-faint uppercase">{formatDayLabel(selected)}</p>
            <p className="tnum font-display mt-1 text-[28px] leading-none font-semibold whitespace-nowrap text-ink">
              {num(totals.calories)}
              <span className="ml-1.5 text-[13px] font-medium text-faint">/ {num(target)} kcal</span>
            </p>
          </div>
          <span
            className={cn(
              "shrink-0 rounded-full px-2.5 py-1 text-[11px] font-bold whitespace-nowrap",
              totals.calories > target ? "bg-bad-soft text-bad" : totals.calories > 0 ? "bg-mint text-leaf" : "bg-cream-deep text-faint"
            )}
          >
            {totals.calories === 0 ? "No logs" : totals.calories > target ? `${num(totals.calories - target)} over` : `${num(target - totals.calories)} left`}
          </span>
        </div>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-cream-deep">
          <div
            className={cn("h-full rounded-full transition-[width] duration-700", totals.calories > target ? "bg-bad" : "bg-leaf")}
            style={{ width: `${totals.calories > 0 ? Math.max(3, pct) : 0}%` }}
          />
        </div>
        <div className="mt-4">
          <MacroBars totals={totals} targets={macroTargets} compact />
        </div>
        <p className="mt-3 text-[11.5px] text-faint">{formatFullDate(selected)}</p>
      </section>

      {/* meals */}
      <section className="mt-6">
        <h2 className="mb-3 text-[14px] font-bold text-ink">
          {isToday ? "Today's" : `${formatDayLabel(selected)}'s`} meals
        </h2>
        {loading ? (
          <div className="grid gap-3 md:grid-cols-2">
            <div className="shimmer h-24 rounded-xl border border-line" />
            <div className="shimmer h-24 rounded-xl border border-line" />
          </div>
        ) : meals && meals.length > 0 ? (
          <div className="stagger grid gap-3 md:grid-cols-2">
            {meals.map((meal) => (
              <MealCard key={meal.id} meal={meal} onClick={() => navigate(`/app/meal/${meal.id}`)} onRepeat={repeatMeal} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-line-strong bg-card/50 px-6 py-8 text-center">
            <CalendarOff size={22} className="mx-auto text-faint" />
            <p className="mt-2 text-[13.5px] font-semibold text-ink-soft">No meals logged</p>
            <p className="mt-0.5 text-[12.5px] text-muted">{isToday ? "Your day is a blank page. Log something!" : "Nothing was recorded on this day."}</p>
          </div>
        )}
      </section>
    </div>
  );
}
