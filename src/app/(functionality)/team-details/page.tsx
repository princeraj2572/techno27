"use client";
import { useEffect, useState } from "react";
import { getParticipatingTeams, getInvitedTeams, deleteTeamAction, leaveTeamAction } from "@/actions/team-actions";
import { sendTeamInviteAction, acceptInviteAction, rejectInviteAction, cancelInviteAction } from "@/actions/invite-actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { AlertCircle, Users, UserPlus, ChevronLeft, CheckCircle2, X, Clock, Trash2, LogOut } from "lucide-react";
import Link from "next/link";

type Member = { fullName: string; email: string; role: string };
type PendingInvite = { _id: string; inviteeEmail: string };
type Team = {
  _id: string;
  leader: string;
  members: Member[];
  size: number;
  event?: { name: string };
  invites?: string[];
  pendingInvites?: PendingInvite[];
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

function ConfirmDialog({
  open, title, description, confirmLabel, onConfirm, onCancel, danger,
}: {
  open: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
  danger?: boolean;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/40" onClick={onCancel} />
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 space-y-4">
        <h2 className="text-base font-bold text-slate-900">{title}</h2>
        <p className="text-sm text-slate-500 leading-relaxed">{description}</p>
        <div className="flex gap-3 justify-end">
          <Button size="sm" variant="outline" onClick={onCancel}>Cancel</Button>
          <Button
            size="sm"
            onClick={onConfirm}
            className={danger ? "bg-red-600 hover:bg-red-700 text-white" : ""}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}

function TeamCard({
  team, currentEmail, onDelete, onInviteSent,
}: {
  team: Team;
  currentEmail: string;
  onDelete: (id: string) => void;
  onInviteSent: () => void;
}) {
  const [inviteEmail, setInviteEmail]     = useState("");
  const [inviteMsg, setInviteMsg]         = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [inviting, setInviting]           = useState(false);
  const [cancelingId, setCancelingId]     = useState<string | null>(null);
  const [pendingInvites, setPendingInvites] = useState<PendingInvite[]>(team.pendingInvites ?? []);
  const [confirm, setConfirm]             = useState<null | "delete" | "leave">(null);

  const isLeader     = team.leader === currentEmail;
  const confirmedPct = Math.round((team.members.length / team.size) * 100);
  const claimedPct   = Math.min(Math.round(((team.members.length + pendingInvites.length) / team.size) * 100), 100);
  const isFull       = (team.members.length + pendingInvites.length) >= team.size;

  async function handleInvite() {
    if (!inviteEmail.trim()) return;
    setInviting(true);
    setInviteMsg(null);
    try {
      const result = await sendTeamInviteAction({ teamId: team._id, inviteeEmail: inviteEmail.trim() });
      setPendingInvites((prev) => [
        ...prev,
        { _id: String(result.invite._id), inviteeEmail: inviteEmail.trim() },
      ]);
      setInviteEmail("");
      setInviteMsg({ type: "ok", text: "Invite sent." });
      onInviteSent();
    } catch (e: unknown) {
      setInviteMsg({ type: "err", text: (e as Error).message });
    } finally {
      setInviting(false);
    }
  }

  async function handleCancelInvite(inviteId: string) {
    setCancelingId(inviteId);
    try {
      await cancelInviteAction(inviteId);
      setPendingInvites((prev) => prev.filter((i) => i._id !== inviteId));
    } catch (e: unknown) {
      alert((e as Error).message);
    } finally {
      setCancelingId(null);
    }
  }

  async function handleConfirmed() {
    setConfirm(null);
    setActionLoading(true);
    try {
      if (isLeader) {
        await deleteTeamAction(team._id);
      } else {
        await leaveTeamAction(team._id);
      }
      onDelete(team._id);
    } catch (e: unknown) {
      alert((e as Error).message);
    } finally {
      setActionLoading(false);
    }
  }

  return (
    <>
      <ConfirmDialog
        open={confirm !== null}
        title={isLeader ? "Delete team?" : "Leave team?"}
        description={
          isLeader
            ? `This will permanently delete your team for "${team.event?.name ?? "this event"}" and cancel all pending invites.`
            : `You will be removed from the team for "${team.event?.name ?? "this event"}". The team leader can re-invite you.`
        }
        confirmLabel={isLeader ? "Delete team" : "Leave team"}
        onConfirm={handleConfirmed}
        onCancel={() => setConfirm(null)}
        danger={isLeader}
      />

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
            <button
              onClick={() => setConfirm(isLeader ? "delete" : "leave")}
              disabled={actionLoading}
              className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-xl transition-colors shrink-0 ${
                isLeader
                  ? "text-red-600 hover:bg-red-50 hover:text-red-700"
                  : "text-slate-500 hover:bg-slate-100 hover:text-slate-700"
              } disabled:opacity-50`}
            >
              {actionLoading ? (
                <div className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
              ) : isLeader ? (
                <Trash2 className="h-3.5 w-3.5" />
              ) : (
                <LogOut className="h-3.5 w-3.5" />
              )}
              {isLeader ? "Delete team" : "Leave team"}
            </button>
          </div>

          {/* Fill bar — pending (amber) behind confirmed (indigo/emerald) */}
          <div className="mt-3 h-1.5 bg-slate-100 rounded-full overflow-hidden relative">
            {/* pending layer */}
            <div
              className="absolute inset-y-0 left-0 rounded-full bg-amber-300 transition-all"
              style={{ width: `${claimedPct}%` }}
            />
            {/* confirmed layer */}
            <div
              className={`absolute inset-y-0 left-0 rounded-full transition-all ${isFull && pendingInvites.length === 0 ? "bg-emerald-500" : "bg-indigo-500"}`}
              style={{ width: `${confirmedPct}%` }}
            />
          </div>
          {pendingInvites.length > 0 && (
            <p className="text-[10px] text-amber-600 mt-1">
              {pendingInvites.length} invite{pendingInvites.length > 1 ? "s" : ""} pending · {team.size - team.members.length - pendingInvites.length > 0 ? `${team.size - team.members.length - pendingInvites.length} slot${team.size - team.members.length - pendingInvites.length > 1 ? "s" : ""} open` : "all slots claimed"}
            </p>
          )}
        </div>

        <Separator />

        {/* Members */}
        <div className="px-5 py-4 space-y-2.5">
          {team.members.map((m) => {
            const isExternal = m.role === "EXTERNAL_USER";
            return (
              <div key={m.email} className="flex items-center gap-2.5">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                  isExternal ? "bg-amber-100 text-amber-700" : "bg-indigo-100 text-indigo-700"
                }`}>
                  {m.fullName[0]?.toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <p className="text-sm font-medium text-slate-900 truncate">{m.fullName}</p>
                    <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full border shrink-0 ${
                      isExternal
                        ? "bg-amber-50 text-amber-700 border-amber-200"
                        : "bg-indigo-50 text-indigo-700 border-indigo-200"
                    }`}>
                      {isExternal ? "External" : "OPJU"}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 truncate">{m.email}</p>
                </div>
                {m.email === team.leader && (
                  <Badge className="text-xs h-5 shrink-0">Leader</Badge>
                )}
              </div>
            );
          })}
        </div>

        {/* Pending outgoing invites (leader only) */}
        {isLeader && pendingInvites.length > 0 && (
          <>
            <Separator />
            <div className="px-5 py-4 space-y-2">
              <p className="text-xs font-medium text-slate-400">
                Pending invites ({pendingInvites.length})
              </p>
              {pendingInvites.map((inv) => (
                <div
                  key={inv._id}
                  className="flex items-center gap-2.5 bg-slate-50 rounded-xl px-3 py-2"
                >
                  <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center shrink-0">
                    <Clock className="h-3 w-3 text-slate-500" />
                  </div>
                  <p className="flex-1 text-xs text-slate-600 truncate">{inv.inviteeEmail}</p>
                  <span className="text-[10px] font-medium text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded-full shrink-0">
                    Pending
                  </span>
                  <button
                    onClick={() => handleCancelInvite(inv._id)}
                    disabled={cancelingId === inv._id}
                    className="text-slate-400 hover:text-red-500 transition-colors disabled:opacity-40 shrink-0 ml-1"
                    title="Cancel invite"
                  >
                    {cancelingId === inv._id ? (
                      <div className="w-3.5 h-3.5 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <X className="h-3.5 w-3.5" />
                    )}
                  </button>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Invite form (leader only, not full) */}
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
        {isFull && isLeader && (
          <div className="px-5 pb-4">
            <p className={`text-xs font-medium flex items-center gap-1 ${pendingInvites.length > 0 ? "text-amber-600" : "text-emerald-600"}`}>
              <CheckCircle2 className="h-3.5 w-3.5" />
              {pendingInvites.length > 0 ? "All slots claimed — cancel an invite to send a new one" : "Team is full"}
            </p>
          </div>
        )}
      </div>
    </>
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
