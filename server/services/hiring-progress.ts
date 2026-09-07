import { Connection } from "../models/Connection";
import { ProfileView } from "../models/ProfileView";
import { Requirement } from "../models/Requirement";
import { User, type IUser } from "../models/User";

export type HiringStepId =
  | "browse"
  | "shortlist"
  | "trial"
  | "connect"
  | "firstSession";

export type HiringSteps = Record<HiringStepId, boolean>;

export type RequirementPitchSummary = {
  requirementId: string;
  subject: string;
  classLevel: string;
  area: string;
  pendingCount: number;
};

export type HiringProgress = {
  steps: HiringSteps;
  completedCount: number;
  totalSteps: number;
  pendingPitchCount: number;
  pitchSummaries: RequirementPitchSummary[];
};

const STEP_ORDER: HiringStepId[] = [
  "browse",
  "shortlist",
  "trial",
  "connect",
  "firstSession",
];

export async function computeHiringProgress(
  user: IUser,
): Promise<HiringProgress> {
  const parentId = user._id.toString();
  const pp = user.parentProfile;

  const [viewedProfile, connectionCount, acceptedCount, openRequirements] =
    await Promise.all([
      ProfileView.exists({ viewer: user._id }),
      Connection.countDocuments({ parent: user._id }),
      Connection.countDocuments({ parent: user._id, status: "accepted" }),
      Requirement.find({
        parent: user._id,
        status: "open",
        expiresAt: { $gt: new Date() },
      }).select("_id subject classLevel area"),
    ]);

  const pendingInterests = (await Connection.find({
    parent: user._id,
    requestedBy: "teacher",
    status: "pending",
    requirement: { $exists: true, $ne: null },
  }).select("requirement")) as { requirement?: { toString(): string } }[];

  const pendingByReq = new Map<string, number>();
  for (const c of pendingInterests) {
    const key = c.requirement?.toString();
    if (!key) continue;
    pendingByReq.set(key, (pendingByReq.get(key) ?? 0) + 1);
  }

  const pitchSummaries: RequirementPitchSummary[] = openRequirements
    .map((r) => {
      const id = r._id.toString();
      const pendingCount = pendingByReq.get(id) ?? 0;
      if (pendingCount === 0) return null;
      return {
        requirementId: id,
        subject: r.subject,
        classLevel: r.classLevel,
        area: r.area,
        pendingCount,
      };
    })
    .filter((row): row is RequirementPitchSummary => row !== null);

  const steps: HiringSteps = {
    browse: Boolean(
      viewedProfile || connectionCount > 0 || openRequirements.length > 0,
    ),
    shortlist: (pp?.shortlistedTeacherIds?.length ?? 0) > 0,
    trial: Boolean(pp?.trialLoggedAt),
    connect: acceptedCount > 0,
    firstSession: Boolean(pp?.firstSessionLoggedAt),
  };

  const completedCount = STEP_ORDER.filter((id) => steps[id]).length;

  return {
    steps,
    completedCount,
    totalSteps: STEP_ORDER.length,
    pendingPitchCount: pendingInterests.length,
    pitchSummaries,
  };
}

export async function markHiringStep(
  user: IUser,
  step: "trial" | "firstSession",
): Promise<IUser> {
  if (!user.parentProfile) {
    throw new Error("Parent profile required");
  }
  const now = new Date();
  if (step === "trial") {
    user.parentProfile.trialLoggedAt = now;
  } else {
    user.parentProfile.firstSessionLoggedAt = now;
  }
  user.markModified("parentProfile");
  await user.save();
  return user;
}
