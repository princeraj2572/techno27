"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChevronLeft, UserPlus } from "lucide-react";
import Link from "next/link";
import { TicketTitle } from "@/components/indie/gold-poster";

export default function CreateManagementPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    mobileNumber: "",
    role: "MANAGEMENT_ADMIN" as "MANAGEMENT_ADMIN" | "EVENT_MANAGER",
    department: "",
    gender: "Male" as "Male" | "Female" | "Other",
  });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMsg(null);
    try {
      const res = await fetch("/api/admin/management/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const d = await res.json();
      if (d.success) {
        setMsg({ type: "success", text: `Account created for ${form.fullName}.` });
        setTimeout(() => router.push("/dev/management"), 1500);
      } else {
        setMsg({ type: "error", text: d.error ?? "Failed to create account." });
      }
    } catch {
      setMsg({ type: "error", text: "Request failed." });
    } finally {
      setLoading(false);
    }
  }

  const inputClass = "h-10 rounded-xl border-slate-200 text-sm focus:ring-[#f5c928] focus:border-[#1c1812]/30";
  const selectClass = "w-full h-10 px-3 rounded-xl border border-slate-200 bg-white text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#f5c928] focus:border-[#1c1812]/30";

  return (
    <div className="">
      <div className="max-w-xl mx-auto px-4 py-8 space-y-7">

        {/* Header */}
        <div className="flex items-center justify-between animate-slide-up" style={{ animationDelay: "0s" }}>
          <div>
            <Link href="/dev/management" className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-[#0f6b63] transition-colors mb-1">
              <ChevronLeft className="h-3.5 w-3.5" /> Management
            </Link>
            <TicketTitle className="mb-2 text-3xl leading-[1.1] break-words sm:text-5xl">Create account</TicketTitle>
            <p className="text-xs text-slate-500 mt-0.5">Add a Management Admin or Event Manager</p>
          </div>
          <div className="w-12 h-12 rounded-full border-[3px] border-[#1c1812] bg-[#f5c928] shadow-[0_4px_0_#1c1812] flex items-center justify-center">
            <UserPlus className="h-5 w-5 text-[#0f6b63]" />
          </div>
        </div>

        {/* Form */}
        <div className="bg-white border-[3px] border-[#1c1812] shadow-[0_4px_0_#1c1812] rounded-2xl px-5 py-5 animate-slide-up" style={{ animationDelay: "0.06s" }}>
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Role */}
            <div className="space-y-1.5">
              <Label className="text-xs text-slate-600">Role</Label>
              <select value={form.role} onChange={(e) => set("role", e.target.value)} className={selectClass} required>
                <option value="MANAGEMENT_ADMIN">Management Admin</option>
                <option value="EVENT_MANAGER">Event Manager</option>
              </select>
            </div>

            {/* Full name */}
            <div className="space-y-1.5">
              <Label className="text-xs text-slate-600">Full Name</Label>
              <Input value={form.fullName} onChange={(e) => set("fullName", e.target.value)} className={inputClass} required />
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <Label className="text-xs text-slate-600">Email</Label>
              <Input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} className={inputClass} placeholder="e.g. manager@opju.ac.in" required />
            </div>

            {/* Mobile */}
            <div className="space-y-1.5">
              <Label className="text-xs text-slate-600">Mobile Number</Label>
              <Input value={form.mobileNumber} onChange={(e) => set("mobileNumber", e.target.value)} className={inputClass} required />
            </div>

            {/* Department */}
            <div className="space-y-1.5">
              <Label className="text-xs text-slate-600">Department <span className="text-slate-300">(optional)</span></Label>
              <Input value={form.department} onChange={(e) => set("department", e.target.value)} className={inputClass} />
            </div>

            {/* Gender */}
            <div className="space-y-1.5">
              <Label className="text-xs text-slate-600">Gender</Label>
              <select value={form.gender} onChange={(e) => set("gender", e.target.value)} className={selectClass}>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <Label className="text-xs text-slate-600">Password</Label>
              <Input type="password" value={form.password} onChange={(e) => set("password", e.target.value)} className={inputClass} required minLength={8} placeholder="Min 8 characters" />
            </div>

            {msg && (
              <p className={`text-xs px-3 py-2 rounded-xl ${msg.type === "success" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-red-50 text-red-600 border border-red-200"}`}>
                {msg.text}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full h-10 rounded-xl bg-[#0f6b63] text-white text-sm font-medium hover:bg-[#0b4f49] disabled:opacity-50 transition-colors"
            >
              {loading ? "Creating..." : "Create account"}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
