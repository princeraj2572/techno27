export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";
import { getUser } from "@/actions/user-actions";
import { getPaymentData, getPaymentStatusCounts } from "@/actions/payment-actions";
import { MAX_PAYMENT } from "@/lib/payment-constants";
import { Button } from "@/components/ui/button";
import { ChevronLeft, CreditCard, ChevronRight } from "lucide-react";
import Link from "next/link";
import ApprovalPanel from "./ApprovalPanel";

export default async function DevPaymentsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const user = await getUser();
  if (!user || user.role !== "DEV_ADMIN") redirect("/dashboard");

  const { page: rawPage } = await searchParams;
  const page = Math.max(1, parseInt(rawPage ?? "1"));
  const limit = 25;

  const [{ rows: payments, total }, statusCounts] = await Promise.all([
    getPaymentData(page, limit).catch(() => ({ rows: [], total: 0 })),
    getPaymentStatusCounts().catch(() => ({ cleared: 0, pending: 0 })),
  ]);
  const totalPages = Math.ceil(total / limit);

  const pagePayable = payments.reduce((s, p) => s + p.payableAmount, 0);
  const currentUserId = String(user._id ?? "");

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
            <p className="text-xs text-slate-400 mt-0.5">{total} external participant(s) · max ₹{MAX_PAYMENT}</p>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-indigo-100 flex items-center justify-center">
            <CreditCard className="h-5 w-5 text-indigo-600" />
          </div>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-3 gap-3 animate-slide-up" style={{ animationDelay: "0.05s" }}>
          <div className="bg-indigo-600 rounded-2xl px-4 py-4">
            <p className="text-xs font-medium text-indigo-200 mb-1">Payable (this page)</p>
            <p className="text-2xl font-bold text-white tabular-nums">₹{pagePayable.toLocaleString()}</p>
            <p className="text-xs text-indigo-300 mt-1">{payments.length} of {total} participants</p>
          </div>
          <div className={`rounded-2xl px-4 py-4 ${statusCounts.cleared > 0 ? "bg-emerald-500" : "bg-slate-50 border border-slate-100"}`}>
            <p className={`text-xs font-medium mb-1 ${statusCounts.cleared > 0 ? "text-emerald-100" : "text-slate-400"}`}>Cleared</p>
            <p className={`text-2xl font-bold tabular-nums ${statusCounts.cleared > 0 ? "text-white" : "text-slate-700"}`}>{statusCounts.cleared}</p>
          </div>
          <div className={`rounded-2xl px-4 py-4 ${statusCounts.pending > 0 ? "bg-amber-500" : "bg-slate-50 border border-slate-100"}`}>
            <p className={`text-xs font-medium mb-1 ${statusCounts.pending > 0 ? "text-amber-100" : "text-slate-400"}`}>Pending</p>
            <p className={`text-2xl font-bold tabular-nums ${statusCounts.pending > 0 ? "text-white" : "text-slate-700"}`}>{statusCounts.pending}</p>
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

          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-4">
              <p className="text-xs text-slate-400">
                {(page - 1) * limit + 1}â€“{Math.min(page * limit, total)} of {total}
              </p>
              <div className="flex items-center gap-2">
                {page > 1 ? (
                  <Button variant="outline" size="sm" className="h-8 text-xs" asChild>
                    <Link href={`/dev/payments?page=${page - 1}`}>â† Prev</Link>
                  </Button>
                ) : (
                  <Button variant="outline" size="sm" className="h-8 text-xs" disabled>â† Prev</Button>
                )}
                <span className="text-xs text-slate-400">{page} / {totalPages}</span>
                {page < totalPages ? (
                  <Button variant="outline" size="sm" className="h-8 text-xs" asChild>
                    <Link href={`/dev/payments?page=${page + 1}`}>Next <ChevronRight className="h-3 w-3 ml-0.5" /></Link>
                  </Button>
                ) : (
                  <Button variant="outline" size="sm" className="h-8 text-xs" disabled>Next <ChevronRight className="h-3 w-3 ml-0.5" /></Button>
                )}
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
