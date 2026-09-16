import { excludeDemoUsersFilter } from "../lib/demo-users";
import { User } from "../models/User";

export type LeaderboardRow = {
  userId: string;
  name: string;
  xp: number;
  you: boolean;
  rank: number;
};

type CacheEntry = {
  at: number;
  rows: Omit<LeaderboardRow, "you" | "rank">[];
};

const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes — keeps DB load low
let cache: CacheEntry | null = null;

function firstName(full: string | undefined | null): string {
  const t = (full || "").trim();
  if (!t) return "Explorer";
  return t.split(/\s+/)[0] || "Explorer";
}

async function loadTopRows(limit = 100): Promise<CacheEntry["rows"]> {
  const users = await User.find({
    ...excludeDemoUsersFilter,
    role: "parent",
    "learn.starter.status": "active",
    "learn.starter.track": "class-3-5",
  })
    .select("parentProfile.name learn.starter.progress.xp")
    .sort({ "learn.starter.progress.xp": -1, "learn.starter.enrolledAt": 1 })
    .limit(limit)
    .lean();

  return users.map((u) => ({
    userId: String(u._id),
    name: firstName(u.parentProfile?.name),
    xp: u.learn?.starter?.progress?.xp ?? 0,
  }));
}

export async function getLearnLeaderboard(userId: string, limit = 100) {
  const now = Date.now();
  if (!cache || now - cache.at > CACHE_TTL_MS) {
    cache = { at: now, rows: await loadTopRows(Math.max(limit, 100)) };
  }

  const rows = cache.rows.slice(0, limit);
  const board: LeaderboardRow[] = rows.map((r, i) => ({
    ...r,
    you: r.userId === userId,
    rank: i + 1,
  }));

  let yourRank = board.find((r) => r.you)?.rank ?? null;
  let yourXp = board.find((r) => r.you)?.xp ?? null;

  if (yourRank == null) {
    const me = await User.findById(userId)
      .select("parentProfile.name learn.starter.progress.xp learn.starter.status")
      .lean();
    if (me?.learn?.starter?.status === "active") {
      yourXp = me.learn.starter.progress?.xp ?? 0;
      const higher = await User.countDocuments({
        ...excludeDemoUsersFilter,
        role: "parent",
        "learn.starter.status": "active",
        "learn.starter.track": "class-3-5",
        "learn.starter.progress.xp": { $gt: yourXp },
      });
      yourRank = higher + 1;
      const xpValue = yourXp ?? 0;
      const rankValue = yourRank;
      // Ensure "you" appears if outside top N
      if (!board.some((r) => r.you)) {
        board.push({
          userId,
          name: firstName(me.parentProfile?.name),
          xp: xpValue,
          you: true,
          rank: rankValue,
        });
      }
    }
  }

  return {
    updatedAt: new Date(cache.at).toISOString(),
    cacheTtlSec: Math.round(CACHE_TTL_MS / 1000),
    totalShown: board.filter((r) => r.rank <= limit).length,
    yourRank,
    yourXp,
    rows: board.filter((r) => r.rank <= limit || r.you).slice(0, limit + 1),
  };
}

/** Invalidate after XP-changing writes so the earner sees themselves sooner. */
export function invalidateLearnLeaderboardCache() {
  cache = null;
}

export async function getYourLearnRank(userId: string): Promise<number | null> {
  const board = await getLearnLeaderboard(userId, 100);
  return board.yourRank;
}
