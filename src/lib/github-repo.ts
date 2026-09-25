/**
 * Live GitHub stats for the public Mentr repo (open-source landing).
 * Uses the public REST API. Optional GITHUB_TOKEN raises rate limits (60 → 5k/hr).
 */

import { GITHUB_REPO_URL } from "@/lib/seo";

export const GITHUB_OWNER = "adarshashokbaghel-code";
export const GITHUB_REPO = "mentr";

/** UI-only overrides — hide specific GitHub logins from public display. */
const GITHUB_DISPLAY_OVERRIDES: Record<
  string,
  { displayName: string; linkable: boolean }
> = {
  "adarshs-ui": { displayName: "maintainer", linkable: false },
};

export function resolveGithubDisplay(login: string): {
  displayName: string;
  linkable: boolean;
} {
  const override = GITHUB_DISPLAY_OVERRIDES[login.toLowerCase()];
  if (override) return override;
  return { displayName: login, linkable: true };
}

export type GithubContributor = {
  login: string;
  displayName: string;
  linkable: boolean;
  avatarUrl: string;
  profileUrl: string;
  /** Commit count from GitHub contributors API */
  contributions: number;
  /** Merged PR count derived from search results */
  mergedPrs: number;
  rank: number;
  isCreator: boolean;
};

export type GithubMergedPr = {
  number: number;
  title: string;
  url: string;
  mergedAt: string;
  authorLogin: string;
  authorDisplayName: string;
  authorLinkable: boolean;
  authorUrl: string;
  authorAvatarUrl?: string;
};

export type GithubRepoStats = {
  fullName: string;
  url: string;
  description: string | null;
  stars: number;
  forks: number;
  openIssues: number;
  watchers: number;
  pushedAt: string | null;
  license: string | null;
  creator: {
    login: string;
    avatarUrl: string;
    profileUrl: string;
  };
  contributors: GithubContributor[];
  contributorCount: number;
  totalCommits: number;
  mergedPrCount: number;
  lastMergedPr: GithubMergedPr | null;
  recentMergedPrs: GithubMergedPr[];
  fetchedAt: string;
};

/** @deprecated use GithubMergedPr */
export type GithubLastMergedPr = GithubMergedPr;

function githubHeaders(): HeadersInit {
  const headers: HeadersInit = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "mentr-open-source-page",
  };
  const token = process.env.GITHUB_TOKEN?.trim();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
}

async function githubGet<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`https://api.github.com${path}`, {
      headers: githubHeaders(),
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

function formatRelativeTime(iso: string): string {
  const then = Date.parse(iso);
  if (!Number.isFinite(then)) return iso;
  const diffSec = Math.round((Date.now() - then) / 1000);
  const abs = Math.abs(diffSec);
  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
  if (abs < 60) return rtf.format(-diffSec, "second");
  if (abs < 3600) return rtf.format(-Math.round(diffSec / 60), "minute");
  if (abs < 86400) return rtf.format(-Math.round(diffSec / 3600), "hour");
  if (abs < 86400 * 30) return rtf.format(-Math.round(diffSec / 86400), "day");
  if (abs < 86400 * 365)
    return rtf.format(-Math.round(diffSec / (86400 * 30)), "month");
  return rtf.format(-Math.round(diffSec / (86400 * 365)), "year");
}

export function formatGithubRelativeTime(
  iso: string | null | undefined,
): string {
  if (!iso) return "—";
  return formatRelativeTime(iso);
}

type RepoPayload = {
  full_name: string;
  html_url: string;
  description: string | null;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  subscribers_count?: number;
  pushed_at: string | null;
  license: { spdx_id?: string | null } | null;
  owner: {
    login: string;
    avatar_url: string;
    html_url: string;
  };
};

type ContributorPayload = {
  login: string;
  avatar_url: string;
  html_url: string;
  contributions: number;
};

type SearchPayload = {
  total_count: number;
  items: Array<{
    number: number;
    title: string;
    html_url: string;
    closed_at: string | null;
    pull_request?: { merged_at?: string | null };
    user: {
      login: string;
      html_url: string;
      avatar_url?: string;
    } | null;
  }>;
};

function mapPr(
  item: SearchPayload["items"][number],
  fallbackIso: string,
): GithubMergedPr {
  const authorLogin = item.user?.login ?? "unknown";
  const display = resolveGithubDisplay(authorLogin);
  return {
    number: item.number,
    title: item.title,
    url: item.html_url,
    mergedAt:
      item.pull_request?.merged_at || item.closed_at || fallbackIso,
    authorLogin,
    authorDisplayName: display.displayName,
    authorLinkable: display.linkable,
    authorUrl: item.user?.html_url ?? GITHUB_REPO_URL,
    authorAvatarUrl: item.user?.avatar_url,
  };
}

/** Server-only fetch of public repo activity for /open-source. */
export async function fetchGithubRepoStats(): Promise<GithubRepoStats | null> {
  const [repo, contributors, mergedSearch] = await Promise.all([
    githubGet<RepoPayload>(`/repos/${GITHUB_OWNER}/${GITHUB_REPO}`),
    githubGet<ContributorPayload[]>(
      `/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contributors?per_page=30&anon=false`,
    ),
    githubGet<SearchPayload>(
      `/search/issues?q=${encodeURIComponent(
        `repo:${GITHUB_OWNER}/${GITHUB_REPO} is:pr is:merged`,
      )}&sort=updated&order=desc&per_page=100`,
    ),
  ]);

  if (!repo) return null;

  const fallbackIso = repo.pushed_at || new Date().toISOString();
  const mergedItems = mergedSearch?.items ?? [];
  const prsByAuthor = new Map<string, number>();
  for (const item of mergedItems) {
    const login = item.user?.login;
    if (!login) continue;
    prsByAuthor.set(login, (prsByAuthor.get(login) ?? 0) + 1);
  }

  const creatorLogin = repo.owner.login;
  const contributorList = Array.isArray(contributors) ? contributors : [];
  const ranked = [...contributorList]
    .sort((a, b) => b.contributions - a.contributions)
    .map((c, index) => {
      const display = resolveGithubDisplay(c.login);
      return {
        login: c.login,
        displayName: display.displayName,
        linkable: display.linkable,
        avatarUrl: c.avatar_url,
        profileUrl: c.html_url,
        contributions: c.contributions,
        mergedPrs: prsByAuthor.get(c.login) ?? 0,
        rank: index + 1,
        isCreator: c.login.toLowerCase() === creatorLogin.toLowerCase(),
      };
    });

  const recentMergedPrs = mergedItems.slice(0, 8).map((item) =>
    mapPr(item, fallbackIso),
  );
  const lastMergedPr = recentMergedPrs[0] ?? null;

  return {
    fullName: repo.full_name,
    url: repo.html_url || GITHUB_REPO_URL,
    description: repo.description,
    stars: repo.stargazers_count ?? 0,
    forks: repo.forks_count ?? 0,
    openIssues: repo.open_issues_count ?? 0,
    watchers: repo.subscribers_count ?? 0,
    pushedAt: repo.pushed_at,
    license: repo.license?.spdx_id ?? "MIT",
    creator: {
      login: repo.owner.login,
      avatarUrl: repo.owner.avatar_url,
      profileUrl: repo.owner.html_url,
    },
    contributors: ranked,
    contributorCount: ranked.length,
    totalCommits: ranked.reduce((sum, c) => sum + c.contributions, 0),
    mergedPrCount: mergedSearch?.total_count ?? mergedItems.length,
    lastMergedPr,
    recentMergedPrs,
    fetchedAt: new Date().toISOString(),
  };
}
