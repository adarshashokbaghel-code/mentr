import { ProfileView } from "../models/ProfileView";
import { User } from "../models/User";

/** Bump the (teacher, viewer) row when a signed-in parent opens a tutor profile. */
export async function recordProfileView(teacherId: string, viewerId: string) {
  const viewer = await User.findById(viewerId);
  if (!viewer || viewer.role !== "parent" || !viewer.parentProfile?.name) {
    return;
  }
  await ProfileView.updateOne(
    { teacher: teacherId, viewer: viewerId },
    {
      $set: {
        viewerName: viewer.parentProfile.name,
        viewerArea:
          viewer.parentProfile.area || viewer.parentProfile.city || undefined,
        lastViewedAt: new Date(),
      },
      $inc: { count: 1 },
    },
    { upsert: true },
  );
}
