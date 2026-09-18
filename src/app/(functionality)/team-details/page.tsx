"use client";
import { useEffect, useState } from "react";
import { getParticipatingTeams, getInvitedTeams, deleteTeamAction } from "@/actions/team-actions";
import { sendTeamInviteAction, acceptInviteAction, rejectInviteAction } from "@/actions/invite-actions";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  team,
  currentEmail,
  onDelete,
  onInviteSent,
}: {
  team: Team;
  currentEmail: string;
  onDelete: (id: string) => void;
  onInviteSent: () => void;
}) {
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteMsg, setInviteMsg] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [inviting, setInviting] = useState(false);

  const isLeader = team.leader === currentEmail;
  const isFull = team.members.length >= team.size;

  async function handleInvite() {
    if (!inviteEmail.trim()) return;
    setInviting(true);
    setInviteMsg("");
    try {
      await sendTeamInviteAction({ teamId: team._id, inviteeEmail: inviteEmail.trim() });
      setInviteEmail("");
      setInviteMsg("Invite sent.");
      onInviteSent();
    } catch (e: unknown) {
      setInviteMsg((e as Error).message);
    } finally {
      setInviting(false);
    }
  }

  async function handleDelete() {
    if (!confirm(`Leave/delete team for "${team.event?.name}"?`)) return;
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
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-base">{team.event?.name ?? "Unknown Event"}</CardTitle>
            <p className="text-xs text-muted-foreground mt-0.5">
              {team.members.length} / {team.size} members
              {isLeader && <span className="ml-2 text-primary">• You are the leader</span>}
            </p>
          </div>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="text-xs text-destructive hover:underline disabled:opacity-50"
          >
            {deleting ? "Deleting..." : isLeader ? "Delete" : "Leave"}
          </button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <ul className="space-y-1">
          {team.members.map((m) => (
            <li key={m.email} className="flex items-center gap-2 text-sm">
              <span className="w-2 h-2 rounded-full bg-primary/60 shrink-0" />
              <span>{m.fullName}</span>
              <span className="text-xs text-muted-foreground">{m.email}</span>
              {m.email === team.leader && (
                <Badge variant="outline" className="text-xs py-0">Leader</Badge>
              )}
            </li>
          ))}
        </ul>

        {isLeader && !isFull && (
          <div className="flex gap-2 pt-1">
            <input
              type="email"
              placeholder="Invite by email..."
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleInvite()}
              className="flex-1 px-3 py-1.5 rounded-md border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <button
              onClick={handleInvite}
              disabled={inviting}
              className="px-3 py-1.5 rounded-md bg-primary text-primary-foreground text-sm hover:bg-primary/90 disabled:opacity-50"
            >
              {inviting ? "..." : "Invite"}
            </button>
          </div>
        )}
        {isFull && isLeader && (
          <p className="text-xs text-muted-foreground">Team is full.</p>
        )}
        {inviteMsg && (
          <p className="text-xs text-muted-foreground">{inviteMsg}</p>
        )}
      </CardContent>
    </Card>
  );
}

function InviteCard({
  invite,
  onAccept,
  onReject,
}: {
  invite: Invite;
  onAccept: (id: string) => void;
  onReject: (id: string) => void;
}) {
  const [loading, setLoading] = useState<"accept" | "reject" | null>(null);

  async function handle(action: "accept" | "reject") {
    setLoading(action);
    try {
      if (action === "accept") {
        await acceptInviteAction(invite._id);
        onAccept(invite._id);
      } else {
        await rejectInviteAction(invite._id);
        onReject(invite._id);
      }
    } catch (e: unknown) {
      alert((e as Error).message);
    } finally {
      setLoading(null);
    }
  }

  if (invite.status !== "PENDING") return null;

  return (
    <Card className="border-amber-500/20 bg-amber-500/5">
      <CardContent className="py-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="font-medium text-sm">
              Invited to: <span className="text-primary">{invite.team?.event?.name ?? "Unknown Event"}</span>
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              From: {invite.team?.leader?.fullName ?? invite.inviterEmail}
            </p>
            <p className="text-xs text-muted-foreground">
              Team: {invite.team?.members?.length ?? 0} member(s)
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => handle("accept")}
              disabled={loading !== null}
              className="px-3 py-1.5 rounded-md bg-primary text-primary-foreground text-xs hover:bg-primary/90 disabled:opacity-50"
            >
              {loading === "accept" ? "..." : "Accept"}
            </button>
            <button
              onClick={() => handle("reject")}
              disabled={loading !== null}
              className="px-3 py-1.5 rounded-md border text-xs hover:bg-muted disabled:opacity-50"
            >
              {loading === "reject" ? "..." : "Reject"}
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function TeamDetailsPage() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [invites, setInvites] = useState<Invite[]>([]);
  const [currentEmail, setCurrentEmail] = useState("");
  const [loading, setLoading] = useState(true);

  async function reload() {
    try {
      const [t, i] = await Promise.all([getParticipatingTeams(), getInvitedTeams()]);
      setTeams(t);
      setInvites(i);
    } catch {
      //
    }
  }

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/session");
        const d = await res.json();
        if (d.authenticated) setCurrentEmail(d.user?.email ?? "");
      } catch {
        //
      }
      await reload();
      setLoading(false);
    })();
  }, []);

  const pendingInvites = invites.filter((i) => i.status === "PENDING");

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center text-muted-foreground">
        Loading...
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">My Teams</h1>
        <Link href="/dashboard" className="text-sm text-muted-foreground hover:text-primary">← Dashboard</Link>
      </div>

      {pendingInvites.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold">
            Pending Invitations ({pendingInvites.length})
          </h2>
          {pendingInvites.map((invite) => (
            <InviteCard
              key={invite._id}
              invite={invite}
              onAccept={() => { reload(); }}
              onReject={() => { reload(); }}
            />
          ))}
        </div>
      )}

      <div className="space-y-3">
        <h2 className="text-lg font-semibold">
          My Registered Teams ({teams.length})
        </h2>
        {teams.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              <p>You haven&apos;t joined any teams yet.</p>
              <Link href="/events-selection" className="text-primary hover:underline mt-2 block text-sm">
                Browse and register for events →
              </Link>
            </CardContent>
          </Card>
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
  );
}
