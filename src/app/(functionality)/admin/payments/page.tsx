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
  const payments = paymentData ?? [];

  const totalPayable  = payments.reduce((s, p) => s + (p?.payableAmount ?? 0), 0);
  const totalCleared  = payments.filter((p) => p?.payClearance).length;
  const totalPending  = payments.length - totalCleared;

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
            <p className="text-xs text-slate-400 mt-0.5">External participant payments</p>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-indigo-100 flex items-center justify-center">
            <CreditCard className="h-5 w-5 text-indigo-600" />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 animate-slide-up" style={{ animationDelay: "0.05s" }}>
          <div className="bg-indigo-600 rounded-2xl p-4">
            <p className="text-xs font-medium text-indigo-200 mb-3">Total payable</p>
            <p className="text-3xl font-bold text-white tabular-nums leading-none">₹{totalPayable}</p>
            <p className="text-xs text-indigo-300 mt-2">{payments.length} participants</p>
          </div>
          <div className={`rounded-2xl p-4 ${totalCleared > 0 ? "bg-emerald-500" : "bg-slate-100"}`}>
            <p className={`text-xs font-medium mb-3 ${totalCleared > 0 ? "text-emerald-100" : "text-slate-400"}`}>Cleared</p>
            <p className={`text-4xl font-bold tabular-nums leading-none ${totalCleared > 0 ? "text-white" : "text-slate-700"}`}>{totalCleared}</p>
            <p className={`text-xs mt-2 ${totalCleared > 0 ? "text-emerald-200" : "text-slate-400"}`}>payments</p>
          </div>
          <div className={`rounded-2xl p-4 ${totalPending > 0 ? "bg-amber-500" : "bg-slate-100"}`}>
            <p className={`text-xs font-medium mb-3 ${totalPending > 0 ? "text-amber-100" : "text-slate-400"}`}>Pending</p>
            <p className={`text-4xl font-bold tabular-nums leading-none ${totalPending > 0 ? "text-white" : "text-slate-700"}`}>{totalPending}</p>
            <p className={`text-xs mt-2 ${totalPending > 0 ? "text-amber-200" : "text-slate-400"}`}>awaiting clearance</p>
          </div>
        </div>

        {/* Payment rows */}
        <div className="space-y-2 animate-slide-up" style={{ animationDelay: "0.1s" }}>
          <p className="text-xs font-medium text-slate-400">All external participant payments · {payments.length}</p>

          {payments.length === 0 ? (
            <div className="rounded-2xl border-2 border-dashed border-slate-100 py-12 text-center">
              <CreditCard className="h-8 w-8 mx-auto mb-3 text-slate-200" />
              <p className="text-sm font-medium text-slate-500">No payment data yet</p>
            </div>
          ) : (
            payments.map((p) =>
              p ? (
                <div key={p.email} className={`bg-white border border-slate-100 border-l-4 ${
                  p.payClearance ? "border-l-emerald-500" : p.acknowledgedAmount > 0 ? "border-l-amber-400" : "border-l-slate-200"
                } rounded-xl px-4 py-3.5`}>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-xs font-bold text-amber-700 shrink-0">
                      {p.fullName[0]?.toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-900 truncate">{p.fullName}</p>
                      <p className="text-xs text-slate-400 truncate">{p.email}</p>
                      {p.eventNames && <p className="text-xs text-slate-400 truncate">{p.eventNames}</p>}
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <div className="text-right">
                        <p className="text-sm font-bold text-slate-900">₹{p.payableAmount}</p>
                        {p.acknowledgedAmount > 0 && (
                          <p className="text-xs text-slate-400">ack ₹{p.acknowledgedAmount}</p>
                        )}
                      </div>
                      {p.payClearance ? (
                        <span className="text-xs font-medium text-emerald-600 flex items-center gap-1">
                          <CheckCircle2 className="h-3.5 w-3.5" /> Cleared
                        </span>
                      ) : (
                        <span className="text-xs font-medium text-amber-600 flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" /> Pending
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ) : null
            )
          )}
        </div>

      </div>
    </div>
  );
}
