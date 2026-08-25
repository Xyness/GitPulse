import { fetchUserData } from "./github";
import { transformUserData } from "./transforms";
import { getCachedProfile, setCachedProfile } from "./cache";
import type { ProfileData } from "./types";

/** Cache first. Every route that wants a whole profile goes through here. */
export async function loadProfile(username: string): Promise<ProfileData> {
  const cached = getCachedProfile(username);
  if (cached) return cached;

  const data = transformUserData(await fetchUserData(username));
  setCachedProfile(username, data);
  return data;
}
