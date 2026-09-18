export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";
import { getUser } from "@/actions/user-actions";
import { connectToDatabase } from "@/lib/mongodb";
import { Team } from "@/models/team.model";
import { Event } from "@/models/event.model";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Link from "next/link";

async function getAllTeamsWithEvents() {
  await connectToDatabase();
  const teams = await Team.find().sort({ createdAt: -1 }).lean();
  const eventIds = [...new Set(teams.map((t: { event: unknown }) => String(t.event)))];
  const events = await Event.find({ _id: { $in: eventIds } }).select("name").lean();
  const eventMap = Object.fromEntries(
    events.map((e: { _id: unknown; name: string }) => [String(e._id), e.name])
  );
  return JSON.parse(JSON.stringify(teams.map((t: { event: unknown }) => ({
    ...t,
    eventName: eventMap[String(t.event)] ?? "Unknown",
  }))));
}

export default async function AdminTeamsPage() {
  const user = await getUser();
  if (!user || !["DEV_ADMIN", "MANAGEMENT_ADMIN"].includes(user.role)) redirect("/dashboard");

  const teams = await getAllTeamsWithEvents().catch(() => []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Teams</h1>
        <Link href="/admin" className="text-sm text-muted-foreground hover:text-primary">← Admin</Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">All Teams ({teams.length})</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          {teams.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4">No teams found.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Leader</TableHead>
                  <TableHead>Event</TableHead>
                  <TableHead>Members</TableHead>
                  <TableHead>Max Size</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {teams.map((t: {
                  _id: string;
                  leader: string;
                  eventName: string;
                  members: string[];
                  size: number;
                }) => (
                  <TableRow key={t._id}>
                    <TableCell className="font-medium">{t.leader}</TableCell>
                    <TableCell className="text-sm">{t.eventName}</TableCell>
                    <TableCell className="text-sm">{t.members.length}</TableCell>
                    <TableCell className="text-sm">{t.size}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
