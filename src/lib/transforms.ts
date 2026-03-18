import type {
  GitHubUser,
  GitHubRepo,
  ConstellationNode,
  ConstellationLink,
  HeatmapData,
  LanguageTimelineEntry,
  WrappedStats,
  ProfileData,
} from "./types";

export function buildConstellationNodes(repos: GitHubRepo[]): ConstellationNode[] {
  return repos
    .filter((r) => !r.isArchived)
    .map((repo) => ({
      id: repo.name,
      name: repo.name,
      stars: repo.stargazerCount,
      forks: repo.forkCount,
      commits: repo.defaultBranchRef?.target.history.totalCount ?? 0,
      language: repo.primaryLanguage?.name ?? "Unknown",
      languageColor: repo.primaryLanguage?.color ?? "#8b8b8b",
      description: repo.description,
      url: repo.url,
    }));
}

export function buildConstellationLinks(repos: GitHubRepo[]): ConstellationLink[] {
  const links: ConstellationLink[] = [];
  const languageGroups: Record<string, string[]> = {};

  for (const repo of repos) {
    if (repo.primaryLanguage) {
      const lang = repo.primaryLanguage.name;
      if (!languageGroups[lang]) languageGroups[lang] = [];
      languageGroups[lang].push(repo.name);
    }
  }

  for (const repos of Object.values(languageGroups)) {
    for (let i = 0; i < repos.length - 1; i++) {
      for (let j = i + 1; j < Math.min(repos.length, i + 3); j++) {
        links.push({
          source: repos[i],
          target: repos[j],
          strength: 0.3,
        });
      }
    }
  }

  return links;
}

export function buildHeatmapData(user: GitHubUser): HeatmapData[] {
  const days: HeatmapData[] = [];
  const allDays = user.contributionsCollection.contributionCalendar.weeks.flatMap(
    (w) => w.contributionDays
  );

  const maxCount = Math.max(...allDays.map((d) => d.contributionCount), 1);

  for (const day of allDays) {
    let level = 0;
    if (day.contributionCount > 0) {
      const ratio = day.contributionCount / maxCount;
      if (ratio <= 0.25) level = 1;
      else if (ratio <= 0.5) level = 2;
      else if (ratio <= 0.75) level = 3;
      else level = 4;
    }

    days.push({
      date: day.date,
      count: day.contributionCount,
      level,
    });
  }

  return days;
}

export function buildLanguageBreakdown(
  repos: GitHubRepo[]
): Array<{ name: string; color: string; percentage: number; bytes: number }> {
  const totals: Record<string, { bytes: number; color: string }> = {};

  for (const repo of repos) {
    for (const edge of repo.languages.edges) {
      const lang = edge.node.name;
      if (!totals[lang]) {
        totals[lang] = { bytes: 0, color: edge.node.color };
      }
      totals[lang].bytes += edge.size;
    }
  }

  const totalBytes = Object.values(totals).reduce((sum, l) => sum + l.bytes, 0);
  if (totalBytes === 0) return [];

  return Object.entries(totals)
    .map(([name, { bytes, color }]) => ({
      name,
      color,
      percentage: Math.round((bytes / totalBytes) * 1000) / 10,
      bytes,
    }))
    .sort((a, b) => b.bytes - a.bytes);
}

export function buildLanguageTimeline(repos: GitHubRepo[]): LanguageTimelineEntry[] {
  const monthlyData: Record<string, Record<string, number>> = {};

  for (const repo of repos) {
    const created = new Date(repo.createdAt);
    const key = `${created.getFullYear()}-${String(created.getMonth() + 1).padStart(2, "0")}`;

    if (!monthlyData[key]) monthlyData[key] = {};

    for (const edge of repo.languages.edges) {
      const lang = edge.node.name;
      monthlyData[key][lang] = (monthlyData[key][lang] ?? 0) + edge.size;
    }
  }

  return Object.entries(monthlyData)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, languages]) => ({ date, languages }));
}

function calculateLongestStreak(user: GitHubUser): number {
  const days = user.contributionsCollection.contributionCalendar.weeks.flatMap(
    (w) => w.contributionDays
  );

  let longest = 0;
  let current = 0;

  for (const day of days) {
    if (day.contributionCount > 0) {
      current++;
      longest = Math.max(longest, current);
    } else {
      current = 0;
    }
  }

  return longest;
}

function buildContributionsByMonth(
  user: GitHubUser
): Array<{ month: string; count: number }> {
  const months: Record<string, number> = {};

  for (const week of user.contributionsCollection.contributionCalendar.weeks) {
    for (const day of week.contributionDays) {
      const d = new Date(day.date);
      const key = d.toLocaleDateString("en-US", { month: "short" });
      months[key] = (months[key] ?? 0) + day.contributionCount;
    }
  }

  return Object.entries(months).map(([month, count]) => ({ month, count }));
}

export function buildWrappedStats(user: GitHubUser): WrappedStats {
  const repos = user.repositories.nodes;
  const langBreakdown = buildLanguageBreakdown(repos);
  const topLang = langBreakdown[0] ?? { name: "None", color: "#8b8b8b", percentage: 0 };

  const commitsByRepo = user.contributionsCollection.commitContributionsByRepository;
  const mostActive = commitsByRepo.reduce(
    (best, curr) =>
      curr.contributions.totalCount > best.commits
        ? { name: curr.repository.name, commits: curr.contributions.totalCount }
        : best,
    { name: "None", commits: 0 }
  );

  const totalStars = repos.reduce((sum, r) => sum + r.stargazerCount, 0);

  return {
    username: user.login,
    avatarUrl: user.avatarUrl,
    totalContributions:
      user.contributionsCollection.contributionCalendar.totalContributions,
    totalRepos: user.repositories.totalCount,
    totalStars,
    topLanguage: topLang,
    mostActiveRepo: mostActive,
    longestStreak: calculateLongestStreak(user),
    topRepos: repos.slice(0, 5).map((r) => ({
      name: r.name,
      stars: r.stargazerCount,
      language: r.primaryLanguage?.name ?? "Unknown",
      color: r.primaryLanguage?.color ?? "#8b8b8b",
    })),
    languageBreakdown: langBreakdown.slice(0, 8),
    contributionsByMonth: buildContributionsByMonth(user),
  };
}

export function transformUserData(user: GitHubUser): ProfileData {
  const repos = user.repositories.nodes;

  return {
    user,
    constellation: {
      nodes: buildConstellationNodes(repos),
      links: buildConstellationLinks(repos),
    },
    heatmap: buildHeatmapData(user),
    languageTimeline: buildLanguageTimeline(repos),
    languageBreakdown: buildLanguageBreakdown(repos),
    wrapped: buildWrappedStats(user),
  };
}
