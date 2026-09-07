import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { CalendarDays, Gauge, LogOut, Plus, UserRound } from "lucide-react";
import { useSession } from "@/state/session";
import { Logo } from "@/components/Logo";
import { initialOf } from "@/lib/utils";
import { cn } from "@/utils/cn";

const NAV = [
  { to: "/app/today", label: "Today", icon: Gauge },
  { to: "/app/history", label: "History", icon: CalendarDays },
  { to: "/app/profile", label: "Profile", icon: UserRound },
];

/**
 * Mobile: a symmetric bottom tab bar — four equal slots, Log gets a
 * lime circle in the middle so alignment and touch targets stay even.
 * Desktop: compact sidebar; the app becomes a centered column.
 */
export function AppShell() {
  const { session, signOut } = useSession();
  const navigate = useNavigate();
  const location = useLocation();

  // Stacked screens (log flow, meal detail) own their full screen real estate.
  const isStackScreen = location.pathname.startsWith("/app/log") || location.pathname.startsWith("/app/meal");

  return (
    <div className="min-h-[100dvh] bg-cream">
      {/* ---- desktop sidebar ---- */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[240px] flex-col border-r border-line bg-card px-4 py-6 md:flex">
        <div className="px-2">
          <Logo />
        </div>
        <button
          onClick={() => navigate("/app/log")}
          className="mt-6 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-lime text-sm font-bold text-ink transition-colors hover:bg-lime-deep active:scale-[0.98]"
        >
          <Plus size={17} strokeWidth={2.8} />
          Log meal
        </button>
        <nav className="mt-5 space-y-0.5">
          {NAV.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                cn(
                  "flex h-10 items-center gap-3 rounded-lg px-3 text-sm font-semibold transition-colors",
                  isActive ? "bg-mint text-pine" : "text-muted hover:bg-cream-deep hover:text-ink"
                )
              }
            >
              <Icon size={17} strokeWidth={2.2} />
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="mt-auto flex items-center gap-2.5 rounded-xl bg-cream-deep/70 p-2.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-lime-soft text-[12px] font-bold text-pine">
            {initialOf(session?.user.name ?? "K")}
          </div>
          <div className="min-w-0 flex-1">
            <p className="clamp-1 text-[12.5px] font-semibold text-ink">{session?.user.name}</p>
            <p className="clamp-1 text-[10.5px] text-faint">Demo account</p>
          </div>
          <button
            onClick={() => void signOut()}
            title="Sign out"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-faint transition-colors hover:bg-bad-soft hover:text-bad"
          >
            <LogOut size={15} />
          </button>
        </div>
      </aside>

      {/* ---- content ---- */}
      <main className={cn("md:pl-[240px]", !isStackScreen && "pb-[calc(80px+env(safe-area-inset-bottom))] md:pb-10")}>
        <Outlet />
      </main>

      {/* ---- mobile bottom nav: 4 equal slots ---- */}
      {!isStackScreen && (
        <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-card pb-safe md:hidden">
          <div className="mx-auto flex h-[60px] max-w-lg">
            <MobileTab to="/app/today" label="Today" icon={Gauge} />
            <MobileTab to="/app/history" label="History" icon={CalendarDays} />
            <button onClick={() => navigate("/app/log")} className="flex h-full flex-1 flex-col items-center justify-center gap-[2px]">
              <span className="flex h-[26px] items-center justify-center">
                <span className="flex h-[30px] w-[30px] items-center justify-center rounded-full bg-lime text-pine transition-transform active:scale-90">
                  <Plus size={17} strokeWidth={2.8} />
                </span>
              </span>
              <span className="text-[10px] leading-none font-semibold text-pine">Log</span>
            </button>
            <MobileTab to="/app/profile" label="Profile" icon={UserRound} />
          </div>
        </nav>
      )}
    </div>
  );
}

function MobileTab({ to, label, icon: Icon }: { to: string; label: string; icon: typeof Gauge }) {
  return (
    <NavLink to={to} className="flex h-full flex-1 flex-col items-center justify-center gap-[2px]">
      {({ isActive }) => (
        <>
          <span className="flex h-[26px] items-center justify-center">
            <Icon size={21} strokeWidth={isActive ? 2.3 : 1.9} className={isActive ? "text-pine" : "text-faint"} />
          </span>
          <span className={cn("text-[10px] leading-none", isActive ? "font-bold text-pine" : "font-medium text-faint")}>{label}</span>
        </>
      )}
    </NavLink>
  );
}
