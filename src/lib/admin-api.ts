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

const BACKEND_PORT = process.env.NEXT_PUBLIC_BACKEND_PORT || "5000";

/** In local dev, call Express directly — Next's rewrite proxy can drop long POSTs (email send). */
function adminApiOrigin(): string {
  if (typeof window === "undefined") return "";
  const host = window.location.hostname;
  if (host === "localhost" || host === "127.0.0.1") {
    return `http://${host}:${BACKEND_PORT}`;
  }
  return "";
}

function adminUrl(path: string, key: string): string {
  const sep = path.includes("?") ? "&" : "?";
  return `${adminApiOrigin()}${path}${sep}key=${encodeURIComponent(key)}`;
}

export async function fetchAdminStats(key: string): Promise<AdminStats> {
  const res = await fetch(adminUrl("/api/admin/stats", key), { cache: "no-store" });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(
      (body as { error?: string }).error || `Request failed (${res.status})`,
    );
  }
  return res.json() as Promise<AdminStats>;
}

function adminFetch<T>(key: string, path: string, init?: RequestInit): Promise<T> {
  return fetch(adminUrl(path, key), {
    cache: "no-store",
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
  }).then(async (res) => {
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(
        (body as { error?: string }).error || `Request failed (${res.status})`,
      );
    }
    return res.json() as Promise<T>;
  });
}

export type AdminUserRow = {
  id: string;
  email: string;
  name: string;
  role: string;
  profileComplete: boolean;
  emailVerified: boolean;
  city: string;
  area: string;
  country: string;
  phone?: string;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
  referralUrl?: string;
  registrationSource?: string;
  faculty?: {
    designation: string;
    bio: string;
    subjects: string[];
    levels: string[];
    languages: string[];
    qualification: string;
    experienceYears: number;
    teachingModes: string[];
    hourlyRate?: number;
    workplace?: string;
    gender?: string;
    certifications: string[];
    achievements: string[];
    timezone: string;
    availabilitySlots: number;
  };
  parent?: {
    phoneNumber: string;
    area?: string;
    country: string;
    city: string;
  };
};

export type MessengerTemplateMeta = {
  id: string;
  label: string;
  description: string;
  audience: "faculty" | "parent";
};

export type MessengerPreview = {
  subject: string;
  html: string;
  text: string;
};

export type MessengerSendResult = {
  sent: number;
  failed: number;
  results: {
    userId: string;
    email: string;
    ok: boolean;
    error?: string;
    referralUrl?: string;
  }[];
};

export function searchAdminUsers(
  key: string,
  q: string,
  role?: "faculty" | "parent",
) {
  const params = new URLSearchParams({ q });
  if (role) params.set("role", role);
  if (role === "parent") params.set("limit", "200");
  return adminFetch<{ users: AdminUserRow[] }>(
    key,
    `/api/admin/users/search?${params.toString()}`,
  );
}

export function fetchAdminUsers(key: string, q = "") {
  return adminFetch<{ users: AdminUserRow[]; total: number }>(
    key,
    `/api/admin/users?q=${encodeURIComponent(q)}&limit=1000`,
  );
}

export type AdminConnectionRow = {
  id: string;
  parentName: string;
  parentEmail: string;
  teacherName: string;
  teacherEmail: string;
  status: string;
  requestedBy: string;
  message: string;
  createdAt: string;
  respondedAt?: string;
};

export type AdminRequirementRow = {
  id: string;
  subject: string;
  classLevel: string;
  city: string;
  area: string;
  status: string;
  interestCount: number;
  parentEmail: string;
  details: string;
  expiresAt: string;
  createdAt: string;
};

export function fetchAdminConnections(key: string) {
  return adminFetch<{ connections: AdminConnectionRow[]; total: number }>(
    key,
    "/api/admin/connections?limit=500",
  );
}

export function fetchAdminRequirements(key: string) {
  return adminFetch<{ posts: AdminRequirementRow[]; total: number }>(
    key,
    "/api/admin/requirements?limit=500",
  );
}

export type AdminProfileViewRow = {
  id: string;
  teacherName: string;
  teacherEmail: string;
  viewerName: string;
  viewerEmail: string;
  viewerArea?: string;
  count: number;
  lastViewedAt: string;
};

export type AdminOtpRow = {
  id: string;
  email: string;
  purpose: string;
  role: string;
  consumed: boolean;
  attempts: number;
  createdAt: string;
};

export function fetchAdminProfileViews(key: string) {
  return adminFetch<{ views: AdminProfileViewRow[]; total: number }>(
    key,
    "/api/admin/engagement/profile-views?limit=500",
  );
}

export function fetchAdminOtpActivity(key: string) {
  return adminFetch<{ sessions: AdminOtpRow[]; total: number }>(
    key,
    "/api/admin/engagement/otp?limit=150",
  );
}

export function fetchMessengerTemplates(key: string) {
  return adminFetch<{ templates: MessengerTemplateMeta[] }>(
    key,
    "/api/admin/messenger/templates",
  );
}

export function previewMessengerEmail(
  key: string,
  payload: {
    templateId: string;
    name?: string;
    referralUrl?: string;
    role?: "faculty" | "parent";
  },
) {
  return adminFetch<MessengerPreview>(key, "/api/admin/messenger/preview", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function sendMessengerEmails(
  key: string,
  payload: { templateId: string; userIds: string[] },
) {
  return adminFetch<MessengerSendResult>(key, "/api/admin/messenger/send", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
