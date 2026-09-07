import { useEffect, useMemo, useState } from "react";
import { useAnimatedNumber } from "@/hooks/useAnimatedNumber";
import { num } from "@/lib/utils";

export interface RingSegment {
  id: string;
  value: number;
}

/** Distinct leaf tones so each meal is visible on the ring. */
const SEG_COLORS = ["#0d5b3b", "#17754f", "#2f9061", "#5ead80", "#8cc7a4", "#b6e0c6"];

/**
 * The one-second answer to "how am I doing today?".
 * Each meal gets its own arc segment — the ring quietly shows the
 * composition of your day, not just the total.
 */
export function CalorieRing({
  eaten,
  target,
  size = 208,
  segments,
}: {
  eaten: number;
  target: number;
  size?: number;
  segments?: RingSegment[];
}) {
  const stroke = 12;
  const r = (size - stroke) / 2;
  const c = size / 2;

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const frame = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  const ratio = target > 0 ? eaten / target : 0;
  const progress = Math.max(0, Math.min(1, ratio));
  const over = eaten - target;
  const isOver = over > 0;

  const display = useAnimatedNumber(isOver ? over : Math.max(0, target - eaten));
  const pctLabel = useAnimatedNumber(Math.round(ratio * 100));

  const arcs = useMemo(() => {
    const source = segments?.filter((s) => s.value > 0) ?? (eaten > 0 ? [{ id: "all", value: eaten }] : []);
    const total = source.reduce((a, s) => a + s.value, 0);
    const gap = source.length > 1 ? 0.9 : 0;
    let acc = 0;
    return source.map((s, i) => {
      const len = total > 0 ? (s.value / total) * (progress * 100) : 0;
      const start = acc;
      acc += len;
      return {
        id: s.id,
        start,
        len: Math.max(0, len - gap),
        color: source.length === 1 ? "var(--color-leaf)" : SEG_COLORS[i % SEG_COLORS.length],
      };
    });
  }, [segments, eaten, progress]);

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size}>
        <circle cx={c} cy={c} r={r} fill="none" stroke="var(--color-cream-deep)" strokeWidth={stroke} />
        <g transform={`rotate(-90 ${c} ${c})`}>
          {arcs.map((a) => {
            const len = mounted ? a.len : 0;
            return (
              <circle
                key={a.id}
                cx={c}
                cy={c}
                r={r}
                fill="none"
                stroke={a.color}
                strokeWidth={stroke}
                strokeLinecap="butt"
                pathLength={100}
                strokeDasharray={`${len} ${Math.max(0, 100 - len)}`}
                strokeDashoffset={-(mounted ? a.start : 0)}
                className="ring-seg"
              />
            );
          })}
        </g>
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="text-[10.5px] font-bold tracking-[0.14em] text-faint uppercase">{isOver ? "Over goal" : "Remaining"}</span>
        <span className={`tnum font-display mt-1 text-[44px] leading-none font-semibold tracking-tight ${isOver ? "text-bad" : "text-ink"}`}>
          {num(display)}
        </span>
        <span className="mt-1 text-[12.5px] font-medium text-muted">{isOver ? "kcal over" : "kcal left"}</span>
        <span className="tnum mt-1.5 rounded-full bg-cream-deep px-2 py-0.5 text-[11px] font-semibold text-muted">
          {pctLabel}% of {num(target)}
        </span>
      </div>
    </div>
  );
}
