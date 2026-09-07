/**
 * Recently-logged meal descriptions — the "quick add" chips on the
 * compose screen. Local preference data, deliberately not part of the
 * Meal domain model; a production backend can keep this client-side.
 */

const keyFor = (userId: string) => `kiracal:v1:recents:${userId}`;
const MAX = 8;

export function getRecents(userId: string | undefined): string[] {
  if (!userId) return [];
  try {
    const raw = localStorage.getItem(keyFor(userId));
    const list: string[] = raw ? JSON.parse(raw) : [];
    return Array.isArray(list) ? list.filter((s) => typeof s === "string") : [];
  } catch {
    return [];
  }
}

export function addRecent(userId: string | undefined, description: string): void {
  const text = description.trim();
  if (!userId || text.length < 3) return;
  const next = [text, ...getRecents(userId).filter((r) => r.toLowerCase() !== text.toLowerCase())].slice(0, MAX);
  localStorage.setItem(keyFor(userId), JSON.stringify(next));
}
