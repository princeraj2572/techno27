export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";
import { getUser } from "@/actions/user-actions";
import { getAccommodationCounts, getAccommodationsByGender } from "@/actions/accommodation-actions";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Hotel, Building2, Calendar, Phone, Users, ChevronRight } from "lucide-react";
import Link from "next/link";

const GENDERS = ["Male", "Female", "Other"] as const;
type Gender = (typeof GENDERS)[number];

const GENDER_CHIP: Record<Gender, string> = {
  Male:   "bg-sky-50   text-sky-700   border border-sky-200",
  Female: "bg-pink-50  text-pink-700  border border-pink-200",
  Other:  "bg-slate-50 text-slate-600 border border-slate-200",
};

const GENDER_BORDER: Record<Gender, string> = {
  Male:   "border-l-sky-400",
  Female: "border-l-pink-400",
  Other:  "border-l-slate-300",
};

const GENDER_TAB_ACTIVE: Record<Gender, string> = {
  Male:   "bg-sky-600 text-white",
  Female: "bg-pink-600 text-white",
  Other:  "bg-slate-600 text-white",
};

type AccomItem = Awaited<ReturnType<typeof getAccommodationsByGender>>["rows"][number];

function AccomRow({ item }: { item: AccomItem }) {
  const u = item.user as { _id: unknown; fullName: string; email: string; mobileNumber?: string };
  const a = item.accommodation;
  const border = GENDER_BORDER[a.gender as Gender] ?? "border-l-slate-200";
  const chip   = GENDER_CHIP[a.gender as Gender]   ?? "bg-slate-50 text-slate-600 border border-slate-200";

  return (
    <div className={`bg-white border border-slate-100 border-l-4 ${border} rounded-xl px-4 py-3.5`}>
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center text-xs font-bold text-teal-700 shrink-0 mt-0.5">
          {u.fullName[0]?.toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-sm font-semibold text-slate-900">{u.fullName}</p>
            <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${chip}`}>{a.gender}</span>
          </div>
          <p className="text-xs text-slate-400">{u.email}</p>

          <div className="flex items-center gap-4 mt-1.5 flex-wrap">
            {u.mobileNumber && (
              <span className="flex items-center gap-1 text-xs text-slate-500">
                <Phone className="h-3 w-3 shrink-0" /> {u.mobileNumber}
              </span>
            )}
            {a.universityName && (
              <span className="flex items-center gap-1 text-xs text-slate-500">
                <Building2 className="h-3 w-3 shrink-0" /> {a.universityName}
              </span>
            )}
            {a.arrivalTime && (
              <span className="flex items-center gap-1 text-xs text-slate-400">
                <Calendar className="h-3 w-3 shrink-0" />
                {new Date(a.arrivalTime).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                {" → "}
                {a.departureTime ? new Date(a.departureTime).toLocaleDateString("en-IN", { day: "numeric", month: "short" }) : "—"}
              </span>
            )}
          </div>

          {a.additionalDetails && (
            <p className="text-xs text-slate-400 mt-1 line-clamp-2">{a.additionalDetails}</p>
          )}
        </div>
      </div>
    </div>
  );
}

function GroupBlock({ groupName, members }: { groupName: string; members: AccomItem[] }) {
  return (
    <div className="rounded-2xl border border-teal-100 bg-teal-50/40 overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-teal-100 bg-teal-50">
        <Users className="h-3.5 w-3.5 text-teal-500 shrink-0" />
        <p className="text-xs font-semibold text-teal-800">{groupName}</p>
        <span className="ml-auto text-[10px] text-teal-400 font-medium">{members.length} member{members.length !== 1 ? "s" : ""}</span>
      </div>
      <div className="p-3 space-y-2">
        {members.map((item) => (
          <AccomRow key={String(item.user._id)} item={item} />
        ))}
      </div>
    </div>
  );
}

// Groups the current page's rows by groupName. Groups can only be judged
// within the page being viewed — rows with the same groupName that land on
// different pages (same gender tab, sorted by groupName) will appear as
// separate blocks rather than merging across a page boundary.
function buildGroups(items: AccomItem[]) {
  const groups = new Map<string, AccomItem[]>();
  const solo: AccomItem[] = [];
  for (const item of items) {
    const g = (item.accommodation as { groupName?: string }).groupName?.trim();
    if (g) {
      if (!groups.has(g)) groups.set(g, []);
      groups.get(g)!.push(item);
    } else {
      solo.push(item);
    }
  }
  return { groups, solo };
}

export default async function AdminAccommodationPage({
  searchParams,
}: {
  searchParams: Promise<{ gender?: string; page?: string }>;
}) {
  const user = await getUser();
  if (!user || !["DEV_ADMIN", "MANAGEMENT_ADMIN"].includes(user.role)) redirect("/dashboard");

  const counts = await getAccommodationCounts().catch(() => ({ total: 0, male: 0, female: 0, other: 0 }));

  const { gender: rawGender, page: rawPage } = await searchParams;
  const gender: Gender = GENDERS.includes(rawGender as Gender) ? (rawGender as Gender) : "Male";
  const page = Math.max(1, parseInt(rawPage ?? "1"));
  const limit = 25;

  const { rows, total } = await getAccommodationsByGender(gender, page, limit).catch(() => ({ rows: [], total: 0 }));
  const totalPages = Math.ceil(total / limit);
  const { groups, solo } = buildGroups(rows);

  const TAB_COUNT: Record<Gender, number> = { Male: counts.male, Female: counts.female, Other: counts.other };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-7">

        {/* Header */}
        <div className="flex items-center justify-between animate-slide-up" style={{ animationDelay: "0s" }}>
          <div>
            <Link href="/admin" className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-teal-600 transition-colors mb-1">
              <ChevronLeft className="h-3.5 w-3.5" /> Admin
            </Link>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Accommodation</h1>
            <p className="text-xs text-slate-400 mt-0.5">{counts.total} request{counts.total !== 1 ? "s" : ""}</p>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-teal-100 flex items-center justify-center">
            <Hotel className="h-5 w-5 text-teal-600" />
          </div>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-3 gap-3 animate-slide-up" style={{ animationDelay: "0.05s" }}>
          <div className="bg-teal-600 rounded-2xl px-4 py-4">
            <p className="text-xs font-medium text-teal-200 mb-1">Total</p>
            <p className="text-2xl font-bold text-white tabular-nums">{counts.total}</p>
            <p className="text-xs text-teal-300 mt-1">requests</p>
          </div>
          <div className={`rounded-2xl px-4 py-4 ${counts.male > 0 ? "bg-sky-50 border border-sky-100" : "bg-slate-50 border border-slate-100"}`}>
            <p className={`text-xs font-medium mb-1 ${counts.male > 0 ? "text-sky-500" : "text-slate-400"}`}>Male</p>
            <p className={`text-2xl font-bold tabular-nums ${counts.male > 0 ? "text-sky-900" : "text-slate-600"}`}>{counts.male}</p>
            <p className={`text-xs mt-1 ${counts.male > 0 ? "text-sky-400" : "text-slate-400"}`}>participants</p>
          </div>
          <div className={`rounded-2xl px-4 py-4 ${counts.female > 0 ? "bg-pink-50 border border-pink-100" : "bg-slate-50 border border-slate-100"}`}>
            <p className={`text-xs font-medium mb-1 ${counts.female > 0 ? "text-pink-500" : "text-slate-400"}`}>Female</p>
            <p className={`text-2xl font-bold tabular-nums ${counts.female > 0 ? "text-pink-900" : "text-slate-600"}`}>{counts.female}</p>
            <p className={`text-xs mt-1 ${counts.female > 0 ? "text-pink-400" : "text-slate-400"}`}>participants</p>
          </div>
        </div>

        {counts.total === 0 ? (
          <div className="rounded-2xl border-2 border-dashed border-slate-100 py-12 text-center animate-slide-up" style={{ animationDelay: "0.1s" }}>
            <Hotel className="h-8 w-8 mx-auto mb-3 text-slate-200" />
            <p className="text-sm font-medium text-slate-500">No accommodation requests yet</p>
          </div>
        ) : (
          <div className="animate-slide-up space-y-4" style={{ animationDelay: "0.1s" }}>

            {/* Gender tabs */}
            <div className="flex items-center gap-2">
              {GENDERS.map((g) => (
                <Link
                  key={g}
                  href={`/admin/accommodation?gender=${g}`}
                  className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-colors ${
                    gender === g ? GENDER_TAB_ACTIVE[g] : "bg-slate-50 text-slate-500 hover:bg-slate-100"
                  }`}
                >
                  {g} · {TAB_COUNT[g]}
                </Link>
              ))}
            </div>

            {rows.length === 0 ? (
              <div className="rounded-2xl border-2 border-dashed border-slate-100 py-12 text-center">
                <p className="text-sm text-slate-400">No {gender.toLowerCase()} requests</p>
              </div>
            ) : (
              <div className="space-y-4">
                {[...groups.entries()].map(([gname, members]) => (
                  <GroupBlock key={gname} groupName={gname} members={members} />
                ))}
                {solo.length > 0 && (
                  <div className="space-y-2">
                    {groups.size > 0 && (
                      <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wide">Individual</p>
                    )}
                    {solo.map((item) => (
                      <AccomRow key={String(item.user._id)} item={item} />
                    ))}
                  </div>
                )}
              </div>
            )}

            {totalPages > 1 && (
              <div className="flex items-center justify-between pt-2">
                <p className="text-xs text-slate-400">
                  {(page - 1) * limit + 1}–{Math.min(page * limit, total)} of {total}
                </p>
                <div className="flex items-center gap-2">
                  {page > 1 ? (
                    <Button variant="outline" size="sm" className="h-8 text-xs" asChild>
                      <Link href={`/admin/accommodation?gender=${gender}&page=${page - 1}`}>← Prev</Link>
                    </Button>
                  ) : (
                    <Button variant="outline" size="sm" className="h-8 text-xs" disabled>← Prev</Button>
                  )}
                  <span className="text-xs text-slate-400">{page} / {totalPages}</span>
                  {page < totalPages ? (
                    <Button variant="outline" size="sm" className="h-8 text-xs" asChild>
                      <Link href={`/admin/accommodation?gender=${gender}&page=${page + 1}`}>Next <ChevronRight className="h-3 w-3 ml-0.5" /></Link>
                    </Button>
                  ) : (
                    <Button variant="outline" size="sm" className="h-8 text-xs" disabled>Next <ChevronRight className="h-3 w-3 ml-0.5" /></Button>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
