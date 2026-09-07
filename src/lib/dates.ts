/** Local-timezone date helpers. dateKey ("YYYY-MM-DD") is the app's day unit. */

const pad = (n: number) => String(n).padStart(2, "0");

export function dateKeyOf(d: Date): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function todayKey(): string {
  return dateKeyOf(new Date());
}

export function keyToDate(key: string): Date {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function addDays(key: string, days: number): string {
  const d = keyToDate(key);
  d.setDate(d.getDate() + days);
  return dateKeyOf(d);
}

const DAY_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const DAY_LETTER = ["S", "M", "T", "W", "T", "F", "S"];
const MONTH_SHORT = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** "Today" / "Yesterday" / "Tue, 4 Feb" */
export function formatDayLabel(key: string): string {
  if (key === todayKey()) return "Today";
  if (key === addDays(todayKey(), -1)) return "Yesterday";
  const d = keyToDate(key);
  const sameYear = d.getFullYear() === new Date().getFullYear();
  return `${DAY_SHORT[d.getDay()]}, ${d.getDate()} ${MONTH_SHORT[d.getMonth()]}${sameYear ? "" : ` ${d.getFullYear()}`}`;
}

export function formatFullDate(key: string): string {
  const d = keyToDate(key);
  return `${DAY_SHORT[d.getDay()]}, ${d.getDate()} ${MONTH_SHORT[d.getMonth()]}`;
}

export function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

export function mealLabelForHour(hour: number): string {
  if (hour < 5) return "Supper";
  if (hour < 11) return "Breakfast";
  if (hour < 15) return "Lunch";
  if (hour < 18) return "Snack";
  if (hour < 22) return "Dinner";
  return "Supper";
}

export function mealLabelNow(): string {
  return mealLabelForHour(new Date().getHours());
}

export interface WeekDay {
  key: string;
  weekdayLetter: string;
  dayNum: number;
  isToday: boolean;
  isFuture: boolean;
}

/** The Monday-start week containing `key`. */
export function weekOf(key: string): WeekDay[] {
  const d = keyToDate(key);
  const mondayOffset = (d.getDay() + 6) % 7;
  const monday = addDays(key, -mondayOffset);
  const today = todayKey();
  return Array.from({ length: 7 }, (_, i) => {
    const k = addDays(monday, i);
    const dd = keyToDate(k);
    return {
      key: k,
      weekdayLetter: DAY_LETTER[dd.getDay()],
      dayNum: dd.getDate(),
      isToday: k === today,
      isFuture: k > today,
    };
  });
}
