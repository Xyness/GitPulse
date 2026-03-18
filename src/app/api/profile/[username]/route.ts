import { NextResponse, type NextRequest } from "next/server";
import { fetchUserData } from "@/lib/github";
import { transformUserData } from "@/lib/transforms";
import { getCachedProfile, setCachedProfile } from "@/lib/cache";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  const { username } = await params;

  try {
    const cached = getCachedProfile(username);
    if (cached) {
      const totalStars = cached.user.repositories.nodes.reduce(
        (s, r) => s + r.stargazerCount,
        0
      );
      const totalForks = cached.user.repositories.nodes.reduce(
        (s, r) => s + r.forkCount,
        0
      );
      return NextResponse.json({ data: cached, totalStars, totalForks });
    }

    const user = await fetchUserData(username);
    const data = transformUserData(user);
    setCachedProfile(username, data);

    const totalStars = user.repositories.nodes.reduce(
      (s, r) => s + r.stargazerCount,
      0
    );
    const totalForks = user.repositories.nodes.reduce(
      (s, r) => s + r.forkCount,
      0
    );

    return NextResponse.json({ data, totalStars, totalForks });
  } catch (e) {
    const message =
      e instanceof Error ? e.message : "Failed to fetch profile.";
    return NextResponse.json({ error: message }, { status: 404 });
  }
}
