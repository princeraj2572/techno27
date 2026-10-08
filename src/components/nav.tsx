"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, Cog, Menu, X } from "lucide-react";
import { UserDropdown } from "@/components/user-dropdown";
import useFetch from "@/hooks/use-fetch";
import { getUser } from "@/actions/user-actions";
import { cn } from "@/lib/utils";
import { blackletter } from "@/components/heritage";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Events", href: "/events" },
  { label: "Schedule", href: "/schedule" },
  { label: "Gallery", href: "/gallery" },
];

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

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 bg-[#fbf3e6]/95 backdrop-blur border-b transition-shadow",
        scrolled ? "border-[#9b111e]/25 shadow-[0_6px_20px_-12px_rgba(110,11,18,0.5)]" : "border-[#9b111e]/10"
      )}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0 text-[#1c0b09]">
          <Cog className="h-7 w-7" aria-hidden />
          <span className={cn("text-2xl leading-none text-[#6e0b12]", blackletter.className)}>
            Techno-aiMBiAtion <span className="text-[#c1121f]">&apos;27</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => {
            const active = isActive(pathname, link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative text-[13px] font-semibold uppercase tracking-wider transition-colors",
                  active ? "text-[#1c0b09]" : "text-[#1c0b09]/70 hover:text-[#9b111e]"
                )}
              >
                {link.label}
                {active && <span className="absolute -bottom-2 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-[#c1121f]" />}
              </Link>
            );
          })}
        </div>

        {/* Desktop right side */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <UserDropdown
              user={{
                fullName: user.fullName,
                email: user.email,
                role: user.role,
              }}
            />
          ) : (
            <>
              <Link href="/auth/login" className="text-[13px] font-semibold uppercase tracking-wider text-[#1c0b09]/70 hover:text-[#9b111e]">
                Sign in
              </Link>
              <Link
                href="/auth/signup"
                className="inline-flex items-center gap-2 rounded-lg bg-[#1c0b09] px-5 py-2.5 text-[13px] font-semibold uppercase tracking-wider text-white hover:bg-[#7a0c14] transition-colors"
              >
                Register now <ArrowRight className="h-4 w-4" />
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden p-2 text-[#1c0b09]"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-[#fbf3e6] border-t border-[#9b111e]/15">
          <div className="px-5 py-4 space-y-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "block py-2.5 text-sm font-semibold uppercase tracking-wider border-b border-[#9b111e]/10",
                  isActive(pathname, link.href) ? "text-[#c1121f]" : "text-[#1c0b09]"
                )}
              >
                {link.label}
              </Link>
            ))}

            <div className="pt-4 flex flex-col gap-2">
              {user ? (
                <UserDropdown
                  user={{
                    fullName: user.fullName,
                    email: user.email,
                    role: user.role,
                  }}
                />
              ) : (
                <>
                  <Link
                    href="/auth/login"
                    className="text-center rounded-lg border border-[#1c0b09]/40 py-2.5 text-sm font-semibold uppercase tracking-wider"
                  >
                    Sign in
                  </Link>
                  <Link
                    href="/auth/signup"
                    className="text-center rounded-lg bg-[#1c0b09] text-white py-2.5 text-sm font-semibold uppercase tracking-wider"
                  >
                    Register now
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
