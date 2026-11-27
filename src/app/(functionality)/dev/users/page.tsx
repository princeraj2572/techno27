export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";
import { getUser, getAllUsersPaginated, searchUsers } from "@/features/users/user-actions";
import { Search, ChevronRight, ChevronLeft as ChevLeft } from "lucide-react";
import Link from "next/link";
import ExtraFilters from "../../admin/participants/ExtraFilters";
import { OPJU_BRANCHES, OPJU_DEPARTMENTS, OPJU_SEMESTERS, branchFilterValue } from "@/data/opju-academics";
import { TicketTitle } from "@/components/indie/gold-poster";

const ROLE_CHIP: Record<string, string> = {
  DEV_ADMIN:        "bg-red-50    text-red-700    border-red-200",
  MANAGEMENT_ADMIN: "bg-[#fbe3d9] text-[#a33517] border-[#c8421f]/30",
  EVENT_MANAGER:    "bg-[#e3f1ef]   text-[#0f6b63]   border-[#0f6b63]/30",
  INTERNAL_USER:    "bg-[#e3f1ef]    text-[#0f6b63]    border-[#0f6b63]/30",
  EXTERNAL_USER:    "bg-amber-50  text-amber-700  border-amber-200",
};

const ROLE_AVATAR: Record<string, string> = {
  DEV_ADMIN:        "bg-red-100    text-red-700",
  MANAGEMENT_ADMIN: "bg-[#fbe3d9] text-[#a33517]",
  EVENT_MANAGER:    "bg-[#e3f1ef]   text-[#0f6b63]",
  INTERNAL_USER:    "bg-[#e3f1ef]    text-[#0f6b63]",
  EXTERNAL_USER:    "bg-amber-100  text-amber-700",
};

type UserRow = {
  _id: string; fullName: string; email: string; role: string;
  mobileNumber?: string; enrollmentNumber?: string; participantId?: string;
  collegeName?: string; branch?: string; department?: string; semester?: string;
  createdAt?: string;
};

export default async function DevUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string; branch?: string; department?: string; semester?: string }>;
}) {
  const user = await getUser();
  if (!user || user.role !== "DEV_ADMIN") redirect("/dashboard");

  const { q, page: pageParam, branch, department, semester } = await searchParams;
  const page = Math.max(1, parseInt(pageParam ?? "1", 10) || 1);

  let users: UserRow[] = [];
  let total = 0;
  let totalPages = 1;

  if (q) {
    const results = await searchUsers(q).catch(() => []);
    users = results as UserRow[];
    total = results.length;
    totalPages = 1;
  } else {
    const data = await getAllUsersPaginated(page, 25, {
      branch: branch ? branchFilterValue(branch) : undefined,
      department,
      semester,
    }).catch(() => ({ users: [], total: 0, totalPages: 1, currentPage: 1 }));
    users = data.users as UserRow[];
    total = data.total;
    totalPages = data.totalPages;
  }

  return (
    <div className="">
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-7">

        {/* Header */}
        <div className="flex items-center flex-wrap justify-between gap-x-4 gap-y-3">
          <div>
            <TicketTitle className="mb-2 text-3xl leading-[1.1] break-words sm:text-5xl">Users</TicketTitle>
            <p className="text-xs text-slate-500 mt-0.5">
              {q ? `Search results for "${q}"` : `${total.toLocaleString()} registered accounts`}
            </p>
          </div>
        </div>

        {/* Branch / Department / Semester filters */}
        <div className="">
          <ExtraFilters
            branches={[...OPJU_BRANCHES]}
            departments={[...OPJU_DEPARTMENTS]}
            semesters={OPJU_SEMESTERS.map(String)}
          />
        </div>

        {/* Search */}
        <form method="GET" className="">
          {branch && <input type="hidden" name="branch" value={branch} />}
          {department && <input type="hidden" name="department" value={department} />}
          {semester && <input type="hidden" name="semester" value={semester} />}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 pointer-events-none" />
              <input
                name="q"
                defaultValue={q ?? ""}
                placeholder="Search by name, email, mobile, enrollment, participantId..."
                className="w-full pl-9 pr-3 h-10 rounded-xl border-2 border-[#1c1812] bg-white text-sm text-slate-800 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#f5c928] focus:border-[#1c1812]/30"
              />
            </div>
            <button
              type="submit"
              className="px-4 h-10 rounded-xl bg-[#0f6b63] text-white text-sm font-medium hover:bg-[#0b4f49] transition-colors shrink-0"
            >
              Search
            </button>
            {q && (
              <Link
                href="/dev/users"
                className="px-4 h-10 rounded-2xl border-[3px] border-[#1c1812] shadow-[0_4px_0_#1c1812] bg-white text-slate-600 text-sm font-medium hover:bg-slate-50 transition-colors shrink-0 flex items-center"
              >
                Clear
              </Link>
            )}
          </div>
        </form>

        {/* Results */}
        <div className="">
          {users.length === 0 ? (
            <div className="rounded-2xl border-[3px] border-dashed border-[#1c1812]/30 py-12 text-center bg-white/60">
              <Search className="h-8 w-8 mx-auto mb-3 text-slate-300" />
              <p className="text-sm font-medium text-slate-500">
                {q ? `No users found for "${q}"` : "No users yet"}
              </p>
            </div>
          ) : (
            <div className="bg-white border-[3px] border-[#1c1812] shadow-[0_4px_0_#1c1812] rounded-2xl overflow-hidden divide-y divide-slate-100">
              {users.map((u) => (
                <div key={u._id} className="flex items-center gap-3 px-4 py-3.5 hover:bg-slate-50 transition-colors">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${ROLE_AVATAR[u.role] ?? "bg-slate-100 text-slate-600"}`}>
                    {u.fullName[0]?.toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-semibold text-slate-900 truncate">{u.fullName}</p>
                      <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full border shrink-0 ${ROLE_CHIP[u.role] ?? "bg-slate-50 text-slate-600 border-slate-200"}`}>
                        {u.role.replace(/_/g, " ")}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 truncate">{u.email}</p>
                  </div>
                  <div className="text-right shrink-0 hidden sm:block">
                    {(u.enrollmentNumber ?? u.participantId) && (
                      <code className="text-xs font-mono text-slate-500 block">{u.enrollmentNumber ?? u.participantId}</code>
                    )}
                    {u.collegeName && <p className="text-xs text-slate-500 truncate max-w-[120px]">{u.collegeName}</p>}
                    {(u.branch || u.semester) && (
                      <p className="text-xs text-slate-500 truncate max-w-[160px]">
                        {[u.branch, u.semester ? `Sem ${u.semester}` : null].filter(Boolean).join(" · ")}
                      </p>
                    )}
                  </div>
                  <Link
                    href={`/dev/users/${u._id}`}
                    className="text-xs font-semibold text-[#0f6b63] hover:text-[#0f6b63] shrink-0 px-3 py-1.5 rounded-lg hover:bg-[#f6efdf] transition-colors"
                  >
                    View
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pagination (only when not searching) */}
        {!q && totalPages > 1 && (() => {
          const pageParams = new URLSearchParams();
          if (branch) pageParams.set("branch", branch);
          if (department) pageParams.set("department", department);
          if (semester) pageParams.set("semester", semester);
          const extra = pageParams.toString();
          const pageHref = (p: number) => `/dev/users?page=${p}${extra ? `&${extra}` : ""}`;
          return (
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-500">
              Page {page} of {totalPages} · {total} users
            </p>
            <div className="flex items-center gap-2">
              {page > 1 && (
                <Link
                  href={pageHref(page - 1)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-2xl border-[3px] border-[#1c1812] shadow-[0_4px_0_#1c1812] bg-white text-xs text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <ChevLeft className="h-3.5 w-3.5" /> Prev
                </Link>
              )}
              {page < totalPages && (
                <Link
                  href={pageHref(page + 1)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-2xl border-[3px] border-[#1c1812] shadow-[0_4px_0_#1c1812] bg-white text-xs text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  Next <ChevronRight className="h-3.5 w-3.5" />
                </Link>
              )}
            </div>
          </div>
          );
        })()}

      </div>
    </div>
  );
}
