import type { ProfileData } from "./types";

const cache = new Map<string, { data: ProfileData; timestamp: number }>();
const CACHE_TTL = 10 * 60 * 1000; // 10 minutes

export function getCachedProfile(username: string): ProfileData | null {
  const key = username.toLowerCase();
  const entry = cache.get(key);

  if (!entry) return null;
  if (Date.now() - entry.timestamp > CACHE_TTL) {
    cache.delete(key);
    return null;
  }

  return entry.data;
}

export function setCachedProfile(username: string, data: ProfileData): void {
  const key = username.toLowerCase();
  cache.set(key, { data, timestamp: Date.now() });

  // Naive LRU-ish eviction. This lives in the module scope of a serverless
  // function, so it's per-instance and dies with the instance anyway.
  if (cache.size > 200) {
    const oldest = Array.from(cache.entries()).sort(
      (a, b) => a[1].timestamp - b[1].timestamp
    );
    for (let i = 0; i < 50; i++) {
      cache.delete(oldest[i][0]);
    }
  }
}
