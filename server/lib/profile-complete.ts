import type { IUser } from "../models/User";

/** Whether a user has enough profile data to appear in search / public pages. */
export function isProfileComplete(user: IUser): boolean {
  if (user.profileCompleted) return true;
  if (user.role === "parent") {
    return Boolean(user.parentProfile?.name && user.parentProfile?.phoneNumber);
  }
  // Legacy faculty accounts created before the profiling flow
  return Boolean(user.profile?.name && user.profile?.phoneNumber);
}
