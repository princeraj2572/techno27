"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

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

  return (
    <div className="max-w-xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Create Management Account</h1>
        <Link href="/dev/management" className="text-sm text-muted-foreground hover:text-primary">← Back</Link>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">Account Details</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-sm font-medium">Role</label>
              <select
                value={form.role}
                onChange={(e) => set("role", e.target.value)}
                className="w-full px-3 py-2 rounded-md border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                required
              >
                <option value="MANAGEMENT_ADMIN">Management Admin</option>
                <option value="EVENT_MANAGER">Event Manager</option>
              </select>
            </div>

            {(["fullName", "email", "mobileNumber", "department"] as const).map((field) => (
              <div key={field} className="space-y-1">
                <label className="text-sm font-medium capitalize">
                  {field === "fullName" ? "Full Name" : field === "mobileNumber" ? "Mobile Number" : field.charAt(0).toUpperCase() + field.slice(1)}
                </label>
                <input
                  type={field === "email" ? "email" : "text"}
                  value={form[field]}
                  onChange={(e) => set(field, e.target.value)}
                  className="w-full px-3 py-2 rounded-md border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  required={field !== "department"}
                  placeholder={field === "email" ? "e.g. manager@opju.ac.in" : ""}
                />
              </div>
            ))}

            <div className="space-y-1">
              <label className="text-sm font-medium">Gender</label>
              <select
                value={form.gender}
                onChange={(e) => set("gender", e.target.value)}
                className="w-full px-3 py-2 rounded-md border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium">Password</label>
              <input
                type="password"
                value={form.password}
                onChange={(e) => set("password", e.target.value)}
                className="w-full px-3 py-2 rounded-md border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                required
                minLength={8}
                placeholder="Min 8 characters"
              />
            </div>

            {msg && (
              <p className={`text-sm ${msg.type === "success" ? "text-green-500" : "text-destructive"}`}>
                {msg.text}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 disabled:opacity-50"
            >
              {loading ? "Creating..." : "Create Account"}
            </button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
