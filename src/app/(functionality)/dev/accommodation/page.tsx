export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";
import { getUser } from "@/features/users/user-actions";
import { connectToDatabase } from "@/lib/mongodb";
import { Accommodation } from "@/features/accommodation/accommodation.model";
import { Button } from "@/components/ui/button";
import { Hotel, Building2, Calendar, Phone, Users, ChevronRight } from "lucide-react";
import Link from "next/link";
import { TicketTitle } from "@/components/indie/gold-poster";

type AccomItem = {
  _id: string; gender?: string; universityName?: string; groupName?: string;
  arrivalTime?: string; departureTime?: string; additionalDetails?: string;
  userId?: { fullName?: string; email?: string; mobileNumber?: string } | null;
};

async function getData(page: number, limit: number) {
  await connectToDatabase();
  const [items, total, maleCount, femaleCount, otherCount] = await Promise.all([
    Accommodation.find()
      .populate("userId", "fullName email mobileNumber")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    Accommodation.countDocuments(),
    Accommodation.countDocuments({ gender: "Male" }),
    Accommodation.countDocuments({ gender: "Female" }),
    Accommodation.countDocuments({ gender: "Other" }),
  ]);
  return {
    items: JSON.parse(JSON.stringify(items)) as AccomItem[],
    total,
    maleCount,
    femaleCount,
    otherCount,
  };
}

const GENDER_CHIP: Record<string, string> = {
  Male:   "bg-sky-50   text-sky-700   border-sky-200",
  Female: "bg-pink-50  text-pink-700  border-pink-200",
  Other:  "bg-slate-50 text-slate-600 border-slate-200",
};

const GENDER_BORDER: Record<string, string> = {
  Male:   "border-l-sky-400",
  Female: "border-l-pink-400",
  Other:  "border-l-slate-300",
};

function AccomRow({ item }: { item: AccomItem }) {
  const border = GENDER_BORDER[item.gender ?? ""] ?? "border-l-amber-300";
  const chip   = GENDER_CHIP[item.gender   ?? ""] ?? "bg-slate-50 text-slate-600 border-slate-200";
  return (
    <div className={`bg-white border-[3px] border-[#1c1812] shadow-[0_4px_0_#1c1812] border-l-[6px] ${border} rounded-2xl px-4 py-3.5 flex items-start gap-3`}>
      <div className="w-7 h-7 rounded-full bg-[#fde9a8] flex items-center justify-center text-xs font-bold text-[#0f6b63] shrink-0">
        {(item.userId?.fullName ?? "?")[0]?.toUpperCase()}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="text-sm font-semibold text-slate-900">{item.userId?.fullName ?? "—"}</p>
          {item.gender && (
            <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full border shrink-0 ${chip}`}>
              {item.gender}
            </span>
          )}
        </div>
        <p className="text-xs text-slate-500">{item.userId?.email ?? "—"}</p>
        <div className="flex items-center gap-3 mt-1 flex-wrap">
          {item.userId?.mobileNumber && (
            <span className="flex items-center gap-1 text-xs text-slate-500">
              <Phone className="h-3 w-3 shrink-0" /> {item.userId.mobileNumber}
            </span>
          )}
          {item.universityName && (
            <span className="flex items-center gap-1 text-xs text-slate-500">
              <Building2 className="h-3 w-3 shrink-0" /> {item.universityName}
            </span>
          )}
          {item.arrivalTime && (
            <span className="flex items-center gap-1 text-xs text-slate-500">
              <Calendar className="h-3 w-3 shrink-0" />
              {new Date(item.arrivalTime).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
              {" → "}
              {item.departureTime ? new Date(item.departureTime).toLocaleDateString("en-IN", { day: "numeric", month: "short" }) : "—"}
            </span>
          )}
        </div>
        {item.additionalDetails && (
          <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{item.additionalDetails}</p>
        )}
      </div>
    </div>
  );
}

function GroupBlock({ groupName, members }: { groupName: string; members: AccomItem[] }) {
  return (
    <div className="rounded-2xl border border-[#1c1812]/30 bg-[#f6efdf]/40 overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-[#1c1812]/30 bg-[#f6efdf]">
        <Users className="h-3.5 w-3.5 text-[#0f6b63] shrink-0" />
        <p className="text-xs font-semibold text-[#0f6b63]">{groupName}</p>
        <span className="ml-auto text-[10px] text-[#0f6b63]/70 font-medium">
          {members.length} member{members.length !== 1 ? "s" : ""}
        </span>
      </div>
      <div className="p-3 space-y-2">
        {members.map((item) => <AccomRow key={item._id} item={item} />)}
      </div>
    </div>
  );
}

export default async function DevAccommodationPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const user = await getUser();
  if (!user || user.role !== "DEV_ADMIN") redirect("/dashboard");

  const { page: rawPage } = await searchParams;
  const page = Math.max(1, parseInt(rawPage ?? "1"));
  const limit = 25;

  const { items, total, maleCount, femaleCount, otherCount } = await getData(page, limit)
    .catch(() => ({ items: [], total: 0, maleCount: 0, femaleCount: 0, otherCount: 0 }));
  const totalPages = Math.ceil(total / limit);

  // Groups are formed from the current page only — a group split across
  // pages will appear partially on each page it has members on.
  const groups = new Map<string, AccomItem[]>();
  const solo: AccomItem[] = [];
  for (const item of items) {
    const g = item.groupName?.trim();
    if (g) {
      if (!groups.has(g)) groups.set(g, []);
      groups.get(g)!.push(item);
    } else {
      solo.push(item);
    }
  }

  return (
    <div className="">
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-7">

        {/* Header */}
        <div className="flex items-center flex-wrap justify-between gap-x-4 gap-y-3">
          <div>
            <TicketTitle className="mb-2 text-3xl leading-[1.1] break-words sm:text-5xl">Accommodation</TicketTitle>
            <p className="text-xs text-slate-500 mt-0.5">
              {total} request{total !== 1 ? "s" : ""}
            </p>
          </div>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-4 gap-3">
          <div className="bg-[#1c1812] border-[3px] border-[#1c1812] shadow-[0_4px_0_#1c1812] rounded-2xl px-4 py-4">
            <p className="text-xs font-semibold text-white mb-1">Total</p>
            <p className="text-2xl font-bold text-white tabular-nums">{total}</p>
            <p className="text-xs font-medium text-white mt-1">requests</p>
          </div>
          <div className={`rounded-2xl px-4 py-4 ${maleCount > 0 ? "bg-white border-[3px] border-[#1c1812] shadow-[0_4px_0_#1c1812]" : "bg-slate-50 border-[3px] border-[#1c1812] shadow-[0_4px_0_#1c1812]"}`}>
            <p className={`text-xs font-medium mb-1 ${maleCount > 0 ? "text-sky-500" : "text-slate-500"}`}>Male</p>
            <p className={`text-2xl font-bold tabular-nums ${maleCount > 0 ? "text-sky-900" : "text-slate-600"}`}>{maleCount}</p>
            <p className={`text-xs mt-1 ${maleCount > 0 ? "text-sky-400" : "text-slate-500"}`}>participants</p>
          </div>
          <div className={`rounded-2xl px-4 py-4 ${femaleCount > 0 ? "bg-pink-50 border-[3px] border-[#1c1812] shadow-[0_4px_0_#1c1812]" : "bg-white border-[3px] border-[#1c1812] shadow-[0_4px_0_#1c1812]"}`}>
            <p className={`text-xs font-medium mb-1 ${femaleCount > 0 ? "text-pink-500" : "text-slate-500"}`}>Female</p>
            <p className={`text-2xl font-bold tabular-nums ${femaleCount > 0 ? "text-pink-900" : "text-slate-600"}`}>{femaleCount}</p>
            <p className={`text-xs mt-1 ${femaleCount > 0 ? "text-pink-400" : "text-slate-500"}`}>participants</p>
          </div>
          <div className={`rounded-2xl px-4 py-4 ${otherCount > 0 ? "bg-slate-100 border-[3px] border-[#1c1812] shadow-[0_4px_0_#1c1812]" : "bg-white border-[3px] border-[#1c1812] shadow-[0_4px_0_#1c1812]"}`}>
            <p className="text-xs font-medium text-slate-500 mb-1">Other</p>
            <p className="text-2xl font-bold text-slate-600 tabular-nums">{otherCount}</p>
            <p className="text-xs text-slate-500 mt-1">participants</p>
          </div>
        </div>

        {/* Items */}
        {items.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed border-slate-100 py-12 text-center">
            <Hotel className="h-8 w-8 mx-auto mb-3 text-slate-200" />
            <p className="text-sm font-medium text-slate-500">No accommodation requests yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Groups first */}
            {groups.size > 0 && (
              <div>
                <p className="text-xs font-medium text-slate-500 mb-3">Groups</p>
                <div className="space-y-3">
                  {[...groups.entries()].map(([gname, members]) => (
                    <GroupBlock key={gname} groupName={gname} members={members} />
                  ))}
                </div>
              </div>
            )}

            {/* Solo / no group */}
            {solo.length > 0 && (
              <div>
                {groups.size > 0 && (
                  <p className="text-xs font-medium text-slate-500 mb-3">Individual</p>
                )}
                <div className="space-y-2">
                  {solo.map((item) => <AccomRow key={item._id} item={item} />)}
                </div>
              </div>
            )}
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-between pt-2">
            <p className="text-xs text-slate-500">
              {(page - 1) * limit + 1}–{Math.min(page * limit, total)} of {total}
            </p>
            <div className="flex items-center gap-2">
              {page > 1 ? (
                <Button variant="outline" size="sm" className="h-8 text-xs" asChild>
                  <Link href={`/dev/accommodation?page=${page - 1}`}>← Prev</Link>
                </Button>
              ) : (
                <Button variant="outline" size="sm" className="h-8 text-xs" disabled>← Prev</Button>
              )}
              <span className="text-xs text-slate-500">{page} / {totalPages}</span>
              {page < totalPages ? (
                <Button variant="outline" size="sm" className="h-8 text-xs" asChild>
                  <Link href={`/dev/accommodation?page=${page + 1}`}>Next <ChevronRight className="h-3 w-3 ml-0.5" /></Link>
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
