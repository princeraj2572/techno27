import { createHash } from "crypto";
import { Schema, model, models } from "mongoose";

export type OtpPurpose = "signup" | "reset";

export interface IOtp {
  email: string;
  purpose: OtpPurpose;
  hash: string;
  attempts: number;
  verified: boolean;
  expiresAt: Date;
  createdAt: Date;
}

const otpSchema = new Schema<IOtp>(
  {
    email: { type: String, required: true },
    purpose: { type: String, enum: ["signup", "reset"], required: true },
    hash: { type: String, required: true },
    attempts: { type: Number, default: 0 },
    verified: { type: Boolean, default: false },
    expiresAt: { type: Date, required: true, expires: 0 }, // Mongo TTL deletes it once expired
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);
otpSchema.index({ email: 1, purpose: 1 }, { unique: true });

export const Otp = models?.Otp || model<IOtp>("Otp", otpSchema);

export const OTP_TTL_MS = 10 * 60 * 1000;
export const hashOtp = (email: string, otp: string) => createHash("sha256").update(`${email}:${otp}`).digest("hex");

/** Server-only: runs `fn` only if this email passed verifyOtp for `purpose` and hasn't expired; uses up the OTP once `fn` succeeds. */
export async function withVerifiedOtp<T>(email: string, purpose: OtpPurpose, fn: () => Promise<T>): Promise<T> {
  const doc = await Otp.findOne({ email, purpose, verified: true, expiresAt: { $gt: new Date() } });
  if (!doc) throw new Error("Email not verified or code expired. Please verify your email again.");
  const result = await fn();
  await Otp.deleteOne({ _id: doc._id });
  return result;
}
