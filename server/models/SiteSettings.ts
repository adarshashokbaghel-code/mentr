import mongoose, { Document, Schema } from "mongoose";

/** Admin-editable copy for auto signup welcome emails (Messenger). */
export type IMessengerWelcomeSettings = {
  /** Send mentor welcome when a tutor verifies email on first signup */
  autoWelcomeMentor: boolean;
  /** Send parent welcome when a parent verifies email on first signup */
  autoWelcomeParent: boolean;
  /** Optional intro paragraph (plain text; {{name}} supported). Empty = built-in default. */
  mentorIntro: string;
  parentIntro: string;
  /** Optional subject override ({{name}} supported). Empty = default subject. */
  mentorSubject: string;
  parentSubject: string;
  /** Optional coupon code embedded in mentor welcome (Premium checkout). */
  mentorWelcomeCouponCode: string;
};

export const DEFAULT_MESSENGER_WELCOME: IMessengerWelcomeSettings = {
  autoWelcomeMentor: true,
  autoWelcomeParent: true,
  mentorIntro: "",
  parentIntro: "",
  mentorSubject: "",
  parentSubject: "",
  mentorWelcomeCouponCode: "",
};

/** Singleton site settings — featured landing tutors, etc. */
export interface ISiteSettings extends Document {
  key: string;
  /** Ordered faculty user IDs shown on homepage Featured section */
  featuredTeacherIds: string[];
  messengerWelcome?: IMessengerWelcomeSettings;
  updatedAt: Date;
  createdAt: Date;
}

const siteSettingsSchema = new Schema<ISiteSettings>(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      default: "main",
    },
    featuredTeacherIds: {
      type: [String],
      default: [],
    },
    messengerWelcome: {
      type: {
        autoWelcomeMentor: { type: Boolean, default: true },
        autoWelcomeParent: { type: Boolean, default: true },
        mentorIntro: { type: String, default: "" },
        parentIntro: { type: String, default: "" },
        mentorSubject: { type: String, default: "" },
        parentSubject: { type: String, default: "" },
        mentorWelcomeCouponCode: { type: String, default: "" },
      },
      default: () => ({ ...DEFAULT_MESSENGER_WELCOME }),
    },
  },
  { timestamps: true },
);

export const SiteSettings =
  mongoose.models.SiteSettings ||
  mongoose.model<ISiteSettings>("SiteSettings", siteSettingsSchema);
