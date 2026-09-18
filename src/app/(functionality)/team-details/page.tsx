"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { getParticipatingTeams, getInvitedTeams, deleteTeamAction, leaveTeamAction, getCurrentUserEmailAction, removeTeamMemberAction, checkUserExistsAction } from "@/actions/team-actions";
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
  event?: { _id: string; name: string };
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
  const [inviteEmail, setInviteEmail]       = useState("");
  const [inviteMsg, setInviteMsg]           = useState<{ type: "ok" | "err" | "info"; text: string } | null>(null);
  const [invitePreview, setInvitePreview]   = useState<string | null>(null); // resolved user's fullName
  const [validating, setValidating]         = useState(false);
  const [actionLoading, setActionLoading]   = useState(false);
  const [inviting, setInviting]             = useState(false);
  const [cancelingId, setCancelingId]       = useState<string | null>(null);
  const [removingEmail, setRemovingEmail]   = useState<string | null>(null);
  const [pendingInvites, setPendingInvites] = useState<PendingInvite[]>(team.pendingInvites ?? []);
  const [members, setMembers]               = useState<Member[]>(team.members);
  const [confirm, setConfirm]               = useState<null | "delete" | "leave" | string>(null); // string = remove memberEmail
  const [inviteOpenSlot, setInviteOpenSlot] = useState<number | null>(null);

  const isLeader     = team.leader === currentEmail;
  const confirmedPct = Math.round((members.length / team.size) * 100);
  const claimedPct   = Math.min(Math.round(((members.length + pendingInvites.length) / team.size) * 100), 100);
  const isFull       = (members.length + pendingInvites.length) >= team.size;

  async function handleEmailChange(val: string) {
    setInviteEmail(val);
    setInvitePreview(null);
    setInviteMsg(null);
    if (!val.includes("@")) return;
    setValidating(true);
    try {
      const { exists, fullName } = await checkUserExistsAction(val.trim());
      if (exists) {
        setInvitePreview(fullName ?? null);
        setInviteMsg({ type: "info", text: `✓ Found: ${fullName}` });
      } else {
        setInviteMsg({ type: "err", text: "No account found with this email" });
      }
    } catch { /* silent */ } finally {
      setValidating(false);
    }
  }

  async function handleInvite(slotIndex?: number) {
    if (!inviteEmail.trim()) return;
    if (!invitePreview) {
      setInviteMsg({ type: "err", text: "Verify the email first — user must be registered" });
      return;
    }
    setInviting(true);
    setInviteMsg(null);
    try {
      const result = await sendTeamInviteAction({ teamId: team._id, inviteeEmail: inviteEmail.trim() });
      setPendingInvites((prev) => [
        ...prev,
        { _id: String(result.invite._id), inviteeEmail: inviteEmail.trim() },
      ]);
      setInviteEmail("");
      setInvitePreview(null);
      setInviteOpenSlot(null);
      onInviteSent();
    } catch (e: unknown) {
      setInviteMsg({ type: "err", text: (e as Error).message });
      void slotIndex;
    } finally {
      setInviting(false);
    }
  }

  async function handleRemoveMember(memberEmail: string) {
    setRemovingEmail(memberEmail);
    setConfirm(null);
    try {
      await removeTeamMemberAction(team._id, memberEmail);
      setMembers((prev) => prev.filter((m) => m.email !== memberEmail));
    } catch (e: unknown) {
      alert((e as Error).message);
    } finally {
      setRemovingEmail(null);
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
    const current = confirm;
    setConfirm(null);
    if (current === "delete" || current === "leave") {
      setActionLoading(true);
      try {
        if (isLeader) { await deleteTeamAction(team._id); }
        else          { await leaveTeamAction(team._id); }
        onDelete(team._id);
      } catch (e: unknown) {
        alert((e as Error).message);
      } finally {
        setActionLoading(false);
      }
    } else if (current) {
      // current is the member email to remove
      await handleRemoveMember(current);
    }
  }

  return (
    <>
      <ConfirmDialog
        open={confirm !== null}
        title={
          confirm === "delete" ? "Delete team?" :
          confirm === "leave"  ? "Leave team?" :
          "Remove member?"
        }
        description={
          confirm === "delete"
            ? `This will permanently delete your team for "${team.event?.name ?? "this event"}" and cancel all pending invites.`
            : confirm === "leave"
            ? `You will be removed from the team for "${team.event?.name ?? "this event"}". The team leader can re-invite you.`
            : `Remove ${confirm} from this team? They can be re-invited later.`
        }
        confirmLabel={
          confirm === "delete" ? "Delete team" :
          confirm === "leave"  ? "Leave team" :
          "Remove"
        }
        onConfirm={handleConfirmed}
        onCancel={() => setConfirm(null)}
        danger={confirm === "delete" || (typeof confirm === "string" && confirm !== "leave")}
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
                {members.length} of {team.size} members
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
              {pendingInvites.length} invite{pendingInvites.length > 1 ? "s" : ""} pending · {team.size - members.length - pendingInvites.length > 0 ? `${team.size - members.length - pendingInvites.length} slot${team.size - members.length - pendingInvites.length > 1 ? "s" : ""} open` : "all slots claimed"}
            </p>
          )}
        </div>

        <Separator />

        {/* Unified slot list: confirmed → pending → empty */}
        <div className="px-5 py-4 space-y-2">

          {/* Confirmed members */}
          {members.map((m) => {
            const isExternal   = m.role === "EXTERNAL_USER";
            const isSelf       = m.email === currentEmail;
            const isTeamLeader = m.email === team.leader;
            return (
              <div key={m.email} className="flex items-center gap-2.5">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
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
                {isTeamLeader ? (
                  <Badge className="text-xs h-5 shrink-0">Leader</Badge>
                ) : isLeader && !isSelf ? (
                  <button
                    onClick={() => setConfirm(m.email)}
                    disabled={removingEmail === m.email}
                    className="shrink-0 inline-flex items-center gap-1 text-[10px] font-medium text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors px-2 py-1 rounded-lg disabled:opacity-40"
                  >
                    {removingEmail === m.email
                      ? <div className="w-3 h-3 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
                      : <X className="h-3 w-3" />
                    }
                    Remove
                  </button>
                ) : (
                  <span className="text-[10px] text-emerald-600 font-medium flex items-center gap-0.5 shrink-0">
                    <CheckCircle2 className="h-3 w-3" /> Joined
                  </span>
                )}
              </div>
            );
          })}

          {/* Pending invite rows (visible to everyone; cancel only for leader) */}
          {pendingInvites.map((inv) => (
            <div key={inv._id} className="flex items-center gap-2.5 bg-amber-50 border border-amber-100 rounded-xl px-3 py-2">
              <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                <Clock className="h-3.5 w-3.5 text-amber-500" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-slate-700 truncate">{inv.inviteeEmail}</p>
                <p className="text-[10px] text-amber-600">Invite pending · awaiting response</p>
              </div>
              {isLeader && (
                <button
                  onClick={() => handleCancelInvite(inv._id)}
                  disabled={cancelingId === inv._id}
                  className="inline-flex items-center gap-1 text-[10px] font-medium text-slate-400 hover:text-red-500 transition-colors disabled:opacity-40 shrink-0 px-2 py-1 rounded-lg hover:bg-red-50"
                >
                  {cancelingId === inv._id
                    ? <div className="w-3 h-3 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
                    : <X className="h-3 w-3" />
                  }
                  Cancel
                </button>
              )}
            </div>
          ))}

          {/* Empty open slots — show invite form inline for leader */}
          {Array.from({ length: Math.max(0, team.size - members.length - pendingInvites.length) }).map((_, i) => (
            <div key={`slot-${i}`}>
              {isLeader && inviteOpenSlot === i ? (
                /* Expanded inline invite form */
                <div className="border border-indigo-200 bg-indigo-50 rounded-xl px-3 py-2.5 space-y-1.5">
                  <div className="flex gap-2">
                    <div className="flex-1 relative">
                      <Input
                        type="email"
                        placeholder="teammate@email.com"
                        value={inviteEmail}
                        onChange={(e) => handleEmailChange(e.target.value)}
                        onKeyDown={(e) => { if (e.key === "Enter") handleInvite(i); if (e.key === "Escape") { setInviteOpenSlot(null); setInviteEmail(""); setInviteMsg(null); setInvitePreview(null); } }}
                        autoFocus
                        className="h-8 text-sm bg-white w-full"
                      />
                      {validating && (
                        <div className="absolute right-2 top-2 w-4 h-4 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
                      )}
                    </div>
                    <Button
                      size="sm"
                      onClick={() => handleInvite(i)}
                      disabled={inviting || !invitePreview}
                      className="h-8 px-3 text-xs shrink-0"
                    >
                      {inviting ? <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : "Send"}
                    </Button>
                    <button onClick={() => { setInviteOpenSlot(null); setInviteEmail(""); setInviteMsg(null); setInvitePreview(null); }} className="text-slate-400 hover:text-slate-600 px-1 shrink-0">
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  {inviteMsg && (
                    <p className={`text-[10px] font-medium ${
                      inviteMsg.type === "info" ? "text-emerald-600" :
                      inviteMsg.type === "err"  ? "text-red-500" : "text-emerald-600"
                    }`}>
                      {inviteMsg.text}
                    </p>
                  )}
                </div>
              ) : (
                /* Empty slot button */
                <button
                  onClick={() => { if (isLeader) { setInviteEmail(""); setInviteMsg(null); setInvitePreview(null); setInviteOpenSlot(i); } }}
                  disabled={!isLeader}
                  className={`w-full flex items-center gap-2.5 border-2 border-dashed rounded-xl px-3 py-2 transition-colors ${
                    isLeader
                      ? "border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 group cursor-pointer"
                      : "border-slate-100 cursor-default"
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full border-2 border-dashed flex items-center justify-center shrink-0 transition-colors ${
                    isLeader ? "border-slate-300 group-hover:border-indigo-400" : "border-slate-200"
                  }`}>
                    <UserPlus className={`h-3.5 w-3.5 transition-colors ${isLeader ? "text-slate-300 group-hover:text-indigo-500" : "text-slate-200"}`} />
                  </div>
                  <span className={`text-xs transition-colors ${isLeader ? "text-slate-400 group-hover:text-indigo-600 font-medium" : "text-slate-300"}`}>
                    {isLeader ? "Invite teammate" : "Open slot"}
                  </span>
                  {isLeader && (
                    <span className="ml-auto text-[10px] font-semibold text-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity">
                      + Invite
                    </span>
                  )}
                </button>
              )}
            </div>
          ))}

        </div>

        {isFull && !isLeader && (
          <div className="px-5 pb-4">
            <p className="text-xs text-emerald-600 font-medium flex items-center gap-1">
              <CheckCircle2 className="h-3.5 w-3.5" /> Team is full
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
  const searchParams                    = useSearchParams();
  const eventFilter                     = searchParams.get("event");
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
        const [email] = await Promise.all([
          getCurrentUserEmailAction(),
          reload(),
        ]);
        setCurrentEmail(email);
      } catch { /* silent */ }
      setLoading(false);
    })();
  }, []);

  if (loading) return <Skeleton />;

  const pendingInvites  = invites.filter((i) => i.status === "PENDING");
  const visibleTeams  = eventFilter
    ? teams.filter((t) => t.event?._id === eventFilter)
    : teams;
  const filteredEvent = eventFilter ? (visibleTeams[0]?.event?.name ?? null) : null;

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
              href={filteredEvent ? "/dashboard" : "/dashboard"}
              className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-indigo-600 transition-colors mb-1"
            >
              <ChevronLeft className="h-3.5 w-3.5" /> Dashboard
            </Link>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              {filteredEvent ?? "My teams"}
            </h1>
            {filteredEvent && (
              <Link href="/team-details" className="text-xs text-indigo-600 hover:underline mt-0.5 block">
                ← All teams
              </Link>
            )}
          </div>
          <div className="w-10 h-10 rounded-2xl bg-indigo-100 flex items-center justify-center">
            <Users className="h-5 w-5 text-indigo-600" />
          </div>
        </div>

        {/* ── Pending invitations ─────────────────────────────── */}
        {!filteredEvent && pendingInvites.length > 0 && (
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
        {!filteredEvent && (
        <div
          className="space-y-3 animate-slide-up"
          style={{ animationDelay: pendingInvites.length > 0 ? "0.1s" : "0.05s" }}
        >
          <p className="text-sm font-semibold text-slate-900">
            Registered teams
            <span className="ml-1.5 text-slate-400 font-normal">({teams.length})</span>
          </p>
          </div>
        )}

        <div className="space-y-3 animate-slide-up" style={{ animationDelay: "0.05s" }}>
          {visibleTeams.length === 0 ? (
            <div className="rounded-2xl border-2 border-dashed border-slate-100 py-12 text-center">
              <Users className="h-8 w-8 mx-auto mb-3 text-slate-200" />
              <p className="text-sm font-medium text-slate-500">No team found for this event</p>
              <Link
                href="/events-selection"
                className="text-xs text-indigo-600 hover:underline mt-1 block"
              >
                Register for an event to create or join a team
              </Link>
            </div>
          ) : (
            visibleTeams.map((team) => (
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
