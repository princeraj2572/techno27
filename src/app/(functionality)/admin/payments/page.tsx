export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";
import { getUser } from "@/actions/user-actions";
import { getPaymentData } from "@/actions/payment-actions";
import { ChevronLeft, CreditCard, CheckCircle2, Clock } from "lucide-react";
import Link from "next/link";

export default async function AdminPaymentsPage() {
  const user = await getUser();
  if (!user || !["DEV_ADMIN", "MANAGEMENT_ADMIN"].includes(user.role)) redirect("/dashboard");

  const paymentData = await getPaymentData().catch(() => []);
  const payments = (paymentData ?? []).filter(Boolean) as NonNullable<(typeof paymentData)[0]>[];

  const clearedCount = payments.filter((p) => p.payClearance).length;
  const pendingCount = payments.filter((p) => !p.payClearance && p.numberOfTransactions > 0).length;

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-7">

        {/* Header */}
        <div className="flex items-center justify-between animate-slide-up" style={{ animationDelay: "0s" }}>
          <div>
            <Link href="/admin" className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-indigo-600 transition-colors mb-1">
              <ChevronLeft className="h-3.5 w-3.5" /> Admin
            </Link>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Payments</h1>
            <p className="text-xs text-slate-400 mt-0.5">External participant payment status</p>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-indigo-100 flex items-center justify-center">
            <CreditCard className="h-5 w-5 text-indigo-600" />
          </div>
        </div>

        {/* Stats — no amounts shown */}
        <div className="grid grid-cols-3 gap-3 animate-slide-up" style={{ animationDelay: "0.05s" }}>
          <div className="bg-indigo-600 rounded-2xl p-4">
            <p className="text-xs font-medium text-indigo-200 mb-3">Participants</p>
            <p className="text-4xl font-bold text-white tabular-nums leading-none">{payments.length}</p>
            <p className="text-xs text-indigo-300 mt-2">external</p>
          </div>
          <div className={`rounded-2xl p-4 ${clearedCount > 0 ? "bg-emerald-500" : "bg-slate-100"}`}>
            <p className={`text-xs font-medium mb-3 ${clearedCount > 0 ? "text-emerald-100" : "text-slate-400"}`}>Cleared</p>
            <p className={`text-4xl font-bold tabular-nums leading-none ${clearedCount > 0 ? "text-white" : "text-slate-700"}`}>{clearedCount}</p>
            <p className={`text-xs mt-2 ${clearedCount > 0 ? "text-emerald-200" : "text-slate-400"}`}>payments done</p>
          </div>
          <div className={`rounded-2xl p-4 ${pendingCount > 0 ? "bg-amber-500" : "bg-slate-100"}`}>
            <p className={`text-xs font-medium mb-3 ${pendingCount > 0 ? "text-amber-100" : "text-slate-400"}`}>Pending</p>
            <p className={`text-4xl font-bold tabular-nums leading-none ${pendingCount > 0 ? "text-white" : "text-slate-700"}`}>{pendingCount}</p>
            <p className={`text-xs mt-2 ${pendingCount > 0 ? "text-amber-200" : "text-slate-400"}`}>awaiting clearance</p>
          </div>
        </div>

        {/* Payment rows — status only, no amounts */}
        <div className="space-y-2 animate-slide-up" style={{ animationDelay: "0.1s" }}>
          <p className="text-xs font-medium text-slate-400 mb-2">All external participants · {payments.length}</p>

          {payments.length === 0 ? (
            <div className="rounded-2xl border-2 border-dashed border-slate-100 py-12 text-center">
              <CreditCard className="h-8 w-8 mx-auto mb-3 text-slate-200" />
              <p className="text-sm font-medium text-slate-500">No external participants yet</p>
            </div>
          ) : (
            payments.map((p) => (
              <div key={p.email} className={`bg-white border border-slate-100 border-l-4 ${
                p.payClearance ? "border-l-emerald-500" : p.numberOfTransactions > 0 ? "border-l-amber-400" : "border-l-slate-200"
              } rounded-xl px-4 py-3.5`}>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-xs font-bold text-amber-700 shrink-0">
                    {p.fullName[0]?.toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-900 truncate">{p.fullName}</p>
                    <p className="text-xs text-slate-400 truncate">{p.email}</p>
                    {p.eventNames && (
                      <p className="text-xs text-slate-400 truncate">{p.eventNames}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs text-slate-400">{p.numberOfTransactions} tx</span>
                    {p.payClearance ? (
                      <span className="text-xs font-medium text-emerald-600 flex items-center gap-1">
                        <CheckCircle2 className="h-3.5 w-3.5" /> Cleared
                      </span>
                    ) : p.numberOfTransactions > 0 ? (
                      <span className="text-xs font-medium text-amber-600 flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" /> Pending
                      </span>
                    ) : (
                      <span className="text-xs text-slate-300">No payment</span>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}
