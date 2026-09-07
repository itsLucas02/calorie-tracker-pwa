import type { Session } from "@/lib/types";

/**
 * Auth seam.
 *
 * Production target: Supabase Auth with Google OAuth.
 * Replace `mockAuthService` with a `SupabaseAuthService`
 * implementing the same three methods — screens don't change.
 */
export interface AuthService {
  getSession(): Promise<Session | null>;
  signInWithGoogle(): Promise<Session>;
  signOut(): Promise<void>;
}

const SESSION_KEY = "kiracal:v1:session";
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** Local demo auth — no real OAuth here by design. */
export const mockAuthService: AuthService = {
  async getSession() {
    await sleep(120);
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      return raw ? (JSON.parse(raw) as Session) : null;
    } catch {
      return null;
    }
  },

  async signInWithGoogle() {
    await sleep(700); // simulate the OAuth round-trip
    const session: Session = {
      user: {
        id: "demo-user-01",
        email: "aina.demo@kiracal.app",
        name: "Aina Rahman",
      },
      accessToken: `demo-token-${Math.random().toString(36).slice(2)}`,
      createdAt: new Date().toISOString(),
    };
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    return session;
  },

  async signOut() {
    await sleep(150);
    localStorage.removeItem(SESSION_KEY);
  },
};
