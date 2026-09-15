import mongoose from "mongoose";
import { isDemoUserEmail } from "../lib/demo-users";
import { Connection } from "../models/Connection";
import { Notification } from "../models/Notification";
import { OtpSession } from "../models/OtpSession";
import { ProfileView } from "../models/ProfileView";
import { Requirement } from "../models/Requirement";
import { User } from "../models/User";
import { UserInteraction } from "../models/UserInteraction";
import { removeMentorProfileImage } from "./mentor-profile-image";

export const DELETED_USER_LABEL = "Deleted user";

export type AdminDeleteUserResult = {
  id: string;
  email: string;
  role: string;
  deleted: {
    user: boolean;
    connectionsAnonymized: number;
    connectionsRemoved: number;
    requirements: number;
    profileViews: number;
    notifications: number;
    otpSessions: number;
    interactions: number;
    shortlistPulls: number;
    profileImage: boolean;
  };
};

/**
 * Permanently remove a user and related private data.
 * Connection history kept for the other party is anonymized to "Deleted user".
 */
export async function deleteAdminUser(
  userId: string,
): Promise<AdminDeleteUserResult | { error: string; status: number }> {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return { error: "Invalid user id", status: 400 };
  }

  const user = await User.findById(userId);
  if (!user) {
    return { error: "User not found", status: 404 };
  }
  if (isDemoUserEmail(user.email)) {
    return { error: "Demo accounts cannot be deleted", status: 400 };
  }

  const oid = user._id;
  const email = user.email;
  const role = user.role;
  const profileImagePath = user.profileImagePath;

  // Anonymize denormalized names on connections the other party still sees
  const [asParent, asTeacher] = await Promise.all([
    Connection.updateMany(
      { parent: oid },
      {
        $set: {
          parentName: DELETED_USER_LABEL,
          parentArea: "",
          status: "declined",
          respondedAt: new Date(),
        },
      },
    ),
    Connection.updateMany(
      { teacher: oid },
      {
        $set: {
          teacherName: DELETED_USER_LABEL,
          teacherArea: "",
          status: "declined",
          respondedAt: new Date(),
        },
      },
    ),
  ]);

  // Remove orphan connection rows where BOTH sides would be useless
  // (pending-only cleanup already declined above). Keep history for the
  // surviving party so their UI can show "Deleted user".
  const connectionsAnonymized =
    (asParent.modifiedCount ?? 0) + (asTeacher.modifiedCount ?? 0);

  const [
    reqDel,
    viewsDel,
    notifDel,
    otpDel,
    interactionDel,
    shortlistPull,
  ] = await Promise.all([
    Requirement.deleteMany({ parent: oid }),
    ProfileView.deleteMany({
      $or: [{ teacher: oid }, { viewer: oid }],
    }),
    Notification.deleteMany({ user: oid }),
    OtpSession.deleteMany({ email }),
    UserInteraction.deleteMany({ email }),
    User.updateMany(
      { "parentProfile.shortlistedTeacherIds": userId },
      { $pull: { "parentProfile.shortlistedTeacherIds": userId } },
    ),
  ]);

  // Notifications that mention this tutor by id
  await Notification.updateMany(
    { "meta.teacherId": userId },
    {
      $set: {
        "meta.teacherName": DELETED_USER_LABEL,
        title: "Tutor account removed",
        body: "This tutor is no longer on Mentr.",
      },
    },
  );

  let profileImage = false;
  try {
    await removeMentorProfileImage(profileImagePath);
    profileImage = Boolean(profileImagePath);
  } catch (err) {
    console.warn("admin delete: profile image cleanup failed", err);
  }

  await User.deleteOne({ _id: oid });

  return {
    id: userId,
    email,
    role,
    deleted: {
      user: true,
      connectionsAnonymized,
      connectionsRemoved: 0,
      requirements: reqDel.deletedCount ?? 0,
      profileViews: viewsDel.deletedCount ?? 0,
      notifications: notifDel.deletedCount ?? 0,
      otpSessions: otpDel.deletedCount ?? 0,
      interactions: interactionDel.deletedCount ?? 0,
      shortlistPulls: shortlistPull.modifiedCount ?? 0,
      profileImage,
    },
  };
}
