"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import EnterEmail from "./EnterEmail";
import VerifyOtp from "./VerifyOtp";
import SignupForm from "./SignupForm";

type Step = 1 | 2 | 3;

const STEP_LABELS = ["Email", "Verify OTP", "Your Details"];

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
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-16">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Create Account</CardTitle>
          <CardDescription>Join Technorollix 2027</CardDescription>

          {/* Step indicator */}
          <div className="flex items-center justify-center gap-2 mt-4">
            {STEP_LABELS.map((label, i) => {
              const n = (i + 1) as Step;
              return (
                <div key={n} className="flex items-center gap-2">
                  <div
                    className={`flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold transition-colors ${
                      step === n
                        ? "bg-primary text-primary-foreground"
                        : step > n
                          ? "bg-primary/30 text-primary"
                          : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {n}
                  </div>
                  <span
                    className={`text-xs hidden sm:block ${step === n ? "text-foreground font-medium" : "text-muted-foreground"}`}
                  >
                    {label}
                  </span>
                  {i < STEP_LABELS.length - 1 && (
                    <div className={`h-px w-8 ${step > n ? "bg-primary/50" : "bg-border"}`} />
                  )}
                </div>
              );
            })}
          </div>
        </CardHeader>

        <CardContent>
          {step === 1 && <EnterEmail onNext={handleEmailNext} />}
          {step === 2 && (
            <VerifyOtp
              email={email}
              onNext={() => setStep(3)}
              onBack={() => setStep(1)}
            />
          )}
          {step === 3 && <SignupForm email={email} isInternal={isInternal} />}

          {step === 1 && (
            <p className="text-center text-sm text-muted-foreground mt-4">
              Already have an account?{" "}
              <Link href="/auth/login" className="text-primary hover:underline">
                Sign in
              </Link>
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
