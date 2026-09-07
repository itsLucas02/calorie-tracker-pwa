import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, History, Sparkles, TriangleAlert, X } from "lucide-react";
import { useSession } from "@/state/session";
import { mealAnalysisService, mealRepository } from "@/services";
import { sumItems, type MealItem } from "@/lib/types";
import { todayKey, mealLabelNow, formatFullDate } from "@/lib/dates";
import { addRecent, getRecents } from "@/services/meals/recents";
import { haptic, num } from "@/lib/utils";
import { Button, Input, LogoMark, Textarea, Badge } from "@/components/ui";
import { MealItemsEditor } from "@/components/MealItemsEditor";

type Phase = "compose" | "analyzing" | "review";

const EXAMPLES = [
  "Nasi putih, ayam kari, kangkung belacan",
  "2 roti canai dengan dhal",
  "Mee goreng mamak, telur mata",
  "Nasi lemak, teh o",
  "Teh tarik kurang manis",
];

const ANALYSIS_MESSAGES = [
  "Reading your meal…",
  "Matching local dishes…",
  "Estimating portions…",
  "Counting macros…",
];

export default function LogMealScreen() {
  const { session } = useSession();
  const navigate = useNavigate();

  const [phase, setPhase] = useState<Phase>("compose");
  const [description, setDescription] = useState("");
  const [items, setItems] = useState<MealItem[]>([]);
  const [notes, setNotes] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [msgIndex, setMsgIndex] = useState(0);
  const [recents, setRecents] = useState<string[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setRecents(getRecents(session?.user.id).slice(0, 4));
  }, [session]);

  useEffect(() => {
    if (phase === "compose") {
      const t = setTimeout(() => textareaRef.current?.focus(), 350);
      return () => clearTimeout(t);
    }
  }, [phase]);

  useEffect(() => {
    if (phase !== "analyzing") return;
    setMsgIndex(0);
    const timer = setInterval(() => setMsgIndex((i) => Math.min(i + 1, ANALYSIS_MESSAGES.length - 1)), 550);
    return () => clearInterval(timer);
  }, [phase]);

  const analyse = async () => {
    const text = description.trim();
    if (text.length < 3) return;
    setError(null);
    setPhase("analyzing");
    try {
      const result = await mealAnalysisService.analyze(text);
      setItems(
        result.items.map((it) => ({
          id: it.id,
          name: it.name,
          portion: it.portion,
          calories: it.calories,
          proteinG: it.proteinG,
          carbsG: it.carbsG,
          fatG: it.fatG,
        }))
      );
      setNotes(result.notes);
      setPhase("review");
    } catch {
      setError("Kira couldn't read that one — try rephrasing, e.g. \"2 roti canai, dhal\".");
      setPhase("compose");
    }
  };

  const totals = sumItems(items);
  const allNamed = items.length > 0 && items.every((i) => i.name.trim().length > 0);

  const save = async () => {
    if (!session || !allNamed) return;
    setSaving(true);
    const cleaned = items.map((i) => ({ ...i, name: i.name.trim(), portion: i.portion.trim() || "1 serving" }));
    await mealRepository.create(session.user.id, {
      dateKey: todayKey(),
      originalDescription: description.trim(),
      items: cleaned,
    });
    addRecent(session.user.id, description);
    haptic();
    const kcal = sumItems(cleaned).calories;
    navigate("/app/today", { replace: true, state: { justLogged: kcal } });
  };

  return (
    <div className="screen-sheet min-h-[100dvh] bg-cream">
      <div className="mx-auto flex min-h-[100dvh] w-full max-w-xl flex-col px-5 pt-[max(0.875rem,env(safe-area-inset-top))] md:max-w-2xl md:px-8">
        {/* top bar */}
        <div className="flex items-center gap-2">
          {phase === "review" ? (
            <button
              onClick={() => setPhase("compose")}
              aria-label="Back to edit description"
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-line bg-card text-muted transition-colors hover:text-ink"
            >
              <ArrowLeft size={17} />
            </button>
          ) : (
            <button
              onClick={() => navigate("/app/today")}
              aria-label="Close"
              disabled={phase === "analyzing"}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-line bg-card text-muted transition-colors hover:text-ink disabled:opacity-40"
            >
              <X size={17} />
            </button>
          )}
          <div className="flex-1 text-center">
            <h1 className="text-[14px] font-bold text-ink">{phase === "review" ? "Review meal" : "Log meal"}</h1>
            <p className="text-[11.5px] font-medium text-faint">
              {phase === "review" ? "Check the estimate, fix anything" : `${formatFullDate(todayKey())} · logs as ${mealLabelNow()}`}
            </p>
          </div>
          <div className="w-10" />
        </div>

        {/* ---------- compose ---------- */}
        {phase === "compose" && (
          <div className="anim-fade flex flex-1 flex-col pt-8">
            <h2 className="font-display text-[28px] leading-tight font-semibold tracking-tight text-ink">
              What did you eat?
            </h2>
            <p className="mt-1.5 text-[14px] text-muted">Plain words are perfect. BM, English, rojak — semua boleh.</p>

            <div className="mt-5">
              <Textarea
                ref={textareaRef}
                rows={5}
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                  setError(null);
                }}
                placeholder="e.g. Nasi putih, ayam kari, kangkung belacan…"
                className="min-h-[130px] text-[17px]"
              />
              {error && <p className="mt-2 text-[13px] font-medium text-bad">{error}</p>}
            </div>

            <div className="no-scrollbar -mx-5 mt-4 flex gap-2 overflow-x-auto px-5 pb-1 md:-mx-8 md:px-8">
              {recents.map((ex) => (
                <button
                  key={ex}
                  onClick={() => setDescription(ex)}
                  className="flex shrink-0 items-center gap-1.5 overflow-hidden rounded-lg border border-leaf/25 bg-mint/60 px-3 py-2 text-[12.5px] font-medium whitespace-nowrap text-pine transition-colors hover:border-leaf/50 active:scale-[0.97]"
                >
                  <History size={12} className="shrink-0" />
                  <span className="max-w-[180px] overflow-hidden text-ellipsis">{ex}</span>
                </button>
              ))}
              {EXAMPLES.map((ex) => (
                <button
                  key={ex}
                  onClick={() => setDescription(ex)}
                  className="shrink-0 rounded-lg border border-line bg-card px-3 py-2 text-[12.5px] font-medium whitespace-nowrap text-muted transition-colors hover:border-line-strong hover:text-ink active:scale-[0.97]"
                >
                  {ex}
                </button>
              ))}
            </div>

            <div className="sticky bottom-0 mt-auto -mx-5 border-t border-line bg-cream px-5 pt-3.5 pb-[calc(0.875rem+env(safe-area-inset-bottom))] md:-mx-8 md:px-8">
              <Button size="lg" variant="lime" className="w-full text-[15.5px]" disabled={description.trim().length < 3} onClick={analyse}>
                <Sparkles size={17} />
                Analyse meal
              </Button>
              <p className="mt-2 text-center text-[11.5px] text-faint">Kira estimates — you approve before anything is saved.</p>
            </div>
          </div>
        )}

        {/* ---------- analyzing ---------- */}
        {phase === "analyzing" && (
          <div className="flex flex-1 flex-col items-center justify-center pb-16">
            <div className="anim-breathe flex h-16 w-16 items-center justify-center rounded-[20px] bg-pine">
              <LogoMark size={32} />
            </div>
            <p key={msgIndex} className="anim-fade mt-5 text-[15px] font-semibold text-ink">
              {ANALYSIS_MESSAGES[msgIndex]}
            </p>
            <p className="mt-1 text-[12.5px] text-faint">"{description.trim().slice(0, 60)}{description.trim().length > 60 ? "…" : ""}"</p>
            <div className="mt-8 w-full max-w-xs space-y-2.5">
              <div className="shimmer h-14 rounded-2xl border border-line" />
              <div className="shimmer h-14 rounded-2xl border border-line opacity-70" style={{ animationDelay: "80ms" }} />
              <div className="shimmer h-14 rounded-2xl border border-line opacity-40" style={{ animationDelay: "160ms" }} />
            </div>
          </div>
        )}

        {/* ---------- review ---------- */}
        {phase === "review" && (
          <div className="anim-fade flex flex-1 flex-col pt-5 pb-4">
            <div className="mb-3 flex items-center gap-2">
              <Badge tone="lime">
                <Sparkles size={11} />
                Kira's estimate
              </Badge>
              <span className="text-[11.5px] text-faint">tap any value to correct it</span>
            </div>

            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              aria-label="Meal description"
              className="mb-4 h-11 bg-transparent text-[14px] font-medium text-ink-soft italic"
            />

            {notes.length > 0 && (
              <div className="mb-4 flex gap-2.5 rounded-2xl border border-warn/20 bg-warn-soft p-3.5">
                <TriangleAlert size={15} className="mt-0.5 shrink-0 text-warn" />
                <div className="text-[12.5px] leading-relaxed text-[#7c5410]">
                  {notes.map((n, i) => (
                    <p key={i}>{n}</p>
                  ))}
                </div>
              </div>
            )}

            <div className="stagger">
              <MealItemsEditor items={items} onChange={setItems} />
            </div>

            {/* totals + actions */}
            <div className="sticky bottom-0 mt-5 -mx-5 border-t border-line bg-cream px-5 pt-3 pb-[calc(0.875rem+env(safe-area-inset-bottom))] md:-mx-8 md:px-8">
              <div className="mb-3 rounded-xl border border-line bg-card px-4 py-3">
                <div className="flex items-baseline justify-between">
                  <span className="text-[13px] font-bold text-ink">Total</span>
                  <span className="flex items-baseline gap-1">
                    <span className="tnum font-display text-[22px] leading-none font-semibold text-pine">{num(totals.calories)}</span>
                    <span className="text-[11px] font-bold text-faint">kcal</span>
                  </span>
                </div>
                <div className="tnum mt-1.5 flex items-center gap-4 border-t border-line/60 pt-2 text-[12px] font-semibold text-muted">
                  <span className="flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-protein" />{num(totals.proteinG)} g protein</span>
                  <span className="flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-carb" />{num(totals.carbsG)} g carbs</span>
                  <span className="flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-fat" />{num(totals.fatG)} g fat</span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="lg" onClick={() => setPhase("compose")}>
                  Cancel
                </Button>
                <Button size="lg" className="flex-1" loading={saving} disabled={!allNamed} onClick={save}>
                  Save meal
                </Button>
              </div>
              {!allNamed && items.length > 0 && (
                <p className="mt-2 text-center text-[11.5px] text-faint">Give every item a name to save.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
