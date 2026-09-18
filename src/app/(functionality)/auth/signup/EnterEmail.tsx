"use client";

import { useState } from "react";
import { ArrowRight, Building2, GraduationCap } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { sendWelcomeEmail } from "@/actions/mailer";

interface Props {
  onNext: (email: string, isInternal: boolean) => void;
}

export default function EnterEmail({ onNext }: Props) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isInternal = email.toLowerCase().endsWith("@opju.ac.in");
  const hasEmail = email.includes("@") && email.length > 3;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email) return setError("Email is required");
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return setError("Enter a valid email address");

    setLoading(true);
    try {
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      sessionStorage.setItem("signup_otp", otp);
      sessionStorage.setItem("signup_email", email.toLowerCase().trim());
      sessionStorage.setItem("signup_is_internal", String(isInternal));
      await sendWelcomeEmail(email, otp);
      onNext(email.toLowerCase().trim(), isInternal);
    } catch {
      setError("Failed to send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-1.5">
        <Label htmlFor="email" className="text-sm font-medium text-slate-700">Email address</Label>
        <Input
          id="email"
          type="email"
          placeholder="you@example.com or you@opju.ac.in"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="h-11 rounded-xl border-slate-200 bg-slate-50 focus:bg-white transition-colors"
          autoFocus
          required
        />
      </div>

      {/* Role detection */}
      {hasEmail && (
        <div className={`flex items-start gap-3 px-4 py-3.5 rounded-xl border transition-all ${
          isInternal
            ? "bg-sky-50 border-sky-200"
            : "bg-violet-50 border-violet-200"
        }`}>
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
            isInternal ? "bg-sky-600" : "bg-violet-600"
          }`}>
            {isInternal
              ? <GraduationCap className="h-4 w-4 text-white" />
              : <Building2 className="h-4 w-4 text-white" />}
          </div>
          <div>
            <p className={`text-sm font-semibold ${isInternal ? "text-sky-800" : "text-violet-800"}`}>
              {isInternal ? "OPJU Student — Free registration" : "External Participant — Paid registration"}
            </p>
            <p className={`text-xs mt-0.5 ${isInternal ? "text-sky-600" : "text-violet-600"}`}>
              {isInternal
                ? "Your @opju.ac.in email gives you free access to all events."
                : "Registration fees apply (₹99–₹499 depending on event). Payment collected after sign-up."}
            </p>
          </div>
        </div>
      )}

      {error && (
        <div className="px-4 py-3 rounded-xl bg-red-50 border border-red-200">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full h-11 rounded-xl bg-violet-600 hover:bg-violet-700 disabled:bg-violet-300 text-white text-sm font-semibold transition-colors flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <span className="h-4 w-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            Sending OTP…
          </>
        ) : (
          <>Continue <ArrowRight className="h-4 w-4" /></>
        )}
      </button>
    </form>
  );
}
