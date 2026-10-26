"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Ticket, X } from "lucide-react";
import { UserDropdown } from "@/components/layout/user-dropdown";
import useFetch from "@/hooks/use-fetch";
import { getUser } from "@/features/users/user-actions";
import { cn } from "@/lib/utils";
import { body, serif } from "@/components/indie";
import { getEvent } from "@/features/events/data/all-events";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Events", href: "/events" },
  { label: "Schedule", href: "/schedule" },
  { label: "Junoon '27", href: "/junoon" },
  { label: "Creatorverse", href: "/creatorverse" },
  { label: "Gallery", href: "/gallery" },
  { label: "Sponsors", href: "/sponsors" },
  { label: "Contact", href: "/contact" },
];

// Navbar colours per page, matching each page's top band. Event pages use their own event theme.
type NavTheme = { bg: string; ink: string; accent: string; accentInk: string };
const DEFAULT_THEME: NavTheme = { bg: "#3a0808", ink: "#f5edd8", accent: "#f5c928", accentInk: "#000000" };
const CRIMSON: NavTheme = { bg: "#a1001a", ink: "#f5edd8", accent: "#f5c928", accentInk: "#000000" };
const PAGE_THEMES: [string, NavTheme][] = [
  ["/schedule", { bg: "#f65f00", ink: "#000000", accent: "#000000", accentInk: "#f5edd8" }],
  ["/junoon", { bg: "#0f0029", ink: "#f5edd8", accent: "#f5c928", accentInk: "#000000" }],
  ["/creatorverse", { bg: "#ff2d8a", ink: "#000000", accent: "#000000", accentInk: "#ffffff" }],
  ["/contact", { bg: "#0e5b57", ink: "#f5edd8", accent: "#ffd34d", accentInk: "#000000" }],
  ["/about", CRIMSON], ["/gallery", CRIMSON], ["/sponsors", CRIMSON],
];

function themeFor(pathname: string): NavTheme {
  const event = pathname.startsWith("/events/") ? getEvent(pathname.split("/")[2]) : undefined;
  if (event) return { bg: event.theme.bg, ink: event.theme.ink, accent: event.theme.accent, accentInk: event.theme.accentInk };
  if (pathname === "/events") return CRIMSON;
  return PAGE_THEMES.find(([prefix]) => pathname.startsWith(prefix))?.[1] ?? DEFAULT_THEME;
}

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const { data: user, fn: fetchUser } = useFetch(getUser);

  useEffect(() => {
    fetchUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const linkCls = (href: string) =>
    isActive(pathname, href)
      ? "bg-[var(--nav-accent)] text-[var(--nav-accent-ink)] shadow-[2px_2px_0_0_rgba(0,0,0,0.45)]"
      : "text-[var(--nav-ink)] hover:bg-[color-mix(in_srgb,var(--nav-ink)_14%,transparent)]";

  const theme = themeFor(pathname);
  const navVars = {
    "--nav-bg": theme.bg, "--nav-ink": theme.ink, "--nav-accent": theme.accent, "--nav-accent-ink": theme.accentInk,
  } as React.CSSProperties;

  const user_ = user && { fullName: user.fullName, email: user.email, role: user.role };

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 border-b-4 border-[var(--nav-accent)] text-[var(--nav-ink)] backdrop-blur-md transition-[box-shadow,background-color,border-color,color] duration-500",
        body.className,
        scrolled && "shadow-[0_6px_0_0_rgba(0,0,0,0.35)]"
      )}
      style={{ ...navVars, background: `color-mix(in srgb, var(--nav-bg) ${scrolled ? 82 : 100}%, transparent)` }}
    >
      <nav className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Station board logo */}
        <Link href="/" className="group flex items-center gap-2.5 shrink-0">
          <svg viewBox="0 0 100 100" className="h-10 w-10 transition-transform duration-500 group-hover:rotate-180" aria-hidden>
            <circle cx="50" cy="50" r="46" fill="#a1001a" stroke="#f5c928" strokeWidth="5" />
            {[34, 26, 18].map((r) => (
              <circle key={r} cx="50" cy="50" r={r} fill="none" stroke="#000" strokeWidth="1.5" />
            ))}
            <circle cx="50" cy="50" r="11" fill="#f5c928" />
            <circle cx="50" cy="50" r="2.5" fill="#000" />
          </svg>
          <span className={cn("whitespace-nowrap text-xl leading-none text-[var(--nav-accent)] sm:text-2xl", serif.className)}>
            Techno-<span className="text-[var(--nav-ink)]">aiMBiAtion</span>
            <span className="text-[var(--nav-accent)]"> &apos;27</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden min-[1320px]:flex flex-1 items-center justify-center gap-0.5 2xl:gap-2">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn("whitespace-nowrap px-2.5 py-1.5 text-sm 2xl:text-base font-bold uppercase tracking-wide transition", linkCls(link.href))}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Desktop right side */}
        <div className="hidden min-[1320px]:flex items-center gap-3 shrink-0">
          {user_ ? (
            <UserDropdown user={user_} />
          ) : (
            <>
              <Link
                href="/auth/login"
                className="whitespace-nowrap border-2 border-[var(--nav-ink)] px-4 py-1 text-sm 2xl:text-base font-bold uppercase tracking-wide text-[var(--nav-ink)] transition hover:bg-[var(--nav-ink)] hover:text-[var(--nav-bg)]"
              >
                Sign in
              </Link>
              <Link
                href="/auth/signup"
                className="flex items-center gap-1.5 whitespace-nowrap border-2 border-black bg-[#f5c928] px-4 py-1 text-sm 2xl:text-base font-bold uppercase tracking-wide text-black shadow-[3px_3px_0_0_#ff6a00] transition hover:-translate-y-0.5 hover:bg-[#ff6a00]"
              >
                <Ticket className="h-4 w-4" /> Register
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          className="min-[1320px]:hidden p-2 text-[var(--nav-accent)] hover:opacity-70"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="min-[1320px]:hidden border-b-4 border-[var(--nav-accent)]" style={{ background: "color-mix(in srgb, var(--nav-bg) 94%, black)" }}>
          <div className="px-4 py-4 space-y-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn("block border-b border-dashed border-[var(--nav-ink)]/30 px-3 py-2.5 text-xl font-bold uppercase tracking-wider", linkCls(link.href))}
              >
                {link.label}
              </Link>
            ))}

            <div className="mt-2 flex flex-col gap-2 border-t-2 border-dashed border-[var(--nav-accent)] pt-3">
              {user_ ? (
                <UserDropdown user={user_} />
              ) : (
                <>
                  <Link
                    href="/auth/login"
                    className="border-2 border-[var(--nav-ink)] py-2 text-center text-lg font-bold uppercase tracking-wider text-[var(--nav-ink)] transition hover:bg-[var(--nav-ink)] hover:text-[var(--nav-bg)]"
                  >
                    Sign in
                  </Link>
                  <Link
                    href="/auth/signup"
                    className="border-2 border-black bg-[#f5c928] py-2 text-center text-lg font-bold uppercase tracking-wider text-black shadow-[3px_3px_0_0_#ff6a00]"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
