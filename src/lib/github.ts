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
          isArchived
          isFork
        }
      }
      contributionsCollection {
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              date
              contributionCount
            }
          }
        }
        commitContributionsByRepository(maxRepositories: 100) {
          repository {
            name
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

/**
 * A missing login comes back as "Could not resolve to a User with the login of
 * x", which is true but not what you want on screen. Anything else is a real
 * failure and is worth showing verbatim, rate limits included.
 */
export function describeLookupError(error: unknown, notFound: string): string {
  if (!(error instanceof Error)) return "Something went wrong talking to GitHub.";
  return error.message.includes("Could not resolve") ? notFound : error.message;
}
