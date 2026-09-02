import Link from "next/link";
import type { NavItem } from "./Header";

interface FooterProps {
  name: string;
  program: string;
  description: string;
  email: string;
  location: string;
  navItems: NavItem[];
}

export default function Footer({ name, program, description, email, location, navItems }: FooterProps) {
  return (
    <footer className="relative overflow-hidden border-t border-stone/30 bg-cream-deep">
      <div className="mx-auto max-w-6xl px-6 pt-12 pb-6 text-center md:px-10 md:pt-12 md:pb-6 md:text-left lg:px-10 lg:pt-24 lg:pb-12bu">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-12 lg:gap-[8rem]">
          <div>
            <p className="font-display text-[16px]! text-ink">{name}</p>
            <p className="mt-2 mx-auto max-w-full text-sm leading-relaxed text-ink-soft md:mx-0 md:max-w-xs">
              {description}
            </p>
          </div>

          <div>
            <p className="text-[12px]! font-semibold uppercase tracking-[0.18em] text-clay-deep min-[768px]:text-[12px]">
              Jelajah
            </p>
            <ul className="mt-3 space-y-2 text-sm text-ink-soft">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="transition-colors hover:text-ink">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-[12px]! font-semibold uppercase tracking-[0.18em] text-clay-deep min-[768px]:text-[12px]">
              Kontak
            </p>
            <ul className="mt-3 space-y-2 text-sm text-ink-soft">
              {email && (
                <li>
                  <a
                    href={`mailto:${email}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-colors hover:text-ink"
                  >
                    {email}
                  </a>
                </li>
              )}
              {location && <li>{location}</li>}
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-stone/25 pt-0 text-center text-xs text-ink-soft/80 md:flex-row md:items-center md:pt-8 md:text-left">
          <p>
            &copy; {new Date().getFullYear()} E-Portofolio · {program} · {name}
          </p>
        </div>
      </div>
    </footer>
  );
}
