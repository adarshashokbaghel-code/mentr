import mongoose, { Document, Schema } from "mongoose";

export const WEEK_DAYS = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
] as const;
export type WeekDay = (typeof WEEK_DAYS)[number];

export const TEACHING_MODES = [
  "online",
  "student_home",
  "tutor_home",
] as const;
export type TeachingMode = (typeof TEACHING_MODES)[number];

export interface IAvailabilitySlot {
  day: WeekDay;
  /** 24h "HH:mm" */
  start: string;
  /** 24h "HH:mm" */
  end: string;
  /** Marked taken by the faculty after a WhatsApp booking */
  booked?: boolean;
}

export interface ISocialLinks {
  linkedin?: string;
  github?: string;
  website?: string;
  youtube?: string;
  instagram?: string;
}

export interface IFacultyProfile {
  name: string;
  designation: string;
  phoneNumber: string;
  bio: string;
  subjects: string[];
  // Extended profiling fields
  country: string;
  city: string;
  area: string;
  levels: string[];
  languages: string[];
  qualification: string;
  experienceYears: number;
  teachingModes: TeachingMode[];
  hourlyRate?: number;
  timeFormat: "12h" | "24h";
  /** IANA zone the availability slots are written in, e.g. "Asia/Kolkata" */
  timezone: string;
  availability: IAvailabilitySlot[];
  // Optional extras
  gender?: "male" | "female" | "other";
  workplace?: string;
  certifications: string[];
  /** Awards, results, notable outcomes — e.g. "200+ students taught" */
  achievements: string[];
  /** Link to a short intro / demo class video (YouTube etc.) */
  introVideo?: string;
  socials?: ISocialLinks;
  // Legacy field kept optional for older records
  department?: string;
}

export const USER_ROLES = ["faculty", "parent"] as const;
export type UserRole = (typeof USER_ROLES)[number];

/** Minimal profile for parents/students looking for tutors. */
export interface IParentProfile {
  name: string;
  phoneNumber: string;
  country: string;
  city: string;
  area?: string;
}

export interface IUser extends Document {
  email: string;
  role: UserRole;
  emailVerified: boolean;
  profileCompleted: boolean;
  profile?: IFacultyProfile;
  parentProfile?: IParentProfile;
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const availabilitySlotSchema = new Schema<IAvailabilitySlot>(
  {
    day: { type: String, enum: WEEK_DAYS, required: true },
    start: { type: String, required: true, trim: true },
    end: { type: String, required: true, trim: true },
    booked: { type: Boolean, default: false },
  },
  { _id: false },
);

const socialLinksSchema = new Schema<ISocialLinks>(
  {
    linkedin: { type: String, trim: true },
    github: { type: String, trim: true },
    website: { type: String, trim: true },
    youtube: { type: String, trim: true },
    instagram: { type: String, trim: true },
  },
  { _id: false },
);

const facultyProfileSchema = new Schema<IFacultyProfile>(
  {
    name: { type: String, required: true, trim: true },
    designation: { type: String, required: true, trim: true },
    phoneNumber: { type: String, required: true, trim: true },
    bio: { type: String, default: "", trim: true },
    subjects: { type: [String], default: [] },
    country: { type: String, default: "India", trim: true },
    city: { type: String, default: "", trim: true },
    area: { type: String, default: "", trim: true },
    levels: { type: [String], default: [] },
    languages: { type: [String], default: [] },
    qualification: { type: String, default: "", trim: true },
    experienceYears: { type: Number, default: 0, min: 0, max: 60 },
    teachingModes: {
      type: [String],
      enum: TEACHING_MODES,
      default: [],
    },
    hourlyRate: { type: Number, min: 0 },
    timeFormat: { type: String, enum: ["12h", "24h"], default: "12h" },
    timezone: { type: String, default: "Asia/Kolkata", trim: true },
    availability: { type: [availabilitySlotSchema], default: [] },
    gender: { type: String, enum: ["male", "female", "other"] },
    workplace: { type: String, trim: true },
    certifications: { type: [String], default: [] },
    achievements: { type: [String], default: [] },
    introVideo: { type: String, trim: true },
    socials: { type: socialLinksSchema },
    department: { type: String, trim: true },
  },
  { _id: false },
);

const parentProfileSchema = new Schema<IParentProfile>(
  {
    name: { type: String, required: true, trim: true },
    phoneNumber: { type: String, required: true, trim: true },
    country: { type: String, default: "India", trim: true },
    city: { type: String, required: true, trim: true },
    area: { type: String, trim: true },
  },
  { _id: false },
);

const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    role: { type: String, enum: USER_ROLES, default: "faculty" },
    emailVerified: { type: Boolean, default: false },
    profileCompleted: { type: Boolean, default: false },
    profile: { type: facultyProfileSchema, required: false },
    parentProfile: { type: parentProfileSchema, required: false },
    lastLoginAt: { type: Date },
  },
  { timestamps: true },
);

userSchema.index({ "profile.subjects": 1 });
userSchema.index({ "profile.city": 1 });

export const User =
  mongoose.models.User || mongoose.model<IUser>("User", userSchema);
