import { graphql } from "@octokit/graphql";
import type { GitHubUser, GitHubOrg } from "./types";

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

const graphqlWithAuth = GITHUB_TOKEN
  ? graphql.defaults({
      headers: { authorization: `token ${GITHUB_TOKEN}` },
    })
  : graphql;

const USER_QUERY = `
  query UserProfile($login: String!) {
    user(login: $login) {
      login
      name
      bio
      avatarUrl
      location
      company
      websiteUrl
      twitterUsername
      followers { totalCount }
      following { totalCount }
      repositories(
        first: 100
        orderBy: { field: STARGAZERS, direction: DESC }
        ownerAffiliations: OWNER
        isFork: false
      ) {
        totalCount
        nodes {
          name
          description
          url
          stargazerCount
          forkCount
          primaryLanguage { name color }
          languages(first: 10, orderBy: { field: SIZE, direction: DESC }) {
            edges {
              size
              node { name color }
            }
          }
          defaultBranchRef {
            target {
              ... on Commit {
                history(first: 1) { totalCount }
              }
            }
          }
          createdAt
          updatedAt
          isArchived
          isFork
        }
      }
      contributionsCollection {
        totalCommitContributions
        totalPullRequestContributions
        totalIssueContributions
        totalRepositoryContributions
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              date
              contributionCount
              color
            }
          }
        }
        commitContributionsByRepository(maxRepositories: 100) {
          repository {
            name
            primaryLanguage { name color }
          }
          contributions {
            totalCount
          }
        }
      }
    }
  }
`;

const ORG_QUERY = `
  query OrgProfile($login: String!) {
    organization(login: $login) {
      login
      name
      description
      avatarUrl
      websiteUrl
      membersWithRole { totalCount }
      repositories(
        first: 100
        orderBy: { field: STARGAZERS, direction: DESC }
      ) {
        totalCount
        nodes {
          name
          description
          url
          stargazerCount
          forkCount
          primaryLanguage { name color }
          languages(first: 10, orderBy: { field: SIZE, direction: DESC }) {
            edges {
              size
              node { name color }
            }
          }
          defaultBranchRef {
            target {
              ... on Commit {
                history(first: 1) { totalCount }
              }
            }
          }
          createdAt
          updatedAt
          isArchived
          isFork
        }
      }
    }
  }
`;

export async function fetchUserData(username: string): Promise<GitHubUser> {
  const response = await graphqlWithAuth<{ user: GitHubUser }>(USER_QUERY, {
    login: username,
  });
  return response.user;
}

export async function fetchOrgData(name: string): Promise<GitHubOrg> {
  const response = await graphqlWithAuth<{ organization: GitHubOrg }>(
    ORG_QUERY,
    { login: name }
  );
  return response.organization;
}

export function getRateLimitInfo(): { authenticated: boolean; limit: number } {
  return {
    authenticated: !!GITHUB_TOKEN,
    limit: GITHUB_TOKEN ? 5000 : 60,
  };
}
