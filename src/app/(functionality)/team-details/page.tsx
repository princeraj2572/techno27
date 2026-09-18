"use client";
import { useEffect, useState } from "react";
import { getParticipatingTeams, getInvitedTeams, deleteTeamAction } from "@/actions/team-actions";
import { sendTeamInviteAction, acceptInviteAction, rejectInviteAction } from "@/actions/invite-actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { AlertCircle, Users, UserPlus, ChevronLeft, CheckCircle2, X } from "lucide-react";
import Link from "next/link";

type Member = { fullName: string; email: string; role: string };
type Team = {
  _id: string;
  leader: string;
  members: Member[];
  size: number;
  event?: { name: string };
  invites?: string[];
};
type Invite = {
  _id: string;
  inviterEmail: string;
  status: string;
  team?: {
    leader?: { fullName?: string; email?: string };
    event?: { name?: string };
    members: { fullName: string; email: string }[];
  };
};

function TeamCard({
  team, currentEmail, onDelete, onInviteSent,
}: {
  team: Team;
  currentEmail: string;
  onDelete: (id: string) => void;
  onInviteSent: () => void;
}) {
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteMsg, setInviteMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [inviting, setInviting] = useState(false);

  const isLeader = team.leader === currentEmail;
  const isFull   = team.members.length >= team.size;
  const fillPct  = Math.round((team.members.length / team.size) * 100);

  async function handleInvite() {
    if (!inviteEmail.trim()) return;
    setInviting(true);
    setInviteMsg(null);
    try {
      await sendTeamInviteAction({ teamId: team._id, inviteeEmail: inviteEmail.trim() });
      setInviteEmail("");
      setInviteMsg({ type: "ok", text: "Invite sent." });
      onInviteSent();
    } catch (e: unknown) {
      setInviteMsg({ type: "err", text: (e as Error).message });
    } finally {
      setInviting(false);
    }
  }

  async function handleDelete() {
    if (!confirm(`${isLeader ? "Delete" : "Leave"} team for "${team.event?.name}"?`)) return;
    setDeleting(true);
    try {
      await deleteTeamAction(team._id);
      onDelete(team._id);
    } catch (e: unknown) {
      alert((e as Error).message);
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="bg-white border border-slate-100 border-l-4 border-l-indigo-500 rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="px-5 pt-5 pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="text-sm font-bold text-slate-900 truncate">
              {team.event?.name ?? "Unknown Event"}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {team.members.length} of {team.size} members
              {isLeader && (
                <span className="ml-1.5 text-indigo-500 font-medium">· you&apos;re the leader</span>
              )}
            </p>
          </div>
          <Button
            size="sm"
            variant="ghost"
            className="text-xs text-red-500 hover:text-red-600 hover:bg-red-50 h-7 px-2 shrink-0"
            onClick={handleDelete}
            disabled={deleting}
          >
            {deleting ? "…" : isLeader ? "Delete team" : "Leave team"}
          </Button>
        </div>

        {/* Fill bar */}
        <div className="mt-3 h-1 bg-slate-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${isFull ? "bg-emerald-500" : "bg-indigo-500"}`}
            style={{ width: `${fillPct}%` }}
          />
        </div>
      </div>

      <Separator />

      {/* Members */}
      <div className="px-5 py-4 space-y-2.5">
        {team.members.map((m) => (
          <div key={m.email} className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center text-xs font-bold text-indigo-700 shrink-0">
              {m.fullName[0]?.toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-900 truncate">{m.fullName}</p>
              <p className="text-xs text-slate-400 truncate">{m.email}</p>
            </div>
            {m.email === team.leader && (
              <Badge className="text-xs h-5 shrink-0">Leader</Badge>
            )}
          </div>
        ))}
      </div>

      {/* Invite row (leader only, not full) */}
      {isLeader && !isFull && (
        <>
          <Separator />
          <div className="px-5 py-4">
            <p className="text-xs font-medium text-slate-500 mb-2">Invite a teammate</p>
            <div className="flex gap-2">
              <Input
                type="email"
                placeholder="teammate@email.com"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleInvite()}
                className="flex-1 h-9 text-sm"
              />
              <Button size="sm" onClick={handleInvite} disabled={inviting} className="h-9 px-4">
                <UserPlus className="h-3.5 w-3.5 mr-1.5" />
                {inviting ? "Sending…" : "Invite"}
              </Button>
            </div>
            {inviteMsg && (
              <p className={`text-xs mt-1.5 ${inviteMsg.type === "ok" ? "text-emerald-600" : "text-red-500"}`}>
                {inviteMsg.text}
              </p>
            )}
          </div>
        </>
      )}
      {isFull && (
        <div className="px-5 pb-4">
          <p className="text-xs text-emerald-600 font-medium flex items-center gap-1">
            <CheckCircle2 className="h-3.5 w-3.5" /> Team is full
          </p>
        </div>
      )}
    </div>
  );
}

function InviteCard({
  invite, onAccept, onReject,
}: {
  invite: Invite;
  onAccept: (id: string) => void;
  onReject: (id: string) => void;
}) {
  const [loading, setLoading] = useState<"accept" | "reject" | null>(null);

  async function handle(action: "accept" | "reject") {
    setLoading(action);
    try {
      if (action === "accept") { await acceptInviteAction(invite._id); onAccept(invite._id); }
      else                     { await rejectInviteAction(invite._id); onReject(invite._id); }
    } catch (e: unknown) {
      alert((e as Error).message);
    } finally {
      setLoading(null);
    }
  }

  if (invite.status !== "PENDING") return null;

  return (
    <div className="bg-amber-50 border border-amber-200 rounded-2xl px-5 py-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-bold text-amber-900 truncate">
            {invite.team?.event?.name ?? "Unknown Event"}
          </p>
          <p className="text-xs text-amber-700 mt-0.5">
            Invited by {invite.team?.leader?.fullName ?? invite.inviterEmail}
          </p>
          <p className="text-xs text-amber-600 mt-0.5">
            {invite.team?.members?.length ?? 0} member{(invite.team?.members?.length ?? 0) !== 1 ? "s" : ""} in team
          </p>
        </div>
        <div className="flex gap-2 shrink-0">
          <Button
            size="sm"
            className="h-8 px-3 text-xs"
            onClick={() => handle("accept")}
            disabled={loading !== null}
          >
            <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
            {loading === "accept" ? "…" : "Accept"}
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="h-8 px-3 text-xs border-amber-300 text-amber-800 hover:bg-amber-100"
            onClick={() => handle("reject")}
            disabled={loading !== null}
          >
            <X className="h-3.5 w-3.5 mr-1" />
            {loading === "reject" ? "…" : "Decline"}
          </Button>
        </div>
      </div>
    </div>
  );
}

function Skeleton() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-2xl mx-auto px-4 py-8 space-y-3">
        <div className="h-8 w-32 bg-slate-100 rounded-xl animate-pulse" />
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-36 rounded-2xl bg-slate-100 animate-pulse" />
        ))}
      </div>
    </div>
  );
}

export default function TeamDetailsPage() {
  const [teams, setTeams]               = useState<Team[]>([]);
  const [invites, setInvites]           = useState<Invite[]>([]);
  const [currentEmail, setCurrentEmail] = useState("");
  const [loading, setLoading]           = useState(true);

  async function reload() {
    try {
      const [t, i] = await Promise.all([getParticipatingTeams(), getInvitedTeams()]);
      setTeams(t);
      setInvites(i);
    } catch { /* silent */ }
  }

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/session");
        const d   = await res.json();
        if (d.authenticated) setCurrentEmail(d.user?.email ?? "");
      } catch { /* silent */ }
      await reload();
      setLoading(false);
    })();
  }, []);

  if (loading) return <Skeleton />;

  const pendingInvites = invites.filter((i) => i.status === "PENDING");

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-2xl mx-auto px-4 py-8 space-y-7">

        {/* ── Header ─────────────────────────────────────────── */}
        <div
          className="flex items-center justify-between animate-slide-up"
          style={{ animationDelay: "0s" }}
        >
          <div>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-indigo-600 transition-colors mb-1"
            >
              <ChevronLeft className="h-3.5 w-3.5" /> Dashboard
            </Link>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">My teams</h1>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-indigo-100 flex items-center justify-center">
            <Users className="h-5 w-5 text-indigo-600" />
          </div>
        </div>

        {/* ── Pending invitations ─────────────────────────────── */}
        {pendingInvites.length > 0 && (
          <div
            className="space-y-2 animate-slide-up"
            style={{ animationDelay: "0.05s" }}
          >
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-amber-500" />
              <p className="text-sm font-semibold text-slate-900">
                Pending invitations
              </p>
              <span className="text-xs bg-amber-100 text-amber-700 font-semibold px-1.5 py-0.5 rounded-full">
                {pendingInvites.length}
              </span>
            </div>
            {pendingInvites.map((invite) => (
              <InviteCard
                key={invite._id}
                invite={invite}
                onAccept={() => reload()}
                onReject={() => reload()}
              />
            ))}
          </div>
        )}

        {/* ── My teams ─────────────────────────────────────────── */}
        <div
          className="space-y-3 animate-slide-up"
          style={{ animationDelay: pendingInvites.length > 0 ? "0.1s" : "0.05s" }}
        >
          <p className="text-sm font-semibold text-slate-900">
            Registered teams
            <span className="ml-1.5 text-slate-400 font-normal">({teams.length})</span>
          </p>

          {teams.length === 0 ? (
            <div className="rounded-2xl border-2 border-dashed border-slate-100 py-12 text-center">
              <Users className="h-8 w-8 mx-auto mb-3 text-slate-200" />
              <p className="text-sm font-medium text-slate-500">No teams yet</p>
              <Link
                href="/events-selection"
                className="text-xs text-indigo-600 hover:underline mt-1 block"
              >
                Register for an event to create or join a team
              </Link>
            </div>
          ) : (
            teams.map((team) => (
              <TeamCard
                key={team._id}
                team={team}
                currentEmail={currentEmail}
                onDelete={(id) => setTeams((prev) => prev.filter((t) => t._id !== id))}
                onInviteSent={reload}
              />
            ))
          )}
        </div>

      </div>
    </div>
  );
}
