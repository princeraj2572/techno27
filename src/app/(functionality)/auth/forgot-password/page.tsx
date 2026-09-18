"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, CheckCircle2, ArrowLeft, Zap, Mail, ShieldCheck, KeyRound } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { sendResetPasswordEmail } from "@/actions/mailer";
import { resetPassword } from "@/actions/user-actions";

type Step = "email" | "otp" | "password";

const STEPS: { key: Step; label: string; icon: React.ElementType }[] = [
  { key: "email",    label: "Email",  icon: Mail       },
  { key: "otp",     label: "Verify", icon: ShieldCheck },
  { key: "password",label: "Reset",  icon: KeyRound    },
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
      setError("Couldn't send the OTP. Check the email and try again.");
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

  const inputCls = "h-11 rounded-xl border-slate-200 bg-slate-50 focus:bg-white transition-colors";

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <Zap className="h-4 w-4 text-violet-600" />
          <span className="text-sm font-bold text-slate-900 tracking-tight">Technorollix 2027</span>
        </div>
        <Link href="/auth/login" className="text-xs text-slate-400 hover:text-slate-600 flex items-center gap-1 transition-colors">
          <ArrowLeft className="h-3 w-3" /> Back to sign in
        </Link>
      </div>

      <div className="flex-1 flex items-start justify-center px-6 py-12">
        <div className="w-full max-w-sm animate-slide-up space-y-8">

          {/* Heading */}
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Reset password</h1>
            <p className="text-sm text-slate-500 mt-1">
              {step === "email"    && "Enter your email and we'll send a code."}
              {step === "otp"     && `Check your inbox at ${email}`}
              {step === "password" && "Choose a new password for your account."}
            </p>
          </div>

          {/* Step indicator */}
          <div className="flex items-center gap-0">
            {STEPS.map(({ key, label, icon: Icon }, i) => {
              const idx = STEPS.findIndex((s) => s.key === key);
              const done = idx < stepIndex;
              const active = idx === stepIndex;
              return (
                <div key={key} className="flex items-center flex-1 last:flex-none">
                  <div className="flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                      done   ? "bg-violet-600 text-white"
                      : active ? "bg-violet-600 text-white ring-4 ring-violet-100"
                      : "bg-slate-100 text-slate-400"
                    }`}>
                      {done ? <CheckCircle2 className="h-4 w-4" /> : <Icon className="h-3.5 w-3.5" />}
                    </div>
                    <span className={`text-[10px] mt-1 font-medium ${active ? "text-violet-700" : "text-slate-400"}`}>
                      {label}
                    </span>
                  </div>
                  {i < STEPS.length - 1 && (
                    <div className={`flex-1 h-0.5 mx-2 mb-4 rounded-full transition-colors ${done ? "bg-violet-600" : "bg-slate-100"}`} />
                  )}
                </div>
              );
            })}
          </div>

          {/* Step: email */}
          {step === "email" && (
            <form onSubmit={handleSendOtp} className="space-y-5">
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-sm font-medium text-slate-700">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={inputCls}
                  autoFocus
                  required
                />
              </div>
              {error && (
                <div className="px-4 py-3 rounded-xl bg-red-50 border border-red-200">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}
              <button type="submit" disabled={loading}
                className="w-full h-11 rounded-xl bg-violet-600 hover:bg-violet-700 disabled:bg-violet-300 text-white text-sm font-semibold transition-colors flex items-center justify-center gap-2">
                {loading ? (
                  <><span className="h-4 w-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Sending code…</>
                ) : "Send code"}
              </button>
            </form>
          )}

          {/* Step: OTP */}
          {step === "otp" && (
            <form onSubmit={handleVerifyOtp} className="space-y-5">
              <div className="flex items-start gap-3 px-4 py-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <div className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center shrink-0 mt-0.5">
                  <ShieldCheck className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-800">Check your inbox</p>
                  <p className="text-xs text-slate-500 mt-0.5">We sent a 6-digit code to <span className="font-medium text-slate-700">{email}</span></p>
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="otp" className="text-sm font-medium text-slate-700">One-time code</Label>
                <Input
                  id="otp"
                  placeholder="000000"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  maxLength={6}
                  inputMode="numeric"
                  className="h-14 rounded-xl border-slate-200 bg-slate-50 focus:bg-white text-center text-2xl font-bold tracking-[0.5em] transition-colors"
                  autoFocus
                  required
                />
              </div>
              {error && (
                <div className="px-4 py-3 rounded-xl bg-red-50 border border-red-200">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}
              <button type="submit"
                className="w-full h-11 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold transition-colors flex items-center justify-center">
                Verify code
              </button>
              <button type="button" onClick={() => { setStep("email"); setError(""); setOtp(""); }}
                className="w-full h-10 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 text-sm font-medium transition-colors flex items-center justify-center gap-2">
                <ArrowLeft className="h-3.5 w-3.5" /> Use a different email
              </button>
            </form>
          )}

          {/* Step: new password */}
          {step === "password" && (
            <form onSubmit={handleResetPassword} className="space-y-5">
              <div className="space-y-1.5">
                <Label htmlFor="newPassword" className="text-sm font-medium text-slate-700">New password</Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    type={showPassword ? "text" : "password"}
                    placeholder="Min. 8 characters"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className={`${inputCls} pr-11`}
                    autoFocus
                    required
                  />
                  <button type="button" onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="confirmPassword" className="text-sm font-medium text-slate-700">Confirm password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirm ? "text" : "password"}
                    placeholder="Re-enter password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={`${inputCls} pr-11`}
                    required
                  />
                  <button type="button" onClick={() => setShowConfirm((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                    {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              {error && (
                <div className="px-4 py-3 rounded-xl bg-red-50 border border-red-200">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}
              <button type="submit" disabled={loading}
                className="w-full h-11 rounded-xl bg-violet-600 hover:bg-violet-700 disabled:bg-violet-300 text-white text-sm font-semibold transition-colors flex items-center justify-center gap-2">
                {loading ? (
                  <><span className="h-4 w-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Saving…</>
                ) : "Save new password"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
