"use client";

import { useState } from "react";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Props {
  email: string;
  onNext: () => void;
  onBack: () => void;
}

export default function VerifyOtp({ email, onNext, onBack }: Props) {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const stored = sessionStorage.getItem("signup_otp");
    if (otp.trim() !== stored) {
      return setError("Incorrect OTP. Check your email and try again.");
    }
    onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Info */}
      <div className="flex items-start gap-3 px-4 py-3.5 rounded-xl bg-slate-50 border border-slate-200">
        <div className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center shrink-0 mt-0.5">
          <ShieldCheck className="h-4 w-4 text-white" />
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-800">Check your inbox</p>
          <p className="text-xs text-slate-500 mt-0.5">
            We sent a 6-digit code to <span className="font-medium text-slate-700">{email}</span>
          </p>
        </div>
      </div>

      {/* OTP input */}
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
        <p className="text-xs text-slate-400 text-center">Enter the 6-digit code from your email</p>
      </div>

      {error && (
        <div className="px-4 py-3 rounded-xl bg-red-50 border border-red-200">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      <button
        type="submit"
        className="w-full h-11 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold transition-colors flex items-center justify-center gap-2"
      >
        Verify & continue
      </button>

      <button
        type="button"
        onClick={onBack}
        className="w-full h-10 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 text-sm font-medium transition-colors flex items-center justify-center gap-2"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Use a different email
      </button>
    </form>
  );
}
