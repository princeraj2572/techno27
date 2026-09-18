export const dynamic = "force-dynamic";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getUser } from "@/actions/user-actions";
import { connectToDatabase } from "@/lib/mongodb";
import { Accommodation } from "@/models/accommodation.model";
import { Button } from "@/components/ui/button";
import FilterForm from "../FilterForm";
import { ChevronLeft, Hotel, Download, ChevronRight } from "lucide-react";
import Link from "next/link";

type AccomItem = {
  _id: string;
  gender?: string;
  universityName?: string;
  arrivalTime?: string;
  departureTime?: string;
  additionalDetails?: string;
  userId?: { fullName?: string; email?: string } | null;
};

async function getData(params: { q: string; gender: string; page: number; limit: number }) {
  const { q, gender, page, limit } = params;
  await connectToDatabase();

  const filter: Record<string, unknown> = {};
  if (gender) filter.gender = gender;

  const [items, dbTotal] = await Promise.all([
    Accommodation.find(filter)
      .populate("userId", "fullName email")
      .sort({ createdAt: -1 })
      .skip(q ? 0 : (page - 1) * limit)
      .limit(q ? 0 : limit)
      .lean(),
    Accommodation.countDocuments(filter),
  ]);

  let rows = JSON.parse(JSON.stringify(items)) as AccomItem[];

  if (q) {
    const rx = new RegExp(q, "i");
    rows = rows.filter((i) =>
      rx.test(i.userId?.fullName ?? "") ||
      rx.test(i.userId?.email    ?? "") ||
      rx.test(i.universityName   ?? "")
    );
    const start = (page - 1) * limit;
    return { rows: rows.slice(start, start + limit), total: rows.length };
  }

  return { rows, total: dbTotal };
}

export default async function ReportAccommodationPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>;
}) {
  const user = await getUser();
  if (!user || !["DEV_ADMIN", "MANAGEMENT_ADMIN"].includes(user.role)) redirect("/dashboard");

  const sp     = await searchParams;
  const q      = sp.q      ?? "";
  const gender = sp.gender ?? "";
  const page   = Math.max(1, parseInt(sp.page ?? "1"));
  const limit  = [25, 50, 100].includes(parseInt(sp.limit ?? "25")) ? parseInt(sp.limit ?? "25") : 25;

  const { rows, total } = await getData({ q, gender, page, limit }).catch(() => ({ rows: [], total: 0 }));
  const totalPages = Math.ceil(total / limit);

  const exportParams = new URLSearchParams();
  if (q)      exportParams.set("q", q);
  if (gender) exportParams.set("gender", gender);
  const exportHref = `/api/export/accommodation${exportParams.toString() ? `?${exportParams}` : ""}`;

  const pageParams = new URLSearchParams();
  if (q)            pageParams.set("q", q);
  if (gender)       pageParams.set("gender", gender);
  if (limit !== 25) pageParams.set("limit", String(limit));
  const baseUrl = `/admin/reports/accommodation?${pageParams}`;

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-7">

        <div className="flex items-center justify-between animate-slide-up" style={{ animationDelay: "0s" }}>
          <div>
            <Link href="/admin/reports" className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-teal-600 transition-colors mb-1">
              <ChevronLeft className="h-3.5 w-3.5" /> Reports
            </Link>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Accommodation Report</h1>
            <p className="text-xs text-slate-400 mt-0.5">{total} request(s)</p>
          </div>
          <div className="flex items-center gap-3">
            <a href={exportHref} download className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-600 hover:text-amber-700 border border-amber-200 rounded-lg px-3 py-2">
              <Download className="h-3.5 w-3.5" />
              {q || gender ? "Export filtered" : "Download Excel"}
            </a>
            <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center shrink-0">
              <Hotel className="h-4 w-4 text-amber-600" />
            </div>
          </div>
        </div>

        <div className="animate-slide-up" style={{ animationDelay: "0.04s" }}>
          <Suspense>
            <FilterForm view="accommodation" />
          </Suspense>
        </div>

        <div className="space-y-2 animate-slide-up" style={{ animationDelay: "0.08s" }}>
          {rows.length === 0 ? (
            <div className="rounded-2xl border-2 border-dashed border-slate-100 py-10 text-center">
              <p className="text-sm text-slate-400">No results</p>
            </div>
          ) : (
            rows.map((item: AccomItem) => (
              <div key={item._id} className="bg-white border border-slate-100 border-l-4 border-l-amber-300 rounded-xl px-4 py-3.5 flex items-start gap-3">
                <div className="w-7 h-7 rounded-full bg-amber-100 flex items-center justify-center text-xs font-bold text-amber-700 shrink-0">
                  {(item.userId?.fullName ?? "?")[0]?.toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-900">{item.userId?.fullName ?? "â€”"}</p>
                  <p className="text-xs text-slate-400">{item.userId?.email ?? "â€”"}</p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {[
                      item.universityName,
                      item.gender && `(${item.gender})`,
                      item.arrivalTime  && `Arrives ${new Date(item.arrivalTime).toLocaleDateString()}`,
                      item.departureTime && `Departs ${new Date(item.departureTime).toLocaleDateString()}`,
                    ].filter(Boolean).join(" Â· ")}
                  </p>
                  {item.additionalDetails && (
                    <p className="text-xs text-slate-400 truncate">{item.additionalDetails}</p>
                  )}
                </div>
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
