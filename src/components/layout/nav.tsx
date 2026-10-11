"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { UserDropdown } from "@/components/layout/user-dropdown";
import useFetch from "@/hooks/use-fetch";
import { getUser } from "@/features/users/user-actions";
import { cn } from "@/lib/utils";
import { body, display } from "@/components/indie";

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
        "fixed top-0 left-0 right-0 z-50 bg-black border-b-2 border-[#f5c928] transition-shadow",
        body.className,
        scrolled && "shadow-[0_4px_0_0_#7a1c1c]"
      )}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-6">
        {/* Logo */}
        <Link href="/" className="group flex items-center gap-2.5 shrink-0">
          <svg viewBox="0 0 100 100" className="h-10 w-10 transition-transform duration-500 group-hover:rotate-180" aria-hidden>
            <circle cx="50" cy="50" r="46" fill="#7a1c1c" stroke="#f5c928" strokeWidth="4" />
            {[34, 26, 18].map((r) => (
              <circle key={r} cx="50" cy="50" r={r} fill="none" stroke="#000" strokeWidth="1.5" />
            ))}
            <circle cx="50" cy="50" r="11" fill="#f5c928" />
            <circle cx="50" cy="50" r="2.5" fill="#000" />
          </svg>
          <span className={cn("text-sm sm:text-base 2xl:text-lg whitespace-nowrap text-[#f5c928] leading-none", display.className)}>
            Techno-aiMBiAtion<span className="text-[#ff6a00]"> 27</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden xl:flex items-center gap-4 2xl:gap-6">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "whitespace-nowrap px-2.5 py-1 text-[15px] 2xl:text-lg font-bold uppercase tracking-wider transition",
                isActive(pathname, link.href)
                  ? "-rotate-2 border-2 border-black bg-[#f5c928] text-black shadow-[2px_2px_0_0_#ff6a00]"
                  : "border-2 border-transparent text-white hover:-translate-y-0.5 hover:border-[#f5edd8]/40 hover:text-[#f5c928]"
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Desktop right side */}
        <div className="hidden xl:flex items-center gap-3 shrink-0">
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
                className="whitespace-nowrap border-2 border-[#f5edd8] px-4 py-1 text-base 2xl:text-lg font-bold uppercase tracking-wider text-[#f5edd8] transition hover:bg-[#f5edd8] hover:text-black"
              >
                Sign in
              </Link>
              <Link
                href="/auth/signup"
                className="whitespace-nowrap border-2 border-black bg-[#f5c928] px-5 py-1 text-base 2xl:text-lg font-bold uppercase tracking-wider text-black shadow-[3px_3px_0_0_#ff6a00] transition hover:-translate-y-0.5 hover:bg-[#ff6a00] hover:shadow-[3px_3px_0_0_#f5edd8]"
              >
                Register
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          className="xl:hidden p-2 text-[#f5c928] hover:text-[#ff6a00]"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="xl:hidden bg-black border-t-2 border-dashed border-[#f5c928]/50">
          <div className="px-4 py-4 space-y-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "block border-b border-dashed border-[#f5edd8]/20 px-3 py-2.5 text-xl font-bold uppercase tracking-wider",
                  isActive(pathname, link.href) ? "border-black bg-[#f5c928] text-black" : "text-white hover:bg-[#f5edd8]/10 hover:text-[#f5c928]"
                )}
              >
                {link.label}
              </Link>
            ))}

            <div className="pt-3 mt-2 border-t-2 border-dashed border-[#f5c928]/50 flex flex-col gap-2">
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
                    className="border-2 border-[#f5edd8] py-2 text-center text-lg font-bold uppercase tracking-wider text-[#f5edd8] transition hover:bg-[#f5edd8] hover:text-black"
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
