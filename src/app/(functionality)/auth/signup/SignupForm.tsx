"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { userSignup } from "@/actions/user-actions";
import { OPJU_DEPARTMENTS, OPJU_BRANCHES } from "@/data/opju-academics";

interface Props {
  email: string;
  isInternal: boolean;
}

export default function SignupForm({ email, isInternal }: Props) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [photoUploading, setPhotoUploading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [form, setForm] = useState({
    fullName: "",
    mobileNumber: "",
    gender: "",
    department: "",
    program: "",
    branch: "",
    year: "",
    address: "",
    emergencyContactName: "",
    emergencyContactNumber: "",
    dateOfBirth: "",
    password: "",
    confirmPassword: "",
    // INTERNAL
    enrollmentNumber: "",
    semester: "",
    section: "",
    dayScholarOrHosteller: "",
    // EXTERNAL
    collegeName: "",
    city: "",
    state: "",
    accommodationNeeded: "",
    // Custom branch when "Other" is selected
    otherBranch: "",
  });

  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (data.url) setPhotoUrl(data.url);
      else setError("Photo upload failed. Please try again.");
    } catch {
      setError("Photo upload failed. Please try again.");
    } finally {
      setPhotoUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      return setError("Passwords do not match");
    }
    if (form.password.length < 8) {
      return setError("Password must be at least 8 characters");
    }
    if (!isInternal && !photoUrl) {
      return setError("Profile photo is required for external participants");
    }
    if (!form.department) {
      return setError("Please select a department");
    }
    if (!form.branch) {
      return setError("Please select a branch");
    }
    if (form.branch === "__other" && !form.otherBranch.trim()) {
      return setError("Please enter your branch name");
    }

    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(form.mobileNumber)) {
      return setError("Mobile number must be exactly 10 digits");
    }
    if (!phoneRegex.test(form.emergencyContactNumber)) {
      return setError("Emergency contact number must be exactly 10 digits");
    }

    setLoading(true);
    try {
      await userSignup({
        email,
        password: form.password,
        fullName: form.fullName,
        mobileNumber: form.mobileNumber,
        gender: form.gender as "Male" | "Female" | "Other",
        department: form.department,
        program: form.program,
        branch: form.branch === "__other" ? form.otherBranch.trim() : form.branch,
        year: form.year as "1st" | "2nd" | "3rd" | "4th",
        address: form.address,
        emergencyContactName: form.emergencyContactName,
        emergencyContactNumber: form.emergencyContactNumber,
        dateOfBirth: form.dateOfBirth || undefined,
        profilePhotoUrl: photoUrl || undefined,
        ...(isInternal
          ? {
              enrollmentNumber: form.enrollmentNumber,
              semester: form.semester || undefined,
              section: form.section || undefined,
              dayScholarOrHosteller: form.dayScholarOrHosteller as "Day Scholar" | "Hosteller" | undefined,
            }
          : {
              collegeName: form.collegeName,
              city: form.city,
              state: form.state,
              accommodationNeeded: form.accommodationNeeded === "yes",
            }),
      });

      sessionStorage.removeItem("signup_otp");
      sessionStorage.removeItem("signup_email");
      sessionStorage.removeItem("signup_is_internal");

      router.push("/auth/login?registered=1");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <Badge variant={isInternal ? "default" : "secondary"}>
          {isInternal ? "OPJU Student" : "External Participant"}
        </Badge>
        <span className="text-xs text-muted-foreground truncate">{email}</span>
      </div>

      {/* Shared fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label>Full Name *</Label>
          <Input placeholder="Your full name" value={form.fullName} onChange={set("fullName")} required />
        </div>
        <div className="space-y-1">
          <Label>Mobile Number *</Label>
          <Input placeholder="10-digit number" value={form.mobileNumber} onChange={set("mobileNumber")} required maxLength={10} />
        </div>
        <div className="space-y-1">
          <Label>Gender *</Label>
          <Select value={form.gender} onValueChange={(v) => setForm((p) => ({ ...p, gender: v }))}>
            <SelectTrigger><SelectValue placeholder="Select gender" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="Male">Male</SelectItem>
              <SelectItem value="Female">Female</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1">
          <Label>Date of Birth</Label>
          <Input type="date" value={form.dateOfBirth} onChange={set("dateOfBirth")} />
        </div>
        <div className="space-y-1">
          <Label>Department *</Label>
          <Select value={form.department} onValueChange={(v) => setForm((p) => ({ ...p, department: v }))}>
            <SelectTrigger><SelectValue placeholder="Select department" /></SelectTrigger>
            <SelectContent>
              {OPJU_DEPARTMENTS.map((d) => (
                <SelectItem key={d} value={d}>{d}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1">
          <Label>Program *</Label>
          <Input placeholder="e.g. B.Tech" value={form.program} onChange={set("program")} required />
        </div>
        <div className="space-y-1">
          <Label>Branch *</Label>
          <Select value={form.branch} onValueChange={(v) => setForm((p) => ({ ...p, branch: v }))}>
            <SelectTrigger><SelectValue placeholder="Select branch" /></SelectTrigger>
            <SelectContent>
              {OPJU_BRANCHES.map((b) => (
                <SelectItem key={b} value={b}>{b}</SelectItem>
              ))}
              <SelectItem value="__other">Other</SelectItem>
            </SelectContent>
          </Select>
          {form.branch === "__other" && (
            <Input
              placeholder="Enter your branch name"
              value={form.otherBranch}
              onChange={set("otherBranch")}
              className="mt-1.5"
              required
            />
          )}
        </div>
        <div className="space-y-1">
          <Label>Year of Study *</Label>
          <Select value={form.year} onValueChange={(v) => setForm((p) => ({ ...p, year: v }))}>
            <SelectTrigger><SelectValue placeholder="Select year" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="1st">1st Year</SelectItem>
              <SelectItem value="2nd">2nd Year</SelectItem>
              <SelectItem value="3rd">3rd Year</SelectItem>
              <SelectItem value="4th">4th Year</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-1">
        <Label>Address *</Label>
        <Input placeholder="Your full address" value={form.address} onChange={set("address")} required />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label>Emergency Contact Name *</Label>
          <Input placeholder="Parent / Guardian name" value={form.emergencyContactName} onChange={set("emergencyContactName")} required />
        </div>
        <div className="space-y-1">
          <Label>Emergency Contact Number *</Label>
          <Input placeholder="10-digit number" value={form.emergencyContactNumber} onChange={set("emergencyContactNumber")} required maxLength={10} />
        </div>
      </div>

      {/* INTERNAL-only fields */}
      {isInternal && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-border pt-4">
          <div className="space-y-1">
            <Label>Enrollment Number *</Label>
            <Input placeholder="Your enrollment number" value={form.enrollmentNumber} onChange={set("enrollmentNumber")} required />
          </div>
          <div className="space-y-1">
            <Label>Semester</Label>
            <Select value={form.semester} onValueChange={(v) => setForm((p) => ({ ...p, semester: v }))}>
              <SelectTrigger><SelectValue placeholder="Select semester" /></SelectTrigger>
              <SelectContent>
                {[1,2,3,4,5,6,7,8].map(s => (
                  <SelectItem key={s} value={String(s)}>Semester {s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label>Section</Label>
            <Input placeholder="e.g. A, B" value={form.section} onChange={set("section")} />
          </div>
          <div className="space-y-1">
            <Label>Day Scholar / Hosteller</Label>
            <Select value={form.dayScholarOrHosteller} onValueChange={(v) => setForm((p) => ({ ...p, dayScholarOrHosteller: v }))}>
              <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Day Scholar">Day Scholar</SelectItem>
                <SelectItem value="Hosteller">Hosteller</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      {/* EXTERNAL-only fields */}
      {!isInternal && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-border pt-4">
          <div className="space-y-1">
            <Label>College Name *</Label>
            <Input placeholder="Your college name" value={form.collegeName} onChange={set("collegeName")} required />
          </div>
          <div className="space-y-1">
            <Label>City *</Label>
            <Input placeholder="City" value={form.city} onChange={set("city")} required />
          </div>
          <div className="space-y-1">
            <Label>State *</Label>
            <Input placeholder="State" value={form.state} onChange={set("state")} required />
          </div>
          <div className="space-y-1">
            <Label>Accommodation Needed? *</Label>
            <Select value={form.accommodationNeeded} onValueChange={(v) => setForm((p) => ({ ...p, accommodationNeeded: v }))}>
              <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="yes">Yes</SelectItem>
                <SelectItem value="no">No</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      {/* Profile Photo */}
      <div className="space-y-2 border-t border-border pt-4">
        <Label>
          Profile Photo {!isInternal ? "*" : "(Optional)"}
          {!isInternal && (
            <span className="ml-2 text-xs text-muted-foreground font-normal">
              Required — shown at entrance for identity verification
            </span>
          )}
        </Label>
        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            disabled={photoUploading}
          >
            {photoUploading ? "Uploading..." : "Choose Photo"}
          </Button>
          {photoUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={photoUrl} alt="Profile" className="h-10 w-10 rounded-full object-cover border" />
          )}
          <span className="text-xs text-muted-foreground">JPG/PNG/WebP, max 2MB</span>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp"
          className="hidden"
          onChange={handlePhotoUpload}
        />
      </div>

      {/* Password */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-border pt-4">
        <div className="space-y-1">
          <Label>Password *</Label>
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Min. 8 characters"
              value={form.password}
              onChange={set("password")}
              className="pr-10"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>
        <div className="space-y-1">
          <Label>Confirm Password *</Label>
          <div className="relative">
            <Input
              type={showConfirm ? "text" : "password"}
              placeholder="Re-enter password"
              value={form.confirmPassword}
              onChange={set("confirmPassword")}
              className="pr-10"
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirm((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label={showConfirm ? "Hide password" : "Show password"}
            >
              {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="px-3 py-2 rounded-lg bg-destructive/10 border border-destructive/20">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      <Button type="submit" className="w-full" disabled={loading || photoUploading}>
        {loading ? "Creating account..." : "Create Account"}
      </Button>
    </form>
  );
}
