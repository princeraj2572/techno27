export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";
import { getUser } from "@/actions/user-actions";
import { connectToDatabase } from "@/lib/mongodb";
import { User } from "@/models/user.model";
import { Transaction } from "@/models/transaction.model";
import { ChevronLeft, CreditCard, CheckCircle2, Clock } from "lucide-react";
import Link from "next/link";

async function getPaymentData() {
  await connectToDatabase();
  const externalUsers = await User.find({ role: "EXTERNAL_USER" })
    .select("fullName email participantId mobileNumber")
    .lean();

  const emails = externalUsers.map((u: { email: string }) => u.email);
  const allTx  = await Transaction.find({ userEmail: { $in: emails } }).lean();

  const txByEmail = new Map<string, typeof allTx>();
  for (const tx of allTx as { userEmail: string }[]) {
    if (!txByEmail.has(tx.userEmail)) txByEmail.set(tx.userEmail, []);
    txByEmail.get(tx.userEmail)!.push(tx as never);
  }

  type Row = {
    email: string; fullName: string; participantId?: string; mobileNumber?: string;
    payableAmount: number; payClearance: boolean; txCount: number;
  };

  const rows: Row[] = JSON.parse(JSON.stringify(externalUsers)).map((u: { email: string; fullName: string; participantId?: string; mobileNumber?: string }) => {
    const txs = (txByEmail.get(u.email) ?? []) as { currentPayAmount?: number; clearanceApproval?: boolean }[];
    return {
      email: u.email,
      fullName: u.fullName,
      participantId: u.participantId,
      mobileNumber: u.mobileNumber,
      payableAmount: txs.reduce((s, t) => s + (t.currentPayAmount ?? 0), 0),
      payClearance: txs.some((t) => t.clearanceApproval),
      txCount: txs.length,
    };
  });

  const totalAmount = rows.reduce((s, r) => s + r.payableAmount, 0);
  const clearedCount = rows.filter((r) => r.payClearance).length;
  const pendingCount = rows.filter((r) => !r.payClearance && r.txCount > 0).length;

  return { rows, totalAmount, clearedCount, pendingCount };
}

export default async function DevPaymentsPage() {
  const user = await getUser();
  if (!user || user.role !== "DEV_ADMIN") redirect("/dashboard");

  const { rows, totalAmount, clearedCount, pendingCount } = await getPaymentData().catch(() => ({
    rows: [], totalAmount: 0, clearedCount: 0, pendingCount: 0,
  }));

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-7">

        {/* Header */}
        <div className="flex items-center justify-between animate-slide-up" style={{ animationDelay: "0s" }}>
          <div>
            <Link href="/dev" className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-indigo-600 transition-colors mb-1">
              <ChevronLeft className="h-3.5 w-3.5" /> Dev
            </Link>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Payments</h1>
            <p className="text-xs text-slate-400 mt-0.5">{rows.length} external participant(s)</p>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-indigo-100 flex items-center justify-center">
            <CreditCard className="h-5 w-5 text-indigo-600" />
          </div>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-3 gap-3 animate-slide-up" style={{ animationDelay: "0.05s" }}>
          <div className="bg-indigo-600 rounded-2xl px-4 py-4">
            <p className="text-xs font-medium text-indigo-200 mb-1">Total payable</p>
            <p className="text-2xl font-bold text-white tabular-nums">₹{totalAmount.toLocaleString()}</p>
          </div>
          <div className="bg-emerald-50 border border-emerald-100 rounded-2xl px-4 py-4">
            <p className="text-xs font-medium text-emerald-600 mb-1">Cleared</p>
            <p className="text-2xl font-bold text-emerald-900 tabular-nums">{clearedCount}</p>
          </div>
          <div className={`rounded-2xl px-4 py-4 ${pendingCount > 0 ? "bg-amber-500" : "bg-slate-50 border border-slate-100"}`}>
            <p className={`text-xs font-medium mb-1 ${pendingCount > 0 ? "text-amber-100" : "text-slate-400"}`}>Pending</p>
            <p className={`text-2xl font-bold tabular-nums ${pendingCount > 0 ? "text-white" : "text-slate-700"}`}>{pendingCount}</p>
          </div>
        </div>

        {/* Payment rows */}
        <div className="space-y-2 animate-slide-up" style={{ animationDelay: "0.1s" }}>
          {rows.length === 0 ? (
            <div className="rounded-2xl border-2 border-dashed border-slate-100 py-12 text-center">
              <CreditCard className="h-8 w-8 mx-auto mb-3 text-slate-200" />
              <p className="text-sm font-medium text-slate-500">No external participants yet</p>
            </div>
          ) : (
            rows.map((p) => (
              <div key={p.email} className={`bg-white border border-slate-100 border-l-4 ${
                p.payClearance ? "border-l-emerald-500" : p.txCount > 0 ? "border-l-amber-400" : "border-l-slate-200"
              } rounded-xl px-4 py-3.5 flex items-center gap-3`}>
                <div className="w-7 h-7 rounded-full bg-amber-100 flex items-center justify-center text-xs font-bold text-amber-700 shrink-0">
                  {p.fullName[0]?.toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-900 truncate">{p.fullName}</p>
                  <p className="text-xs text-slate-400 truncate">{p.email}</p>
                  {p.participantId && <code className="text-[10px] font-mono text-slate-400">{p.participantId}</code>}
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-bold text-slate-900">₹{p.payableAmount}</p>
                  <p className="text-xs text-slate-400">{p.txCount} tx</p>
                </div>
                {p.payClearance ? (
                  <span className="text-xs font-medium text-emerald-600 flex items-center gap-1 shrink-0">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Cleared
                  </span>
                ) : p.txCount > 0 ? (
                  <span className="text-xs font-medium text-amber-600 flex items-center gap-1 shrink-0">
                    <Clock className="h-3.5 w-3.5" /> Pending
                  </span>
                ) : (
                  <span className="text-xs text-slate-300 shrink-0">No tx</span>
                )}
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}
