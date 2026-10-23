"use client";

import { useState } from "react";
import Link from "next/link";
import { AuthCard, AuthShell } from "../auth-shell";
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
    <AuthShell>
      <AuthCard tag="Join the riot" title="Create Account" description="Join Techno-aiMBiAtion 2027" steps={STEP_LABELS} current={step - 1}>
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
            <Link href="/auth/login" className="font-bold text-[#a1001a] underline underline-offset-4 hover:text-[#ff6a00]">
              Sign in
            </Link>
          </p>
        )}
      </AuthCard>
    </AuthShell>
  );
}
