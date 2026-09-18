"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Upload, CheckCircle2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { userSignup } from "@/actions/user-actions";

interface Props {
  email: string;
  isInternal: boolean;
}

function FieldRow({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">{children}</div>;
}

function SectionLabel({ label, color = "violet" }: { label: string; color?: "violet" | "sky" }) {
  const cls = color === "sky"
    ? "bg-sky-50 border-sky-200 text-sky-700"
    : "bg-violet-50 border-violet-200 text-violet-700";
  return (
    <div className={`px-3 py-1.5 rounded-lg border text-xs font-semibold tracking-wide ${cls}`}>
      {label}
    </div>
  );
}

export default function SignupForm({ email, isInternal }: Props) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [photoName, setPhotoName] = useState("");
  const [photoUploading, setPhotoUploading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [form, setForm] = useState({
    fullName: "", mobileNumber: "", gender: "", department: "",
    program: "", branch: "", year: "", address: "",
    emergencyContactName: "", emergencyContactNumber: "", dateOfBirth: "",
    password: "", confirmPassword: "",
    // INTERNAL
    enrollmentNumber: "", semester: "", section: "", dayScholarOrHosteller: "",
    // EXTERNAL
    collegeName: "", city: "", state: "", accommodationNeeded: "",
  });

  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [key]: e.target.value }));
  const sel = (key: string) => (v: string) =>
    setForm((prev) => ({ ...prev, [key]: v }));

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoUploading(true);
    setPhotoName(file.name);
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
    if (form.password !== form.confirmPassword) return setError("Passwords do not match");
    if (form.password.length < 8) return setError("Password must be at least 8 characters");
    if (!isInternal && !photoUrl) return setError("Profile photo is required for external participants");
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(form.mobileNumber)) return setError("Mobile number must be exactly 10 digits");
    if (!phoneRegex.test(form.emergencyContactNumber)) return setError("Emergency contact number must be exactly 10 digits");

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
        branch: form.branch,
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

  const inputCls = "h-10 rounded-xl border-slate-200 bg-slate-50 focus:bg-white transition-colors text-sm";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">

      {/* Who you are */}
      <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border ${isInternal ? "bg-sky-50 border-sky-200" : "bg-violet-50 border-violet-200"}`}>
        <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${isInternal ? "bg-sky-600" : "bg-violet-600"}`}>
          <span className="text-white text-xs font-bold">{isInternal ? "IN" : "EX"}</span>
        </div>
        <div>
          <p className={`text-xs font-semibold ${isInternal ? "text-sky-800" : "text-violet-800"}`}>
            {isInternal ? "OPJU Student" : "External Participant"}
          </p>
          <p className={`text-xs ${isInternal ? "text-sky-600" : "text-violet-600"}`}>{email}</p>
        </div>
      </div>

      {/* Personal info */}
      <div className="space-y-4">
        <SectionLabel label="Personal information" color={isInternal ? "sky" : "violet"} />
        <FieldRow>
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-slate-600">Full Name *</Label>
            <Input className={inputCls} placeholder="Your full name" value={form.fullName} onChange={set("fullName")} required />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-slate-600">Mobile Number *</Label>
            <Input className={inputCls} placeholder="10-digit number" value={form.mobileNumber} onChange={set("mobileNumber")} maxLength={10} required />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-slate-600">Gender *</Label>
            <Select value={form.gender} onValueChange={sel("gender")}>
              <SelectTrigger className={inputCls}><SelectValue placeholder="Select gender" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Male">Male</SelectItem>
                <SelectItem value="Female">Female</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-slate-600">Date of Birth</Label>
            <Input className={inputCls} type="date" value={form.dateOfBirth} onChange={set("dateOfBirth")} />
          </div>
        </FieldRow>
        <div className="space-y-1.5">
          <Label className="text-xs font-medium text-slate-600">Address *</Label>
          <Input className={inputCls} placeholder="Your full address" value={form.address} onChange={set("address")} required />
        </div>
      </div>

      {/* Academic info */}
      <div className="space-y-4">
        <SectionLabel label="Academic details" color={isInternal ? "sky" : "violet"} />
        <FieldRow>
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-slate-600">Department *</Label>
            <Input className={inputCls} placeholder="e.g. Engineering" value={form.department} onChange={set("department")} required />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-slate-600">Program *</Label>
            <Input className={inputCls} placeholder="e.g. B.Tech" value={form.program} onChange={set("program")} required />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-slate-600">Branch *</Label>
            <Input className={inputCls} placeholder="e.g. CSE" value={form.branch} onChange={set("branch")} required />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-slate-600">Year of Study *</Label>
            <Select value={form.year} onValueChange={sel("year")}>
              <SelectTrigger className={inputCls}><SelectValue placeholder="Select year" /></SelectTrigger>
              <SelectContent>
                {["1st","2nd","3rd","4th"].map((y) => (
                  <SelectItem key={y} value={y}>{y} Year</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </FieldRow>
      </div>

      {/* INTERNAL-only */}
      {isInternal && (
        <div className="space-y-4">
          <SectionLabel label="OPJU details" color="sky" />
          <FieldRow>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-slate-600">Enrollment Number *</Label>
              <Input className={inputCls} placeholder="Your enrollment number" value={form.enrollmentNumber} onChange={set("enrollmentNumber")} required />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-slate-600">Semester</Label>
              <Select value={form.semester} onValueChange={sel("semester")}>
                <SelectTrigger className={inputCls}><SelectValue placeholder="Select semester" /></SelectTrigger>
                <SelectContent>
                  {[1,2,3,4,5,6,7,8].map((s) => (
                    <SelectItem key={s} value={String(s)}>Semester {s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-slate-600">Section</Label>
              <Input className={inputCls} placeholder="e.g. A, B" value={form.section} onChange={set("section")} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-slate-600">Day Scholar / Hosteller</Label>
              <Select value={form.dayScholarOrHosteller} onValueChange={sel("dayScholarOrHosteller")}>
                <SelectTrigger className={inputCls}><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Day Scholar">Day Scholar</SelectItem>
                  <SelectItem value="Hosteller">Hosteller</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </FieldRow>
        </div>
      )}

      {/* EXTERNAL-only */}
      {!isInternal && (
        <div className="space-y-4">
          <SectionLabel label="College details" color="violet" />
          <FieldRow>
            <div className="space-y-1.5 sm:col-span-2">
              <Label className="text-xs font-medium text-slate-600">College Name *</Label>
              <Input className={inputCls} placeholder="Your college name" value={form.collegeName} onChange={set("collegeName")} required />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-slate-600">City *</Label>
              <Input className={inputCls} placeholder="City" value={form.city} onChange={set("city")} required />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-slate-600">State *</Label>
              <Input className={inputCls} placeholder="State" value={form.state} onChange={set("state")} required />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-slate-600">Accommodation needed? *</Label>
              <Select value={form.accommodationNeeded} onValueChange={sel("accommodationNeeded")}>
                <SelectTrigger className={inputCls}><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Yes — I need accommodation</SelectItem>
                  <SelectItem value="no">No — I have my own</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </FieldRow>
        </div>
      )}

      {/* Emergency contact */}
      <div className="space-y-4">
        <SectionLabel label="Emergency contact" color={isInternal ? "sky" : "violet"} />
        <FieldRow>
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-slate-600">Contact Name *</Label>
            <Input className={inputCls} placeholder="Parent / Guardian name" value={form.emergencyContactName} onChange={set("emergencyContactName")} required />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-slate-600">Contact Number *</Label>
            <Input className={inputCls} placeholder="10-digit number" value={form.emergencyContactNumber} onChange={set("emergencyContactNumber")} maxLength={10} required />
          </div>
        </FieldRow>
      </div>

      {/* Profile photo */}
      <div className="space-y-3">
        <SectionLabel label={`Profile photo${!isInternal ? " (required)" : " (optional)"}`} color={isInternal ? "sky" : "violet"} />
        {!isInternal && (
          <p className="text-xs text-slate-500">Required for external participants — shown at entrance for identity verification.</p>
        )}
        <div
          onClick={() => fileInputRef.current?.click()}
          className={`flex items-center gap-4 px-4 py-4 rounded-xl border-2 border-dashed cursor-pointer transition-colors ${
            photoUrl
              ? "border-emerald-300 bg-emerald-50"
              : "border-slate-200 hover:border-violet-300 hover:bg-violet-50/30 bg-slate-50"
          }`}
        >
          {photoUrl ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={photoUrl} alt="Profile" className="h-12 w-12 rounded-xl object-cover border-2 border-emerald-300 shrink-0" />
              <div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                  <p className="text-sm font-medium text-emerald-700">Photo uploaded</p>
                </div>
                <p className="text-xs text-slate-400 mt-0.5 truncate max-w-xs">{photoName}</p>
              </div>
            </>
          ) : (
            <>
              <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
                {photoUploading
                  ? <span className="h-5 w-5 border-2 border-violet-300 border-t-violet-600 rounded-full animate-spin" />
                  : <Upload className="h-5 w-5 text-slate-400" />}
              </div>
              <div>
                <p className="text-sm font-medium text-slate-700">
                  {photoUploading ? "Uploading…" : "Click to upload photo"}
                </p>
                <p className="text-xs text-slate-400 mt-0.5">JPG, PNG or WebP · max 2 MB</p>
              </div>
            </>
          )}
        </div>
        <input ref={fileInputRef} type="file" accept="image/jpeg,image/jpg,image/png,image/webp" className="hidden" onChange={handlePhotoUpload} />
      </div>

      {/* Password */}
      <div className="space-y-4">
        <SectionLabel label="Set password" color={isInternal ? "sky" : "violet"} />
        <FieldRow>
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-slate-600">Password *</Label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Min. 8 characters"
                value={form.password}
                onChange={set("password")}
                className={`${inputCls} pr-11`}
                required
              />
              <button type="button" onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-slate-600">Confirm Password *</Label>
            <div className="relative">
              <Input
                type={showConfirm ? "text" : "password"}
                placeholder="Re-enter password"
                value={form.confirmPassword}
                onChange={set("confirmPassword")}
                className={`${inputCls} pr-11`}
                required
              />
              <button type="button" onClick={() => setShowConfirm((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
        </FieldRow>
      </div>

      {error && (
        <div className="px-4 py-3 rounded-xl bg-red-50 border border-red-200">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={loading || photoUploading}
        className="w-full h-11 rounded-xl bg-violet-600 hover:bg-violet-700 disabled:bg-violet-300 text-white text-sm font-semibold transition-colors flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <span className="h-4 w-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            Creating account…
          </>
        ) : "Create account"}
      </button>
    </form>
  );
}
