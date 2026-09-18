"use client";
export const dynamic = "force-dynamic";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

const ROLE_OPTIONS = [
  "DEV_ADMIN",
  "MANAGEMENT_ADMIN",
  "EVENT_MANAGER",
  "INTERNAL_USER",
  "EXTERNAL_USER",
] as const;

type UserDetail = {
  _id: string;
  fullName: string;
  email: string;
  role: string;
  mobileNumber?: string;
  gender?: string;
  department?: string;
  program?: string;
  branch?: string;
  year?: string;
  semester?: string;
  section?: string;
  enrollmentNumber?: string;
  dayScholarOrHosteller?: string;
  collegeName?: string;
  city?: string;
  state?: string;
  participantId?: string;
  accommodationNeeded?: boolean;
  profilePhotoUrl?: string;
  address?: string;
  emergencyContactName?: string;
  emergencyContactNumber?: string;
  createdAt?: string;
};

export default function DevUserDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [user, setUser] = useState<UserDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [newRole, setNewRole] = useState("");
  const [roleMsg, setRoleMsg] = useState("");
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
    setRoleMsg("");
    try {
      const res = await fetch("/api/admin/user/role", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetUserId: id, newRole }),
      });
      const d = await res.json();
      if (d.success) {
        setUser((prev) => prev ? { ...prev, role: newRole } : prev);
        setRoleMsg("Role updated successfully.");
      } else {
        setRoleMsg(d.error ?? "Failed to update role.");
      }
    } catch {
      setRoleMsg("Request failed.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className="max-w-3xl mx-auto px-4 py-16 text-muted-foreground">Loading...</div>;
  if (!user) return <div className="max-w-3xl mx-auto px-4 py-16 text-muted-foreground">User not found.</div>;

  const fields: [string, string | undefined | boolean][] = [
    ["Email", user.email],
    ["Mobile", user.mobileNumber],
    ["Gender", user.gender],
    ["Department", user.department],
    ["Program", user.program],
    ["Branch", user.branch],
    ["Year", user.year],
    ...(user.role === "INTERNAL_USER"
      ? ([
          ["Semester", user.semester],
          ["Section", user.section],
          ["Enrollment No.", user.enrollmentNumber],
          ["Day Scholar / Hosteller", user.dayScholarOrHosteller],
        ] as [string, string | undefined | boolean][])
      : ([
          ["College Name", user.collegeName],
          ["City", user.city],
          ["State", user.state],
          ["Participant ID", user.participantId],
          ["Accommodation Needed", user.accommodationNeeded ? "Yes" : "No"],
        ] as [string, string | undefined | boolean][])),
    ["Address", user.address],
    ["Emergency Contact", user.emergencyContactName],
    ["Emergency Contact No.", user.emergencyContactNumber],
    ["Joined", user.createdAt ? new Date(user.createdAt).toLocaleDateString() : undefined],
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{user.fullName}</h1>
          <p className="text-muted-foreground text-sm">{user.email}</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline">{user.role.replace(/_/g, " ")}</Badge>
          <button onClick={() => router.back()} className="text-sm text-muted-foreground hover:text-primary">← Back</button>
        </div>
      </div>

      {user.profilePhotoUrl && (
        <Image
          src={user.profilePhotoUrl}
          alt="Profile"
          width={96}
          height={96}
          className="rounded-full object-cover border"
          unoptimized
        />
      )}

      <Card>
        <CardHeader><CardTitle className="text-base">Profile Details</CardTitle></CardHeader>
        <CardContent>
          <dl className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
            {fields.map(([label, value]) =>
              value !== undefined && value !== "" ? (
                <div key={label} className="col-span-1">
                  <dt className="text-muted-foreground text-xs">{label}</dt>
                  <dd className="font-medium">{String(value)}</dd>
                </div>
              ) : null
            )}
          </dl>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">Change Role</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <select
            value={newRole}
            onChange={(e) => setNewRole(e.target.value)}
            className="w-full px-3 py-2 rounded-md border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          >
            {ROLE_OPTIONS.map((r) => (
              <option key={r} value={r}>{r.replace(/_/g, " ")}</option>
            ))}
          </select>
          <button
            onClick={handleRoleChange}
            disabled={saving || newRole === user.role}
            className="px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 disabled:opacity-50"
          >
            {saving ? "Saving..." : "Update Role"}
          </button>
          {roleMsg && <p className="text-sm text-muted-foreground">{roleMsg}</p>}
        </CardContent>
      </Card>

      <div className="flex gap-3 text-sm">
        <Link href="/dev/users" className="text-primary hover:underline">← User Search</Link>
        <Link href="/dev" className="text-muted-foreground hover:text-primary">Dev Dashboard</Link>
      </div>
    </div>
  );
}
