/** Top-level contact form modes — one visible block at a time */
export const CONTACT_KINDS = [
  {
    id: "feedback",
    label: "Feedback",
    hint: "What worked, what didn’t, or what felt confusing.",
  },
  {
    id: "feature",
    label: "Feature request",
    hint: "Tell us what to build next — title and description.",
  },
  {
    id: "review",
    label: "Review",
    hint: "Rate Mentr 1–5 stars and leave a short note.",
  },
] as const;

export type ContactKindId = (typeof CONTACT_KINDS)[number]["id"];

export const FEEDBACK_TYPES = [
  { id: "general", label: "General feedback" },
  { id: "feature", label: "Feature request" },
  { id: "bug", label: "Something is broken" },
  { id: "review", label: "Leave a review" },
  { id: "parent-help", label: "I need help finding a tutor" },
  { id: "tutor-help", label: "I need help listing as a tutor" },
  { id: "partnership", label: "Partnership or press" },
  { id: "safety", label: "Report a safety concern" },
] as const;

export type FeedbackTypeId = (typeof FEEDBACK_TYPES)[number]["id"];

export const INTERACTION_ROLES = [
  { id: "parent", label: "Parent / guardian" },
  { id: "tutor", label: "Tutor / mentor" },
  { id: "student", label: "Student" },
  { id: "other", label: "Other" },
] as const;

export type InteractionRoleId = (typeof INTERACTION_ROLES)[number]["id"];

export const INTERACTION_CITIES = [
  "Bengaluru",
  "Hyderabad",
  "Delhi",
  "Chennai",
  "Mumbai",
  "Pune",
  "Kolkata",
  "Dubai",
  "Abu Dhabi",
  "Other — India",
  "Other — worldwide",
] as const;

export function feedbackTypeLabel(id: string): string {
  return FEEDBACK_TYPES.find((t) => t.id === id)?.label ?? id;
}

export function interactionRoleLabel(id: string): string {
  return INTERACTION_ROLES.find((t) => t.id === id)?.label ?? id;
}
