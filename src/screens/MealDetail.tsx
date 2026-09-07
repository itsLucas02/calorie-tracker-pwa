import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Info, Pencil, RotateCcw, Trash2 } from "lucide-react";
import { useSession } from "@/state/session";
import { useToast } from "@/state/toast";
import { useMeal, useRepeatMeal } from "@/hooks/useMeals";
import { mealRepository } from "@/services";
import { sumItems, type MealItem } from "@/lib/types";
import { dateKeyOf, formatDayLabel, formatTime, mealLabelForHour } from "@/lib/dates";
import { addRecent } from "@/services/meals/recents";
import { haptic, num } from "@/lib/utils";
import { Button, Input } from "@/components/ui";
import { MealItemsEditor } from "@/components/MealItemsEditor";

function isoDate(d: Date): string {
  return dateKeyOf(d);
}
function isoTime(d: Date): string {
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

export default function MealDetailScreen() {
  const { id } = useParams<{ id: string }>();
  const { session } = useSession();
  const toast = useToast();
  const navigate = useNavigate();
  const { meal, loading } = useMeal(session?.user.id, id);
  const repeatMeal = useRepeatMeal();

  const [editing, setEditing] = useState(false);
  const [desc, setDesc] = useState("");
  const [items, setItems] = useState<MealItem[]>([]);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [saving, setSaving] = useState(false);

  const startEdit = () => {
    if (!meal) return;
    const at = new Date(meal.createdAt);
    setDesc(meal.originalDescription);
    setItems(meal.items.map((i) => ({ ...i })));
    setDate(isoDate(at));
    setTime(isoTime(at));
    setEditing(true);
  };

  const save = async () => {
    if (!session || !meal) return;
    const allNamed = items.length > 0 && items.every((i) => i.name.trim().length > 0);
    if (!allNamed || !date || !time) return;
    setSaving(true);
    const when = new Date(`${date}T${time}`);
    const cleaned = items.map((i) => ({ ...i, name: i.name.trim(), portion: i.portion.trim() || "1 serving" }));
    await mealRepository.update(session.user.id, meal.id, {
      originalDescription: desc.trim() || meal.originalDescription,
      items: cleaned,
      createdAt: when.toISOString(),
      dateKey: dateKeyOf(when),
      label: mealLabelForHour(when.getHours()),
    });
    haptic();
    toast.show("Meal updated");
    setSaving(false);
    setEditing(false);
  };

  const remove = async () => {
    if (!session || !meal) return;
    const snapshot = meal;
    await mealRepository.remove(session.user.id, meal.id);
    haptic(14);
    toast.show("Meal deleted", {
      variant: "info",
      action: {
        label: "Undo",
        onPress: () => {
          void mealRepository.create(session.user.id, {
            id: snapshot.id,
            dateKey: snapshot.dateKey,
            createdAt: snapshot.createdAt,
            label: snapshot.label,
            originalDescription: snapshot.originalDescription,
            items: snapshot.items,
          });
        },
      },
    });
    navigate(-1);
  };

  const logAgain = async () => {
    if (!meal) return;
    await repeatMeal(meal);
    addRecent(session?.user.id, meal.originalDescription);
    navigate("/app/today");
  };

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-xl px-5 pt-6 md:max-w-2xl md:px-8">
        <div className="shimmer h-10 w-40 rounded-xl" />
        <div className="shimmer mt-5 h-24 rounded-2xl" />
        <div className="shimmer mt-3 h-40 rounded-2xl" />
      </div>
    );
  }

  if (!meal) {
    return (
      <div className="mx-auto flex min-h-[70dvh] w-full max-w-xl flex-col items-center justify-center px-5 text-center">
        <h2 className="font-display text-xl font-semibold text-ink">Meal not found</h2>
        <p className="mt-1 text-sm text-muted">It may have been deleted.</p>
        <Button variant="secondary" className="mt-5" onClick={() => navigate("/app/today")}>
          Back to Today
        </Button>
      </div>
    );
  }

  const totals = editing ? sumItems(items) : meal.totals;
  const allNamed = items.length > 0 && items.every((i) => i.name.trim().length > 0);

  return (
    <div className="screen-sheet mx-auto flex min-h-[100dvh] w-full max-w-xl flex-col px-5 pt-[max(0.875rem,env(safe-area-inset-top))] pb-4 md:max-w-2xl md:px-8">
      {/* header */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => (editing ? setEditing(false) : navigate(-1))}
          aria-label="Back"
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-line bg-card text-muted transition-colors hover:text-ink"
        >
          <ArrowLeft size={17} />
        </button>
        <div className="min-w-0 flex-1 text-center">
          <h1 className="text-[14px] font-bold text-ink">{meal.label}</h1>
          <p className="text-[11.5px] font-medium text-faint">
            {formatDayLabel(meal.dateKey)} · {formatTime(meal.createdAt)}
          </p>
        </div>
        {!editing ? (
          <div className="flex gap-2">
            <button
              onClick={startEdit}
              aria-label="Edit meal"
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-line bg-card text-muted transition-colors hover:text-pine"
            >
              <Pencil size={15} />
            </button>
            <button
              onClick={() => void remove()}
              aria-label="Delete meal"
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-line bg-card text-muted transition-colors hover:bg-bad-soft hover:text-bad"
            >
              <Trash2 size={15} />
            </button>
          </div>
        ) : (
          <div className="w-10" />
        )}
      </div>

      {editing ? (
        <div className="anim-fade flex flex-1 flex-col pt-5">
          <div className="mb-4 grid grid-cols-5 gap-2">
            <label className="col-span-3 block">
              <span className="mb-1.5 block text-[13px] font-semibold text-ink-soft">Date</span>
              <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="tnum" />
            </label>
            <label className="col-span-2 block">
              <span className="mb-1.5 block text-[13px] font-semibold text-ink-soft">Time</span>
              <Input type="time" value={time} onChange={(e) => setTime(e.target.value)} className="tnum" />
            </label>
          </div>
          <Input value={desc} onChange={(e) => setDesc(e.target.value)} aria-label="Meal description" className="mb-4 bg-transparent text-[14px] font-medium italic" />
          <MealItemsEditor items={items} onChange={setItems} />
          <div className="sticky bottom-0 mt-5 -mx-5 border-t border-line bg-cream px-5 pt-3 pb-[calc(0.875rem+env(safe-area-inset-bottom))] md:-mx-8 md:px-8">
            <div className="flex gap-2">
              <Button variant="ghost" size="lg" onClick={() => setEditing(false)}>
                Cancel
              </Button>
              <Button size="lg" className="flex-1" loading={saving} disabled={!allNamed || !date || !time} onClick={save}>
                Save changes · {num(totals.calories)} kcal
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="stagger flex-1 pt-5">
          <div className="rounded-2xl border border-line bg-card p-5">
            <p className="text-[11px] font-bold tracking-[0.12em] text-faint uppercase">What you said</p>
            <p className="mt-1.5 text-[15px] leading-relaxed font-medium text-ink">"{meal.originalDescription}"</p>
          </div>

          <div className="mt-3 overflow-hidden rounded-2xl border border-line bg-card">
            {meal.items.map((item, i) => (
              <div key={item.id} className={i > 0 ? "border-t border-line" : ""}>
                <div className="flex items-center justify-between gap-3 px-5 pt-3.5">
                  <div className="min-w-0">
                    <p className="clamp-1 text-[14.5px] font-semibold text-ink">{item.name}</p>
                    <p className="clamp-1 text-[12px] text-faint">{item.portion}</p>
                  </div>
                  <span className="tnum shrink-0 text-[15px] font-bold text-ink">{num(item.calories)} kcal</span>
                </div>
                <div className="tnum flex gap-3 px-5 pt-1 pb-3.5 text-[11.5px] font-semibold text-muted">
                  <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-protein" />{num(item.proteinG)}g protein</span>
                  <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-carb" />{num(item.carbsG)}g carbs</span>
                  <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-fat" />{num(item.fatG)}g fat</span>
                </div>
              </div>
            ))}
            <div className="flex items-center justify-between border-t border-line bg-mint/50 px-5 py-3.5">
              <span className="text-[13px] font-bold text-pine">Meal total</span>
              <div className="flex items-baseline gap-2">
                <span className="tnum text-[12px] font-semibold text-leaf">
                  P {num(meal.totals.proteinG)} · C {num(meal.totals.carbsG)} · F {num(meal.totals.fatG)}
                </span>
                <span className="tnum font-display text-[20px] font-semibold text-pine">{num(meal.totals.calories)}</span>
                <span className="text-[11px] font-bold text-leaf">kcal</span>
              </div>
            </div>
          </div>

          <Button variant="secondary" size="lg" className="mt-3 w-full" onClick={() => void logAgain()}>
            <RotateCcw size={16} />
            Log this again today
          </Button>

          <p className="mt-4 flex items-start gap-2 px-1 text-[11.5px] leading-relaxed text-faint">
            <Info size={13} className="mt-0.5 shrink-0" />
            Values are Kira estimates. Tap the pencil to correct anything — totals update the day instantly.
          </p>
        </div>
      )}
    </div>
  );
}
