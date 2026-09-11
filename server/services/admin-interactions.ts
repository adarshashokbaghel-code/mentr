import { UserInteraction } from "../models/UserInteraction";

export type AdminInteractionRow = {
  id: string;
  name: string;
  email: string;
  city: string;
  country: string;
  role: string;
  feedbackType: string;
  feedback: string;
  featureTitle?: string;
  featureDescription?: string;
  rating: number;
  review?: string;
  page: string;
  createdAt: string;
};

export async function listAdminInteractions(limit = 300) {
  const docs = await UserInteraction.find()
    .sort({ createdAt: -1 })
    .limit(Math.min(limit, 500))
    .lean();

  const rows: AdminInteractionRow[] = docs.map((d) => ({
    id: String(d._id),
    name: d.name,
    email: d.email,
    city: d.city,
    country: d.country,
    role: d.role,
    feedbackType: d.feedbackType,
    feedback: d.feedback,
    featureTitle: d.featureTitle,
    featureDescription: d.featureDescription,
    rating: d.rating,
    review: d.review,
    page: d.page,
    createdAt: d.createdAt.toISOString(),
  }));

  const byType: Record<string, number> = {};
  let ratingSum = 0;
  for (const row of rows) {
    byType[row.feedbackType] = (byType[row.feedbackType] || 0) + 1;
    ratingSum += row.rating;
  }

  return {
    rows,
    total: rows.length,
    averageRating: rows.length ? Math.round((ratingSum / rows.length) * 10) / 10 : 0,
    byType,
    fiveStars: rows.filter((r) => r.rating === 5).length,
    featureRequests: rows.filter((r) => r.featureTitle).length,
  };
}
