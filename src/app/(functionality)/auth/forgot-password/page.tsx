"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { sendResetPasswordEmail } from "@/lib/mailer";
import { resetPassword } from "@/features/users/user-actions";
import { AuthCard, AuthShell } from "../auth-shell";

type Step = "email" | "otp" | "password";

const STEPS: { key: Step; label: string }[] = [
  { key: "email", label: "Email" },
  { key: "otp", label: "Verify" },
  { key: "password", label: "Reset" },
];

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const stepIndex = STEPS.findIndex((s) => s.key === step);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email) return setError("Email is required");
    setLoading(true);
    try {
      const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
      sessionStorage.setItem("reset_otp", generatedOtp);
      sessionStorage.setItem("reset_email", email);
      await sendResetPasswordEmail(email, generatedOtp);
      setStep("otp");
    } catch {
      setError("Couldn't send the OTP. Check the email address and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const stored = sessionStorage.getItem("reset_otp");
    if (otp !== stored) return setError("That OTP doesn't match. Check your email and try again.");
    setStep("password");
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (newPassword !== confirmPassword) return setError("Passwords don't match.");
    if (newPassword.length < 8) return setError("Password must be at least 8 characters.");
    setLoading(true);
    try {
      await resetPassword(email, newPassword);
      sessionStorage.removeItem("reset_otp");
      sessionStorage.removeItem("reset_email");
      router.push("/auth/login");
    } catch {
      setError("Couldn't reset your password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const description =
    step === "email" ? "Enter your email and we'll send a one-time code."
    : step === "otp" ? `We sent a 6-digit code to ${email}`
    : "Choose a new password for your account.";

  return (
    <AuthShell>
      <AuthCard tag="No worries" title="Reset password" description={description} steps={STEPS.map((x) => x.label)} current={stepIndex} maxWidth="max-w-md">
        <div>
            {step === "email" && (
              <form onSubmit={handleSendOtp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                {error && (
                  <div className="px-3 py-2 rounded-lg bg-destructive/10 border border-destructive/20">
                    <p className="text-sm text-destructive">{error}</p>
                  </div>
                )}
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Sending code…" : "Send code"}
                </Button>
                <p className="text-center text-sm text-muted-foreground">
                  <Link href="/auth/login" className="inline-flex items-center gap-1 font-bold text-[#a1001a] underline underline-offset-4 hover:text-[#ff6a00]">
                    <ArrowLeft className="h-3 w-3" /> Back to sign in
                  </Link>
                </p>
              </form>
            )}

            {step === "otp" && (
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="otp">One-time code</Label>
                  <Input
                    id="otp"
                    placeholder="6-digit code"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    maxLength={6}
                    inputMode="numeric"
                    className="tracking-widest text-center text-lg"
                    required
                  />
                </div>
                {error && (
                  <div className="px-3 py-2 rounded-lg bg-destructive/10 border border-destructive/20">
                    <p className="text-sm text-destructive">{error}</p>
                  </div>
                )}
                <Button type="submit" className="w-full">Verify code</Button>
                <Button
                  type="button"
                  variant="ghost"
                  className="w-full"
                  onClick={() => { setStep("email"); setError(""); setOtp(""); }}
                >
                  Use a different email
                </Button>
              </form>
            )}

            {step === "password" && (
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New password</Label>
                  <div className="relative">
                    <Input
                      id="newPassword"
                      type={showPassword ? "text" : "password"}
                      placeholder="Min. 8 characters"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm password</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirm ? "text" : "password"}
                      placeholder="Re-enter password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      aria-label={showConfirm ? "Hide password" : "Show password"}
                    >
                      {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                {error && (
                  <div className="px-3 py-2 rounded-lg bg-destructive/10 border border-destructive/20">
                    <p className="text-sm text-destructive">{error}</p>
                  </div>
                )}
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Saving…" : "Save new password"}
                </Button>
              </form>
            )}
        </div>
      </AuthCard>
    </AuthShell>
  );
}
