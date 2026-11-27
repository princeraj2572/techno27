"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { serif } from "@/components/indie";
import styles from "./signup.module.css";
import EnterEmail from "./EnterEmail";
import VerifyOtp from "./VerifyOtp";
import SignupForm from "./SignupForm";
import HangingNazar from "@/components/HangingNazar";

type Step = 1 | 2 | 3;

const STEP_LABELS = ["Email", "Verify OTP", "Your Details"];

export default function SignupPage() {
  const [step, setStep] = useState<Step>(1);
  const [email, setEmail] = useState("");
  const [isInternal, setIsInternal] = useState(false);
  const heading = useRef<HTMLHeadingElement>(null);
  const frame = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const header = document.querySelector("body header");
    if (!header) return;
    const observer = new ResizeObserver(() => frame.current?.style.setProperty("--header-height", getComputedStyle(document.documentElement).getPropertyValue("--public-header-offset").trim() || "64px"));
    observer.observe(header);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    heading.current?.focus({ preventScroll: true });
    if (step === 3) heading.current?.scrollIntoView({ block: "start", behavior: "instant" });
  }, [step]);

  const handleEmailNext = (submittedEmail: string, internal: boolean) => {
    setEmail(submittedEmail);
    setIsInternal(internal);
    setStep(2);
  };

  return (
    <div ref={frame} className={styles.registration} data-details={step === 3}>
      <div className={styles.artboard}>
      <HangingNazar fixed={step === 3} />
      <div className={styles.artwork}>{["left", "right", "bottom"].map(side => <img key={side} className={styles.landscape} src={`/images/registration-frame/${side}.png`} width={6400} height={3600} alt="" />)}</div>
      {step === 3 && <>
        <div className={styles.detailsWatermark} aria-hidden="true">
          <img src="/images/registration-frame/lighter.png" width={1030} height={1526} alt="" />
        </div>
        <div className={styles.detailsFrame} aria-hidden="true">
          <img className={styles.detailsLeft} src="/images/registration-frame/registration-left.png" width={1767} height={3600} alt="" />
        </div>
      </>}
      <section className={styles.content}>
        {step !== 3 && <img className={styles.watermark} src="/images/registration-frame/lighter.png" width={1030} height={1526} alt="" />}
        <header>
          <p className={styles.tag}>Join the riot</p>
          <h1 ref={heading} tabIndex={-1} className={serif.className}>Create Account</h1>
          <p>Join Techno-aiMBiAtion 2027</p>
          <ol className={styles.steps} aria-label="Registration progress">{STEP_LABELS.map((label, index) => <li key={label} aria-current={index === step - 1 ? "step" : undefined} data-done={index < step - 1}><span>{index < step - 1 ? "✓" : index + 1}</span>{label}</li>)}</ol>
        </header>
        <div key={step} className={styles.step}>
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
        </div>
      </section>
      </div>
    </div>
  );
}
