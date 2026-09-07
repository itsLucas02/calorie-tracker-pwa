import { forwardRef, useEffect, type ButtonHTMLAttributes, type InputHTMLAttributes, type ReactNode, type TextareaHTMLAttributes } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/utils/cn";

/** Locks body scroll while a modal overlay is mounted. */
export function useScrollLock() {
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);
}

/* ---------------- Button ---------------- */

type ButtonVariant = "primary" | "lime" | "secondary" | "ghost" | "danger" | "dashed";
type ButtonSize = "sm" | "md" | "lg" | "icon";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
}

const buttonVariants: Record<ButtonVariant, string> = {
  primary: "bg-pine text-white hover:bg-pine-deep",
  lime: "bg-lime text-ink hover:bg-lime-deep",
  secondary: "bg-card border border-line text-ink hover:border-line-strong hover:bg-cream",
  ghost: "text-muted hover:text-ink hover:bg-cream-deep",
  danger: "bg-bad text-white hover:bg-[#b8462f]",
  dashed: "border border-dashed border-line-strong text-muted hover:text-pine hover:border-leaf/50 hover:bg-mint/50",
};

const buttonSizes: Record<ButtonSize, string> = {
  sm: "h-9 px-3.5 text-[13px] gap-1.5",
  md: "h-11 px-5 text-sm gap-2",
  lg: "h-[52px] px-6 text-[15px] gap-2",
  icon: "h-10 w-10",
};

export function Button({ variant = "primary", size = "md", loading, className, children, disabled, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex select-none items-center justify-center whitespace-nowrap rounded-xl font-semibold transition-all duration-150 active:scale-[0.975] disabled:pointer-events-none disabled:opacity-50",
        buttonVariants[variant],
        buttonSizes[size],
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? <Loader2 size={17} className="animate-spin" /> : children}
    </button>
  );
}

/* ---------------- Inputs ---------------- */

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(function Input({ className, ...props }, ref) {
  return (
    <input
      ref={ref}
      className={cn(
        "h-11 w-full rounded-xl border border-line bg-card px-3.5 text-[15px] text-ink outline-none transition-all placeholder:text-faint focus:border-leaf/60 focus:ring-[3px] focus:ring-leaf/15",
        className
      )}
      {...props}
    />
  );
});

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(function Textarea({ className, ...props }, ref) {
  return (
    <textarea
      ref={ref}
      className={cn(
        "w-full resize-none rounded-2xl border border-line bg-card px-4 py-3.5 text-[16px] leading-relaxed text-ink outline-none transition-all placeholder:text-faint focus:border-leaf/60 focus:ring-[3px] focus:ring-leaf/15",
        className
      )}
      {...props}
    />
  );
});

export function Field({ label, hint, error, children }: { label: string; hint?: string; error?: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[13px] font-semibold text-ink-soft">{label}</span>
      {children}
      {error ? (
        <span className="mt-1.5 block text-xs font-medium text-bad">{error}</span>
      ) : hint ? (
        <span className="mt-1.5 block text-xs text-muted">{hint}</span>
      ) : null}
    </label>
  );
}

/** Compact numeric field used in the meal editor. */
export function NumField({
  label,
  value,
  onChange,
  suffix,
  accent,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  suffix: string;
  accent?: boolean;
}) {
  return (
    <label className="block">
      <span className={cn("mb-1 block text-[10px] font-bold tracking-wide uppercase", accent ? "text-pine" : "text-faint")}>{label}</span>
      <div
        className={cn(
          "flex h-10 items-center rounded-lg border bg-card px-2 transition-all focus-within:border-leaf/60 focus-within:ring-[3px] focus-within:ring-leaf/15",
          accent ? "border-line-strong" : "border-line"
        )}
      >
        <input
          type="number"
          inputMode="numeric"
          min={0}
          max={5000}
          value={Number.isFinite(value) ? value : 0}
          onChange={(e) => {
            const v = Math.max(0, Math.min(5000, Math.round(Number(e.target.value) || 0)));
            onChange(v);
          }}
          className={cn("tnum w-full min-w-0 bg-transparent text-[14px] font-semibold text-ink outline-none", accent && "text-[15px]")}
        />
        <span className="shrink-0 pl-1 text-[11px] font-medium text-faint">{suffix}</span>
      </div>
    </label>
  );
}

/* ---------------- Segmented control ---------------- */

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="grid auto-cols-fr grid-flow-col gap-1 rounded-xl bg-cream-deep p-1">
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={cn(
            "h-10 rounded-lg text-sm font-semibold transition-all duration-150",
            value === opt.value ? "bg-card text-ink shadow-[0_2px_8px_-2px_rgba(23,34,28,0.18)]" : "text-muted hover:text-ink-soft"
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

/* ---------------- Badge ---------------- */

export function Badge({ children, tone = "default", className }: { children: ReactNode; tone?: "default" | "mint" | "lime" | "warn"; className?: string }) {
  const tones = {
    default: "bg-cream-deep text-muted",
    mint: "bg-mint text-leaf",
    lime: "bg-lime-soft text-[#5d7010]",
    warn: "bg-warn-soft text-warn",
  };
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold", tones[tone], className)}>
      {children}
    </span>
  );
}

/* ---------------- Confirm dialog ---------------- */

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  danger,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  danger?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  if (!open) return null;
  return <ConfirmDialogBody {...{ title, description, confirmLabel, cancelLabel, danger, onConfirm, onCancel }} />;
}

function ConfirmDialogBody({
  title,
  description,
  confirmLabel,
  cancelLabel,
  danger,
  onConfirm,
  onCancel,
}: Omit<Parameters<typeof ConfirmDialog>[0], "open">) {
  useScrollLock();
  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center p-4 sm:items-center" role="dialog" aria-modal="true">
      <div className="anim-fade absolute inset-0 bg-ink/40 backdrop-blur-[2px]" onClick={onCancel} />
      <div className="anim-pop mb-safe relative w-full max-w-[340px] rounded-2xl border border-line bg-card p-5 shadow-[0_24px_48px_-20px_rgba(23,34,28,0.35)]">
        <h3 className="font-display text-[17px] font-semibold">{title}</h3>
        <p className="mt-1.5 text-sm leading-relaxed text-muted">{description}</p>
        <div className="mt-5 flex gap-2">
          <Button variant="secondary" className="flex-1" onClick={onCancel}>
            {cancelLabel}
          </Button>
          <Button variant={danger ? "danger" : "primary"} className="flex-1" onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Misc ---------------- */

export function Splash() {
  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-cream">
      <div className="anim-breathe">
        <div className="flex h-16 w-16 items-center justify-center rounded-[22px] bg-pine">
          <LogoMark size={34} />
        </div>
      </div>
    </div>
  );
}

/** The 4-petal Kira spark mark (also mirrored in favicon.svg). */
export function LogoMark({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" aria-hidden>
      <g fill="#D9F45C">
        <path d="M32 12c2.6 0 4.7 2.1 4.7 4.7v7.1c0 1.2-.4 2.4-1.2 3.3a4.68 4.68 0 0 1-3.5 1.6 4.68 4.68 0 0 1-3.5-1.6 4.76 4.76 0 0 1-1.2-3.3v-7.1c0-2.6 2.1-4.7 4.7-4.7z" />
        <path d="M32 52c2.6 0 4.7-2.1 4.7-4.7v-7.1c0-1.2-.4-2.4-1.2-3.3a4.68 4.68 0 0 0-3.5-1.6 4.68 4.68 0 0 0-3.5 1.6 4.76 4.76 0 0 0-1.2 3.3v7.1c0 2.6 2.1 4.7 4.7 4.7z" />
        <path d="M12 32c0-2.6 2.1-4.7 4.7-4.7h7.1c1.2 0 2.4.4 3.3 1.2a4.68 4.68 0 0 1 1.6 3.5 4.68 4.68 0 0 1-1.6 3.5 4.76 4.76 0 0 1-3.3 1.2h-7.1c-2.6 0-4.7-2.1-4.7-4.7z" />
        <path d="M52 32c0-2.6-2.1-4.7-4.7-4.7h-7.1c-1.2 0-2.4.4-3.3 1.2a4.68 4.68 0 0 0-1.6 3.5 4.68 4.68 0 0 0 1.6 3.5 4.76 4.76 0 0 0 3.3 1.2h7.1c2.6 0 4.7-2.1 4.7-4.7z" />
      </g>
      <circle cx="32" cy="32" r="4.4" fill="#0C4A33" />
    </svg>
  );
}
