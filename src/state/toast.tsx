import { CheckCircle2, Info } from "lucide-react";
import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from "react";
import { uid } from "@/lib/utils";

export interface ToastAction {
  label: string;
  onPress: () => void;
}

export interface ToastOptions {
  variant?: "success" | "info";
  action?: ToastAction;
  duration?: number;
}

interface Toast {
  id: string;
  message: string;
  variant: "success" | "info";
  action?: ToastAction;
}

interface ToastState {
  show: (message: string, options?: ToastOptions) => void;
}

const ToastContext = createContext<ToastState | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const timers = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  const dismiss = useCallback((id: string) => {
    const timer = timers.current.get(id);
    if (timer) clearTimeout(timer);
    timers.current.delete(id);
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const show = useCallback(
    (message: string, options?: ToastOptions) => {
      const id = uid();
      setToasts((prev) => [...prev.slice(-2), { id, message, variant: options?.variant ?? "success", action: options?.action }]);
      const timer = setTimeout(() => dismiss(id), options?.duration ?? (options?.action ? 5000 : 2800));
      timers.current.set(id, timer);
    },
    [dismiss]
  );

  const value = useMemo(() => ({ show }), [show]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 bottom-[calc(72px+env(safe-area-inset-bottom))] z-[70] flex flex-col items-center gap-2 px-4 md:bottom-6">
        {toasts.map((t) => (
          <div
            key={t.id}
            className="anim-toast pointer-events-auto flex max-w-[92vw] items-center gap-2.5 rounded-full bg-ink py-2.5 pr-2.5 pl-3.5 text-sm font-medium text-cream shadow-[0_12px_32px_-8px_rgba(23,34,28,0.45)]"
          >
            {t.variant === "success" ? (
              <CheckCircle2 size={17} className="shrink-0 text-lime" />
            ) : (
              <Info size={17} className="shrink-0 text-lime" />
            )}
            <span className="tnum whitespace-nowrap">{t.message}</span>
            {t.action && (
              <button
                onClick={() => {
                  t.action!.onPress();
                  dismiss(t.id);
                }}
                className="ml-1 shrink-0 rounded-full bg-lime px-3 py-1 text-[12.5px] font-bold text-ink transition-transform active:scale-95"
              >
                {t.action.label}
              </button>
            )}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastState {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}
