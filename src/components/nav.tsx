"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { UserDropdown } from "@/components/user-dropdown";
import useFetch from "@/hooks/use-fetch";
import { getUser } from "@/actions/user-actions";
import { cn } from "@/lib/utils";
import { body, display } from "@/components/indie";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Events", href: "/events" },
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
        "fixed top-0 left-0 right-0 z-50 bg-black border-b-2 border-[#f5c928] transition-shadow",
        body.className,
        scrolled && "shadow-[0_4px_0_0_#7a1c1c]"
      )}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
          <svg viewBox="0 0 100 100" className="h-9 w-9" aria-hidden>
            <circle cx="50" cy="50" r="46" fill="#7a1c1c" stroke="#f5c928" strokeWidth="4" />
            {[34, 26, 18].map((r) => (
              <circle key={r} cx="50" cy="50" r={r} fill="none" stroke="#000" strokeWidth="1.5" />
            ))}
            <circle cx="50" cy="50" r="11" fill="#f5c928" />
            <circle cx="50" cy="50" r="2.5" fill="#000" />
          </svg>
          <span className={cn("text-base sm:text-lg text-[#f5c928] leading-none", display.className)}>
            Techno-aiMBiAtion<span className="text-[#ff6a00]"> 27</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-7">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-lg font-bold uppercase tracking-wider border-b-2 transition-colors",
                isActive(pathname, link.href)
                  ? "text-[#f5c928] border-[#f5c928]"
                  : "text-white border-transparent hover:text-[#ff6a00]"
              )}
            >
              {link.label}
            </Link>
          ))}
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
              <Link
                href="/auth/login"
                className="text-lg font-bold uppercase tracking-wider text-white hover:text-[#ff6a00] transition-colors"
              >
                Sign in
              </Link>
              <Link
                href="/auth/signup"
                className="bg-[#f5edd8] text-black hover:bg-[#f5c928] transition-colors px-5 py-1 text-lg font-bold uppercase tracking-wider rounded-full"
              >
                Register
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden p-2 text-[#f5c928] hover:text-[#ff6a00]"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-black border-t-2 border-dashed border-[#f5c928]/50">
          <div className="px-4 py-4 space-y-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "block text-xl font-bold uppercase tracking-wider py-2",
                  isActive(pathname, link.href) ? "text-[#f5c928]" : "text-white hover:text-[#ff6a00]"
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
                    className="text-center border-2 border-[#f5edd8] text-[#f5edd8] py-1.5 text-lg font-bold uppercase tracking-wider rounded-full"
                  >
                    Sign in
                  </Link>
                  <Link
                    href="/auth/signup"
                    className="text-center bg-[#f5c928] text-black py-1.5 text-lg font-bold uppercase tracking-wider rounded-full"
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
