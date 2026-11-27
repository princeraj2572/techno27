"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { sendOtp } from "@/features/users/otp-actions";
import { suggestEmail } from "@/features/users/email-domain";

interface Props {
  onNext: (email: string, isInternal: boolean) => void;
}

export default function EnterEmail({ onNext }: Props) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isInternal = email.toLowerCase().endsWith("@opju.ac.in");
  // instant typo hint: "you@gamil.com" -> "Did you mean you@gmail.com?"
  const suggestion = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim()) ? suggestEmail(email.trim().toLowerCase()) : null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email) return setError("Email is required");
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return setError("Invalid email address");

    setLoading(true);
    try {
      const res = await sendOtp(email, "signup");
      if (!res.ok) return setError(res.error);
      onNext(email.toLowerCase().trim(), isInternal);
    } catch {
      setError("Failed to send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email Address</Label>
        <Input
          id="email"
          type="email"
          placeholder="you@example.com or you@opju.ac.in"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        {suggestion && (
          <p role="status" className="text-sm normal-case tracking-normal text-[#1c1812]">
            Did you mean{" "}
            <button type="button" onClick={() => { setEmail(suggestion); setError(""); }} className="font-bold normal-case tracking-normal text-[#0f6b63] underline underline-offset-2">
              {suggestion}
            </button>
            ?
          </p>
        )}
        {email && (
          <div className="flex items-center gap-2">
            <Badge variant={isInternal ? "default" : "secondary"}>
              {isInternal ? "OPJU (Free)" : "External (Paid)"}
            </Badge>
            <span className="text-xs text-muted-foreground">
              {isInternal
                ? "OPJU students get free registration"
                : "External participants must pay registration fees"}
            </span>
          </div>
        )}
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Sending OTP..." : "Continue"}
      </Button>
    </form>
  );
}
