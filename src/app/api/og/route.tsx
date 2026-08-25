import { ImageResponse } from "@vercel/og";
import { type NextRequest } from "next/server";

export const runtime = "edge";

const BACKGROUND = "#0d1117";
const BORDER = "#30363d";
const MUTED = "#8b949e";
const BLUE = "#58a6ff";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const username = searchParams.get("username") ?? "unknown";
  const isWrapped = searchParams.get("wrapped") === "true";

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          backgroundColor: BACKGROUND,
          color: "#e6edf3",
          fontFamily: "Inter, sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 40 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`https://github.com/${username}.png?size=200`}
            alt=""
            width={180}
            height={180}
            style={{ borderRadius: "50%", border: `2px solid ${BORDER}` }}
          />
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ fontSize: 68, fontWeight: 600, lineHeight: 1 }}>
              {username}
            </div>
            <div style={{ fontSize: 30, color: MUTED }}>
              {isWrapped
                ? "GitHub Wrapped"
                : "Contributions, languages and every repo"}
            </div>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            paddingTop: 28,
            borderTop: `1px solid ${BORDER}`,
            fontSize: 24,
          }}
        >
          <span style={{ color: BLUE, fontWeight: 600 }}>GitPulse</span>
          <span style={{ color: MUTED }}>public data only, no login</span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
