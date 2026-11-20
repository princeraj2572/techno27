"use server";
import { randomInt, timingSafeEqual } from "crypto";
import { connectToDatabase } from "@/lib/mongodb";
import { sendResetPasswordEmail, sendWelcomeEmail } from "@/lib/mailer";
import { User } from "@/features/users/user.model";
import { Otp, OTP_TTL_MS, OtpPurpose, hashOtp } from "@/features/users/otp.model";

type Result = { ok: true } | { ok: false; error: string };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const RESEND_AFTER_MS = 60 * 1000;
const MAX_ATTEMPTS = 5;

export async function sendOtp(rawEmail: string, purpose: OtpPurpose): Promise<Result> {
  const email = rawEmail.toLowerCase().trim();
  if (!EMAIL_RE.test(email)) return { ok: false, error: "Invalid email address" };
  if (purpose !== "signup" && purpose !== "reset") return { ok: false, error: "Invalid request" };

  await connectToDatabase();
  const exists = await User.exists({ email });
  if (purpose === "signup" && exists) return { ok: false, error: "An account with this email already exists. Try signing in." };
  // reset: don't reveal whether the account exists, just don't send
  if (purpose === "reset" && !exists) return { ok: true };

  const prev = await Otp.findOne({ email, purpose });
  if (prev && Date.now() - prev.createdAt.getTime() < RESEND_AFTER_MS) {
    return { ok: false, error: "Please wait a minute before requesting another code." };
  }

  const otp = String(randomInt(100000, 1000000));
  await Otp.findOneAndUpdate(
    { email, purpose },
    { hash: hashOtp(email, otp), attempts: 0, verified: false, expiresAt: new Date(Date.now() + OTP_TTL_MS), createdAt: new Date() },
    { upsert: true, timestamps: false },
  );

  try {
    await (purpose === "signup" ? sendWelcomeEmail : sendResetPasswordEmail)(email, otp);
  } catch (e) {
    console.error(`Error sending ${purpose} OTP:`, e);
    await Otp.deleteOne({ email, purpose });
    return { ok: false, error: "Couldn't send the email. Please try again." };
  }
  return { ok: true };
}

export async function verifyOtp(rawEmail: string, otp: string, purpose: OtpPurpose): Promise<Result> {
  const email = rawEmail.toLowerCase().trim();
  await connectToDatabase();
  const doc = await Otp.findOne({ email, purpose, expiresAt: { $gt: new Date() } });
  if (!doc) return { ok: false, error: "Code expired. Please request a new one." };
  if (doc.attempts >= MAX_ATTEMPTS) return { ok: false, error: "Too many attempts. Please request a new code." };

  const given = Buffer.from(hashOtp(email, String(otp).trim()));
  if (!timingSafeEqual(given, Buffer.from(doc.hash))) {
    await Otp.updateOne({ _id: doc._id }, { $inc: { attempts: 1 } });
    return { ok: false, error: "That code doesn't match. Check your email and try again." };
  }
  await Otp.updateOne({ _id: doc._id }, { verified: true });
  return { ok: true };
}
