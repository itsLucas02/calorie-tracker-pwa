import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Session } from "@/lib/types";
import { authService } from "@/services";

interface SessionState {
  status: "loading" | "ready";
  session: Session | null;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const SessionContext = createContext<SessionState | null>(null);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<SessionState["status"]>("loading");
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    let alive = true;
    authService.getSession().then((s) => {
      if (!alive) return;
      setSession(s);
      setStatus("ready");
    });
    return () => {
      alive = false;
    };
  }, []);

  const signInWithGoogle = useCallback(async () => {
    const s = await authService.signInWithGoogle();
    setSession(s);
  }, []);

  const signOut = useCallback(async () => {
    await authService.signOut();
    setSession(null);
  }, []);

  const value = useMemo(
    () => ({ status, session, signInWithGoogle, signOut }),
    [status, session, signInWithGoogle, signOut]
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession(): SessionState {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error("useSession must be used within SessionProvider");
  return ctx;
}
