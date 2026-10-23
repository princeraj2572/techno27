"use client";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { getParticipatingTeams, getInvitedTeams, deleteTeamAction, leaveTeamAction, getCurrentUserEmailAction, removeTeamMemberAction, checkUserExistsAction } from "@/features/teams/team-actions";
import { sendTeamInviteAction, acceptInviteAction, rejectInviteAction, cancelInviteAction } from "@/features/teams/invite-actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { AlertCircle, Users, UserPlus, CheckCircle2, X, Clock, Trash2, LogOut } from "lucide-react";
import Link from "next/link";
import AppShell from "@/components/layout/app-shell";
import { PageShell, TITLE_SHADOW, display } from "@/components/indie";

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
      <div className="relative bg-[#f5edd8] text-[#1a0505] border-2 border-black shadow-[6px_6px_0_0_#000] max-w-sm w-full p-6 space-y-4">
        <h2 className="text-base font-bold text-[#1a0505]">{title}</h2>
        <p className="text-sm text-black/55 leading-relaxed">{description}</p>
        <div className="flex gap-3 justify-end">
          <Button size="sm" variant="outline" onClick={onCancel} className="rounded-none border-2 border-black bg-transparent text-black hover:bg-black/10">Cancel</Button>
          <Button
            size="sm"
            onClick={onConfirm}
            className={`rounded-none border-2 border-black text-white ${danger ? "bg-[#a1001a] hover:bg-[#7a0013]" : "bg-[#7a1c1c] hover:bg-[#5a1212]"}`}
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

      <div className="bg-[#f5edd8] text-[#1a0505] border-2 border-black border-l-8 border-l-[#7a1c1c] shadow-[4px_4px_0_0_#000] overflow-hidden">
        {/* Header */}
        <div className="px-5 pt-5 pb-3">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="text-sm font-bold text-[#1a0505] truncate">
                {team.event?.name ?? "Unknown Event"}
              </h3>
              <p className="text-xs text-black/55 mt-0.5">
                {members.length} of {team.size} members
                {isLeader && (
                  <span className="ml-1.5 text-[#7a1c1c] font-medium">· you&apos;re the leader</span>
                )}
              </p>
            </div>
            <button
              onClick={() => setConfirm(isLeader ? "delete" : "leave")}
              disabled={actionLoading}
              className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-none transition-colors shrink-0 ${
                isLeader
                  ? "text-red-600 hover:bg-red-50 hover:text-red-700"
                  : "text-black/55 hover:bg-black/10 hover:text-[#1a0505]"
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

          {/* Fill bar — pending (amber) behind confirmed (sky/emerald) */}
          <div className="mt-3 h-1.5 bg-black/10 rounded-full overflow-hidden relative">
            {/* pending layer */}
            <div
              className="absolute inset-y-0 left-0 rounded-full bg-amber-300 transition-all"
              style={{ width: `${claimedPct}%` }}
            />
            {/* confirmed layer */}
            <div
              className={`absolute inset-y-0 left-0 rounded-full transition-all ${isFull && pendingInvites.length === 0 ? "bg-emerald-500" : "bg-[#f5c928]/300"}`}
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
                  isExternal ? "bg-amber-100 text-amber-700" : "bg-[#dbe7ff] text-[#0b2a6b]"
                }`}>
                  {m.fullName[0]?.toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <p className="text-sm font-medium text-[#1a0505] truncate">{m.fullName}</p>
                    <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full border shrink-0 ${
                      isExternal
                        ? "bg-amber-50 text-amber-700 border-amber-200"
                        : "bg-[#dbe7ff] text-[#0b2a6b] border-[#0b2a6b]"
                    }`}>
                      {isExternal ? "External" : "OPJU"}
                    </span>
                  </div>
                  <p className="text-xs text-black/55 truncate">{m.email}</p>
                </div>
                {isTeamLeader ? (
                  <Badge className="h-5 shrink-0 rounded-none bg-[#7a1c1c] text-xs text-[#f5edd8]">Leader</Badge>
                ) : isLeader && !isSelf ? (
                  <button
                    onClick={() => setConfirm(m.email)}
                    disabled={removingEmail === m.email}
                    className="shrink-0 inline-flex items-center gap-1 text-[10px] font-medium text-black/55 hover:text-red-500 hover:bg-red-50 transition-colors px-2 py-1 rounded-none disabled:opacity-40"
                  >
                    {removingEmail === m.email
                      ? <div className="w-3 h-3 border-2 border-black/50 border-t-transparent rounded-full animate-spin" />
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
            <div key={inv._id} className="flex items-center gap-2.5 bg-amber-50 border border-amber-100 rounded-none px-3 py-2">
              <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                <Clock className="h-3.5 w-3.5 text-amber-500" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-[#1a0505] truncate">{inv.inviteeEmail}</p>
                <p className="text-[10px] text-amber-600">Invite pending · awaiting response</p>
              </div>
              {isLeader && (
                <button
                  onClick={() => handleCancelInvite(inv._id)}
                  disabled={cancelingId === inv._id}
                  className="inline-flex items-center gap-1 text-[10px] font-medium text-black/55 hover:text-red-500 transition-colors disabled:opacity-40 shrink-0 px-2 py-1 rounded-none hover:bg-red-50"
                >
                  {cancelingId === inv._id
                    ? <div className="w-3 h-3 border-2 border-black/50 border-t-transparent rounded-full animate-spin" />
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
                <div className="border border-[#7a1c1c] bg-[#f5c928]/30 rounded-none px-3 py-2.5 space-y-1.5">
                  <div className="flex gap-2">
                    <div className="flex-1 relative">
                      <Input
                        type="email"
                        placeholder="teammate@email.com"
                        value={inviteEmail}
                        onChange={(e) => handleEmailChange(e.target.value)}
                        onKeyDown={(e) => { if (e.key === "Enter") handleInvite(i); if (e.key === "Escape") { setInviteOpenSlot(null); setInviteEmail(""); setInviteMsg(null); setInvitePreview(null); } }}
                        autoFocus
                        className="h-8 text-sm bg-[#f5edd8] w-full"
                      />
                      {validating && (
                        <div className="absolute right-2 top-2 w-4 h-4 border-2 border-[#7a1c1c] border-t-transparent rounded-full animate-spin" />
                      )}
                    </div>
                    <Button
                      size="sm"
                      onClick={() => handleInvite(i)}
                      disabled={inviting || !invitePreview}
                      className="h-8 px-3 text-xs shrink-0 rounded-none border-2 border-black bg-[#7a1c1c] text-white hover:bg-[#5a1212]"
                    >
                      {inviting ? <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : "Send"}
                    </Button>
                    <button onClick={() => { setInviteOpenSlot(null); setInviteEmail(""); setInviteMsg(null); setInvitePreview(null); }} className="text-black/55 hover:text-[#1a0505] px-1 shrink-0">
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
                  className={`w-full flex items-center gap-2.5 border-2 border-dashed rounded-none px-3 py-2 transition-colors ${
                    isLeader
                      ? "border-black/40 hover:border-[#7a1c1c] hover:bg-[#f5c928]/40 group cursor-pointer"
                      : "border-black/40 cursor-default"
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full border-2 border-dashed flex items-center justify-center shrink-0 transition-colors ${
                    isLeader ? "border-black/40 group-hover:border-[#7a1c1c]" : "border-black/40"
                  }`}>
                    <UserPlus className={`h-3.5 w-3.5 transition-colors ${isLeader ? "text-black/55 group-hover:text-[#7a1c1c]" : "text-black/25"}`} />
                  </div>
                  <span className={`text-xs transition-colors ${isLeader ? "text-black/55 group-hover:text-[#7a1c1c] font-medium" : "text-black/55"}`}>
                    {isLeader ? "Invite teammate" : "Open slot"}
                  </span>
                  {isLeader && (
                    <span className="ml-auto text-[10px] font-semibold text-[#7a1c1c] opacity-0 group-hover:opacity-100 transition-opacity">
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
    <div className="bg-[#fff1c2] border-2 border-black shadow-[4px_4px_0_0_#000] px-5 py-4">
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
            className="h-8 px-3 text-xs rounded-none border-2 border-black bg-[#1f8a3a] text-white hover:bg-[#166b2c]"
            onClick={() => handle("accept")}
            disabled={loading !== null}
          >
            <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
            {loading === "accept" ? "…" : "Accept"}
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="h-8 px-3 text-xs rounded-none border-2 border-black bg-transparent text-black hover:bg-black/10"
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
    <PageShell footer={false}>
      <div className="mx-auto max-w-2xl space-y-3 px-4 py-16">
        <div className="h-10 w-40 animate-pulse bg-[#f5edd8]/20" />
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-36 animate-pulse bg-[#f5edd8]/15" />
        ))}
      </div>
    </PageShell>
  );
}

export default function TeamDetailsPage() {
  return (
    <Suspense fallback={<Skeleton />}>
      <TeamDetailsContent />
    </Suspense>
  );
}

function TeamDetailsContent() {
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

  const crumbs = filteredEvent
    ? [{ label: "Home", href: "/" }, { label: "Dashboard", href: "/dashboard" }, { label: "My teams", href: "/team-details" }, { label: filteredEvent }]
    : [{ label: "Home", href: "/" }, { label: "Dashboard", href: "/dashboard" }, { label: "My teams" }];
  const back = filteredEvent
    ? { href: "/team-details", label: "Back to all teams" }
    : { href: "/dashboard", label: "Back to dashboard" };

  return (
    <AppShell
      title={filteredEvent ?? "My teams"}
      sub={filteredEvent ? "Team for this event" : "Manage your teams and invitations"}
      icon={<Users className="h-6 w-6" />}
      crumbs={crumbs}
      back={back}
    >
      {/* Pending invitations */}
      {!filteredEvent && pendingInvites.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-[#f5c928]" />
            <p className={`text-2xl text-[#f5edd8] ${display.className}`} style={TITLE_SHADOW}>Pending invitations</p>
            <span className="bg-[#f5c928] px-2 py-0.5 text-sm font-bold text-black">{pendingInvites.length}</span>
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

      {/* Teams */}
      <div className="space-y-4">
        {!filteredEvent && (
          <p className={`text-2xl text-[#f5edd8] ${display.className}`} style={TITLE_SHADOW}>
            Registered teams <span className="text-[#f5c928]">({teams.length})</span>
          </p>
        )}

        {visibleTeams.length === 0 ? (
          <div className="border-2 border-dashed border-[#f5edd8]/40 py-12 text-center">
            <Users className="mx-auto mb-3 h-9 w-9 text-[#f5c928]" />
            <p className="text-xl font-bold uppercase text-[#f5edd8]">No team found{filteredEvent ? " for this event" : ""}</p>
            <Link
              href="/events-selection"
              className="mt-1 block text-sm font-bold uppercase tracking-wider text-[#f5c928] hover:underline"
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
    </AppShell>
  );
}
