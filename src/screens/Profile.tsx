import { useState } from "react";
import { Check, ChevronRight, Info, LogOut, Minus, Pencil, Plus, RotateCcw, X } from "lucide-react";
import { useSession } from "@/state/session";
import { useProfile } from "@/state/profile";
import { useToast } from "@/state/toast";
import { ACTIVITY_LEVELS, GOALS, calculateTargets } from "@/lib/calories";
import { effectiveTarget } from "@/lib/types";
import { initialOf, num } from "@/lib/utils";
import { BasicsFields, RhythmFields, basicsValid, type PlanBasics, type PlanRhythm } from "@/components/PlanFields";
import { Badge, Button, ConfirmDialog, useScrollLock } from "@/components/ui";

export default function ProfileScreen() {
  const { session, signOut } = useSession();
  const { profile, saveProfile } = useProfile();
  const toast = useToast();

  const [editingTarget, setEditingTarget] = useState(false);
  const [targetDraft, setTargetDraft] = useState(0);
  const [planSheetOpen, setPlanSheetOpen] = useState(false);
  const [confirmOut, setConfirmOut] = useState(false);

  if (!profile || !session) return null;

  const target = effectiveTarget(profile);
  const isCustom = profile.customCalorieTarget !== null;
  const activity = ACTIVITY_LEVELS.find((a) => a.id === profile.activityLevel);
  const goal = GOALS.find((g) => g.id === profile.goal);

  const startEditTarget = () => {
    setTargetDraft(target);
    setEditingTarget(true);
  };

  const saveTarget = async () => {
    const clamped = Math.min(4500, Math.max(1000, targetDraft));
    await saveProfile({
      ...profile,
      customCalorieTarget: clamped === profile.calculatedCalorieTarget ? null : clamped,
    });
    setEditingTarget(false);
    toast.show(`Daily target set to ${num(clamped)} kcal`);
  };

  const resetTarget = async () => {
    await saveProfile({ ...profile, customCalorieTarget: null });
    toast.show(`Back to the recommended ${num(profile.calculatedCalorieTarget)} kcal`);
  };

  return (
    <div className="screen mx-auto w-full max-w-xl px-4 pt-6 pb-8 md:max-w-2xl md:px-8 md:pt-10">
      <h1 className="font-display text-[28px] leading-tight font-semibold tracking-tight text-ink">Profile</h1>
      <p className="mt-0.5 text-[13px] text-muted">Your body, your plan, your numbers.</p>

      <div className="stagger mt-5 space-y-4">
        {/* user */}
        <section className="flex items-center gap-3.5 rounded-2xl border border-line bg-card p-5">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-lime-soft text-[16px] font-bold text-pine">
            {initialOf(session.user.name)}
          </div>
          <div className="min-w-0 flex-1">
            <p className="clamp-1 text-[15.5px] font-bold text-ink">{session.user.name}</p>
            <p className="clamp-1 text-[12.5px] text-muted">{session.user.email}</p>
          </div>
          <Badge tone="mint">Demo account</Badge>
        </section>

        {/* daily target */}
        <section className="rounded-2xl border border-line bg-card p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold tracking-[0.12em] text-faint uppercase">Daily calorie target</p>
              <p className="tnum font-display mt-1.5 text-[34px] leading-none font-semibold text-pine">
                {num(target)}
                <span className="ml-1.5 text-[13px] font-medium text-faint">kcal / day</span>
              </p>
            </div>
            <Badge tone={isCustom ? "lime" : "mint"}>{isCustom ? "Custom" : "Recommended"}</Badge>
          </div>

          {editingTarget ? (
            <div className="anim-fade mt-4 rounded-2xl border border-line bg-cream p-4">
              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={() => setTargetDraft((v) => Math.max(1000, v - 50))}
                  aria-label="Decrease"
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-line bg-card transition-all hover:border-line-strong active:scale-95"
                >
                  <Minus size={16} />
                </button>
                <span className="tnum w-28 text-center font-display text-[26px] font-semibold text-ink">{num(targetDraft)}</span>
                <button
                  onClick={() => setTargetDraft((v) => Math.min(4500, v + 50))}
                  aria-label="Increase"
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-line bg-card transition-all hover:border-line-strong active:scale-95"
                >
                  <Plus size={16} />
                </button>
              </div>
              <div className="mt-3 flex gap-2">
                <Button variant="ghost" className="flex-1" onClick={() => setEditingTarget(false)}>Cancel</Button>
                <Button className="flex-1" onClick={saveTarget}>
                  <Check size={15} />
                  Set target
                </Button>
              </div>
            </div>
          ) : (
            <div className="mt-4 flex gap-2">
              <Button variant="secondary" size="sm" className="flex-1" onClick={startEditTarget}>
                <Pencil size={13} />
                Adjust target
              </Button>
              {isCustom && (
                <Button variant="ghost" size="sm" onClick={resetTarget}>
                  <RotateCcw size={13} />
                  Reset
                </Button>
              )}
            </div>
          )}

          {isCustom && targetDraft !== profile.calculatedCalorieTarget && (
            <p className="tnum mt-3 text-[11.5px] text-faint">Calculated estimate: {num(profile.calculatedCalorieTarget)} kcal / day</p>
          )}
        </section>

        {/* plan */}
        <section className="overflow-hidden rounded-2xl border border-line bg-card">
          <PlanRow label="Age" value={`${profile.age} yrs`} />
          <PlanRow label="Sex" value={profile.sex === "female" ? "Female" : "Male"} />
          <PlanRow label="Height" value={`${profile.heightCm} cm`} />
          <PlanRow label="Weight" value={`${profile.weightKg} kg`} />
          <PlanRow label="Activity" value={activity?.title ?? profile.activityLevel} />
          <PlanRow label="Goal" value={goal?.title ?? profile.goal} last />
          <button
            onClick={() => setPlanSheetOpen(true)}
            className="flex w-full items-center justify-between border-t border-line px-5 py-4 text-[14px] font-bold text-leaf transition-colors hover:bg-mint/40"
          >
            Edit plan
            <ChevronRight size={16} />
          </button>
        </section>

        {/* about */}
        <section className="rounded-2xl border border-line bg-card p-5">
          <div className="flex gap-2.5">
            <Info size={15} className="mt-0.5 shrink-0 text-faint" />
            <div className="text-[12.5px] leading-relaxed text-muted">
              <p>
                KiraCal targets use the <span className="font-semibold text-ink-soft">Mifflin-St Jeor</span> equation and food
                values are Kira estimates. General guidance, not medical advice.
              </p>
              <p className="mt-2 text-faint">v0.1.0-preview · data stored locally on this device</p>
            </div>
          </div>
        </section>

        <Button variant="secondary" className="w-full text-bad hover:border-bad/30 hover:bg-bad-soft" onClick={() => setConfirmOut(true)}>
          <LogOut size={15} />
          Sign out
        </Button>
      </div>

      {planSheetOpen && <PlanSheet onClose={() => setPlanSheetOpen(false)} />}
      <ConfirmDialog
        open={confirmOut}
        title="Sign out of KiraCal?"
        description="Your plan and meal history stay safely on this device for when you're back."
        confirmLabel="Sign out"
        onConfirm={() => void signOut()}
        onCancel={() => setConfirmOut(false)}
      />
    </div>
  );
}

function PlanRow({ label, value, last }: { label: string; value: string; last?: boolean }) {
  return (
    <div className={`flex items-center justify-between px-5 py-[13px] ${last ? "" : "border-b border-line/70"}`}>
      <span className="text-[13.5px] font-semibold text-muted">{label}</span>
      <span className="text-[13.5px] font-bold text-ink">{value}</span>
    </div>
  );
}

/** Bottom-sheet (mobile) / dialog (desktop) for editing the body + plan inputs. */
function PlanSheet({ onClose }: { onClose: () => void }) {
  const { profile, saveProfile } = useProfile();
  const toast = useToast();
  useScrollLock();
  const [saving, setSaving] = useState(false);
  const [basics, setBasics] = useState<PlanBasics>({
    age: profile?.age ?? 29,
    sex: profile?.sex ?? "female",
    heightCm: profile?.heightCm ?? 165,
    weightKg: profile?.weightKg ?? 62,
  });
  const [rhythm, setRhythm] = useState<PlanRhythm>({
    activityLevel: profile?.activityLevel ?? "light",
    goal: profile?.goal ?? "maintain",
  });

  if (!profile) return null;

  const preview = calculateTargets({ ...basics, ...rhythm });

  const save = async () => {
    if (!basicsValid(basics)) return;
    setSaving(true);
    const hadCustom = profile.customCalorieTarget !== null;
    await saveProfile({
      ...profile,
      ...basics,
      ...rhythm,
      calculatedCalorieTarget: preview.calorieTarget,
      // Custom targets are deliberate — keep them; calculated stays visible for comparison.
      customCalorieTarget: profile.customCalorieTarget,
    });
    setSaving(false);
    onClose();
    toast.show(
      hadCustom
        ? `Plan updated · estimate now ${num(preview.calorieTarget)} kcal`
        : `Plan updated · target now ${num(preview.calorieTarget)} kcal`
    );
  };

  return (
    <div className="fixed inset-0 z-[75] flex items-end justify-center sm:items-center sm:p-6" role="dialog" aria-modal="true">
      <div className="anim-fade absolute inset-0 bg-ink/40 backdrop-blur-[2px]" onClick={onClose} />
      <div className="screen-sheet relative flex max-h-[92dvh] w-full max-w-lg flex-col overflow-hidden rounded-t-2xl border border-line bg-cream sm:rounded-2xl">
        <div className="flex items-center justify-between border-b border-line bg-card px-5 py-4">
          <div>
            <h2 className="font-display text-[18px] font-semibold text-ink">Edit plan</h2>
            <p className="tnum text-[12px] text-muted">
              New estimate: <span className="font-bold text-leaf">{num(preview.calorieTarget)} kcal / day</span>
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-line text-muted transition-colors hover:text-ink"
          >
            <X size={16} />
          </button>
        </div>
        <div className="flex-1 space-y-6 overflow-y-auto px-5 py-5">
          <BasicsFields value={basics} onChange={setBasics} />
          <div className="h-px bg-line" />
          <RhythmFields value={rhythm} onChange={setRhythm} />
        </div>
        <div className="border-t border-line bg-card px-5 pt-3 pb-[calc(0.875rem+env(safe-area-inset-bottom))]">
          <Button size="lg" className="w-full" loading={saving} disabled={!basicsValid(basics)} onClick={save}>
            Save plan · {num(preview.calorieTarget)} kcal
          </Button>
        </div>
      </div>
    </div>
  );
}
