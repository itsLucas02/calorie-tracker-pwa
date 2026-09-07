import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Plus, Sparkles, UtensilsCrossed, Zap } from "lucide-react";
import { useSession } from "@/state/session";
import { useProfile } from "@/state/profile";
import { useMeals, useRepeatMeal } from "@/hooks/useMeals";
import { effectiveTarget } from "@/lib/types";
import { macrosForTarget } from "@/lib/calories";
import { formatFullDate, todayKey } from "@/lib/dates";
import { num } from "@/lib/utils";
import { CalorieRing } from "@/components/CalorieRing";
import { MacroBars } from "@/components/MacroBars";
import { MealCard } from "@/components/MealCard";
import { Button } from "@/components/ui";

function greeting(): string {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

export default function TodayScreen() {
  const { session } = useSession();
  const { profile } = useProfile();
  const navigate = useNavigate();
  const location = useLocation();
  const { meals, loading, totals } = useMeals(session?.user.id, todayKey());
  const repeatMeal = useRepeatMeal();

  // Flash a small confirmation when returning from a fresh log
  const [justLogged, setJustLogged] = useState<number | undefined>(
    () => (location.state as { justLogged?: number } | null)?.justLogged
  );
  useEffect(() => {
    if (justLogged === undefined) return;
    navigate("/app/today", { replace: true, state: null });
    const timer = setTimeout(() => setJustLogged(undefined), 2600);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const target = profile ? effectiveTarget(profile) : 2000;
  const macroTargets = profile ? macrosForTarget(target, profile.goal) : { calories: 2000, proteinG: 150, carbsG: 200, fatG: 67 };
  const eaten = totals.calories;
  const remaining = target - eaten;
  const over = Math.max(0, -remaining);
  const firstName = session?.user.name.split(" ")[0] ?? "there";
  // Earliest meal first so the ring reads chronologically
  const ringSegments = meals ? [...meals].reverse().map((m) => ({ id: m.id, value: m.totals.calories })) : [];

  return (
    <div className="screen mx-auto w-full max-w-xl px-5 pt-6 md:max-w-4xl md:px-8 md:pt-10">
      {/* header */}
      <header>
        <p className="text-[11.5px] font-bold tracking-[0.12em] text-faint uppercase">{formatFullDate(todayKey())}</p>
        <h1 className="font-display mt-1 text-[27px] leading-tight font-semibold tracking-tight text-ink">
          {greeting()}, {firstName}
        </h1>
      </header>

      {loading || !profile ? (
        <TodaySkeleton />
      ) : (
        <>
          {/* hero */}
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            <section className="rounded-2xl border border-line bg-card px-5 py-6">
              <div className="flex justify-center">
                <CalorieRing eaten={eaten} target={target} segments={ringSegments} />
              </div>
              {justLogged !== undefined && (
                <div className="anim-pop mx-auto mt-4 flex w-fit items-center gap-1.5 rounded-full bg-lime-soft px-3 py-1.5 text-[12px] font-bold text-pine">
                  <Zap size={13} />
                  +{num(justLogged)} kcal added to your day
                </div>
              )}
              <div className="mt-4 grid grid-cols-3 divide-x divide-line border-t border-line pt-4 text-center">
                <Stat label="Eaten" value={eaten} />
                <Stat label={over > 0 ? "Over" : "Left"} value={Math.abs(target - eaten)} tone={over > 0 ? "bad" : "good"} />
                <Stat label="Goal" value={target} />
              </div>
            </section>

            <div className="flex flex-col gap-3">
              <section className="flex-1 rounded-2xl border border-line bg-card p-5">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-[14px] font-bold text-ink">Macros</h2>
                  <span className="text-[11.5px] font-semibold text-faint">today vs target</span>
                </div>
                <MacroBars totals={totals} targets={macroTargets} />
                {over > 0 && (
                  <p className="mt-4 rounded-xl bg-bad-soft px-3.5 py-2.5 text-[12.5px] font-medium leading-relaxed text-[#a03c26]">
                    {num(over)} kcal over today's goal. Happens — tomorrow's kira starts fresh.
                  </p>
                )}
                {eaten === 0 && (
                  <p className="mt-4 flex items-center gap-2 rounded-xl bg-mint px-3.5 py-2.5 text-[12.5px] font-medium text-leaf">
                    <Sparkles size={14} className="shrink-0" />
                    Try "nasi lemak and teh o" — it just works.
                  </p>
                )}
              </section>

              <button
                onClick={() => navigate("/app/log")}
                className="hidden items-center justify-between rounded-2xl border border-line bg-card p-4 text-left transition-colors hover:border-line-strong hover:bg-mint/40 active:scale-[0.99] md:flex"
              >
                <span className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-lime text-pine">
                    <Plus size={19} strokeWidth={2.8} />
                  </span>
                  <span>
                    <span className="block text-[15px] font-bold text-ink">Log a meal</span>
                    <span className="mt-0.5 block text-[12.5px] text-muted">Describe it — we kira the rest.</span>
                  </span>
                </span>
              </button>
            </div>
          </div>

          {/* meals */}
          <section className="mt-7">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-[14px] font-bold text-ink">Today's meals</h2>
              {meals && meals.length > 0 && (
                <span className="rounded-full bg-cream-deep px-2.5 py-1 text-[11.5px] font-bold text-muted">
                  {meals.length} · {num(eaten)} kcal
                </span>
              )}
            </div>

            {meals && meals.length > 0 ? (
              <div className="stagger grid gap-3 md:grid-cols-2">
                {meals.map((meal) => (
                  <MealCard key={meal.id} meal={meal} onClick={() => navigate(`/app/meal/${meal.id}`)} onRepeat={repeatMeal} />
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-line-strong bg-card/50 px-6 py-10 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-mint text-leaf">
                  <UtensilsCrossed size={20} />
                </div>
                <h3 className="font-display mt-3 text-[17px] font-semibold text-ink">Nothing logged yet</h3>
                <p className="mx-auto mt-1 max-w-[260px] text-[13px] leading-relaxed text-muted">
                  Say something like "nasi putih, ayam kari, kangkung belacan". That's the whole job.
                </p>
                <Button variant="lime" className="mt-4" onClick={() => navigate("/app/log")}>
                  <Plus size={16} strokeWidth={2.8} />
                  Log your first meal
                </Button>
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}

function Stat({ label, value, tone }: { label: string; value: number; tone?: "good" | "bad" }) {
  return (
    <div>
      <p className="tnum text-[18px] font-bold text-ink">{num(value)}</p>
      <p className={`text-[11px] font-semibold ${tone === "bad" ? "text-bad" : tone === "good" ? "text-leaf" : "text-faint"}`}>
        {label}
      </p>
    </div>
  );
}

function TodaySkeleton() {
  return (
    <div className="mt-5 space-y-3">
      <div className="shimmer h-[340px] rounded-2xl border border-line" />
      <div className="grid gap-3 md:grid-cols-2">
        <div className="shimmer h-24 rounded-xl border border-line" />
        <div className="shimmer h-24 rounded-xl border border-line" />
      </div>
    </div>
  );
}
