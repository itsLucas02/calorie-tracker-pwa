import { num } from "@/lib/utils";

const DISHES: { name: string; kcal: number }[] = [
  { name: "Nasi lemak", kcal: 400 },
  { name: "Roti canai", kcal: 300 },
  { name: "Teh tarik", kcal: 130 },
  { name: "Ayam goreng", kcal: 260 },
  { name: "Nasi kandar", kcal: 410 },
  { name: "Mee goreng mamak", kcal: 450 },
  { name: "Kangkung belacan", kcal: 90 },
  { name: "Char kway teow", kcal: 520 },
  { name: "Satay", kcal: 320 },
  { name: "Cendol", kcal: 320 },
  { name: "Laksa", kcal: 450 },
  { name: "Kuih", kcal: 220 },
];

/** Seamless marquee of "we already know your food" — pure CSS motion. */
export function Ticker() {
  const loop = [...DISHES, ...DISHES];
  return (
    <div className="overflow-hidden border-y border-line bg-card/60 py-3.5" aria-hidden>
      <div className="marquee-track flex w-max items-center gap-2.5 pr-2.5">
        {loop.map((d, i) => (
          <span
            key={`${d.name}-${i}`}
            className="tnum flex shrink-0 items-center gap-2 rounded-full border border-line bg-card px-3.5 py-1.5 text-[12.5px] font-semibold text-ink-soft"
          >
            {d.name}
            <span className="rounded-full bg-mint px-1.5 py-0.5 text-[10.5px] font-bold text-leaf">{num(d.kcal)} kcal</span>
          </span>
        ))}
      </div>
    </div>
  );
}
