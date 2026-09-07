import { Check } from "lucide-react";
import { ACTIVITY_LEVELS, GOALS } from "@/lib/calories";
import type { ActivityLevel, Goal, Sex } from "@/lib/types";
import { Field, Input, SegmentedControl } from "./ui";
import { cn } from "@/utils/cn";

export interface PlanBasics {
  age: number;
  sex: Sex;
  heightCm: number;
  weightKg: number;
}

export interface PlanRhythm {
  activityLevel: ActivityLevel;
  goal: Goal;
}

/** Age / sex / height / weight — shared by onboarding and profile edit. */
export function BasicsFields({ value, onChange }: { value: PlanBasics; onChange: (v: PlanBasics) => void }) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <Field label="Age">
          <Input
            type="number"
            inputMode="numeric"
            min={13}
            max={100}
            value={value.age || ""}
            onChange={(e) => onChange({ ...value, age: Number(e.target.value) || 0 })}
            placeholder="29"
          />
        </Field>
        <Field label="Sex (for calculation)">
          <SegmentedControl<Sex>
            options={[
              { value: "female", label: "Female" },
              { value: "male", label: "Male" },
            ]}
            value={value.sex}
            onChange={(sex) => onChange({ ...value, sex })}
          />
        </Field>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Height">
          <div className="relative">
            <Input
              type="number"
              inputMode="numeric"
              min={120}
              max={230}
              value={value.heightCm || ""}
              onChange={(e) => onChange({ ...value, heightCm: Number(e.target.value) || 0 })}
              placeholder="168"
              className="pr-10"
            />
            <span className="pointer-events-none absolute top-1/2 right-3.5 -translate-y-1/2 text-xs font-semibold text-faint">cm</span>
          </div>
        </Field>
        <Field label="Weight">
          <div className="relative">
            <Input
              type="number"
              inputMode="numeric"
              min={30}
              max={250}
              step="0.1"
              value={value.weightKg || ""}
              onChange={(e) => onChange({ ...value, weightKg: Number(e.target.value) || 0 })}
              placeholder="62"
              className="pr-10"
            />
            <span className="pointer-events-none absolute top-1/2 right-3.5 -translate-y-1/2 text-xs font-semibold text-faint">kg</span>
          </div>
        </Field>
      </div>
    </div>
  );
}

/** Activity level + weight goal — shared by onboarding and profile edit. */
export function RhythmFields({ value, onChange }: { value: PlanRhythm; onChange: (v: PlanRhythm) => void }) {
  return (
    <div className="space-y-5">
      <div>
        <span className="mb-2 block text-[13px] font-semibold text-ink-soft">Activity level</span>
        <div className="space-y-2">
          {ACTIVITY_LEVELS.map((level) => {
            const active = value.activityLevel === level.id;
            return (
              <button
                key={level.id}
                type="button"
                onClick={() => onChange({ ...value, activityLevel: level.id })}
                className={cn(
                  "flex w-full items-center gap-3 rounded-2xl border p-3.5 text-left transition-all active:scale-[0.99]",
                  active ? "border-leaf/60 bg-mint" : "border-line bg-card hover:border-line-strong"
                )}
              >
                <span
                  className={cn(
                    "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
                    active ? "border-leaf bg-leaf text-white" : "border-line-strong bg-card"
                  )}
                >
                  {active && <Check size={11} strokeWidth={3.5} />}
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-semibold text-ink">{level.title}</span>
                  <span className="block text-xs text-muted">{level.desc}</span>
                </span>
              </button>
            );
          })}
        </div>
      </div>
      <div>
        <span className="mb-2 block text-[13px] font-semibold text-ink-soft">Your goal</span>
        <div className="grid grid-cols-3 gap-2">
          {GOALS.map((goal) => {
            const active = value.goal === goal.id;
            return (
              <button
                key={goal.id}
                type="button"
                onClick={() => onChange({ ...value, goal: goal.id })}
                className={cn(
                  "rounded-2xl border px-3 py-3.5 text-left transition-all active:scale-[0.98]",
                  active ? "border-leaf/60 bg-mint" : "border-line bg-card hover:border-line-strong"
                )}
              >
                <span className="block text-[13.5px] font-bold text-ink">{goal.title.replace(" weight", "")}</span>
                <span className="tnum mt-0.5 block text-[11px] font-semibold text-muted">
                  {goal.delta === 0 ? "± 0" : goal.delta > 0 ? `+${goal.delta}` : goal.delta} kcal
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export function basicsValid(b: PlanBasics): boolean {
  return b.age >= 13 && b.age <= 100 && b.heightCm >= 120 && b.heightCm <= 230 && b.weightKg >= 30 && b.weightKg <= 250;
}
