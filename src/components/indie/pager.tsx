import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

const PILL = "inline-flex items-center gap-1 rounded-full border-2 border-[#1c1812] bg-white px-3 py-1 text-sm font-bold text-[#1c1812] transition-transform duration-150 active:scale-95";

/** "1–25 of 80   ‹ Prev  1 / 4  Next ›" footer. `href(page)` builds the link for a page. */
export function Pager({ page, pageSize, total, href }: { page: number; pageSize: number; total: number; href: (p: number) => string }) {
  const pages = Math.ceil(total / pageSize);
  if (pages <= 1) return null;
  return (
    <div className="flex flex-wrap items-center justify-between gap-2 border-t-2 border-dashed border-black/15 px-5 py-3 text-sm">
      <span className="text-black/60">{(page - 1) * pageSize + 1}–{Math.min(page * pageSize, total)} of {total}</span>
      <div className="flex items-center gap-2">
        {page > 1 ? <Link href={href(page - 1)} className={PILL}><ChevronLeft className="h-4 w-4" /> Prev</Link> : <span className={`${PILL} opacity-40`}><ChevronLeft className="h-4 w-4" /> Prev</span>}
        <span className="tabular-nums text-black/60">{page} / {pages}</span>
        {page < pages ? <Link href={href(page + 1)} className={PILL}>Next <ChevronRight className="h-4 w-4" /></Link> : <span className={`${PILL} opacity-40`}>Next <ChevronRight className="h-4 w-4" /></span>}
      </div>
    </div>
  );
}
