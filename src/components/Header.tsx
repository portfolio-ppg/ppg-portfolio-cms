"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export interface NavItem {
  href: string;
  label: string;
}

interface HeaderProps {
  name: string;
  subtitle: string;
  navItems: NavItem[];
  /** Where the logo/name links to. Defaults to the first nav item (the profile page). */
  homeHref?: string;
}

export default function Header({ name, subtitle, navItems, homeHref }: HeaderProps) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 h-16 md:h-20 transition-all duration-500 ${
        scrolled
          ? "bg-cream/85 backdrop-blur-md border-b border-stone/25 shadow-[0_1px_0_0_rgba(183,166,146,0.15)]"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="mx-auto flex h-full max-w-6xl items-center justify-between gap-4 px-6 md:px-10">
        <Link href={homeHref ?? navItems[0]?.href ?? "/"} className="group flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-full border border-clay/60 bg-white-warm text-clay-deep transition-transform duration-500 group-hover:rotate-[18deg]">
            <svg
              width="17"
              height="17"
              viewBox="0 0 100 100"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="
                M50 4
                C52 32 68 48 96 50
                C68 52 52 68 50 96
                C48 68 32 52 4 50
                C32 48 48 32 50 4
                Z
              " />
            </svg>
          </span>
          <span className="hidden md:flex md:flex-col md:leading-tight">
            <span className="font-display text-[15px] tracking-wide text-ink">
              {name}
            </span>
            <span className="text-[10px] uppercase tracking-[0.18em] text-ink-soft">
              {subtitle}
            </span>
          </span>
        </Link>

        <nav className="flex flex-wrap items-center gap-1 rounded-full border border-stone/40 bg-white-warm/60 p-1">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative rounded-full px-4 py-1.5 text-[12px]! transition-colors duration-300 ${
                  active
                    ? "bg-ink text-white-warm shadow-sm"
                    : "text-ink-soft hover:text-ink"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
