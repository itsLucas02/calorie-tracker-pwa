import { LogoMark } from "./ui";
import { cn } from "@/utils/cn";

export function Logo({ compact = false, size = "md" }: { compact?: boolean; size?: "sm" | "md" | "lg" }) {
  const dims = size === "sm" ? 30 : size === "lg" ? 44 : 36;
  const rx = size === "sm" ? "rounded-[10px]" : size === "lg" ? "rounded-[15px]" : "rounded-[12px]";
  return (
    <div className="flex items-center gap-2.5">
      <div className={cn("flex items-center justify-center bg-pine", rx)} style={{ width: dims, height: dims }}>
        <LogoMark size={Math.round(dims * 0.64)} />
      </div>
      {!compact && (
        <span className={cn("font-display font-semibold tracking-tight text-ink", size === "lg" ? "text-2xl" : "text-lg")}>
          Kira<span className="text-leaf">Cal</span>
        </span>
      )}
    </div>
  );
}
