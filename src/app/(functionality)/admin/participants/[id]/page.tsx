export const dynamic = "force-dynamic";
import { redirect, notFound } from "next/navigation";
import { getUser } from "@/actions/user-actions";
import { connectToDatabase } from "@/lib/mongodb";
import { User } from "@/models/user.model";
import { Team } from "@/models/team.model";
import { Transaction } from "@/models/transaction.model";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import { ChevronLeft, User as UserIcon, CheckCircle2, Clock } from "lucide-react";
import Link from "next/link";

const STATUS_LABEL: Record<string, { text: string; color: string }> = {
  REGISTRATION_OPEN:   { text: "Open",      color: "text-emerald-600" },
  EVENT_LIVE:          { text: "Live now",  color: "text-teal-600"  },
  COMPLETED:           { text: "Completed", color: "text-slate-400"   },
  CANCELLED:           { text: "Cancelled", color: "text-red-500"     },
  REGISTRATION_CLOSED: { text: "Closed",    color: "text-amber-600"   },
  TEMPORARILY_CLOSED:  { text: "Paused",    color: "text-orange-500"  },
};

const STATUS_BORDER: Record<string, string> = {
  REGISTRATION_OPEN:   "border-l-emerald-500",
  EVENT_LIVE:          "border-l-teal-500",
  COMPLETED:           "border-l-slate-300",
  CANCELLED:           "border-l-red-400",
  REGISTRATION_CLOSED: "border-l-amber-400",
  TEMPORARILY_CLOSED:  "border-l-orange-400",
};

function Field({ label, value }: { label: string; value?: unknown }) {
  if (!value) return null;
  return (
    <div>
      <p className="text-xs text-slate-400">{label}</p>
      <p className="text-sm font-medium text-slate-900 mt-0.5">{String(value)}</p>
    </div>
  );
}

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
  const isExternal = p.role === "EXTERNAL_USER";
  const firstName = String(p.fullName).split(" ")[0];

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-2xl mx-auto px-4 py-8 space-y-7">

        {/* Header */}
        <div className="flex items-start justify-between gap-4 animate-slide-up" style={{ animationDelay: "0s" }}>
          <div>
            <Link href="/admin/participants" className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-teal-600 transition-colors mb-1">
              <ChevronLeft className="h-3.5 w-3.5" /> Participants
            </Link>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">{String(p.fullName)}</h1>
            <p className="text-xs text-slate-400 mt-0.5">{String(p.email)}</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className={`text-xs font-semibold px-2 py-1 rounded-full border ${
              isExternal ? "bg-amber-50 text-amber-700 border-amber-200" : "bg-teal-50 text-teal-700 border-teal-200"
            }`}>
              {isExternal ? "External" : "OPJU"}
            </span>
            {p.profilePhotoUrl ? (
              <Image src={String(p.profilePhotoUrl)} alt={String(p.fullName)} width={40} height={40}
                className="rounded-full object-cover ring-2 ring-slate-100" unoptimized />
            ) : (
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                isExternal ? "bg-amber-500 text-white" : "bg-teal-600 text-white"
              }`}>
                {firstName[0]?.toUpperCase()}
              </div>
            )}
          </div>
        </div>

        {/* Profile */}
        <div className="bg-white border border-slate-100 rounded-2xl px-5 py-5 animate-slide-up" style={{ animationDelay: "0.05s" }}>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-6 h-6 rounded-lg bg-teal-50 flex items-center justify-center">
              <UserIcon className="h-3.5 w-3.5 text-teal-600" />
            </div>
            <p className="text-sm font-semibold text-slate-900">Profile</p>
          </div>
          <div className="grid grid-cols-2 gap-x-6 gap-y-3.5">
            <Field label="Mobile" value={p.mobileNumber} />
            <Field label="Gender" value={p.gender} />
            <Field label="Date of Birth" value={p.dateOfBirth ? new Date(String(p.dateOfBirth)).toLocaleDateString() : undefined} />
            <Field label="Department" value={p.department} />
            <Field label="Program" value={p.program} />
            <Field label="Branch" value={p.branch} />
            <Field label="Year" value={p.year} />
            {isExternal ? (
              <>
                <Field label="College" value={p.collegeName} />
                <Field label="City, State" value={[p.city, p.state].filter(Boolean).join(", ")} />
                <Field label="Participant ID" value={p.participantId} />
                <Field label="Accommodation" value={(p.accommodationNeeded as boolean) ? "Yes" : "No"} />
              </>
            ) : (
              <>
                <Field label="Enrollment No." value={p.enrollmentNumber} />
                <Field label="Semester" value={p.semester} />
                <Field label="Section" value={p.section} />
                <Field label="Resident" value={p.dayScholarOrHosteller} />
              </>
            )}
            <Field label="Emergency Contact" value={p.emergencyContactName} />
            <Field label="Emergency No." value={p.emergencyContactNumber} />
            <Field label="Joined" value={p.createdAt ? new Date(String(p.createdAt)).toLocaleDateString() : undefined} />
          </div>
        </div>

        <Separator />

        {/* Events */}
        <div className="space-y-3 animate-slide-up" style={{ animationDelay: "0.1s" }}>
          <p className="text-sm font-semibold text-slate-900">
            Registered events <span className="text-slate-400 font-normal">({teamList.length})</span>
          </p>
          {teamList.length === 0 ? (
            <div className="rounded-2xl border-2 border-dashed border-slate-100 py-8 text-center">
              <p className="text-sm text-slate-400">No event registrations</p>
            </div>
          ) : (
            teamList.map((t: { _id: string; event?: { name: string; status: string }; members: string[] }) => {
              const border = STATUS_BORDER[t.event?.status ?? ""] ?? "border-l-slate-200";
              const label  = STATUS_LABEL[t.event?.status ?? ""] ?? { text: t.event?.status?.replace(/_/g, " ") ?? "â€”", color: "text-slate-400" };
              return (
                <div key={t._id} className={`bg-white border border-slate-100 border-l-4 ${border} rounded-xl px-4 py-3.5 flex items-center justify-between`}>
                  <p className="text-sm font-semibold text-slate-900">{t.event?.name ?? "Unknown Event"}</p>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-xs text-slate-400">{t.members.length} member(s)</span>
                    <span className={`text-xs font-medium ${label.color}`}>{label.text}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Transactions (external only) */}
        {isExternal && (
          <>
            <Separator />
            <div className="space-y-3 animate-slide-up" style={{ animationDelay: "0.15s" }}>
              <p className="text-sm font-semibold text-slate-900">
                Transactions <span className="text-slate-400 font-normal">({txList.length})</span>
              </p>
              {txList.length === 0 ? (
                <div className="rounded-2xl border-2 border-dashed border-slate-100 py-8 text-center">
                  <p className="text-sm text-slate-400">No transactions submitted</p>
                </div>
              ) : (
                txList.map((tx: { _id: string; transactionId: string; currentPayAmount: number; acknowledgementByAdmin: boolean; clearanceApproval: boolean }) => (
                  <div key={tx._id} className="bg-white border border-slate-100 rounded-xl px-4 py-3.5 flex items-center justify-between">
                    <code className="text-xs font-mono text-slate-500">{tx.transactionId}</code>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-semibold text-slate-900">â‚¹{tx.currentPayAmount}</span>
                      {tx.clearanceApproval ? (
                        <span className="text-xs font-medium text-emerald-600 flex items-center gap-1">
                          <CheckCircle2 className="h-3.5 w-3.5" /> Cleared
                        </span>
                      ) : tx.acknowledgementByAdmin ? (
                        <span className="text-xs font-medium text-amber-600 flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" /> Acknowledged
                        </span>
                      ) : (
                        <span className="text-xs font-medium text-slate-400">Pending</span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        )}

      </div>
    </div>
  );
}
