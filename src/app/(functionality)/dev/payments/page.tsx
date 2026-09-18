export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";
import { getUser } from "@/actions/user-actions";
import { getPaymentData, MAX_PAYMENT } from "@/actions/payment-actions";
import { ChevronLeft, CreditCard } from "lucide-react";
import Link from "next/link";
import ApprovalPanel from "./ApprovalPanel";

export default async function DevPaymentsPage() {
  const user = await getUser();
  if (!user || user.role !== "DEV_ADMIN") redirect("/dashboard");

  const paymentData = await getPaymentData().catch(() => []);
  const payments = (paymentData ?? []).filter(Boolean) as NonNullable<(typeof paymentData)[0]>[];

  const totalPayable  = payments.reduce((s, p) => s + p.payableAmount, 0);
  const clearedCount  = payments.filter((p) => p.payClearance).length;
  const pendingCount  = payments.filter((p) => !p.payClearance && p.numberOfTransactions > 0).length;

  const currentUserId = String((user as Record<string, unknown>)._id ?? "");

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
            <p className="text-xs text-slate-400 mt-0.5">{payments.length} external participant(s) · max ₹{MAX_PAYMENT}</p>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-indigo-100 flex items-center justify-center">
            <CreditCard className="h-5 w-5 text-indigo-600" />
          </div>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-3 gap-3 animate-slide-up" style={{ animationDelay: "0.05s" }}>
          <div className="bg-indigo-600 rounded-2xl px-4 py-4">
            <p className="text-xs font-medium text-indigo-200 mb-1">Total payable</p>
            <p className="text-2xl font-bold text-white tabular-nums">₹{totalPayable.toLocaleString()}</p>
            <p className="text-xs text-indigo-300 mt-1">{payments.length} participants</p>
          </div>
          <div className={`rounded-2xl px-4 py-4 ${clearedCount > 0 ? "bg-emerald-500" : "bg-slate-50 border border-slate-100"}`}>
            <p className={`text-xs font-medium mb-1 ${clearedCount > 0 ? "text-emerald-100" : "text-slate-400"}`}>Cleared</p>
            <p className={`text-2xl font-bold tabular-nums ${clearedCount > 0 ? "text-white" : "text-slate-700"}`}>{clearedCount}</p>
          </div>
          <div className={`rounded-2xl px-4 py-4 ${pendingCount > 0 ? "bg-amber-500" : "bg-slate-50 border border-slate-100"}`}>
            <p className={`text-xs font-medium mb-1 ${pendingCount > 0 ? "text-amber-100" : "text-slate-400"}`}>Pending</p>
            <p className={`text-2xl font-bold tabular-nums ${pendingCount > 0 ? "text-white" : "text-slate-700"}`}>{pendingCount}</p>
          </div>
        </div>

        {/* Approval panel — full transaction details + acknowledge button */}
        <div className="animate-slide-up" style={{ animationDelay: "0.1s" }}>
          <p className="text-xs font-medium text-slate-400 mb-3">
            Click any row to expand transactions and acknowledge payments
          </p>
          <ApprovalPanel
            rows={payments.map((p) => ({
              email:             p.email,
              fullName:          p.fullName,
              mobileNumber:      p.mobileNumber,
              eventNames:        p.eventNames,
              payableAmount:     p.payableAmount,
              acknowledgedAmount: p.acknowledgedAmount,
              payClearance:      p.payClearance,
              transactions:      p.transactions,
            }))}
            currentUserId={currentUserId}
          />
        </div>

      </div>
    </div>
  );
}
