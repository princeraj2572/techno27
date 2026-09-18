"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, CheckCircle2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { sendResetPasswordEmail } from "@/actions/mailer";
import { resetPassword } from "@/actions/user-actions";

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

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md space-y-4">
        {/* Step indicator */}
        <div className="flex items-center justify-center gap-2 mb-2">
          {STEPS.map((s, i) => (
            <div key={s.key} className="flex items-center gap-2">
              <div className="flex items-center gap-1.5">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold transition-colors ${
                    i < stepIndex
                      ? "bg-primary/30 text-primary"
                      : i === stepIndex
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                  }`}
                >
                  {i < stepIndex ? <CheckCircle2 className="h-3.5 w-3.5" /> : i + 1}
                </div>
                <span
                  className={`text-xs hidden sm:block ${
                    i === stepIndex ? "text-foreground font-medium" : "text-muted-foreground"
                  }`}
                >
                  {s.label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`h-px w-8 transition-colors ${i < stepIndex ? "bg-primary/40" : "bg-border"}`} />
              )}
            </div>
          ))}
        </div>

        <Card>
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-2xl font-semibold tracking-tight">Reset password</CardTitle>
            <CardDescription>
              {step === "email" && "Enter your email and we'll send a one-time code."}
              {step === "otp" && `We sent a 6-digit code to ${email}`}
              {step === "password" && "Choose a new password for your account."}
            </CardDescription>
          </CardHeader>
          <CardContent>
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
                  <Link href="/auth/login" className="inline-flex items-center gap-1 text-primary hover:underline">
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
