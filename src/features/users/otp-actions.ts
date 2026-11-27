"use server";
import { randomInt, timingSafeEqual } from "crypto";
import { connectToDatabase } from "@/lib/mongodb";
import { sendResetPasswordEmail, sendWelcomeEmail } from "@/lib/mailer";
import { User } from "@/features/users/user.model";
import { Otp, OTP_TTL_MS, OtpPurpose, hashOtp } from "@/features/users/otp.model";
import { isDisposable, suggestDomain } from "@/features/users/email-domain";
import { promises as dns } from "dns";

type Result = { ok: true } | { ok: false; error: string };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const RESEND_AFTER_MS = 60 * 1000;
const MAX_ATTEMPTS = 5;

/** Can this domain receive mail? MX records, or an A record (the RFC 5321 fallback).
 *  Only a definite "no such domain / no records" answer blocks; timeouts and DNS outages let it through. */
async function domainReceivesMail(domain: string): Promise<boolean> {
  const definiteNo = (e: unknown) => ["ENOTFOUND", "ENODATA", "ENONAME"].includes((e as { code?: string })?.code ?? "");
  const within = <T,>(p: Promise<T>) => Promise.race([p, new Promise<never>((_, rej) => setTimeout(() => rej(Object.assign(new Error("timeout"), { code: "ETIMEOUT" })), 4000))]);
  try {
    const mx = await within(dns.resolveMx(domain));
    if (mx.some((r) => r.exchange && r.exchange !== ".")) return true;
  } catch (e) {
    if (!definiteNo(e)) return true;
  }
  try {
    return (await within(dns.resolve4(domain))).length > 0;
  } catch (e) {
    return !definiteNo(e);
  }
}

/** Sign-up only: catch typos (gamil.com), throwaway inboxes and domains that can't receive mail. */
async function checkSignupDomain(email: string): Promise<string | null> {
  const domain = email.slice(email.lastIndexOf("@") + 1);
  const fix = suggestDomain(domain);
  if (fix) return `Check your email address: did you mean ${email.slice(0, email.lastIndexOf("@"))}@${fix}?`;
  if (isDisposable(domain)) return "Please use your own email address, not a temporary inbox.";
  if (domain !== "opju.ac.in" && !(await domainReceivesMail(domain))) return `"${domain}" can't receive email. Check the address and try again.`;
  return null;
}

export async function sendOtp(rawEmail: string, purpose: OtpPurpose): Promise<Result> {
  const email = rawEmail.toLowerCase().trim();
  if (!EMAIL_RE.test(email)) return { ok: false, error: "Invalid email address" };
  if (purpose !== "signup" && purpose !== "reset") return { ok: false, error: "Invalid request" };
  if (purpose === "signup") {
    const bad = await checkSignupDomain(email);
    if (bad) return { ok: false, error: bad };
  }

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
