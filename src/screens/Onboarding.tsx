import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Info, Minus, Plus, RotateCcw, Sparkles } from "lucide-react";
import { useSession } from "@/state/session";
import { useProfile } from "@/state/profile";
import { useToast } from "@/state/toast";
import { calculateTargets } from "@/lib/calories";
import { uid, num } from "@/lib/utils";
import { mealRepository } from "@/services";
import { seedDemoMeals } from "@/services/meals/seed";
import { BasicsFields, RhythmFields, basicsValid, type PlanBasics, type PlanRhythm } from "@/components/PlanFields";
import { Button } from "@/components/ui";
import { LogoMark } from "@/components/ui";

const STEP_META = [
  { title: "Tell us about you", sub: "The basics that drive your energy estimate." },
  { title: "Your rhythm", sub: "How you move, and where you're headed." },
  { title: "Your daily target", sub: "An honest starting estimate — tune it to taste." },
];

export default function OnboardingScreen() {
  const { session } = useSession();
  const { saveProfile } = useProfile();
  const toast = useToast();
  const navigate = useNavigate();

  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [basics, setBasics] = useState<PlanBasics>({ age: 29, sex: "female", heightCm: 165, weightKg: 62 });
  const [rhythm, setRhythm] = useState<PlanRhythm>({ activityLevel: "light", goal: "maintain" });

  const calc = useMemo(() => calculateTargets({ ...basics, ...rhythm }), [basics, rhythm]);
  const [adjusted, setAdjusted] = useState<number | null>(null);
  const target = adjusted ?? calc.calorieTarget;

  const canContinue = step === 0 ? basicsValid(basics) : true;

  const finish = async () => {
    if (!session) return;
    setSaving(true);
    await saveProfile({
      id: uid(),
      userId: session.user.id,
      name: session.user.name,
      createdAt: new Date().toISOString(),
      ...basics,
      ...rhythm,
      calculatedCalorieTarget: calc.calorieTarget,
      customCalorieTarget: target !== calc.calorieTarget ? target : null,
    });
    await seedDemoMeals(mealRepository, session.user.id);
    toast.show(`Your plan is ready — ${num(target)} kcal / day`);
    navigate("/app/today", { replace: true });
  };

  return (
    <div className="min-h-[100dvh] bg-cream">
      <div className="mx-auto flex min-h-[100dvh] w-full max-w-lg flex-col px-5 pt-[max(1.25rem,env(safe-area-inset-top))] md:max-w-xl">
        {/* top bar */}
        <div className="flex items-center gap-3">
          {step > 0 ? (
            <button
              onClick={() => setStep((s) => s - 1)}
              aria-label="Back"
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-line bg-card text-muted transition-colors hover:text-ink"
            >
              <ArrowLeft size={17} />
            </button>
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-pine">
              <LogoMark size={20} />
            </div>
          )}
          <div className="flex flex-1 gap-1.5">
            {STEP_META.map((_, i) => (
              <div key={i} className="h-1.5 flex-1 overflow-hidden rounded-full bg-cream-deep">
                <div
                  className="h-full rounded-full bg-leaf transition-all duration-500"
                  style={{ width: i < step ? "100%" : i === step ? "50%" : "0%" }}
                />
              </div>
            ))}
          </div>
          <span className="tnum text-xs font-semibold text-faint">{step + 1} / 3</span>
        </div>

        {/* content */}
        <div key={step} className="anim-fade flex-1 pt-8 pb-6">
          <h1 className="font-display text-[30px] leading-tight font-semibold tracking-tight text-ink">{STEP_META[step].title}</h1>
          <p className="mt-1.5 text-[14.5px] text-muted">{STEP_META[step].sub}</p>

          <div className="mt-7">
            {step === 0 && <BasicsFields value={basics} onChange={setBasics} />}
            {step === 1 && <RhythmFields value={rhythm} onChange={setRhythm} />}
            {step === 2 && (
              <TargetStep
                target={target}
                calculated={calc.calorieTarget}
                bmr={calc.bmr}
                tdee={calc.tdee}
                goalDelta={rhythm.goal === "lose" ? -500 : rhythm.goal === "gain" ? 300 : 0}
                onAdjust={setAdjusted}
              />
            )}
          </div>
        </div>

        {/* bottom CTA */}
        <div className="sticky bottom-0 -mx-5 border-t border-line bg-cream px-5 pt-3 pb-[calc(0.875rem+env(safe-area-inset-bottom))]">
          {step < 2 ? (
            <Button size="lg" className="w-full" disabled={!canContinue} onClick={() => setStep((s) => s + 1)}>
              Continue
              <ArrowRight size={17} />
            </Button>
          ) : (
            <Button size="lg" className="w-full" loading={saving} onClick={finish}>
              <Sparkles size={17} />
              Start kira at {num(target)} kcal
            </Button>
          )}
          {step === 0 && !canContinue && (
            <p className="mt-2 text-center text-xs text-faint">Age 13–100 · height 120–230 cm · weight 30–250 kg</p>
          )}
        </div>
      </div>
    </div>
  );
}

function TargetStep({
  target,
  calculated,
  bmr,
  tdee,
  goalDelta,
  onAdjust,
}: {
  target: number;
  calculated: number;
  bmr: number;
  tdee: number;
  goalDelta: number;
  onAdjust: (v: number | null) => void;
}) {
  const step = (d: number) => onAdjust(Math.min(calculated + 800, Math.max(1200, target + d)));

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-line bg-card p-6 text-center">
        <span className="text-[11px] font-bold tracking-[0.14em] text-faint uppercase">Estimated daily target</span>
        <div className="tnum font-display mt-2 text-[56px] leading-none font-semibold tracking-tight text-pine">{num(target)}</div>
        <div className="mt-1.5 text-sm font-medium text-muted">kcal / day</div>

        <div className="mt-5 flex items-center justify-center gap-3">
          <button
            onClick={() => step(-50)}
            aria-label="Decrease target"
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-line bg-cream text-ink transition-all hover:border-line-strong active:scale-95"
          >
            <Minus size={17} />
          </button>
          <span className="w-20 text-xs font-semibold text-muted">
            Adjust
            <span className="tnum block text-[15px] font-bold text-ink">
              {target === calculated ? "± 0" : `${target > calculated ? "+" : "−"}${Math.abs(target - calculated)}`}
            </span>
          </span>
          <button
            onClick={() => step(50)}
            aria-label="Increase target"
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-line bg-cream text-ink transition-all hover:border-line-strong active:scale-95"
          >
            <Plus size={17} />
          </button>
        </div>

        {target !== calculated && (
          <button
            onClick={() => onAdjust(null)}
            className="mx-auto mt-3 flex items-center gap-1.5 text-xs font-semibold text-leaf hover:underline"
          >
            <RotateCcw size={12} />
            Reset to recommended ({num(calculated)})
          </button>
        )}
      </div>

      <div className="rounded-2xl border border-line bg-card p-4 text-[13px] leading-relaxed text-muted">
        <p className="tnum">
          Resting burn <span className="font-semibold text-ink">{num(bmr)}</span> × activity ≈{" "}
          <span className="font-semibold text-ink">{num(tdee)}</span>
          {goalDelta !== 0 && (
            <>
              {" "}
              <span className={goalDelta < 0 ? "font-semibold text-bad" : "font-semibold text-leaf"}>
                {goalDelta > 0 ? `+${goalDelta}` : goalDelta}
              </span>{" "}
              for your goal
            </>
          )}
        </p>
      </div>

      <div className="flex gap-2.5 rounded-2xl border border-line bg-mint/60 p-4">
        <Info size={16} className="mt-0.5 shrink-0 text-leaf" />
        <p className="text-[12.5px] leading-relaxed text-ink-soft">
          This is an <span className="font-semibold">estimate</span>, based on the Mifflin-St Jeor equation — a sensible
          starting point, not medical advice. You can change it anytime in Profile.
        </p>
      </div>
    </div>
  );
}
