export type AdminStats = {
  generatedAt: string;
  users: {
    total: number;
    parents: number;
    faculty: number;
    verified: number;
    facultyLive: number;
    parentsComplete: number;
    newLast7Days: number;
    activeLast30Days: number;
  };
  connections: {
    total: number;
    pending: number;
    accepted: number;
    declined: number;
    parentInitiated: number;
    teacherInitiated: number;
    acceptanceRate: number;
  };
  requirements: {
    total: number;
    open: number;
    closed: number;
    expired: number;
    totalInterests: number;
    avgInterestsPerPost: number;
    topSubjects: { subject: string; count: number }[];
  };
  engagement: {
    profileViews: number;
    teachersViewed: number;
    otpSessions24h: number;
  };
  supply: {
    facultyByCity: { city: string; count: number }[];
    topSubjects: { subject: string; count: number }[];
  };
};

export async function fetchAdminStats(key: string): Promise<AdminStats> {
  const res = await fetch(`/api/admin/stats?key=${encodeURIComponent(key)}`, {
    cache: "no-store",
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(
      (body as { error?: string }).error || `Request failed (${res.status})`,
    );
  }
  return res.json() as Promise<AdminStats>;
}
