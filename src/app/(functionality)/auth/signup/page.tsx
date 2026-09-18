"use client";

import { useState } from "react";
import Link from "next/link";
import { Zap, Calendar, MapPin, Users, CheckCircle2 } from "lucide-react";
import EnterEmail from "./EnterEmail";
import VerifyOtp from "./VerifyOtp";
import SignupForm from "./SignupForm";

type Step = 1 | 2 | 3;

const STEPS = [
  { n: 1, label: "Email" },
  { n: 2, label: "Verify" },
  { n: 3, label: "Details" },
] as const;

function BrandPanel() {
  return (
    <div className="hidden lg:flex flex-col justify-between bg-gradient-to-br from-slate-950 via-violet-950 to-slate-950 px-12 py-12 text-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-violet-600/10 -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-violet-500/10 translate-y-1/2 -translate-x-1/2 pointer-events-none" />

      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-1">
          <Zap className="h-4 w-4 text-violet-400" />
          <span className="text-xs font-semibold text-violet-400 tracking-[0.2em] uppercase">Technorollix</span>
        </div>
        <p className="text-7xl font-black text-white tracking-tighter leading-none mt-2">2027</p>
      </div>

      <div className="relative z-10 space-y-8">
        <div>
          <p className="text-2xl font-bold text-white leading-snug">Join the fest.<br />Compete. Innovate.</p>
          <p className="text-sm text-slate-400 mt-3 leading-relaxed">
            Register once and get access to<br />20+ events across disciplines.
          </p>
        </div>
        <div className="space-y-3">
          {[
            { icon: Calendar, text: "Feb 27–28, 2027" },
            { icon: MapPin,   text: "OPJU, Raigarh, Chhattisgarh" },
            { icon: Users,    text: "500+ participants expected" },
          ].map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-violet-800/50 flex items-center justify-center shrink-0">
                <Icon className="h-3.5 w-3.5 text-violet-300" />
              </div>
              <span className="text-sm text-slate-300">{text}</span>
            </div>
          ))}
        </div>
        <div className="pt-4 border-t border-slate-800">
          <p className="text-xs text-slate-500 mb-3">Registration fees</p>
          <div className="space-y-1.5">
            {[
              { label: "OPJU students", fee: "Free", color: "text-sky-400" },
              { label: "External (solo)", fee: "₹99–₹199", color: "text-violet-300" },
              { label: "External (team)", fee: "₹299–₹499", color: "text-violet-300" },
            ].map(({ label, fee, color }) => (
              <div key={label} className="flex items-center justify-between">
                <span className="text-xs text-slate-400">{label}</span>
                <span className={`text-xs font-semibold ${color}`}>{fee}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <p className="relative z-10 text-xs text-slate-700">© 2027 OPJU Technorollix</p>
    </div>
  );
}

export default function SignupPage() {
  const [step, setStep] = useState<Step>(1);
  const [email, setEmail] = useState("");
  const [isInternal, setIsInternal] = useState(false);

  const handleEmailNext = (submittedEmail: string, internal: boolean) => {
    setEmail(submittedEmail);
    setIsInternal(internal);
    setStep(2);
  };

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[5fr_7fr]">
      <BrandPanel />

      {/* Form side */}
      <div className="flex flex-col min-h-screen bg-white">
        {/* Mobile top bar */}
        <div className="flex items-center gap-2 px-6 py-5 border-b border-slate-100 lg:hidden">
          <Zap className="h-4 w-4 text-violet-600" />
          <span className="text-sm font-bold text-slate-900 tracking-tight">Technorollix 2027</span>
        </div>

        {/* Scrollable form area */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-2xl mx-auto px-6 py-10 animate-slide-up">

            {/* Heading */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold tracking-tight text-slate-900">Create account</h1>
              <p className="text-sm text-slate-500 mt-1">Join Technorollix 2027 · Takes about 3 minutes</p>
            </div>

            {/* Step progress */}
            <div className="flex items-center gap-0 mb-8">
              {STEPS.map(({ n, label }, i) => (
                <div key={n} className="flex items-center flex-1 last:flex-none">
                  <div className="flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                      step > n
                        ? "bg-violet-600 text-white"
                        : step === n
                          ? "bg-violet-600 text-white ring-4 ring-violet-100"
                          : "bg-slate-100 text-slate-400"
                    }`}>
                      {step > n ? <CheckCircle2 className="h-4 w-4" /> : n}
                    </div>
                    <span className={`text-[10px] mt-1 font-medium ${step === n ? "text-violet-700" : "text-slate-400"}`}>
                      {label}
                    </span>
                  </div>
                  {i < STEPS.length - 1 && (
                    <div className={`flex-1 h-0.5 mx-2 mb-4 rounded-full transition-colors ${step > n ? "bg-violet-600" : "bg-slate-100"}`} />
                  )}
                </div>
              ))}
            </div>

            {/* Step content */}
            {step === 1 && <EnterEmail onNext={handleEmailNext} />}
            {step === 2 && <VerifyOtp email={email} onNext={() => setStep(3)} onBack={() => setStep(1)} />}
            {step === 3 && <SignupForm email={email} isInternal={isInternal} />}

            {step === 1 && (
              <p className="text-center text-sm text-slate-500 mt-6">
                Already have an account?{" "}
                <Link href="/auth/login" className="text-violet-600 hover:text-violet-700 font-semibold transition-colors">
                  Sign in
                </Link>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
