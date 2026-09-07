import type { UserProfile } from "@/lib/types";

/**
 * Profile persistence seam.
 *
 * Production target: Supabase `profiles` table (RLS by user_id).
 * Swap `localProfileRepository` for a Supabase-backed implementation
 * with the same two methods — screens don't change.
 */
export interface ProfileRepository {
  get(userId: string): Promise<UserProfile | null>;
  save(profile: UserProfile): Promise<UserProfile>;
}

const keyFor = (userId: string) => `kiracal:v1:profile:${userId}`;

export const localProfileRepository: ProfileRepository = {
  async get(userId) {
    try {
      const raw = localStorage.getItem(keyFor(userId));
      return raw ? (JSON.parse(raw) as UserProfile) : null;
    } catch {
      return null;
    }
  },

  async save(profile) {
    localStorage.setItem(keyFor(profile.userId), JSON.stringify(profile));
    return profile;
  },
};
