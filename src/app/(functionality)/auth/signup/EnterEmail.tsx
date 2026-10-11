"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { sendWelcomeEmail } from "@/lib/mailer";

interface Props {
  onNext: (email: string, isInternal: boolean) => void;
}

export default function EnterEmail({ onNext }: Props) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isInternal = email.toLowerCase().endsWith("@opju.ac.in");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email) return setError("Email is required");
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return setError("Invalid email address");

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
