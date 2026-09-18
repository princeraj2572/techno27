"use client";
export const dynamic = "force-dynamic";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

const ROLE_OPTIONS = [
  "DEV_ADMIN",
  "MANAGEMENT_ADMIN",
  "EVENT_MANAGER",
  "INTERNAL_USER",
  "EXTERNAL_USER",
] as const;

const ROLE_CHIP: Record<string, string> = {
  DEV_ADMIN:        "bg-red-50    text-red-700    border-red-200",
  MANAGEMENT_ADMIN: "bg-purple-50 text-purple-700 border-purple-200",
  EVENT_MANAGER:    "bg-blue-50   text-blue-700   border-blue-200",
  INTERNAL_USER:    "bg-indigo-50 text-indigo-700 border-indigo-200",
  EXTERNAL_USER:    "bg-amber-50  text-amber-700  border-amber-200",
};

type UserDetail = {
  _id: string; fullName: string; email: string; role: string;
  mobileNumber?: string; gender?: string; department?: string;
  program?: string; branch?: string; year?: string; semester?: string;
  section?: string; enrollmentNumber?: string; dayScholarOrHosteller?: string;
  collegeName?: string; city?: string; state?: string; participantId?: string;
  accommodationNeeded?: boolean; profilePhotoUrl?: string;
  address?: string; emergencyContactName?: string; emergencyContactNumber?: string;
  createdAt?: string;
};

export default function DevUserDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState<UserDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [newRole, setNewRole] = useState("");
  const [roleMsg, setRoleMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch(`/api/admin/user/${id}`)
      .then((r) => r.json())
      .then((d) => {
        setUser(d.user ?? null);
        setNewRole(d.user?.role ?? "");
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  async function handleRoleChange() {
    if (!user || newRole === user.role) return;
    setSaving(true);
    setRoleMsg(null);
    try {
      const res = await fetch("/api/admin/user/role", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetUserId: id, newRole }),
      });
      const d = await res.json();
      if (d.success) {
        setUser((prev) => prev ? { ...prev, role: newRole } : prev);
        setRoleMsg({ type: "success", text: "Role updated successfully." });
      } else {
        setRoleMsg({ type: "error", text: d.error ?? "Failed to update role." });
      }
    } catch {
      setRoleMsg({ type: "error", text: "Request failed." });
    } finally {
      setSaving(false);
    }
  }

  if (loading) return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="space-y-3 animate-pulse w-full max-w-3xl px-4">
        <div className="h-4 bg-slate-100 rounded w-24" />
        <div className="h-8 bg-slate-100 rounded w-48" />
        <div className="h-32 bg-slate-100 rounded-2xl" />
      </div>
    </div>
  );

  if (!user) return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <p className="text-sm text-slate-400">User not found.</p>
    </div>
  );

  const isExternal = user.role === "EXTERNAL_USER";

  const fields: [string, string | boolean | undefined][] = [
    ["Email",            user.email],
    ["Mobile",           user.mobileNumber],
    ["Gender",           user.gender],
    ["Department",       user.department],
    ["Program",          user.program],
    ["Branch",           user.branch],
    ["Year",             user.year],
    ...(user.role === "INTERNAL_USER"
      ? ([
          ["Semester",             user.semester],
          ["Section",              user.section],
          ["Enrollment No.",       user.enrollmentNumber],
          ["Day Scholar / Hosteller", user.dayScholarOrHosteller],
        ] as [string, string | undefined][])
      : ([
          ["College Name",         user.collegeName],
          ["City",                 user.city],
          ["State",                user.state],
          ["Participant ID",       user.participantId],
          ["Accommodation Needed", user.accommodationNeeded ? "Yes" : "No"],
        ] as [string, string | undefined][])),
    ["Address",              user.address],
    ["Emergency Contact",    user.emergencyContactName],
    ["Emergency Contact No.", user.emergencyContactNumber],
    ["Joined",               user.createdAt ? new Date(user.createdAt).toLocaleDateString() : undefined],
  ];

  const selectClass = "w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-300";

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-4 py-8 space-y-7">

        {/* Header */}
        <div className="flex items-start justify-between animate-slide-up" style={{ animationDelay: "0s" }}>
          <div>
            <Link href="/dev/users" className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-indigo-600 transition-colors mb-1">
              ← Users
            </Link>
            <div className="flex items-center gap-3 mt-1">
              {user.profilePhotoUrl ? (
                <Image
                  src={user.profilePhotoUrl}
                  alt="Profile"
                  width={48}
                  height={48}
                  className="rounded-full object-cover border border-slate-100"
                  unoptimized
                />
              ) : (
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-base font-bold ${
                  isExternal ? "bg-amber-100 text-amber-700" : "bg-indigo-100 text-indigo-700"
                }`}>
                  {user.fullName[0]?.toUpperCase()}
                </div>
              )}
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">{user.fullName}</h1>
                <p className="text-xs text-slate-400">{user.email}</p>
              </div>
            </div>
          </div>
          <span className={`text-xs font-semibold px-2 py-1 rounded-full border shrink-0 mt-1 ${ROLE_CHIP[user.role] ?? "bg-slate-50 text-slate-600 border-slate-200"}`}>
            {user.role.replace(/_/g, " ")}
          </span>
        </div>

        {/* Profile fields */}
        <div className="bg-white border border-slate-100 rounded-2xl px-5 py-5 animate-slide-up" style={{ animationDelay: "0.06s" }}>
          <p className="text-xs font-semibold text-slate-400 mb-4">Profile details</p>
          <dl className="grid grid-cols-2 gap-x-6 gap-y-4">
            {fields.map(([label, value]) =>
              value !== undefined && value !== "" ? (
                <div key={label}>
                  <dt className="text-xs text-slate-400">{label}</dt>
                  <dd className="text-sm font-medium text-slate-900 mt-0.5">{String(value)}</dd>
                </div>
              ) : null
            )}
          </dl>
        </div>

        {/* Change role */}
        <div className="bg-white border border-slate-100 rounded-2xl px-5 py-5 animate-slide-up" style={{ animationDelay: "0.1s" }}>
          <p className="text-xs font-semibold text-slate-400 mb-4">Change role</p>
          <div className="space-y-3">
            <select value={newRole} onChange={(e) => setNewRole(e.target.value)} className={selectClass}>
              {ROLE_OPTIONS.map((r) => (
                <option key={r} value={r}>{r.replace(/_/g, " ")}</option>
              ))}
            </select>
            <button
              onClick={handleRoleChange}
              disabled={saving || newRole === user.role}
              className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 disabled:opacity-40 transition-colors"
            >
              {saving ? "Saving..." : "Update role"}
            </button>
            {roleMsg && (
              <p className={`text-xs ${roleMsg.type === "success" ? "text-emerald-600" : "text-red-600"}`}>
                {roleMsg.text}
              </p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
