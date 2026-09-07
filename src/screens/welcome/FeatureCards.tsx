import { Check, Pencil, Plus, Sparkles } from "lucide-react";

/**
 * Three feature cards, each with a hand-built mini diagram of the
 * actual UI pattern — no stock illustration filler.
 */

function MiniInputVisual() {
  return (
    <div className="flex h-full flex-col justify-center gap-2 px-4">
      <div className="rounded-lg border border-line bg-card px-3 py-2.5 text-[12.5px] font-medium text-ink-soft">
        nasi lemak, teh o
        <span className="caret ml-0.5 inline-block h-[13px] w-[2px] translate-y-[2px] bg-leaf" />
      </div>
      <div className="flex h-8 items-center justify-center gap-1.5 rounded-lg bg-lime text-[12px] font-bold text-ink">
        <Sparkles size={13} />
        Analyse meal
      </div>
    </div>
  );
}

function MiniEditVisual() {
  return (
    <div className="flex h-full flex-col justify-center gap-2 px-4">
      <div className="flex items-center justify-between gap-2 rounded-lg border border-line bg-card px-3 py-2">
        <div className="min-w-0">
          <p className="clamp-1 text-[12px] font-semibold text-ink">Teh tarik</p>
          <p className="text-[10.5px] text-faint">1 glass, kurang manis</p>
        </div>
        <span className="flex items-center gap-1 rounded-md border border-line px-1.5 py-1 text-[11px] font-bold text-ink">
          85
          <Pencil size={9} className="text-faint" />
        </span>
      </div>
      <div className="flex items-center gap-1.5 text-[11px] font-bold text-leaf">
        <span className="flex h-[18px] w-[18px] items-center justify-center rounded-full bg-mint">
          <Check size={11} strokeWidth={3} />
        </span>
        Every number is yours to fix
      </div>
    </div>
  );
}

function MiniRingVisual() {
  const r = 26;
  const circ = 2 * Math.PI * r;
  return (
    <div className="flex h-full items-center justify-center gap-3 px-4">
      <svg width="72" height="72" viewBox="0 0 72 72">
        <circle cx="36" cy="36" r={r} fill="none" stroke="var(--color-cream-deep)" strokeWidth="9" />
        <g transform="rotate(-90 36 36)">
          <circle cx="36" cy="36" r={r} fill="none" stroke="#0d5b3b" strokeWidth="9" strokeDasharray={`${circ * 0.34} ${circ * 0.66}`} />
          <circle cx="36" cy="36" r={r} fill="none" stroke="#2f9061" strokeWidth="9" strokeDasharray={`${circ * 0.2} ${circ * 0.8}`} strokeDashoffset={-(circ * 0.345)} />
          <circle cx="36" cy="36" r={r} fill="none" stroke="#8cc7a4" strokeWidth="9" strokeDasharray={`${circ * 0.13} ${circ * 0.87}`} strokeDashoffset={-(circ * 0.55)} />
        </g>
        <text x="36" y="40" textAnchor="middle" fontSize="13" fontWeight="700" fill="var(--color-ink)">67%</text>
      </svg>
      <div className="space-y-1.5">
        {[
          { c: "var(--color-protein)", w: 34 },
          { c: "var(--color-carb)", w: 48 },
          { c: "var(--color-fat)", w: 26 },
        ].map((b, i) => (
          <div key={i} className="h-[5px] rounded-full bg-cream-deep">
            <div className="h-full rounded-full" style={{ width: b.w, background: b.c }} />
          </div>
        ))}
        <span className="flex items-center gap-1 pt-0.5 text-[10.5px] font-semibold text-faint">
          <Plus size={10} className="text-leaf" />
          Updates as you log
        </span>
      </div>
    </div>
  );
}

import type { ReactElement } from "react";

const FEATURES: { title: string; desc: string; Visual: () => ReactElement }[] = [
  {
    title: "Say it in plain words",
    desc: "English, Bahasa, or rojak — describe the meal like you'd tell a friend. No databases to search, no portions to weigh.",
    Visual: MiniInputVisual,
  },
  {
    title: "You check, then approve",
    desc: "Kira's numbers are educated guesses, and every one of them is editable before it counts. Estimates, not prescriptions.",
    Visual: MiniEditVisual,
  },
  {
    title: "Your day at a glance",
    desc: "Calories remaining, protein-carbs-fat, and each meal drawn right onto the ring. One look and you know where you stand.",
    Visual: MiniRingVisual,
  },
];

export function FeatureCards() {
  return (
    <div className="stagger grid gap-3 sm:grid-cols-2 md:grid-cols-3">
      {FEATURES.map((f) => (
        <div key={f.title} className="overflow-hidden rounded-2xl border border-line bg-card">
          <div className="h-[132px] border-b border-line bg-cream">
            <f.Visual />
          </div>
          <div className="p-4">
            <h3 className="text-[14.5px] font-bold text-ink">{f.title}</h3>
            <p className="mt-1 text-[12.5px] leading-relaxed text-muted">{f.desc}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
