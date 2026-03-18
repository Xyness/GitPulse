import { fetchUserData } from "@/lib/github";
import { buildLanguageBreakdown, buildHeatmapData } from "@/lib/transforms";
import { WidgetView } from "./widget-view";

interface PageProps {
  params: Promise<{ username: string }>;
}

export default async function WidgetPage({ params }: PageProps) {
  const { username } = await params;

  let widgetData;
  let error: string | null = null;

  try {
    const user = await fetchUserData(username);
    const totalStars = user.repositories.nodes.reduce(
      (s, r) => s + r.stargazerCount,
      0
    );
    widgetData = {
      username: user.login,
      name: user.name,
      avatarUrl: user.avatarUrl,
      totalContributions:
        user.contributionsCollection.contributionCalendar.totalContributions,
      totalRepos: user.repositories.totalCount,
      totalStars,
      followers: user.followers.totalCount,
      topLanguages: buildLanguageBreakdown(user.repositories.nodes).slice(0, 5),
      heatmap: buildHeatmapData(user),
    };
  } catch {
    error = "Failed to load widget data.";
  }

  return (
    <html lang="en" className="dark">
      <body style={{ margin: 0, background: "#0a0e1a", color: "white", fontFamily: "Inter, system-ui, sans-serif" }}>
        {error ? (
          <div style={{ padding: 20, textAlign: "center", color: "#888" }}>
            {error}
          </div>
        ) : widgetData ? (
          <WidgetView data={widgetData} />
        ) : null}
      </body>
    </html>
  );
}
