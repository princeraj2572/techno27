"use client";
export const dynamic = "force-dynamic";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  ChevronLeft, User, CalendarDays, UsersRound, Zap, Shield,
  Trash2, UserMinus, Send, Plus, Crown, Check, X, AlertCircle,
} from "lucide-react";

const ROLE_OPTIONS = [
  "DEV_ADMIN", "MANAGEMENT_ADMIN", "EVENT_MANAGER", "INTERNAL_USER", "EXTERNAL_USER",
] as const;

const ROLE_CHIP: Record<string, string> = {
  DEV_ADMIN:        "bg-red-50    text-red-700    border-red-200",
  MANAGEMENT_ADMIN: "bg-purple-50 text-purple-700 border-purple-200",
  EVENT_MANAGER:    "bg-blue-50   text-blue-700   border-blue-200",
  INTERNAL_USER:    "bg-sky-50    text-sky-700    border-sky-200",
  EXTERNAL_USER:    "bg-amber-50  text-amber-700  border-amber-200",
};

const ROLE_AVATAR: Record<string, string> = {
  DEV_ADMIN:        "bg-red-100    text-red-700",
  MANAGEMENT_ADMIN: "bg-purple-100 text-purple-700",
  EVENT_MANAGER:    "bg-blue-100   text-blue-700",
  INTERNAL_USER:    "bg-sky-100    text-sky-700",
  EXTERNAL_USER:    "bg-amber-100  text-amber-700",
};

const STATUS_LABEL: Record<string, { text: string; color: string; bg: string }> = {
  REGISTRATION_OPEN:   { text: "Open",      color: "text-emerald-700", bg: "bg-emerald-100" },
  EVENT_LIVE:          { text: "Live",       color: "text-blue-700",    bg: "bg-blue-100" },
  COMPLETED:           { text: "Completed",  color: "text-slate-500",   bg: "bg-slate-100" },
  CANCELLED:           { text: "Cancelled",  color: "text-red-700",     bg: "bg-red-100" },
  REGISTRATION_CLOSED: { text: "Closed",     color: "text-amber-700",   bg: "bg-amber-100" },
  TEMPORARILY_CLOSED:  { text: "Paused",     color: "text-orange-700",  bg: "bg-orange-100" },
  DRAFT:               { text: "Draft",      color: "text-slate-500",   bg: "bg-slate-100" },
  UPCOMING:            { text: "Upcoming",   color: "text-sky-700",     bg: "bg-sky-100" },
};

type MemberUser = { _id: string; fullName: string; email: string; role: string };
type TeamData = {
  _id: string; leader: string; members: string[]; size: number;
  event: { _id: string; name: string; status: string; category?: string } | null;
  memberUsers: MemberUser[];
  pendingInvites: { inviteeEmail: string }[];
};
type EventData = {
  _id: string; name: string; status: string; category?: string;
  teamSize?: number; prizeMoney?: number;
  team: { _id: string; leader: string; size: number } | null;
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

type Tab = "profile" | "events" | "teams" | "actions" | "role";

function Toast({ msg, type, onDismiss }: { msg: string; type: "success" | "error"; onDismiss: () => void }) {
  return (
    <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-lg border text-sm font-medium max-w-xs animate-slide-up ${
      type === "success" ? "bg-emerald-50 border-emerald-200 text-emerald-800" : "bg-red-50 border-red-200 text-red-800"
    }`}>
      {type === "success" ? <Check className="h-4 w-4 shrink-0" /> : <AlertCircle className="h-4 w-4 shrink-0" />}
      {msg}
      <button onClick={onDismiss} className="ml-2 text-current opacity-50 hover:opacity-80">
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

export default function DevUserDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState<UserDetail | null>(null);
  const [teams, setTeams] = useState<TeamData[]>([]);
  const [events, setEvents] = useState<EventData[]>([]);
  const [allEvents, setAllEvents] = useState<{ _id: string; name: string; status: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>("profile");
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  // Role tab state
  const [newRole, setNewRole] = useState("");
  const [savingRole, setSavingRole] = useState(false);

  // Actions tab state
  const [registerEventId, setRegisterEventId] = useState("");
  const [registering, setRegistering] = useState(false);
  const [inviteTeamId, setInviteTeamId] = useState("");
  const [inviteeEmail, setInviteeEmail] = useState("");
  const [inviting, setInviting] = useState(false);

  function showToast(msg: string, type: "success" | "error") {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  }

  async function reload() {
    const d = await fetch(`/api/admin/user/${id}`).then((r) => r.json());
    setUser(d.user ?? null);
    setTeams(d.teams ?? []);
    setEvents(d.events ?? []);
    setNewRole(d.user?.role ?? "");
  }

  useEffect(() => {
    reload()
      .catch(() => {})
      .finally(() => setLoading(false));

    // Fetch all events for register dropdown
    fetch("/api/events")
      .then((r) => r.json())
      .then((d) => {
        const evts = Array.isArray(d) ? d : d.events ?? [];
        setAllEvents(evts.filter((e: { status: string }) => e.status === "REGISTRATION_OPEN"));
      })
      .catch(() => {});
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function handleRoleChange() {
    if (!user || newRole === user.role) return;
    setSavingRole(true);
    try {
      const res = await fetch("/api/admin/user/role", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetUserId: id, newRole }),
      });
      const d = await res.json();
      if (d.success) {
        setUser((prev) => prev ? { ...prev, role: newRole } : prev);
        showToast("Role updated successfully.", "success");
      } else {
        showToast(d.error ?? "Failed to update role.", "error");
      }
    } catch {
      showToast("Request failed.", "error");
    } finally {
      setSavingRole(false);
    }
  }

  async function handleDeleteTeam(teamId: string) {
    if (!confirm("Delete this team? This cannot be undone.")) return;
    const res = await fetch(`/api/admin/team/${teamId}`, { method: "DELETE" });
    const d = await res.json();
    if (d.success) {
      showToast("Team deleted.", "success");
      await reload();
    } else {
      showToast(d.error ?? "Failed to delete team.", "error");
    }
  }

  async function handleRemoveMember(teamId: string, memberEmail: string) {
    if (!confirm(`Remove ${memberEmail} from this team?`)) return;
    const res = await fetch(`/api/admin/team/${teamId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ memberEmail }),
    });
    const d = await res.json();
    if (d.success) {
      showToast("Member removed.", "success");
      await reload();
    } else {
      showToast(d.error ?? "Failed to remove member.", "error");
    }
  }

  async function handleRegister() {
    if (!registerEventId || !user) return;
    setRegistering(true);
    try {
      const res = await fetch("/api/admin/team", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leaderEmail: user.email, eventId: registerEventId }),
      });
      const d = await res.json();
      if (d.success) {
        showToast("User registered for the event.", "success");
        setRegisterEventId("");
        await reload();
      } else {
        showToast(d.error ?? "Registration failed.", "error");
      }
    } catch {
      showToast("Request failed.", "error");
    } finally {
      setRegistering(false);
    }
  }

  async function handleSendInvite() {
    if (!inviteTeamId || !inviteeEmail.trim()) return;
    setInviting(true);
    try {
      const res = await fetch(`/api/admin/team/${inviteTeamId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inviteeEmail: inviteeEmail.trim() }),
      });
      const d = await res.json();
      if (d.success) {
        showToast("Invitation sent.", "success");
        setInviteeEmail("");
        await reload();
      } else {
        showToast(d.error ?? "Failed to send invite.", "error");
      }
    } catch {
      showToast("Request failed.", "error");
    } finally {
      setInviting(false);
    }
  }

  if (loading) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="space-y-3 animate-pulse w-full max-w-3xl px-4">
        <div className="h-4 bg-slate-200 rounded w-24" />
        <div className="h-8 bg-slate-200 rounded w-48" />
        <div className="h-32 bg-slate-200 rounded-2xl" />
      </div>
    </div>
  );

  if (!user) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <p className="text-sm text-slate-400">User not found.</p>
    </div>
  );

  const isExternal = user.role === "EXTERNAL_USER";

  const profileFields: [string, string | boolean | undefined][] = [
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
      : isExternal
      ? ([
          ["College Name",         user.collegeName],
          ["City",                 user.city],
          ["State",                user.state],
          ["Participant ID",       user.participantId],
          ["Accommodation Needed", user.accommodationNeeded ? "Yes" : "No"],
        ] as [string, string | undefined][])
      : []),
    ["Address",              user.address],
    ["Emergency Contact",    user.emergencyContactName],
    ["Emergency Contact No.", user.emergencyContactNumber],
    ["Joined",               user.createdAt ? new Date(user.createdAt).toLocaleDateString() : undefined],
  ];

  const TABS: { key: Tab; label: string; icon: React.ReactNode; count?: number }[] = [
    { key: "profile", label: "Profile",  icon: <User className="h-3.5 w-3.5" /> },
    { key: "events",  label: "Events",   icon: <CalendarDays className="h-3.5 w-3.5" />, count: events.length },
    { key: "teams",   label: "Teams",    icon: <UsersRound className="h-3.5 w-3.5" />,  count: teams.length },
    { key: "actions", label: "Actions",  icon: <Zap className="h-3.5 w-3.5" /> },
    { key: "role",    label: "Role",     icon: <Shield className="h-3.5 w-3.5" /> },
  ];

  const inputCls = "w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-300 transition-all";
  const selectCls = "w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-300 transition-all";

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">

        {/* Header */}
        <div className="flex items-start justify-between animate-slide-up" style={{ animationDelay: "0s" }}>
          <div>
            <Link href="/dev/users" className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-indigo-600 transition-colors mb-2">
              <ChevronLeft className="h-3.5 w-3.5" /> Users
            </Link>
            <div className="flex items-center gap-3">
              {user.profilePhotoUrl ? (
                <Image
                  src={user.profilePhotoUrl} alt="Profile"
                  width={48} height={48}
                  className="rounded-full object-cover border border-slate-200 shrink-0"
                  unoptimized
                />
              ) : (
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-base font-bold shrink-0 ${ROLE_AVATAR[user.role] ?? "bg-slate-100 text-slate-600"}`}>
                  {user.fullName[0]?.toUpperCase()}
                </div>
              )}
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">{user.fullName}</h1>
                <p className="text-xs text-slate-400">{user.email}</p>
              </div>
            </div>
          </div>
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border shrink-0 mt-1 ${ROLE_CHIP[user.role] ?? "bg-slate-50 text-slate-600 border-slate-200"}`}>
            {user.role.replace(/_/g, " ")}
          </span>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pb-0.5 animate-slide-up" style={{ animationDelay: "0.04s" }}>
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                activeTab === tab.key
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "bg-white border border-slate-200 text-slate-600 hover:border-indigo-200 hover:text-indigo-600"
              }`}
            >
              {tab.icon}
              {tab.label}
              {tab.count !== undefined && tab.count > 0 && (
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                  activeTab === tab.key ? "bg-white/20 text-white" : "bg-indigo-50 text-indigo-600"
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Profile tab */}
        {activeTab === "profile" && (
          <div className="bg-white border border-slate-200 rounded-2xl px-5 py-5 animate-slide-up" style={{ animationDelay: "0.06s" }}>
            <p className="text-xs font-semibold text-slate-400 mb-4">Profile details</p>
            <dl className="grid grid-cols-2 gap-x-6 gap-y-4">
              {profileFields.map(([label, value]) =>
                value !== undefined && value !== "" ? (
                  <div key={String(label)}>
                    <dt className="text-xs text-slate-400">{label}</dt>
                    <dd className="text-sm font-medium text-slate-900 mt-0.5">{String(value)}</dd>
                  </div>
                ) : null
              )}
            </dl>
          </div>
        )}

        {/* Events tab */}
        {activeTab === "events" && (
          <div className="animate-slide-up" style={{ animationDelay: "0.06s" }}>
            {events.length === 0 ? (
              <div className="bg-white border-2 border-dashed border-slate-200 rounded-2xl py-12 text-center">
                <CalendarDays className="h-8 w-8 mx-auto mb-3 text-slate-300" />
                <p className="text-sm font-medium text-slate-500">Not registered in any events</p>
              </div>
            ) : (
              <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden divide-y divide-slate-100">
                {events.map((ev) => {
                  const label = STATUS_LABEL[ev.status] ?? { text: ev.status, color: "text-slate-500", bg: "bg-slate-100" };
                  return (
                    <div key={ev._id} className="flex items-center gap-3 px-4 py-3.5">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-900 truncate">{ev.name}</p>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {[ev.category, ev.team?.leader === user.email ? "Leader" : "Member"].filter(Boolean).join(" · ")}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        {ev.team?.leader === user.email && (
                          <Crown className="h-3.5 w-3.5 text-amber-500" />
                        )}
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${label.bg} ${label.color}`}>
                          {label.text}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Teams tab */}
        {activeTab === "teams" && (
          <div className="space-y-4 animate-slide-up" style={{ animationDelay: "0.06s" }}>
            {teams.length === 0 ? (
              <div className="bg-white border-2 border-dashed border-slate-200 rounded-2xl py-12 text-center">
                <UsersRound className="h-8 w-8 mx-auto mb-3 text-slate-300" />
                <p className="text-sm font-medium text-slate-500">No teams</p>
              </div>
            ) : teams.map((team) => (
              <div key={team._id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
                {/* Team header */}
                <div className="flex items-center justify-between px-4 py-3.5 border-b border-slate-100">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-900 truncate">{team.event?.name ?? "Unknown event"}</p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {team.leader === user.email ? "Leader" : "Member"} · {team.members.length} member{team.members.length !== 1 ? "s" : ""}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {team.event && (
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full shrink-0 ${
                        (STATUS_LABEL[team.event.status] ?? { bg: "bg-slate-100" }).bg
                      } ${(STATUS_LABEL[team.event.status] ?? { color: "text-slate-500" }).color}`}>
                        {(STATUS_LABEL[team.event.status] ?? { text: team.event.status }).text}
                      </span>
                    )}
                    <button
                      onClick={() => handleDeleteTeam(team._id)}
                      className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-600 transition-colors"
                      title="Delete team"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                {/* Members list */}
                <div className="divide-y divide-slate-50">
                  {team.memberUsers.map((member) => (
                    <div key={member._id} className="flex items-center gap-2.5 px-4 py-2.5">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${ROLE_AVATAR[member.role] ?? "bg-slate-100 text-slate-600"}`}>
                        {member.fullName[0]?.toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-slate-800 truncate">{member.fullName}</p>
                        <p className="text-xs text-slate-400 truncate">{member.email}</p>
                      </div>
                      {member.email === team.leader && (
                        <Crown className="h-3 w-3 text-amber-500 shrink-0" />
                      )}
                      {member.email !== team.leader && (
                        <button
                          onClick={() => handleRemoveMember(team._id, member.email)}
                          className="p-1 rounded hover:bg-red-50 text-slate-300 hover:text-red-500 transition-colors shrink-0"
                          title="Remove member"
                        >
                          <UserMinus className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                {/* Pending invites */}
                {team.pendingInvites.length > 0 && (
                  <div className="border-t border-slate-100 px-4 py-2.5">
                    <p className="text-xs text-slate-400 mb-1.5">Pending invites</p>
                    <div className="flex flex-wrap gap-1.5">
                      {team.pendingInvites.map((inv) => (
                        <span key={inv.inviteeEmail} className="text-xs bg-amber-50 border border-amber-200 text-amber-700 px-2 py-0.5 rounded-full">
                          {inv.inviteeEmail}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Actions tab */}
        {activeTab === "actions" && (
          <div className="space-y-4 animate-slide-up" style={{ animationDelay: "0.06s" }}>

            {/* Register for event */}
            <div className="bg-white border border-slate-200 rounded-2xl px-5 py-5">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 rounded-lg bg-emerald-100 flex items-center justify-center">
                  <Plus className="h-3.5 w-3.5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">Register for event</p>
                  <p className="text-xs text-slate-400">Create a solo team for this user in an open event</p>
                </div>
              </div>
              <div className="space-y-3">
                <select value={registerEventId} onChange={(e) => setRegisterEventId(e.target.value)} className={selectCls}>
                  <option value="">Select an open event…</option>
                  {allEvents.map((ev) => (
                    <option key={ev._id} value={ev._id}>{ev.name}</option>
                  ))}
                </select>
                {allEvents.length === 0 && (
                  <p className="text-xs text-slate-400">No events with open registration.</p>
                )}
                <button
                  onClick={handleRegister}
                  disabled={!registerEventId || registering}
                  className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 disabled:opacity-40 transition-colors"
                >
                  {registering ? "Registering…" : "Register"}
                </button>
              </div>
            </div>

            {/* Send team invite */}
            <div className="bg-white border border-slate-200 rounded-2xl px-5 py-5">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 rounded-lg bg-indigo-100 flex items-center justify-center">
                  <Send className="h-3.5 w-3.5 text-indigo-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">Send team invite</p>
                  <p className="text-xs text-slate-400">Invite another user to one of this user&apos;s teams</p>
                </div>
              </div>
              {teams.length === 0 ? (
                <p className="text-xs text-slate-400">User must be in a team first.</p>
              ) : (
                <div className="space-y-3">
                  <select value={inviteTeamId} onChange={(e) => setInviteTeamId(e.target.value)} className={selectCls}>
                    <option value="">Select a team…</option>
                    {teams.filter((t) => t.leader === user.email).map((t) => (
                      <option key={t._id} value={t._id}>{t.event?.name ?? "Unknown event"}</option>
                    ))}
                  </select>
                  <input
                    type="email"
                    value={inviteeEmail}
                    onChange={(e) => setInviteeEmail(e.target.value)}
                    placeholder="Invitee email address"
                    className={inputCls}
                  />
                  <button
                    onClick={handleSendInvite}
                    disabled={!inviteTeamId || !inviteeEmail.trim() || inviting}
                    className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 disabled:opacity-40 transition-colors"
                  >
                    {inviting ? "Sending…" : "Send invite"}
                  </button>
                  {teams.filter((t) => t.leader === user.email).length === 0 && (
                    <p className="text-xs text-amber-600">User is not a leader in any team.</p>
                  )}
                </div>
              )}
            </div>

          </div>
        )}

        {/* Role tab */}
        {activeTab === "role" && (
          <div className="bg-white border border-slate-200 rounded-2xl px-5 py-5 animate-slide-up" style={{ animationDelay: "0.06s" }}>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-lg bg-indigo-100 flex items-center justify-center">
                <Shield className="h-3.5 w-3.5 text-indigo-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900">Change role</p>
                <p className="text-xs text-slate-400">Current: <span className="font-medium text-slate-700">{user.role.replace(/_/g, " ")}</span></p>
              </div>
            </div>
            <div className="space-y-3">
              <select value={newRole} onChange={(e) => setNewRole(e.target.value)} className={selectCls}>
                {ROLE_OPTIONS.map((r) => (
                  <option key={r} value={r}>{r.replace(/_/g, " ")}</option>
                ))}
              </select>
              <button
                onClick={handleRoleChange}
                disabled={savingRole || newRole === user.role}
                className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 disabled:opacity-40 transition-colors"
              >
                {savingRole ? "Saving…" : "Update role"}
              </button>
            </div>
          </div>
        )}

      </div>

      {toast && <Toast msg={toast.msg} type={toast.type} onDismiss={() => setToast(null)} />}
    </div>
  );
}
