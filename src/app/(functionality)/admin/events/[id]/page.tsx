export const dynamic = "force-dynamic";
import { redirect, notFound } from "next/navigation";
import { getUser } from "@/actions/user-actions";
import { getEventByIdAction } from "@/actions/event-actions";
import { connectToDatabase } from "@/lib/mongodb";
import { Team } from "@/models/team.model";
import { User } from "@/models/user.model";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Link from "next/link";

export default async function AdminEventDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const viewer = await getUser();
  if (!viewer || !["DEV_ADMIN", "MANAGEMENT_ADMIN"].includes(viewer.role)) redirect("/dashboard");

  const { id } = await params;
  const event = await getEventByIdAction(id);
  if (!event) notFound();

  await connectToDatabase();
  const teams = await Team.find({ event: id }).lean();
  const allEmails = teams.flatMap((t: { leader: string; members: string[] }) => [t.leader, ...t.members]);
  const uniqueEmails = [...new Set(allEmails)];
  const users = await User.find({ email: { $in: uniqueEmails } })
    .select("fullName email role enrollmentNumber participantId mobileNumber")
    .lean();

  const usersMap = Object.fromEntries(
    JSON.parse(JSON.stringify(users)).map((u: { email: string }) => [u.email, u])
  );
  const teamList = JSON.parse(JSON.stringify(teams));

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{event.name}</h1>
          <p className="text-muted-foreground text-sm">Event Detail</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline">{String(event.status).replace(/_/g, " ")}</Badge>
          <Link href="/admin/events" className="text-sm text-muted-foreground hover:text-primary">← Events</Link>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
        {[
          ["Team Size", event.teamSize ?? 1],
          ["Internal Fee", `₹${event.internalFee ?? 0}`],
          ["External Fee", `₹${event.externalFee ?? 0}`],
          ["Prize Pool", event.prizeMoney ? `₹${event.prizeMoney}` : "—"],
          ["Registered", event.registeredCount ?? teamList.length],
          ["Limit", event.maxParticipants ? String(event.maxParticipants) : "∞"],
        ].map(([label, val]) => (
          <div key={String(label)} className="bg-muted/30 rounded-lg p-3">
            <div className="text-xs text-muted-foreground">{label}</div>
            <div className="font-semibold mt-0.5">{val}</div>
          </div>
        ))}
      </div>

      {viewer.role === "DEV_ADMIN" && (
        <p className="text-xs text-muted-foreground bg-muted/50 rounded px-3 py-2">
          To change registration status, go to{" "}
          <Link href={`/dev/events/${id}`} className="text-primary hover:underline">Dev → Events → {event.name}</Link>.
        </p>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            Registered Teams ({teamList.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          {teamList.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4">No registrations yet.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Leader</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Members</TableHead>
                  <TableHead>Type</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {teamList.map((t: { _id: string; leader: string; members: string[] }) => {
                  const leaderUser = usersMap[t.leader] as { fullName?: string; role?: string } | undefined;
                  return (
                    <TableRow key={t._id}>
                      <TableCell className="font-medium">
                        {leaderUser?.fullName ?? t.leader}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">{t.leader}</TableCell>
                      <TableCell className="text-sm">{t.members.length}</TableCell>
                      <TableCell>
                        <Badge variant={leaderUser?.role === "INTERNAL_USER" ? "secondary" : "outline"} className="text-xs">
                          {leaderUser?.role === "INTERNAL_USER" ? "Internal" : "External"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
