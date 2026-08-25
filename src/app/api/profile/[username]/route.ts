import { NextResponse, type NextRequest } from "next/server";
import { loadProfile } from "@/lib/profile";
import { countStars } from "@/lib/transforms";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  const { username } = await params;

  try {
    const data = await loadProfile(username);
    return NextResponse.json({
      data,
      totalStars: countStars(data.user.repositories.nodes),
    });
  } catch (e) {
    const message =
      e instanceof Error ? e.message : "That profile would not load.";
    return NextResponse.json({ error: message }, { status: 404 });
  }
}
