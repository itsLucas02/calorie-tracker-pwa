import type { MacroTotals } from "@/lib/types";

const ROWS: { key: "proteinG" | "carbsG" | "fatG"; label: string; color: string }[] = [
  { key: "proteinG", label: "Protein", color: "var(--color-protein)" },
  { key: "carbsG", label: "Carbs", color: "var(--color-carb)" },
  { key: "fatG", label: "Fat", color: "var(--color-fat)" },
];

export function MacroBars({ totals, targets, compact = false }: { totals: MacroTotals; targets: MacroTotals; compact?: boolean }) {
  return (
    <div className={compact ? "grid grid-cols-3 gap-3" : "space-y-3.5"}>
      {ROWS.map(({ key, label, color }) => {
        const value = totals[key];
        const target = Math.max(1, targets[key]);
        const pct = Math.min(100, (value / target) * 100);
        return (
          <div key={key}>
            <div className="flex items-baseline justify-between">
              <span className="flex items-center gap-1.5 text-[13px] font-semibold text-ink-soft">
                <span className="h-2 w-2 rounded-full" style={{ background: color }} />
                {label}
              </span>
              <span className="tnum text-[12px] font-medium text-muted">
                <span className="font-semibold text-ink">{value}</span>
                {!compact && <span className="text-faint"> / {target} g</span>}
                {compact && <span className="text-faint"> g</span>}
              </span>
            </div>
            {!compact && (
              <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-cream-deep">
                <div
                  className="h-full rounded-full transition-[width] duration-700 ease-out"
                  style={{ width: `${Math.max(value > 0 ? 3 : 0, pct)}%`, background: color }}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
