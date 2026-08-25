interface WidgetData {
  username: string;
  name: string | null;
  avatarUrl: string;
  totalContributions: number;
  totalRepos: number;
  totalStars: number;
  topLanguages: Array<{ name: string; color: string; percentage: number }>;
}

// No Tailwind in here: the widget renders inside someone else's iframe with no
// global stylesheet, so everything is inline.
const border = "#30363d";
const surface = "#161b22";
const muted = "#8b949e";

export function WidgetView({ data }: { data: WidgetData }) {
  const stats = [
    { label: "Contributions", value: data.totalContributions },
    { label: "Repos", value: data.totalRepos },
    { label: "Stars", value: data.totalStars },
  ];

  return (
    <div
      style={{
        padding: 16,
        maxWidth: 400,
        borderRadius: 6,
        border: `1px solid ${border}`,
        background: "#0d1117",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={data.avatarUrl}
          alt=""
          width={40}
          height={40}
          style={{ borderRadius: "50%", border: `1px solid ${border}` }}
        />
        <div>
          <div style={{ fontWeight: 600, fontSize: 14 }}>
            {data.name ?? data.username}
          </div>
          <div style={{ fontSize: 12, color: muted }}>@{data.username}</div>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 8,
          marginBottom: 12,
        }}
      >
        {stats.map((stat) => (
          <div
            key={stat.label}
            style={{
              textAlign: "center",
              padding: "8px 4px",
              borderRadius: 6,
              background: surface,
              border: `1px solid ${border}`,
            }}
          >
            <div style={{ fontSize: 18, fontWeight: 600, fontVariantNumeric: "tabular-nums" }}>
              {stat.value.toLocaleString()}
            </div>
            <div style={{ fontSize: 10, color: muted }}>{stat.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", height: 6, borderRadius: 3, overflow: "hidden" }}>
        {data.topLanguages.map((lang) => (
          <div
            key={lang.name}
            style={{ width: `${lang.percentage}%`, backgroundColor: lang.color }}
          />
        ))}
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "4px 10px", marginTop: 6 }}>
        {data.topLanguages.map((lang) => (
          <span
            key={lang.name}
            style={{ fontSize: 10, color: muted, display: "flex", alignItems: "center", gap: 3 }}
          >
            <span
              style={{
                display: "inline-block",
                width: 7,
                height: 7,
                borderRadius: "50%",
                backgroundColor: lang.color,
              }}
            />
            {lang.name} {lang.percentage}%
          </span>
        ))}
      </div>

      <div
        style={{
          textAlign: "center",
          fontSize: 10,
          marginTop: 12,
          paddingTop: 8,
          borderTop: `1px solid ${border}`,
        }}
      >
        <a
          href={`/${data.username}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: muted, textDecoration: "none" }}
        >
          GitPulse
        </a>
      </div>
    </div>
  );
}
