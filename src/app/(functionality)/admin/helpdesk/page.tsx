export const dynamic = "force-dynamic";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ChevronLeft, LifeBuoy } from "lucide-react";
import { TicketTitle } from "@/components/indie/gold-poster";
import { getUser } from "@/features/users/user-actions";
import { getHelpQueriesAction } from "@/features/helpdesk/help-actions";
import HelpInbox from "./HelpInbox";

export default async function AdminHelpDeskPage({ searchParams }: { searchParams: Promise<{ tab?: string }> }) {
  const user = await getUser();
  if (!user || !["DEV_ADMIN", "MANAGEMENT_ADMIN"].includes(user.role)) redirect("/dashboard");
  const tab = (await searchParams).tab === "resolved" ? "RESOLVED" : "OPEN";
  const [rows, open] = await Promise.all([getHelpQueriesAction(tab), tab === "OPEN" ? null : getHelpQueriesAction("OPEN")]);
  const openCount = (open ?? rows).length;

  return (
    <div className="mx-auto max-w-4xl space-y-6 px-4 py-8">
      <div className="flex items-center justify-between">
        <div>
          <Link href="/admin" className="mb-1 inline-flex items-center gap-1 text-xs text-slate-500 hover:text-[#0f6b63]"><ChevronLeft className="h-3.5 w-3.5" /> Admin</Link>
          <TicketTitle className="mb-2 text-3xl leading-[1.1] sm:text-5xl">Help desk</TicketTitle>
          <p className="text-xs text-slate-500">Questions from participants. Replying marks a question answered.</p>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-full border-[3px] border-[#1c1812] bg-[#f5c928] shadow-[0_4px_0_#1c1812]"><LifeBuoy className="h-5 w-5 text-[#0f6b63]" /></div>
      </div>
      <div className="flex gap-2">
        {([["OPEN", `Open (${openCount})`, "/admin/helpdesk"], ["RESOLVED", "Answered", "/admin/helpdesk?tab=resolved"]] as const).map(([k, label, href]) => (
          <Link key={k} href={href} className={`rounded-full border-[3px] border-[#1c1812] px-4 py-1.5 text-sm font-extrabold uppercase ${tab === k ? "bg-[#1c1812] text-[#f3e8cf]" : "bg-white text-[#1c1812]"}`}>{label}</Link>
        ))}
      </div>
      <HelpInbox rows={rows} />
    </div>
  );
}
