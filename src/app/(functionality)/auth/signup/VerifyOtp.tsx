"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { verifyOtp } from "@/features/users/otp-actions";

interface Props {
  email: string;
  onNext: () => void;
  onBack: () => void;
}

export default function VerifyOtp({ email, onNext, onBack }: Props) {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await verifyOtp(email, otp, "signup").finally(() => setLoading(false));
    if (!res.ok) return setError(res.error);
    onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <p className="text-sm text-muted-foreground text-center">
        We sent a 6-digit OTP to <strong>{email}</strong>
      </p>
      <div className="space-y-2">
        <Label htmlFor="otp">One-Time Password</Label>
        <Input
          id="otp"
          placeholder="Enter 6-digit OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          maxLength={6}
          required
        />
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
      <Button type="submit" className="w-full" disabled={loading}>{loading ? "Verifying..." : "Verify OTP"}</Button>
      <Button type="button" variant="ghost" className="w-full" onClick={onBack}>
        Back
      </Button>
    </form>
  );
}
