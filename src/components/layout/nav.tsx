"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Ticket, X } from "lucide-react";
import { UserDropdown } from "@/components/layout/user-dropdown";
import useFetch from "@/hooks/use-fetch";
import { getUser } from "@/features/users/user-actions";
import { cn } from "@/lib/utils";
import { sans } from "@/components/home/fonts";

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

// One ink-black bar on every page: it sits cleanly on all the page colours (gold, maroon, teal, pink, crimson).
type NavTheme = { bg: string; ink: string; accent: string; accentInk: string };
const THEME: NavTheme = { bg: "#1c1812", ink: "#f3e8cf", accent: "#f5c928", accentInk: "#1c1812" };
const TEAL_LINKS = ["/creatorverse", "/contact"];

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [visible, setVisible] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const header = useRef<HTMLElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const inside = useRef(false);
  const held = useRef(false);
  const wasOpen = useRef(false);
  held.current = mobileOpen || dropdownOpen;
  const show = useCallback(() => { clearTimeout(timer.current); setVisible(true); }, []);
  const hideLater = useCallback((delay = 350) => {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      if (matchMedia("(hover: hover) and (pointer: fine)").matches && !inside.current && !held.current && !header.current?.contains(document.activeElement)) setVisible(false);
    }, delay);
  }, []);
  useEffect(() => { show(); hideLater(1500); return () => clearTimeout(timer.current); }, [pathname, show, hideLater]);
  useEffect(() => {
    if (mobileOpen || dropdownOpen) show();
    else if (wasOpen.current) hideLater();
    wasOpen.current = mobileOpen || dropdownOpen;
  }, [mobileOpen, dropdownOpen, show, hideLater]);

  const { data: user, fn: fetchUser } = useFetch(getUser);

  useEffect(() => {
    fetchUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  useEffect(() => {
    setMobileOpen(false);
    setDropdownOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const linkCls = (href: string) =>
    cn(
      "rounded-lg border-2 px-3 py-1",
      isActive(pathname, href) ? "border-[#f5c928] bg-[#f5c928] text-[#1c1812]" : "border-transparent text-[var(--nav-ink)] hover:border-[var(--nav-ink)]/60",
      TEAL_LINKS.includes(href) && "!border-[#f3e8cf]/70 bg-[#0e7c7b] text-[#f3e8cf]"
    );

  const theme = THEME;
  const navVars = {
    "--nav-bg": theme.bg, "--nav-ink": theme.ink, "--nav-accent": theme.accent, "--nav-accent-ink": theme.accentInk,
  } as React.CSSProperties;

  const user_ = user && { fullName: user.fullName, email: user.email, role: user.role };

  return (
    <>
    <div className="nav-activation" onPointerEnter={() => { inside.current = true; show(); }} onPointerLeave={() => { inside.current = false; hideLater(); }}>
      <button className="nav-reveal" hidden={visible} onFocus={() => { show(); requestAnimationFrame(() => header.current?.querySelector<HTMLElement>('a,button')?.focus()); }} onClick={() => { show(); header.current?.querySelector<HTMLElement>('a,button')?.focus(); }} aria-label="Show navigation">Menu</button>
    </div>
    <header
      ref={header}
      data-main-navigation
      data-visible={visible}
      className={cn(
        "auto-navigation fixed top-0 left-0 right-0 z-50 text-[var(--nav-ink)] backdrop-blur-md",
        sans.className,
        scrolled && visible && "shadow-[0_6px_18px_rgba(0,0,0,0.3)]"
      )}
      onPointerEnter={() => { inside.current = true; show(); }}
      onPointerLeave={() => { inside.current = false; hideLater(); }}
      onFocusCapture={show}
      onBlurCapture={() => hideLater()}
      onKeyDown={event => { if (event.key === "Escape") { setMobileOpen(false); setDropdownOpen(false); } }}
      style={{
        ...navVars,
        background: `color-mix(in srgb, var(--nav-bg) ${scrolled ? 92 : 100}%, transparent)`,
      }}
    >
      <nav className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
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
            <UserDropdown user={user_} onOpenChange={setDropdownOpen} />
          ) : (
            <>
              <Link
                href="/auth/login"
                className={cn("whitespace-nowrap rounded-md border-2 border-[var(--nav-ink)] px-4 py-1 text-sm 2xl:text-base font-bold uppercase tracking-wide text-[var(--nav-ink)] transition hover:bg-[var(--nav-ink)] hover:text-[var(--nav-bg)]")}
              >
                Sign in
              </Link>
              <Link
                href="/auth/signup"
                className="flex items-center gap-1.5 whitespace-nowrap rounded-md border-2 border-black bg-[#ef5a1c] px-4 py-1 text-sm 2xl:text-base font-bold uppercase tracking-wide text-black shadow-[0_0_0_3px_#f3e8cf,4px_5px_0_3px_rgba(0,0,0,0.45)] transition hover:-translate-y-0.5 hover:bg-[#ff7a3d]"
              >
                <Ticket className="h-4 w-4" /> Register
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          className="ml-auto min-[1320px]:hidden p-2 text-[var(--nav-accent)] hover:opacity-70"
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
                className={cn("block px-3 py-2.5 text-xl font-bold uppercase tracking-wider", linkCls(link.href))}
              >
                {link.label}
              </Link>
            ))}

            <div className="mt-2 flex flex-col gap-2 border-t-2 border-dashed border-[var(--nav-accent)] pt-3">
              {user_ ? (
                <UserDropdown user={user_} onOpenChange={setDropdownOpen} />
              ) : (
                <>
                  <Link
                    href="/auth/login"
                    className="rounded-md border-2 border-[var(--nav-ink)] py-2 text-center text-lg font-bold uppercase tracking-wider text-[var(--nav-ink)] transition hover:bg-[var(--nav-ink)] hover:text-[var(--nav-bg)]"
                  >
                    Sign in
                  </Link>
                  <Link
                    href="/auth/signup"
                    className="rounded-md border-2 border-black bg-[#ef5a1c] py-2 text-center text-lg font-bold uppercase tracking-wider text-black shadow-[0_0_0_3px_#f3e8cf]"
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
    </>
  );
}
