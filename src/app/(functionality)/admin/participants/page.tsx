export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";
import { getUser } from "@/actions/user-actions";
import { connectToDatabase } from "@/lib/mongodb";
import { User } from "@/models/user.model";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Link from "next/link";

async function getParticipants(q?: string) {
  await connectToDatabase();
  const filter: Record<string, unknown> = {
    role: { $in: ["INTERNAL_USER", "EXTERNAL_USER"] },
  };
  if (q) {
    const regex = new RegExp(q, "i");
    filter.$or = [
      { fullName: regex },
      { email: regex },
      { mobileNumber: regex },
      { enrollmentNumber: regex },
      { participantId: regex },
      { collegeName: regex },
    ];
  }
  const users = await User.find(filter).sort({ createdAt: -1 }).limit(100).lean();
  return JSON.parse(JSON.stringify(users));
}

export default async function AdminParticipantsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const user = await getUser();
  if (!user || !["DEV_ADMIN", "MANAGEMENT_ADMIN"].includes(user.role)) redirect("/dashboard");

  const { q } = await searchParams;
  const participants = await getParticipants(q).catch(() => []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Participants</h1>
        <Link href="/admin" className="text-sm text-muted-foreground hover:text-primary">← Admin</Link>
      </div>

      <form method="GET" className="flex gap-2">
        <input
          name="q"
          defaultValue={q ?? ""}
          placeholder="Search by name, email, phone, enrollment number..."
          className="flex-1 px-3 py-2 rounded-md border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        />
        <button
          type="submit"
          className="px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90"
        >
          Search
        </button>
      </form>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            {q ? `Results (${participants.length})` : `All Participants (${participants.length})`}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          {participants.length === 0 ? (
            <p className="text-muted-foreground text-sm py-4">No participants found.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Mobile</TableHead>
                  <TableHead>ID</TableHead>
                  <TableHead>College / Dept</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {participants.map((p: {
                  _id: string;
                  fullName: string;
                  email: string;
                  role: string;
                  mobileNumber?: string;
                  enrollmentNumber?: string;
                  participantId?: string;
                  collegeName?: string;
                  department?: string;
                }) => (
                  <TableRow key={p._id}>
                    <TableCell className="font-medium">{p.fullName}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{p.email}</TableCell>
                    <TableCell>
                      <Badge variant={p.role === "INTERNAL_USER" ? "secondary" : "outline"} className="text-xs">
                        {p.role === "INTERNAL_USER" ? "Internal" : "External"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">{p.mobileNumber ?? "—"}</TableCell>
                    <TableCell className="text-xs font-mono">
                      {p.participantId ?? p.enrollmentNumber ?? "—"}
                    </TableCell>
                    <TableCell className="text-sm">{p.collegeName ?? p.department ?? "—"}</TableCell>
                    <TableCell>
                      <Link href={`/admin/participants/${p._id}`} className="text-xs text-primary hover:underline">
                        View →
                      </Link>
                    </TableCell>
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
