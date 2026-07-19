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
  createdAt: string;
  lastLoginAt?: string;
  referralUrl?: string;
  registrationSource?: string;
};

export type MessengerTemplateMeta = {
  id: string;
  label: string;
  description: string;
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

export function searchAdminUsers(key: string, q: string) {
  return adminFetch<{ users: AdminUserRow[] }>(
    key,
    `/api/admin/users/search?q=${encodeURIComponent(q)}`,
  );
}

export function fetchAdminUsers(key: string, q = "") {
  return adminFetch<{ users: AdminUserRow[]; total: number }>(
    key,
    `/api/admin/users?q=${encodeURIComponent(q)}&limit=1000`,
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
  payload: { templateId: string; name?: string; referralUrl?: string },
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
