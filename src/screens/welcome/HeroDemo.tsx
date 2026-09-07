import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, Sparkles } from "lucide-react";
import { analyzeMealNow } from "@/services/analysis/mockMealAnalysisService";
import { useAnimatedNumber } from "@/hooks/useAnimatedNumber";
import { sumItems } from "@/lib/types";
import { num } from "@/lib/utils";
import { cn } from "@/utils/cn";

const SCENARIOS = [
  "Nasi putih, ayam kari, kangkung belacan",
  "2 roti canai with dhal, teh tarik kurang manis",
  "Mee goreng mamak dengan telur mata",
];

function usePrefersReducedMotion() {
  return useMemo(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    []
  );
}

/**
 * A live, honest product demo: types a real meal description, analyses it
 * through the actual (mock) engine, reveals items one by one, counts the
 * total, "saves" it — then loops to the next Malaysian meal.
 */
export function HeroDemo() {
  const reduced = usePrefersReducedMotion();
  const analyses = useMemo(() => SCENARIOS.map((s) => ({ text: s, result: analyzeMealNow(s) })), []);
  const [scenarioIdx, setScenarioIdx] = useState(0);
  const [typed, setTyped] = useState("");
  const [rowsShown, setRowsShown] = useState(0);
  const [saved, setSaved] = useState(false);

  const scenario = analyses[scenarioIdx];
  const visibleItems = scenario.result.items.slice(0, 4);
  const shownTotals = sumItems(visibleItems.slice(0, rowsShown));
  const animatedTotal = useAnimatedNumber(shownTotals.calories);

  useEffect(() => {
    if (reduced) {
      setTyped(scenario.text);
      setRowsShown(visibleItems.length);
      setSaved(true);
      return;
    }
    let cancelled = false;
    const timers: ReturnType<typeof setTimeout>[] = [];
    const { text } = scenario;
    setTyped("");
    setRowsShown(0);
    setSaved(false);

    let i = 0;
    const typeTimer = setInterval(() => {
      i += 1;
      setTyped(text.slice(0, i));
      if (i < text.length) return;
      clearInterval(typeTimer);
      visibleItems.forEach((_, idx) =>
        timers.push(
          setTimeout(() => {
            if (!cancelled) setRowsShown(idx + 1);
          }, 420 + idx * 180)
        )
      );
      timers.push(
        setTimeout(() => {
          if (!cancelled) setSaved(true);
        }, 420 + visibleItems.length * 180 + 500)
      );
      timers.push(
        setTimeout(() => {
          if (!cancelled) setScenarioIdx((v) => (v + 1) % SCENARIOS.length);
        }, 420 + visibleItems.length * 180 + 500 + 2600)
      );
    }, 32);

    return () => {
      cancelled = true;
      clearInterval(typeTimer);
      timers.forEach(clearTimeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scenarioIdx, reduced]);

  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-card shadow-[0_24px_56px_-32px_rgba(12,74,51,0.35)]">
      {/* window header */}
      <div className="flex items-center justify-between border-b border-line px-4 py-2.5">
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-line-strong" />
          <span className="h-2 w-2 rounded-full bg-line-strong" />
          <span className="h-2 w-2 rounded-full bg-lime-deep" />
        </div>
        <span className={cn("flex items-center gap-1.5 text-[11px] font-bold", saved ? "text-leaf" : "text-faint")}>
          {saved ? (
            <>
              <CheckCircle2 size={12.5} />
              Saved to Today
            </>
          ) : (
            <>
              <Sparkles size={12.5} className="anim-soft-pulse" />
              Kira is analysing
            </>
          )}
        </span>
      </div>

      {/* typed description */}
      <div className="border-b border-line bg-cream px-4 pt-3 pb-3.5">
        <p className="min-h-[46px] text-[14px] leading-relaxed font-medium text-ink-soft">
          {'"'}
          {typed}
          {!saved && <span className="caret ml-px inline-block h-[15px] w-[2px] translate-y-[2px] bg-leaf" />}
          {typed.length >= scenario.text.length && '"'}
        </p>
      </div>

      {/* analysed rows */}
      <div className="min-h-[148px] px-4 py-2">
        {visibleItems.map((item, idx) =>
          idx < rowsShown ? (
            <div
              key={`${scenarioIdx}-${item.id}`}
              className="anim-fade flex items-center justify-between gap-3 border-b border-line/60 py-2 last:border-0"
              style={{ animationDuration: "0.25s" }}
            >
              <div className="min-w-0">
                <p className="clamp-1 text-[13px] font-semibold text-ink">{item.name}</p>
                <p className="clamp-1 text-[11px] text-faint">{item.portion}</p>
              </div>
              <span className="tnum shrink-0 text-[13px] font-bold text-ink">{num(item.calories)}</span>
            </div>
          ) : (
            <div key={`ghost-${idx}`} className="py-2">
              <div className="h-[30px]" />
            </div>
          )
        )}
      </div>

      {/* total */}
      <div className="flex items-center justify-between border-t border-line px-4 py-3">
        <span className="text-[12px] font-semibold text-muted">Estimated total</span>
        <span className="flex items-baseline gap-1">
          <span className={cn("tnum font-display text-[24px] leading-none font-semibold", saved ? "text-pine" : "text-ink")}>
            {num(animatedTotal)}
          </span>
          <span className="text-[11px] font-semibold text-muted">kcal</span>
        </span>
      </div>
    </div>
  );
}
