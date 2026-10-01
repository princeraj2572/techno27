export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";
import { getUser } from "@/actions/user-actions";
import { connectToDatabase } from "@/lib/mongodb";
import { User } from "@/models/user.model";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronLeft, Users, Search, ChevronRight } from "lucide-react";
import Link from "next/link";
import ExportButton from "./ExportButton";
import ExtraFilters from "./ExtraFilters";
import { OPJU_DEPARTMENTS, OPJU_BRANCHES, OPJU_SEMESTERS, branchFilterValue } from "@/data/opju-academics";

interface ParticipantFilters {
  q: string;
  type: string;
  branch: string;
  department: string;
  semester: string;
}

async function getParticipants(f: ParticipantFilters, page: number, limit: number) {
  await connectToDatabase();
  const filter: Record<string, unknown> = { role: { $in: ["INTERNAL_USER", "EXTERNAL_USER"] } };
  if (f.type === "internal") filter.role = "INTERNAL_USER";
  if (f.type === "external") filter.role = "EXTERNAL_USER";
  if (f.branch) filter.branch = branchFilterValue(f.branch);
  if (f.department) filter.department = f.department;
  if (f.semester) filter.semester = f.semester;
  if (f.q) {
    const regex = new RegExp(f.q, "i");
    filter.$or = [
      { fullName: regex }, { email: regex }, { mobileNumber: regex },
      { enrollmentNumber: regex }, { participantId: regex }, { collegeName: regex },
    ];
  }
  const [users, total] = await Promise.all([
    User.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    User.countDocuments(filter),
  ]);
  return { rows: JSON.parse(JSON.stringify(users)), total };
}

async function getParticipantCounts() {
  await connectToDatabase();
  const [total, internal, external] = await Promise.all([
    User.countDocuments({ role: { $in: ["INTERNAL_USER", "EXTERNAL_USER"] } }),
    User.countDocuments({ role: "INTERNAL_USER" }),
    User.countDocuments({ role: "EXTERNAL_USER" }),
  ]);
  return { total, internal, external };
}

// Full official OPJU lists, not just whatever values happen to already
// exist in the User collection — lets an admin filter by a branch/
// department/semester even before anyone has registered under it.
function getFilterOptions() {
  return {
    branches: [...OPJU_BRANCHES],
    departments: [...OPJU_DEPARTMENTS],
    semesters: OPJU_SEMESTERS.map(String),
  };
}

export default async function AdminParticipantsPage({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string; page?: string; type?: string;
    branch?: string; department?: string; semester?: string;
  }>;
}) {
  const user = await getUser();
  if (!user || !["DEV_ADMIN", "MANAGEMENT_ADMIN"].includes(user.role)) redirect("/dashboard");

  const {
    q: rawQ, page: rawPage, type: rawType,
    branch: rawBranch, department: rawDepartment, semester: rawSemester,
  } = await searchParams;
  const q = rawQ ?? "";
  const type = ["internal", "external"].includes(rawType ?? "") ? rawType! : "";
  const branch = rawBranch ?? "";
  const department = rawDepartment ?? "";
  const semester = rawSemester ?? "";
  const page = Math.max(1, parseInt(rawPage ?? "1"));
  const limit = 25;

  const [{ rows: participants, total: resultCount }, counts] = await Promise.all([
    getParticipants({ q, type, branch, department, semester }, page, limit).catch(() => ({ rows: [], total: 0 })),
    getParticipantCounts().catch(() => ({ total: 0, internal: 0, external: 0 })),
  ]);
  const filterOptions = getFilterOptions();

  const totalPages = Math.ceil(resultCount / limit);
  const filterParams = new URLSearchParams();
  if (q) filterParams.set("q", q);
  if (type) filterParams.set("type", type);
  if (branch) filterParams.set("branch", branch);
  if (department) filterParams.set("department", department);
  if (semester) filterParams.set("semester", semester);
  const baseUrl = `/admin/participants?${filterParams.toString()}`;

  const tabHref = (t: string) => {
    const p = new URLSearchParams(filterParams);
    if (t) p.set("type", t); else p.delete("type");
    const qs = p.toString();
    return `/admin/participants${qs ? `?${qs}` : ""}`;
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-7">

        {/* Header */}
        <div className="flex items-center justify-between animate-slide-up" style={{ animationDelay: "0s" }}>
          <div>
            <Link href="/admin" className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-teal-600 transition-colors mb-1">
              <ChevronLeft className="h-3.5 w-3.5" /> Admin
            </Link>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Participants</h1>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-teal-100 flex items-center justify-center">
            <Users className="h-5 w-5 text-teal-600" />
          </div>
        </div>

        {/* Stats */}
        {!q && (
          <div className="grid grid-cols-3 gap-3 animate-slide-up" style={{ animationDelay: "0.04s" }}>
            <div className="bg-teal-600 rounded-2xl p-4">
              <p className="text-xs font-medium text-teal-200 mb-3">Total</p>
              <p className="text-4xl font-bold text-white tabular-nums leading-none">{counts.total}</p>
              <p className="text-xs text-teal-300 mt-2">participants</p>
            </div>
            <div className="bg-teal-50 rounded-2xl p-4">
              <p className="text-xs font-medium text-teal-400 mb-3">Internal</p>
              <p className="text-4xl font-bold text-teal-900 tabular-nums leading-none">{counts.internal}</p>
              <p className="text-xs text-teal-400 mt-2">OPJU students</p>
            </div>
            <div className="rounded-2xl p-4 bg-amber-500">
              <p className="text-xs font-medium mb-3 text-amber-100">External</p>
              <p className="text-4xl font-bold tabular-nums leading-none text-white">{counts.external}</p>
              <p className="text-xs mt-2 text-amber-200">outside colleges</p>
            </div>
          </div>
        )}

        {/* Filter tabs + branch/department/semester filters + Export */}
        <div className="flex items-center justify-between gap-2 flex-wrap animate-slide-up" style={{ animationDelay: "0.06s" }}>
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1 bg-slate-100 rounded-xl p-1">
              {[
                { label: "All", value: "" },
                { label: "Internal", value: "internal" },
                { label: "External", value: "external" },
              ].map((t) => (
                <Link
                  key={t.value}
                  href={tabHref(t.value)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    type === t.value
                      ? "bg-white text-slate-900 shadow-sm"
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  {t.label}
                  <span className="ml-1.5 text-[10px] text-slate-400">
                    {t.value === "" ? counts.total : t.value === "internal" ? counts.internal : counts.external}
                  </span>
                </Link>
              ))}
            </div>
            <ExtraFilters
              branches={filterOptions.branches}
              departments={filterOptions.departments}
              semesters={filterOptions.semesters}
            />
          </div>
          <ExportButton q={q} type={type} branch={branch} department={department} semester={semester} />
        </div>

        {/* Search */}
        <form method="GET" className="flex gap-2 animate-slide-up" style={{ animationDelay: "0.08s" }}>
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
            <Input
              name="q"
              defaultValue={q ?? ""}
              placeholder="Search by name, email, phone, enrollment number…"
              className="pl-9"
            />
          </div>
          {type && <input type="hidden" name="type" value={type} />}
          {branch && <input type="hidden" name="branch" value={branch} />}
          {department && <input type="hidden" name="department" value={department} />}
          {semester && <input type="hidden" name="semester" value={semester} />}
          <Button type="submit">Search</Button>
          {q && (
            <Button variant="outline" asChild>
              <Link href={tabHref(type)}>Clear</Link>
            </Button>
          )}
        </form>

        {/* List */}
        <div className="space-y-2 animate-slide-up" style={{ animationDelay: "0.12s" }}>
          <p className="text-xs font-medium text-slate-400">
            {q ? `Results for "${q}"` : "All participants"} · {resultCount}
          </p>

          {participants.length === 0 ? (
            <div className="rounded-2xl border-2 border-dashed border-slate-100 py-12 text-center">
              <Users className="h-8 w-8 mx-auto mb-3 text-slate-200" />
              <p className="text-sm font-medium text-slate-500">No participants found</p>
            </div>
          ) : (
            participants.map((p: {
              _id: string; fullName: string; email: string; role: string;
              mobileNumber?: string; enrollmentNumber?: string; participantId?: string;
              collegeName?: string; department?: string; branch?: string; semester?: string;
            }) => (
              <div key={p._id} className="bg-white border border-slate-100 rounded-xl px-4 py-3.5 flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                  p.role === "INTERNAL_USER" ? "bg-teal-100 text-teal-700" : "bg-amber-100 text-amber-700"
                }`}>
                  {p.fullName[0]?.toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-semibold text-slate-900 truncate">{p.fullName}</p>
                    <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full border ${
                      p.role === "INTERNAL_USER"
                        ? "bg-teal-50 text-teal-700 border-teal-200"
                        : "bg-amber-50 text-amber-700 border-amber-200"
                    }`}>
                      {p.role === "INTERNAL_USER" ? "OPJU" : "External"}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 truncate">{p.email}</p>
                  <p className="text-xs text-slate-400">
                    {p.role === "INTERNAL_USER"
                      ? [p.department, p.branch, p.semester ? `Sem ${p.semester}` : null].filter(Boolean).join(" · ") || "—"
                      : p.collegeName ?? "—"}
                    {(p.enrollmentNumber ?? p.participantId) && (
                      <code className="ml-2 font-mono">{p.enrollmentNumber ?? p.participantId}</code>
                    )}
                  </p>
                </div>
                <Link href={`/admin/participants/${p._id}`} className="text-xs text-teal-600 hover:text-teal-700 font-medium shrink-0">
                  View →
                </Link>
              </div>
            ))
          )}

          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-2">
              <p className="text-xs text-slate-400">
                {(page - 1) * limit + 1}–{Math.min(page * limit, resultCount)} of {resultCount}
              </p>
              <div className="flex items-center gap-2">
                {page > 1 ? (
                  <Button variant="outline" size="sm" className="h-8 text-xs" asChild>
                    <Link href={`${baseUrl}&page=${page - 1}`}>← Prev</Link>
                  </Button>
                ) : (
                  <Button variant="outline" size="sm" className="h-8 text-xs" disabled>← Prev</Button>
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
    </div>
  );
}
