"use client";

// Shared frame for every logged-in area (participant, management, dev, event manager):
// an ink rail with gold-sunburst accents that expands to show labels (state remembered per browser),
// a light breadcrumb strip, and a bottom tab bar + "More" sheet on phones.
import { useEffect, useState, type ComponentType } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowLeft, BarChart3, BedDouble, CalendarDays, ChevronRight, ChevronsLeft, ChevronsRight, ClipboardCheck, CreditCard,
  Database, FileText, Hotel, LayoutDashboard, LifeBuoy, MoreHorizontal, QrCode, ScanLine, Server, ShieldCheck, UserCog, Users, X,
} from "lucide-react";
import { body, display } from "@/components/indie";
import { mono, sans } from "@/components/home/fonts";
import { FestLogo, INK } from "@/components/indie/gold-poster";

export type Area = "participant" | "admin" | "dev" | "event-manager";
export type RailUser = { name: string; role: string; participantId?: string };

type Item = { href: string; label: string; short?: string; icon: ComponentType<{ className?: string }>; exact?: boolean };

const CREAM = "#f3e8cf";
const RAYS = { background: "radial-gradient(circle at 50% 50%, rgba(255,236,170,.9), transparent 60%), repeating-conic-gradient(from 0deg at 50% 50%, #f5c928 0deg 12deg, #e9a11a 12deg 24deg)" };
const STORE_KEY = "trx27-rail-open";

const AREA_SHORT: Record<Area, string> = { participant: "My dashboard", admin: "Mgmt", dev: "Dev", "event-manager": "Events" };
const AREA_NAME: Record<Area, string> = { participant: "My dashboard", admin: "Management", dev: "Developer", "event-manager": "Event manager" };
const AREA_HOME: Record<Area, string> = { participant: "/dashboard", admin: "/admin", dev: "/dev", "event-manager": "/event-manager" };

function itemsFor(area: Area, user: RailUser, pathname: string): Item[] {
  switch (area) {
    case "participant": {
      const items: Item[] = [
        { href: "/dashboard", label: "Dashboard", short: "Home", icon: LayoutDashboard, exact: true },
        { href: "/events-selection", label: "Browse events", short: "Events", icon: CalendarDays },
        { href: "/team-details", label: "My teams", short: "Teams", icon: Users },
        { href: "/dashboard/qr", label: "My QR", short: "QR", icon: QrCode },
      ];
      if (user.role === "EXTERNAL_USER") {
        items.push({ href: "/dashboard/payment", label: "Payments", icon: CreditCard }, { href: "/dashboard/accommodation", label: "Accommodation", icon: Hotel });
      }
      items.push({ href: "/dashboard/help", label: "Help desk", short: "Help", icon: LifeBuoy });
      return items;
    }
    case "admin":
      return [
        { href: "/admin", label: "Overview", icon: LayoutDashboard, exact: true },
        { href: "/admin/events", label: "Events", icon: CalendarDays },
        { href: "/admin/participants", label: "Participants", icon: Users },
        { href: "/admin/teams", label: "Teams", icon: Users },
        { href: "/admin/accommodation", label: "Accommodation", icon: BedDouble },
        { href: "/admin/checkin", label: "Check-in", icon: ScanLine },
        { href: "/admin/event-managers", label: "Event managers", short: "Managers", icon: UserCog },
        { href: "/admin/team", label: "Fest team", icon: ShieldCheck },
        { href: "/admin/reports", label: "Reports", icon: FileText },
        { href: "/admin/helpdesk", label: "Help desk", short: "Help", icon: LifeBuoy },
      ];
    case "dev":
      return [
        { href: "/dev", label: "Overview", icon: LayoutDashboard, exact: true },
        { href: "/dev/users", label: "Users", icon: Users },
        { href: "/dev/management", label: "Management", short: "Mgmt", icon: UserCog },
        { href: "/dev/events", label: "Events", icon: CalendarDays },
        { href: "/dev/payments", label: "Payments", icon: CreditCard },
        { href: "/dev/accommodation", label: "Accommodation", icon: BedDouble },
        { href: "/dev/logs", label: "Logs", icon: FileText },
        { href: "/dev/system", label: "System", icon: Server },
        { href: "/dev/seed", label: "Seed data", short: "Seed", icon: Database },
      ];
    case "event-manager": {
      const items: Item[] = [{ href: "/event-manager", label: "My events", short: "Events", icon: LayoutDashboard, exact: true }];
      // inside an event: its own pages
      const id = pathname.split("/")[2];
      if (id) {
        const base = `/event-manager/${id}`;
        items.push(
          { href: base, label: "Event overview", short: "Event", icon: BarChart3, exact: true },
          { href: `${base}/checkin`, label: "Check-in", icon: ClipboardCheck },
          { href: `${base}/participants`, label: "Participants", icon: Users },
          { href: `${base}/teams`, label: "Teams", icon: Users },
        );
      }
      return items;
    }
  }
}

/** Other areas this role may open (switcher at the bottom of the rail). */
function otherAreas(area: Area, role: string): Area[] {
  const allowed: Area[] =
    role === "DEV_ADMIN" ? ["dev", "admin", "event-manager"] :
    []; // everyone else stays in their own area (middleware enforces it)
  return allowed.filter((a) => a !== area);
}

const isActive = (item: Item, pathname: string) => (item.exact ? pathname === item.href : pathname === item.href || pathname.startsWith(item.href + "/"));

// "Home › Admin › Events › Details" from the URL, with a back link to the parent.
const SEGMENT_LABEL: Record<string, string> = { help: "Help desk", helpdesk: "Help desk", team: "Fest team", checkin: "Check-in", qr: "QR", "event-manager": "Event manager", dev: "Developer", admin: "Management", "events-selection": "Browse events", "team-details": "My teams" };
const looksLikeId = (s: string) => /^[0-9a-f]{24}$/i.test(s) || /^\d{3,}$/.test(s);
function crumbsFor(pathname: string) {
  const segs = pathname.split("/").filter(Boolean);
  return [{ label: "Home", href: "/" }, ...segs.map((seg, i) => ({
    label: looksLikeId(seg) ? (segs[i - 1] === "events" || segs[i - 1] === "event-manager" ? "Event" : "Details") : SEGMENT_LABEL[seg] ?? seg.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
    href: "/" + segs.slice(0, i + 1).join("/"),
  }))];
}

export default function RailFrame({ area, user, children }: { area: Area; user: RailUser; children: React.ReactNode }) {
  const pathname = usePathname();
  const items = itemsFor(area, user, pathname);
  const others = otherAreas(area, user.role);
  const [open, setOpen] = useState(true);
  const [more, setMore] = useState(false);

  // remember expanded/collapsed per browser (first visit: expanded)
  useEffect(() => {
    try {
      const v = localStorage.getItem(STORE_KEY);
      if (v !== null) setOpen(v === "1");
    } catch {}
  }, []);
  const toggle = () => setOpen((v) => { try { localStorage.setItem(STORE_KEY, v ? "0" : "1"); } catch {} return !v; });
  useEffect(() => setMore(false), [pathname]);

  const crumbs = crumbsFor(pathname);
  const parent = crumbs.length > 2 ? crumbs[crumbs.length - 2] : null;
  const initial = (user.name || "?").trim()[0]?.toUpperCase() ?? "?";
  const Toggle = open ? ChevronsLeft : ChevronsRight;
  const tabs = items.slice(0, 4);
  const overflow = [...items.slice(4)];

  return (
    <div className={`flex min-h-[calc(100dvh-4rem)] bg-[#f6efdf] ${sans.className}`}>
      {/* desktop / tablet rail */}
      <aside
        className="sticky top-16 hidden h-[calc(100dvh-4rem)] shrink-0 flex-col overflow-hidden border-r-[3px] py-3 transition-[width] duration-300 ease-out md:flex"
        style={{ width: open ? "15rem" : "5rem", background: INK, borderColor: INK }}
        aria-label={`${AREA_NAME[area]} menu`}
      >
        {/* brand + area name + collapse, kept compact so every menu item fits on a laptop screen */}
        <Link href={AREA_HOME[area]} className="flex shrink-0 items-center px-4" aria-label={AREA_NAME[area]}>
          {open ? <FestLogo className="!mx-0 w-28" /> : <FestLogo className="!mx-0 -ml-1.5 w-[3.75rem] max-w-none" />}
        </Link>
        <div className={`mt-2 flex shrink-0 items-center gap-2 px-4 ${open ? "justify-between" : "justify-center"}`}>
          {open && <p className={`truncate text-[10px] tracking-[0.3em] text-[#f5c928] ${mono.className}`}>{AREA_NAME[area].toUpperCase()}</p>}
          <button
            type="button"
            onClick={toggle}
            aria-label={open ? "Collapse menu" : "Expand menu"}
            aria-expanded={open}
            title={open ? "Collapse menu" : "Expand menu"}
            className="grid h-8 w-8 shrink-0 place-items-center rounded-lg border-2 transition hover:brightness-125 active:scale-95"
            style={{ borderColor: "rgba(243,232,207,.25)", color: CREAM }}
          >
            <Toggle className="h-4 w-4" />
          </button>
        </div>

        {/* only the menu scrolls if the screen is very short; brand and footer stay put */}
        <nav className="mt-3 flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto overflow-x-hidden px-4">
          {items.map((it) => {
            const active = isActive(it, pathname);
            const Icon = it.icon;
            return (
              <Link key={it.href} href={it.href} aria-current={active ? "page" : undefined} className="group relative shrink-0">
                <span
                  className="flex h-10 items-center gap-3 rounded-xl border-[3px] px-[9px] text-sm font-extrabold transition hover:bg-white/5 [@media(max-height:820px)]:h-9"
                  style={active ? { ...RAYS, borderColor: CREAM, color: INK } : { borderColor: "transparent", color: "rgba(243,232,207,.72)" }}
                >
                  <Icon className="h-5 w-5 shrink-0" />
                  <span className={`whitespace-nowrap transition-opacity duration-200 ${open ? "opacity-100" : "opacity-0"}`}>{it.label}</span>
                </span>
                {!open && (
                  <span className="pointer-events-none absolute left-[3.6rem] top-1/2 z-50 -translate-y-1/2 whitespace-nowrap rounded-lg border-2 px-2.5 py-1 text-xs font-extrabold opacity-0 transition group-hover:opacity-100" style={{ background: CREAM, color: INK, borderColor: INK }}>
                    {it.label}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="shrink-0 border-t border-white/10 px-4 pt-3">
          {others.length > 0 && (
            <div className={`mb-3 flex gap-1.5 ${open ? "items-center" : "flex-col items-center"}`}>
              {open && <span className="mr-0.5 text-[11px] font-bold text-[#f3e8cf]/60">Switch</span>}
              {others.map((a) => (
                <Link
                  key={a}
                  href={AREA_HOME[a]}
                  title={`Switch to ${AREA_NAME[a]}`}
                  className={`inline-flex h-8 items-center gap-1 rounded-full border-2 text-xs font-extrabold transition hover:bg-white/10 active:scale-95 ${open ? "px-2.5" : "w-8 justify-center"}`}
                  style={{ borderColor: "rgba(243,232,207,.25)", color: CREAM }}
                >
                  <ChevronRight className="h-3.5 w-3.5 shrink-0 text-[#f5c928]" />
                  {open ? AREA_SHORT[a] : <span className="sr-only">{AREA_NAME[a]}</span>}
                </Link>
              ))}
            </div>
          )}
          {open ? (
            <div className="flex items-center gap-2.5 rounded-xl border-[3px] px-2.5 py-1.5" style={{ ...RAYS, borderColor: CREAM }}>
              <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-full border-2 bg-[#f3e8cf] text-sm ${display.className}`} style={{ borderColor: INK, color: INK }}>{initial}</span>
              <span className="min-w-0">
                <span className={`block text-[9px] tracking-[0.25em] ${mono.className}`} style={{ color: INK }}>{user.participantId ? "ADMIT ONE" : "SIGNED IN"}</span>
                <span className={`block truncate text-sm ${display.className}`} style={{ color: INK }}>{user.participantId ?? user.name}</span>
              </span>
            </div>
          ) : (
            <span className={`mx-auto grid h-11 w-11 place-items-center rounded-full border-[3px] text-lg ${display.className}`} style={{ background: "#f5c928", borderColor: CREAM, color: INK }} title={user.participantId ?? user.name}>{initial}</span>
          )}
        </div>
      </aside>

      {/* content */}
      <div className="flex min-w-0 flex-1 flex-col">
        <div className={`flex flex-wrap items-center gap-x-4 gap-y-2 border-b-2 bg-[#fbf6ea] px-4 py-2.5 sm:px-6 ${body.className}`} style={{ borderColor: `${INK}22` }}>
          {parent && (
            <Link href={parent.href} className="inline-flex items-center gap-1.5 rounded-full border-2 bg-white px-3 py-1.5 text-sm font-bold uppercase tracking-wider transition active:scale-95 sm:py-0.5" style={{ borderColor: INK, color: INK, boxShadow: `0 2px 0 ${INK}` }}>
              <ArrowLeft className="h-4 w-4" /> {parent.label}
            </Link>
          )}
          <nav aria-label="Breadcrumb" className={`${parent ? "hidden sm:flex" : "flex"} min-w-0 flex-wrap items-center gap-1 text-sm font-bold uppercase tracking-widest`}>
            {crumbs.map((c, i) => {
              const last = i === crumbs.length - 1;
              return (
                <span key={c.href} className="flex items-center gap-1">
                  {last ? <span aria-current="page" style={{ color: INK }}>{c.label}</span> : <Link href={c.href} className="tap-target text-[#0e5b57] underline-offset-4 hover:underline">{c.label}</Link>}
                  {!last && <ChevronRight className="h-4 w-4 text-black/35" />}
                </span>
              );
            })}
          </nav>
        </div>
        <div className="flex-1 pb-20 md:pb-0">{children}</div>
      </div>

      {/* phone: bottom tabs + More sheet */}
      <nav className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-5 gap-1 border-t-[3px] px-2 pb-[max(.375rem,env(safe-area-inset-bottom))] pt-1.5 md:hidden" style={{ background: INK, borderColor: INK }} aria-label={`${AREA_NAME[area]} tabs`}>
        {tabs.map((it) => {
          const active = isActive(it, pathname);
          const Icon = it.icon;
          return (
            <Link key={it.href} href={it.href} aria-current={active ? "page" : undefined} className="flex flex-col items-center gap-0.5 rounded-xl border-2 py-1.5 text-[10px] font-extrabold" style={active ? { ...RAYS, borderColor: CREAM, color: INK } : { borderColor: "transparent", color: "rgba(243,232,207,.72)" }}>
              <Icon className="h-5 w-5" /> <span className="max-w-full truncate px-0.5">{it.short ?? it.label}</span>
            </Link>
          );
        })}
        <button type="button" onClick={() => setMore((v) => !v)} aria-expanded={more} className="flex flex-col items-center gap-0.5 rounded-xl border-2 py-1.5 text-[10px] font-extrabold" style={more || overflow.some((o) => isActive(o, pathname)) ? { ...RAYS, borderColor: CREAM, color: INK } : { borderColor: "transparent", color: "rgba(243,232,207,.72)" }}>
          <MoreHorizontal className="h-5 w-5" /> More
        </button>
      </nav>
      {more && (
        <div className="fixed inset-0 z-30 bg-black/40 md:hidden" onClick={() => setMore(false)}>
          <div className="absolute inset-x-2 bottom-20 rounded-2xl border-[3px] p-3" style={{ background: CREAM, borderColor: INK, boxShadow: `0 5px 0 ${INK}` }} onClick={(e) => e.stopPropagation()}>
            <div className="mb-2 flex items-center justify-between px-1">
              <p className={`text-[10px] tracking-[0.3em] ${mono.className}`} style={{ color: INK }}>{AREA_NAME[area].toUpperCase()}</p>
              <button type="button" onClick={() => setMore(false)} aria-label="Close menu"><X className="h-5 w-5" style={{ color: INK }} /></button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {[...overflow, ...others.map((a) => ({ href: AREA_HOME[a], label: AREA_NAME[a], icon: ChevronRight } as Item))].map((it) => {
                const Icon = it.icon;
                const active = isActive(it, pathname);
                return (
                  <Link key={it.href} href={it.href} className="flex items-center gap-2 rounded-xl border-2 px-3 py-2.5 text-sm font-extrabold" style={active ? { ...RAYS, borderColor: INK, color: INK } : { background: "#fff", borderColor: INK, color: INK }}>
                    <Icon className="h-4 w-4 shrink-0" /> {it.label}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
