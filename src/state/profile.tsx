import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { UserProfile } from "@/lib/types";
import { profileRepository } from "@/services";
import { useSession } from "./session";

interface ProfileState {
  status: "loading" | "ready";
  profile: UserProfile | null;
  saveProfile: (profile: UserProfile) => Promise<void>;
}

const ProfileContext = createContext<ProfileState | null>(null);

export function ProfileProvider({ children }: { children: ReactNode }) {
  const { session, status: sessionStatus } = useSession();
  const userId = session?.user.id ?? null;
  const [status, setStatus] = useState<ProfileState["status"]>("loading");
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    if (sessionStatus !== "ready") return;
    if (!userId) {
      setProfile(null);
      setStatus("ready");
      return;
    }
    let alive = true;
    setStatus("loading");
    profileRepository.get(userId).then((p) => {
      if (!alive) return;
      setProfile(p);
      setStatus("ready");
    });
    return () => {
      alive = false;
    };
  }, [userId, sessionStatus]);

  const saveProfile = useCallback(async (p: UserProfile) => {
    await profileRepository.save(p);
    setProfile(p);
  }, []);

  const value = useMemo(() => ({ status, profile, saveProfile }), [status, profile, saveProfile]);

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
}

export function useProfile(): ProfileState {
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error("useProfile must be used within ProfileProvider");
  return ctx;
}
