import { fetchUserData } from "@/lib/github";
import { buildLanguageBreakdown, countStars } from "@/lib/transforms";
import { WidgetView } from "./widget-view";

interface PageProps {
  params: Promise<{ username: string }>;
}

export default async function WidgetPage({ params }: PageProps) {
  const { username } = await params;

  let widgetData;

  try {
    const user = await fetchUserData(username);
    widgetData = {
      username: user.login,
      name: user.name,
      avatarUrl: user.avatarUrl,
      totalContributions:
        user.contributionsCollection.contributionCalendar.totalContributions,
      totalRepos: user.repositories.totalCount,
      totalStars: countStars(user.repositories.nodes),
      topLanguages: buildLanguageBreakdown(user.repositories.nodes).slice(0, 5),
    };
  } catch {
    widgetData = null;
  }

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          colorScheme: "dark",
          background: "#0d1117",
          color: "#e6edf3",
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif',
        }}
      >
        {widgetData ? (
          <WidgetView data={widgetData} />
        ) : (
          <p style={{ padding: 20, textAlign: "center", color: "#8b949e" }}>
            No GitHub user called &quot;{username}&quot;.
          </p>
        )}
      </body>
    </html>
  );
}
