import { Types } from "mongoose";
import { User, type IUser } from "../models/User";
import { toAdminUserRow, type AdminUserRow } from "./admin-messenger";

export type AdminUserUpdateInput = {
  name?: string;
  email?: string;
  phone?: string;
  city?: string;
  area?: string;
  country?: string;
  emailVerified?: boolean;
  profileCompleted?: boolean;
};

function cleanStr(v: unknown, max = 120): string | undefined {
  if (v === undefined || v === null) return undefined;
  const s = String(v).trim();
  if (!s) return "";
  return s.slice(0, max);
}

export async function updateAdminUser(
  userId: string,
  input: AdminUserUpdateInput,
): Promise<{ user: AdminUserRow } | { error: string; status: number }> {
  if (!Types.ObjectId.isValid(userId)) {
    return { error: "Invalid user id", status: 400 };
  }

  const user = await User.findById(userId);
  if (!user) {
    return { error: "User not found", status: 404 };
  }

  const name = cleanStr(input.name, 80);
  const email = cleanStr(input.email, 160)?.toLowerCase();
  const phone = cleanStr(input.phone, 24);
  const city = cleanStr(input.city, 60);
  const area = cleanStr(input.area, 80);
  const country = cleanStr(input.country, 60);

  if (email !== undefined) {
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return { error: "Enter a valid email", status: 400 };
    }
    if (email !== user.email) {
      const clash = await User.findOne({
        email,
        _id: { $ne: user._id },
      }).select("_id");
      if (clash) {
        return { error: "Email already in use", status: 409 };
      }
      user.email = email;
    }
  }

  if (typeof input.emailVerified === "boolean") {
    user.emailVerified = input.emailVerified;
  }
  if (typeof input.profileCompleted === "boolean") {
    user.profileCompleted = input.profileCompleted;
  }

  if (user.role === "parent") {
    if (!user.parentProfile) {
      user.parentProfile = {
        name: name || "Parent",
        phoneNumber: phone || "",
        country: country || "India",
        city: city || "",
        area: area || "",
      };
    } else {
      if (name !== undefined) user.parentProfile.name = name || user.parentProfile.name;
      if (phone !== undefined) user.parentProfile.phoneNumber = phone;
      if (city !== undefined) user.parentProfile.city = city;
      if (area !== undefined) user.parentProfile.area = area || undefined;
      if (country !== undefined) user.parentProfile.country = country || "India";
    }
    user.markModified("parentProfile");
  } else if (user.role === "faculty") {
    if (!user.profile) {
      return { error: "Tutor has no profile to edit yet", status: 400 };
    }
    if (name !== undefined) user.profile.name = name || user.profile.name;
    if (phone !== undefined) user.profile.phoneNumber = phone || user.profile.phoneNumber;
    if (city !== undefined) user.profile.city = city;
    if (area !== undefined) user.profile.area = area;
    if (country !== undefined) user.profile.country = country || "India";
    user.markModified("profile");
  }

  await user.save();
  const fresh = await User.findById(user._id);
  return {
    user: toAdminUserRow(
      fresh as IUser & { _id: unknown; createdAt: Date; updatedAt: Date },
    ),
  };
}
