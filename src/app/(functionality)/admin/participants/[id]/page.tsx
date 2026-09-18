export const dynamic = "force-dynamic";
import { redirect, notFound } from "next/navigation";
import { getUser } from "@/actions/user-actions";
import { connectToDatabase } from "@/lib/mongodb";
import { User } from "@/models/user.model";
import { Team } from "@/models/team.model";
import { Transaction } from "@/models/transaction.model";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default async function AdminParticipantDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const viewer = await getUser();
  if (!viewer || !["DEV_ADMIN", "MANAGEMENT_ADMIN"].includes(viewer.role)) redirect("/dashboard");

  const { id } = await params;
  await connectToDatabase();
  const participant = await User.findById(id).lean();
  if (!participant) notFound();

  const teams = await Team.find({ leader: (participant as { email: string }).email })
    .populate("event", "name status")
    .lean();
  const transactions = await Transaction.find({ userEmail: (participant as { email: string }).email })
    .sort({ createdAt: -1 })
    .lean();

  const p = JSON.parse(JSON.stringify(participant)) as Record<string, unknown>;
  const teamList = JSON.parse(JSON.stringify(teams));
  const txList = JSON.parse(JSON.stringify(transactions));

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{String(p.fullName)}</h1>
          <p className="text-muted-foreground text-sm">{String(p.email)}</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline">{String(p.role).replace(/_/g, " ")}</Badge>
          <Link href="/admin/participants" className="text-sm text-muted-foreground hover:text-primary">← Back</Link>
        </div>
      </div>

      {!!p.profilePhotoUrl && (
        <Image
          src={String(p.profilePhotoUrl)}
          alt="Profile"
          width={96}
          height={96}
          className="rounded-full object-cover border"
          unoptimized
        />
      )}

      <Card>
        <CardHeader><CardTitle className="text-base">Profile</CardTitle></CardHeader>
        <CardContent>
          <dl className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
            {([
              ["Mobile", p.mobileNumber],
              ["Gender", p.gender],
              ["Department", p.department],
              ["Program", p.program],
              ["Branch", p.branch],
              ["Year", p.year],
              p.role === "INTERNAL_USER" ? ["Enrollment No.", p.enrollmentNumber] : ["College", p.collegeName],
              p.role === "INTERNAL_USER" ? ["Semester", p.semester] : ["City, State", `${p.city ?? ""}, ${p.state ?? ""}`],
              p.role === "INTERNAL_USER" ? ["Hosteller", p.dayScholarOrHosteller] : ["Participant ID", p.participantId],
              ["Emergency Contact", p.emergencyContactName],
              ["Emergency No.", p.emergencyContactNumber],
              ["Joined", p.createdAt ? new Date(String(p.createdAt)).toLocaleDateString() : "—"],
            ] as [string, unknown][]).map(([label, val]) => val ? (
              <div key={label}>
                <dt className="text-xs text-muted-foreground">{label}</dt>
                <dd className="font-medium">{String(val)}</dd>
              </div>
            ) : null)}
          </dl>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">Registered Events ({teamList.length})</CardTitle></CardHeader>
        <CardContent>
          {teamList.length === 0 ? (
            <p className="text-sm text-muted-foreground">No event registrations.</p>
          ) : (
            <ul className="space-y-2">
              {teamList.map((t: { _id: string; event?: { name: string; status: string }; members: string[] }) => (
                <li key={t._id} className="flex items-center justify-between text-sm">
                  <span>{t.event?.name ?? "Unknown Event"}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">{t.members.length} member(s)</span>
                    <Badge variant="outline" className="text-xs">{t.event?.status?.replace(/_/g, " ") ?? "—"}</Badge>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      {p.role === "EXTERNAL_USER" && (
        <Card>
          <CardHeader><CardTitle className="text-base">Transactions ({txList.length})</CardTitle></CardHeader>
          <CardContent>
            {txList.length === 0 ? (
              <p className="text-sm text-muted-foreground">No transactions submitted.</p>
            ) : (
              <ul className="space-y-2 text-sm">
                {txList.map((tx: { _id: string; transactionId: string; currentPayAmount: number; acknowledgementByAdmin: boolean; clearanceApproval: boolean }) => (
                  <li key={tx._id} className="flex items-center justify-between py-1 border-b last:border-0">
                    <span className="font-mono text-xs">{tx.transactionId}</span>
                    <div className="flex items-center gap-2">
                      <span>₹{tx.currentPayAmount}</span>
                      <Badge variant={tx.clearanceApproval ? "secondary" : "outline"} className="text-xs">
                        {tx.clearanceApproval ? "Cleared" : tx.acknowledgementByAdmin ? "Acknowledged" : "Pending"}
                      </Badge>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
