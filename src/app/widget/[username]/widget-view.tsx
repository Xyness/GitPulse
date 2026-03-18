"use client";

import type { HeatmapData } from "@/lib/types";

interface WidgetData {
  username: string;
  name: string | null;
  avatarUrl: string;
  totalContributions: number;
  totalRepos: number;
  totalStars: number;
  followers: number;
  topLanguages: Array<{ name: string; color: string; percentage: number }>;
  heatmap: HeatmapData[];
}

export function WidgetView({ data }: { data: WidgetData }) {
  return (
    <div
      style={{
        padding: "16px",
        maxWidth: 400,
        borderRadius: 12,
        border: "1px solid #1e293b",
        background: "linear-gradient(135deg, #0f172a, #0a0e1a)",
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={data.avatarUrl}
          alt={data.username}
          width={40}
          height={40}
          style={{ borderRadius: "50%", border: "2px solid #7c3aed50" }}
        />
        <div>
          <div style={{ fontWeight: 600, fontSize: 14 }}>
            {data.name ?? data.username}
          </div>
          <div style={{ fontSize: 12, color: "#94a3b8" }}>
            @{data.username}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: 8,
          marginBottom: 12,
        }}
      >
        {[
          { label: "Contributions", value: data.totalContributions },
          { label: "Repos", value: data.totalRepos },
          { label: "Stars", value: data.totalStars },
        ].map((stat) => (
          <div
            key={stat.label}
            style={{
              textAlign: "center",
              padding: "8px 4px",
              borderRadius: 8,
              background: "#1e293b50",
            }}
          >
            <div style={{ fontSize: 18, fontWeight: 700 }}>
              {stat.value.toLocaleString()}
            </div>
            <div style={{ fontSize: 10, color: "#94a3b8" }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Languages */}
      <div style={{ marginBottom: 8 }}>
        <div
          style={{
            display: "flex",
            height: 6,
            borderRadius: 3,
            overflow: "hidden",
          }}
        >
          {data.topLanguages.map((lang) => (
            <div
              key={lang.name}
              style={{
                width: `${lang.percentage}%`,
                backgroundColor: lang.color,
              }}
            />
          ))}
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "4px 10px", marginTop: 6 }}>
          {data.topLanguages.map((lang) => (
            <span key={lang.name} style={{ fontSize: 10, color: "#94a3b8", display: "flex", alignItems: "center", gap: 3 }}>
              <span style={{ display: "inline-block", width: 7, height: 7, borderRadius: "50%", backgroundColor: lang.color }} />
              {lang.name} {lang.percentage}%
            </span>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div
        style={{
          textAlign: "center",
          fontSize: 10,
          color: "#64748b",
          marginTop: 8,
          paddingTop: 8,
          borderTop: "1px solid #1e293b",
        }}
      >
        Powered by GitPulse
      </div>
    </div>
  );
}
