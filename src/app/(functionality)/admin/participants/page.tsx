export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";
import { getUser } from "@/features/users/user-actions";
import { connectToDatabase } from "@/lib/mongodb";
import { User } from "@/features/users/user.model";
import { Users, Search } from "lucide-react";
import { display } from "@/components/indie";
import { Pager } from "@/components/indie/pager";
import Link from "next/link";
import ExportButton from "./ExportButton";
import ExtraFilters from "./ExtraFilters";
import { OPJU_DEPARTMENTS, OPJU_BRANCHES, OPJU_SEMESTERS, branchFilterValue } from "@/data/opju-academics";
import { CARD_UI, TicketTitle } from "@/components/indie/gold-poster";

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
    const regex = new RegExp(f.q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i"); // literal text, not a pattern
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
  const page = Math.max(1, parseInt(rawPage ?? "1") || 1);
  const limit = 25;

  const [{ rows: participants, total: resultCount }, counts] = await Promise.all([
    getParticipants({ q, type, branch, department, semester }, page, limit).catch(() => ({ rows: [], total: 0 })),
    getParticipantCounts().catch(() => ({ total: 0, internal: 0, external: 0 })),
  ]);
  const filterOptions = getFilterOptions();

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
    <div className="">
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-7">

        {/* Header */}
        <div className="flex items-center flex-wrap justify-between gap-x-4 gap-y-3">
          <div>
            <TicketTitle className="mb-2 text-3xl leading-[1.1] break-words sm:text-5xl">Participants</TicketTitle>
          </div>
        </div>

        {/* Stats (fest palette, same as the other staff pages) */}
        {!q && (
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Total", value: counts.total, sub: "participants", cls: "bg-[#0f6b63] text-white" },
              { label: "OPJU", value: counts.internal, sub: "internal", cls: "bg-[#f5c928] text-[#1c1812]" },
              { label: "External", value: counts.external, sub: "outside colleges", cls: "bg-[#c8421f] text-white" },
            ].map((t) => (
              <div key={t.label} className={`rounded-2xl border-[3px] border-[#1c1812] p-4 shadow-[0_4px_0_#1c1812] ${t.cls}`}>
                <p className="text-sm font-semibold">{t.label}</p>
                <p className={`mt-2 text-4xl leading-none tabular-nums ${display.className}`}>{t.value}</p>
                <p className="mt-2 text-xs font-medium">{t.sub}</p>
              </div>
            ))}
          </div>
        )}

        {/* Type tabs + academic filters + export */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1 rounded-full border-2 border-[#1c1812] bg-white p-1">
              {[
                { label: "All", value: "", n: counts.total },
                { label: "OPJU", value: "internal", n: counts.internal },
                { label: "External", value: "external", n: counts.external },
              ].map((t) => (
                <Link
                  key={t.value}
                  href={tabHref(t.value)}
                  aria-current={type === t.value ? "page" : undefined}
                  className={`rounded-full px-3 py-2.5 text-xs font-extrabold uppercase sm:py-1 transition-colors ${type === t.value ? "bg-[#1c1812] text-[#f3e8cf]" : "text-[#1c1812] hover:bg-black/5"}`}
                >
                  {t.label} <span className="ml-1 tabular-nums opacity-70">{t.n}</span>
                </Link>
              ))}
            </div>
            <ExtraFilters branches={filterOptions.branches} departments={filterOptions.departments} semesters={filterOptions.semesters} />
          </div>
          <ExportButton q={q} type={type} branch={branch} department={department} semester={semester} />
        </div>

        {/* Search */}
        <form method="GET" className="flex gap-2">
          <label className="relative flex-1">
            <span className="sr-only">Search participants</span>
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-black/50" />
            <input
              name="q"
              defaultValue={q}
              placeholder="Search by name, email, phone, enrollment or participant ID…"
              className="h-11 w-full rounded-full border-2 border-[#1c1812] bg-white pl-9 pr-4 text-sm text-[#1c1812] placeholder:text-black/45 focus:outline-none focus:ring-4 focus:ring-[#f5c928]"
            />
          </label>
          {type && <input type="hidden" name="type" value={type} />}
          {branch && <input type="hidden" name="branch" value={branch} />}
          {department && <input type="hidden" name="department" value={department} />}
          {semester && <input type="hidden" name="semester" value={semester} />}
          <button type="submit" className="h-11 rounded-full border-2 border-[#1c1812] bg-[#0f6b63] px-5 text-sm font-extrabold uppercase text-white transition-transform duration-150 active:scale-95">Search</button>
          {q && <Link href={tabHref(type)} className="grid h-11 place-items-center rounded-full border-2 border-[#1c1812] bg-white px-4 text-sm font-bold text-[#1c1812]">Clear</Link>}
        </form>

        {/* List: one card, a row per participant */}
        <section className={`${CARD_UI} overflow-hidden`}>
          <header className="border-b-2 border-dashed border-black/15 px-5 py-3 text-sm text-black/60">
            {q ? <>Results for <b className="text-[#1c1812]">&ldquo;{q}&rdquo;</b></> : "All participants"} · <b className="tabular-nums text-[#1c1812]">{resultCount}</b>
          </header>
          {participants.length === 0 ? (
            <div className="py-14 text-center">
              <Users className="mx-auto mb-3 h-8 w-8 text-black/25" />
              <p className="font-semibold text-black/60">No participants found</p>
            </div>
          ) : (
            <ul className="divide-y divide-black/10">
              {participants.map((p: {
                _id: string; fullName: string; email: string; role: string;
                enrollmentNumber?: string; participantId?: string;
                collegeName?: string; department?: string; branch?: string; semester?: string;
              }) => {
                const opju = p.role === "INTERNAL_USER";
                const where = opju
                  ? [p.department, p.branch, p.semester ? `Sem ${p.semester}` : null].filter(Boolean).join(" · ")
                  : p.collegeName;
                return (
                  <li key={p._id}>
                    <Link href={`/admin/participants/${p._id}`} className="flex items-center gap-3 px-5 py-3 transition-colors hover:bg-[#fff6cc]">
                      <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-full border-2 border-[#1c1812] text-sm font-extrabold ${opju ? "bg-[#f5c928] text-[#1c1812]" : "bg-[#c8421f] text-white"}`}>
                        {p.fullName[0]?.toUpperCase()}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="flex flex-wrap items-center gap-2">
                          <span className="truncate font-bold text-[#1c1812]">{p.fullName}</span>
                          <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${opju ? "bg-[#f5c928] text-[#1c1812]" : "bg-[#c8421f] text-white"}`}>{opju ? "OPJU" : "External"}</span>
                        </span>
                        <span className="block truncate text-xs text-black/60">{p.email}{where ? ` · ${where}` : ""}</span>
                      </span>
                      {(p.participantId || p.enrollmentNumber) && (
                        <code className="hidden shrink-0 rounded-md bg-[#f6efdf] px-2 py-0.5 font-mono text-xs text-[#1c1812] sm:block">{p.participantId || p.enrollmentNumber}</code>
                      )}
                      <span className="shrink-0 text-xs font-bold uppercase text-[#0f6b63]">View</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
          <Pager page={page} pageSize={limit} total={resultCount} href={(n) => `${baseUrl}${baseUrl.endsWith("?") ? "" : "&"}page=${n}`} />
        </section>

      </div>
    </div>
  );
}
