import { ImageResponse } from "@vercel/og";
import { type NextRequest } from "next/server";

export const runtime = "edge";

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
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0a0e1a",
          color: "white",
          fontFamily: "Inter, sans-serif",
        }}
      >
        {/* Background gradient */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              "radial-gradient(circle at 30% 50%, rgba(124, 58, 237, 0.15), transparent 60%), radial-gradient(circle at 70% 50%, rgba(236, 72, 153, 0.1), transparent 60%)",
            display: "flex",
          }}
        />

        {/* Content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "16px",
            zIndex: 1,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`https://github.com/${username}.png?size=120`}
            alt={`${username}'s avatar`}
            width={120}
            height={120}
            style={{ borderRadius: "50%", border: "3px solid rgba(124, 58, 237, 0.5)" }}
          />

          {/* Title */}
          <div
            style={{
              fontSize: 48,
              fontWeight: 800,
              display: "flex",
              gap: "8px",
            }}
          >
            <span>{username}</span>
          </div>

          {isWrapped ? (
            <div
              style={{
                fontSize: 28,
                fontWeight: 600,
                background: "linear-gradient(90deg, #a855f7, #ec4899)",
                backgroundClip: "text",
                color: "transparent",
                display: "flex",
              }}
            >
              GitHub Wrapped
            </div>
          ) : (
            <div
              style={{
                fontSize: 20,
                color: "rgba(255,255,255,0.6)",
                display: "flex",
              }}
            >
              Interactive GitHub Activity Visualization
            </div>
          )}

          {/* Branding */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginTop: "24px",
              fontSize: 18,
              color: "rgba(255,255,255,0.5)",
            }}
          >
            <span style={{ color: "#7c3aed", fontWeight: 700 }}>GitPulse</span>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
