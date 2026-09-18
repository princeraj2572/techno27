export const dynamic = "force-dynamic";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getUser } from "@/actions/user-actions";
import { connectToDatabase } from "@/lib/mongodb";
import { User } from "@/models/user.model";
import { Transaction } from "@/models/transaction.model";
import { Button } from "@/components/ui/button";
import FilterForm from "../FilterForm";
import { ChevronLeft, CreditCard, Download, ChevronRight, CheckCircle2, Clock } from "lucide-react";
import Link from "next/link";

type PayRow = {
  email: string; fullName: string; participantId?: string;
  payableAmount: number; acknowledgedAmount: number;
  payClearance: boolean; txCount: number;
};

async function getData(params: { q: string; status: string; page: number; limit: number }) {
  const { q, status, page, limit } = params;
  await connectToDatabase();

  const userFilter: Record<string, unknown> = { role: "EXTERNAL_USER" };
  if (q) {
    const r = new RegExp(q, "i");
    userFilter.$or = [{ fullName: r }, { email: r }];
  }

  const externalUsers = await User.find(userFilter)
    .select("fullName email participantId")
    .lean();

  const emails = externalUsers.map((u: { email: string }) => u.email);
  const allTx = await Transaction.find({ userEmail: { $in: emails } }).lean();

  const txByEmail = new Map<string, typeof allTx>();
  for (const tx of allTx as { userEmail: string }[]) {
    if (!txByEmail.has(tx.userEmail)) txByEmail.set(tx.userEmail, []);
    txByEmail.get(tx.userEmail)!.push(tx as never);
  }

  const allRows: PayRow[] = JSON.parse(JSON.stringify(externalUsers)).map((u: { email: string; fullName: string; participantId?: string }) => {
    const txs = (txByEmail.get(u.email) ?? []) as { currentPayAmount?: number; amountAtAdmin?: number; clearanceApproval?: boolean }[];
    return {
      email: u.email,
      fullName: u.fullName,
      participantId: u.participantId,
      payableAmount: txs.reduce((s, t) => s + (t.currentPayAmount ?? 0), 0),
      acknowledgedAmount: txs.reduce((s, t) => s + (t.amountAtAdmin ?? 0), 0),
      payClearance: txs.some((t) => t.clearanceApproval),
      txCount: txs.length,
    };
  });

  const filtered = status === "cleared"
    ? allRows.filter((r) => r.payClearance)
    : status === "pending"
    ? allRows.filter((r) => !r.payClearance)
    : allRows;

  return {
    rows: filtered.slice((page - 1) * limit, page * limit),
    total: filtered.length,
  };
}

export default async function ReportPaymentsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>;
}) {
  const user = await getUser();
  if (!user || !["DEV_ADMIN", "MANAGEMENT_ADMIN"].includes(user.role)) redirect("/dashboard");

  const sp     = await searchParams;
  const q      = sp.q      ?? "";
  const status = sp.status ?? "";
  const page   = Math.max(1, parseInt(sp.page ?? "1"));
  const limit  = [25, 50, 100].includes(parseInt(sp.limit ?? "25")) ? parseInt(sp.limit ?? "25") : 25;

  const { rows, total } = await getData({ q, status, page, limit }).catch(() => ({ rows: [], total: 0 }));
  const totalPages = Math.ceil(total / limit);

  const exportParams = new URLSearchParams();
  if (q)      exportParams.set("q", q);
  if (status) exportParams.set("status", status);
  const exportHref = `/api/export/payments${exportParams.toString() ? `?${exportParams}` : ""}`;

  const pageParams = new URLSearchParams();
  if (q)             pageParams.set("q", q);
  if (status)        pageParams.set("status", status);
  if (limit !== 25)  pageParams.set("limit", String(limit));
  const baseUrl = `/admin/reports/payments?${pageParams}`;

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-7">

        <div className="flex items-center justify-between animate-slide-up" style={{ animationDelay: "0s" }}>
          <div>
            <Link href="/admin/reports" className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-teal-600 transition-colors mb-1">
              <ChevronLeft className="h-3.5 w-3.5" /> Reports
            </Link>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Payment Report</h1>
            <p className="text-xs text-slate-400 mt-0.5">{total} participant(s)</p>
          </div>
          <div className="flex items-center gap-3">
            <a href={exportHref} download className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-600 hover:text-emerald-700 border border-emerald-200 rounded-lg px-3 py-2">
              <Download className="h-3.5 w-3.5" />
              {q || status ? "Export filtered" : "Download Excel"}
            </a>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
              <CreditCard className="h-4 w-4 text-emerald-600" />
            </div>
          </div>
        </div>

        <div className="animate-slide-up" style={{ animationDelay: "0.04s" }}>
          <Suspense>
            <FilterForm view="payments" />
          </Suspense>
        </div>

        <div className="space-y-2 animate-slide-up" style={{ animationDelay: "0.08s" }}>
          {rows.length === 0 ? (
            <div className="rounded-2xl border-2 border-dashed border-slate-100 py-10 text-center">
              <p className="text-sm text-slate-400">No results</p>
            </div>
          ) : (
            rows.map((p: PayRow) => (
              <div key={p.email} className={`bg-white border border-slate-100 border-l-4 ${
                p.payClearance ? "border-l-emerald-500" : "border-l-amber-400"
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
                  <p className="text-sm font-bold text-slate-900">â‚¹{p.payableAmount}</p>
                  <p className="text-xs text-slate-400">{p.txCount} tx</p>
                </div>
                {p.payClearance ? (
                  <span className="text-xs font-medium text-emerald-600 flex items-center gap-1 shrink-0">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Cleared
                  </span>
                ) : (
                  <span className="text-xs font-medium text-amber-600 flex items-center gap-1 shrink-0">
                    <Clock className="h-3.5 w-3.5" /> Pending
                  </span>
                )}
              </div>
            ))
          )}
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between pt-2">
            <p className="text-xs text-slate-400">
              {(page - 1) * limit + 1}â€“{Math.min(page * limit, total)} of {total}
            </p>
            <div className="flex items-center gap-2">
              {page > 1 ? (
                <Button variant="outline" size="sm" className="h-8 text-xs" asChild>
                  <Link href={`${baseUrl}&page=${page - 1}`}>â† Prev</Link>
                </Button>
              ) : (
                <Button variant="outline" size="sm" className="h-8 text-xs" disabled>â† Prev</Button>
              )}
              <span className="text-xs text-slate-400">{page} / {totalPages}</span>
              {page < totalPages ? (
                <Button variant="outline" size="sm" className="h-8 text-xs" asChild>
                  <Link href={`${baseUrl}&page=${page + 1}`}>Next <ChevronRight className="h-3 w-3 ml-0.5" /></Link>
                </Button>
              ) : (
                <Button variant="outline" size="sm" className="h-8 text-xs" disabled>Next <ChevronRight className="h-3 w-3 ml-0.5" /></Button>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
