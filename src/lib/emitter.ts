export type Unsubscribe = () => void;

/** Minimal pub/sub used by repositories to push change notifications
 *  (a natural seam for Supabase Realtime later). */
export function createEmitter() {
  const listeners = new Set<() => void>();
  return {
    subscribe(fn: () => void): Unsubscribe {
      listeners.add(fn);
      return () => {
        listeners.delete(fn);
      };
    },
    emit() {
      listeners.forEach((fn) => fn());
    },
  };
}
