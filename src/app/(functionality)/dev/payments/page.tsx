export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";
import { getUser } from "@/features/users/user-actions";
import { getPaymentData, getPaymentStatusCounts } from "@/features/payments/payment-actions";
import { MAX_PAYMENT } from "@/features/payments/payment-constants";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import ApprovalPanel from "./ApprovalPanel";
import { TicketTitle } from "@/components/indie/gold-poster";

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
    <div className="">
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-7">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <TicketTitle className="mb-2 text-3xl leading-[1.1] break-words sm:text-5xl">Payments</TicketTitle>
            <p className="text-xs text-slate-500 mt-0.5">{total} external participant(s) · max ₹{MAX_PAYMENT}</p>
          </div>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-[#1c1812] border-[3px] border-[#1c1812] shadow-[0_4px_0_#1c1812] rounded-2xl px-4 py-4">
            <p className="text-xs font-semibold text-white mb-1">Payable (this page)</p>
            <p className="text-2xl font-bold text-white tabular-nums">₹{pagePayable.toLocaleString()}</p>
            <p className="text-xs font-medium text-white mt-1">{payments.length} of {total} participants</p>
          </div>
          <div className={`rounded-2xl px-4 py-4 ${statusCounts.cleared > 0 ? "bg-[#0f6b63] border-[3px] border-[#1c1812] shadow-[0_4px_0_#1c1812]" : "bg-slate-50 border border-slate-100"}`}>
            <p className={`text-xs font-medium mb-1 ${statusCounts.cleared > 0 ? "text-emerald-100" : "text-slate-500"}`}>Cleared</p>
            <p className={`text-2xl font-bold tabular-nums ${statusCounts.cleared > 0 ? "text-white" : "text-slate-700"}`}>{statusCounts.cleared}</p>
          </div>
          <div className={`rounded-2xl px-4 py-4 ${statusCounts.pending > 0 ? "bg-[#c8421f] border-[3px] border-[#1c1812] shadow-[0_4px_0_#1c1812]" : "bg-slate-50 border border-slate-100"}`}>
            <p className={`text-xs font-medium mb-1 ${statusCounts.pending > 0 ? "text-amber-100" : "text-slate-500"}`}>Pending</p>
            <p className={`text-2xl font-bold tabular-nums ${statusCounts.pending > 0 ? "text-white" : "text-slate-700"}`}>{statusCounts.pending}</p>
          </div>
        </div>

        {/* Approval panel — full transaction details + acknowledge button */}
        <div className="">
          <p className="text-xs font-medium text-slate-500 mb-3">
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
              <p className="text-xs text-slate-500">
                {(page - 1) * limit + 1}–{Math.min(page * limit, total)} of {total}
              </p>
              <div className="flex items-center gap-2">
                {page > 1 ? (
                  <Button variant="outline" size="sm" className="h-8 text-xs" asChild>
                    <Link href={`/dev/payments?page=${page - 1}`}>← Prev</Link>
                  </Button>
                ) : (
                  <Button variant="outline" size="sm" className="h-8 text-xs" disabled>← Prev</Button>
                )}
                <span className="text-xs text-slate-500">{page} / {totalPages}</span>
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
