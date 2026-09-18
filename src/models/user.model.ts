import { Schema, model, Document, Types, models } from "mongoose";

export type UserRole =
  | "DEV_ADMIN"
  | "MANAGEMENT_ADMIN"
  | "EVENT_MANAGER"
  | "INTERNAL_USER"
  | "EXTERNAL_USER";

export interface IUser extends Document {
  role: UserRole;
  // shared
  fullName: string;
  email: string;
  password: string;
  mobileNumber: string;
  gender: "Male" | "Female" | "Other";
  department: string;
  program: string;
  branch: string;
  year: "1st" | "2nd" | "3rd" | "4th";
  address: string;
  emergencyContactName: string;
  emergencyContactNumber: string;
  dateOfBirth?: string;
  profilePhotoUrl?: string;
  teams: Types.ObjectId[];
  // INTERNAL_USER only
  enrollmentNumber?: string;
  semester?: string;
  section?: string;
  dayScholarOrHosteller?: "Day Scholar" | "Hosteller";
  isVerified?: boolean;
  // EXTERNAL_USER only
  collegeName?: string;
  city?: string;
  state?: string;
  participantId?: string;
  accommodationNeeded?: boolean;
  // legacy compat (derived from role)
  isOutsider?: boolean;
  isAdmin?: boolean;
}

const userSchema = new Schema<IUser>(
  {
    role: {
      type: String,
      enum: ["DEV_ADMIN", "MANAGEMENT_ADMIN", "EVENT_MANAGER", "INTERNAL_USER", "EXTERNAL_USER"],
      required: true,
      default: "INTERNAL_USER",
    },
    fullName: { type: String, required: true, minlength: 2 },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
    password: { type: String, required: true, minlength: 6 },
    mobileNumber: { type: String, required: false, match: /^\d{10}$/ },
    gender: { type: String, enum: ["Male", "Female", "Other"], required: false },
    department: { type: String, required: false },
    program: { type: String, required: false },
    branch: { type: String, required: false },
    year: { type: String, enum: ["1st", "2nd", "3rd", "4th"], required: false },
    address: { type: String, required: false },
    emergencyContactName: { type: String, required: false },
    emergencyContactNumber: { type: String, required: false, match: /^\d{10}$/ },
    dateOfBirth: { type: String, required: false },
    profilePhotoUrl: { type: String, required: false },
    teams: [{ type: Types.ObjectId, ref: "Team" }],
    // INTERNAL_USER
    enrollmentNumber: { type: String, required: false },
    semester: { type: String, required: false },
    section: { type: String, required: false },
    dayScholarOrHosteller: { type: String, enum: ["Day Scholar", "Hosteller"], required: false },
    isVerified: { type: Boolean, default: false },
    // EXTERNAL_USER
    collegeName: { type: String, required: false },
    city: { type: String, required: false },
    state: { type: String, required: false },
    participantId: { type: String, unique: true, sparse: true },
    accommodationNeeded: { type: Boolean, required: false },
    // legacy
    isOutsider: { type: Boolean, default: false },
    isAdmin: { type: Boolean, default: false },
  },
  { timestamps: true }
);

userSchema.index({ role: 1 });

const User = models?.User || model<IUser>("User", userSchema);
export { User };
