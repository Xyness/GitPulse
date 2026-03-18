// ===== GitHub API Response Types =====

export interface GitHubUser {
  login: string;
  name: string | null;
  bio: string | null;
  avatarUrl: string;
  location: string | null;
  company: string | null;
  websiteUrl: string | null;
  twitterUsername: string | null;
  followers: { totalCount: number };
  following: { totalCount: number };
  repositories: {
    totalCount: number;
    nodes: GitHubRepo[];
  };
  contributionsCollection: {
    contributionCalendar: ContributionCalendar;
    totalCommitContributions: number;
    totalPullRequestContributions: number;
    totalIssueContributions: number;
    totalRepositoryContributions: number;
    commitContributionsByRepository: CommitContributionByRepo[];
  };
}

export interface GitHubRepo {
  name: string;
  description: string | null;
  url: string;
  stargazerCount: number;
  forkCount: number;
  primaryLanguage: { name: string; color: string } | null;
  languages: {
    edges: Array<{
      size: number;
      node: { name: string; color: string };
    }>;
  };
  defaultBranchRef: {
    target: {
      history: { totalCount: number };
    };
  } | null;
  createdAt: string;
  updatedAt: string;
  isArchived: boolean;
  isFork: boolean;
}

export interface ContributionCalendar {
  totalContributions: number;
  weeks: Array<{
    contributionDays: ContributionDay[];
  }>;
}

export interface ContributionDay {
  date: string;
  contributionCount: number;
  color: string;
}

export interface CommitContributionByRepo {
  repository: {
    name: string;
    primaryLanguage: { name: string; color: string } | null;
  };
  contributions: {
    totalCount: number;
  };
}

// ===== GitHub Organization Types =====

export interface GitHubOrg {
  login: string;
  name: string | null;
  description: string | null;
  avatarUrl: string;
  websiteUrl: string | null;
  membersWithRole: { totalCount: number };
  repositories: {
    totalCount: number;
    nodes: GitHubRepo[];
  };
}

// ===== Transformed Data Types (for visualizations) =====

export interface ConstellationNode {
  id: string;
  name: string;
  stars: number;
  forks: number;
  commits: number;
  language: string;
  languageColor: string;
  description: string | null;
  url: string;
}

export interface ConstellationLink {
  source: string;
  target: string;
  strength: number;
}

export interface HeatmapData {
  date: string;
  count: number;
  level: number; // 0-4
}

export interface LanguageTimelineEntry {
  date: string;
  languages: Record<string, number>;
}

export interface ActivityEvent {
  type: "commit" | "pr" | "issue" | "release" | "repo";
  date: string;
  title: string;
  repo: string;
  url?: string;
}

export interface WrappedStats {
  username: string;
  avatarUrl: string;
  totalContributions: number;
  totalRepos: number;
  totalStars: number;
  topLanguage: { name: string; color: string; percentage: number };
  mostActiveRepo: { name: string; commits: number };
  longestStreak: number;
  topRepos: Array<{ name: string; stars: number; language: string; color: string }>;
  languageBreakdown: Array<{ name: string; color: string; percentage: number }>;
  contributionsByMonth: Array<{ month: string; count: number }>;
}

export interface ProfileData {
  user: GitHubUser;
  constellation: {
    nodes: ConstellationNode[];
    links: ConstellationLink[];
  };
  heatmap: HeatmapData[];
  languageTimeline: LanguageTimelineEntry[];
  languageBreakdown: Array<{ name: string; color: string; percentage: number; bytes: number }>;
  wrapped: WrappedStats;
}
