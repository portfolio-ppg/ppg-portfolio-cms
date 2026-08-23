"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import {
  LayoutDashboard,
  User,
  MapPin,
  FolderOpen,
  Image as ImageIcon,
  Palette,
  Users,
  LogOut,
  ExternalLink,
  ArrowLeft,
} from "lucide-react";
import { logoutAction } from "@/lib/actions/auth";

const CONTENT_NAV = [
  { href: "/admin/profile", label: "Profil", icon: User },
  { href: "/admin/hometown", label: "Tempat Asal", icon: MapPin },
  { href: "/admin/tasks", label: "Tugas", icon: FolderOpen },
  { href: "/admin/media", label: "Media Library", icon: ImageIcon },
  { href: "/admin/appearance", label: "Tampilan", icon: Palette },
];

export default function AdminSidebar({
  role,
  displayName,
  username,
}: {
  role: "admin" | "user";
  displayName: string;
  username: string;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const asParam = searchParams.get("as");
  // Admins have no portfolio of their own — the content menu only appears
  // once they've picked a user to manage (?as=<username> from Manajemen User).
  const managingOther = role === "admin" && !!asParam;

  function withAs(href: string) {
    if (role !== "admin" || !asParam) return href;
    return `${href}?as=${encodeURIComponent(asParam)}`;
  }

  const publicHref = managingOther ? `/${asParam}` : `/${username}`;
  const showContentNav = role === "user" || managingOther;

  return (
    <>
      <div className="px-6 py-6">
        <div className="flex items-center gap-2.5">
          <Image
            src="/images/e-portfolio-logo.webp"
            alt=""
            width={28}
            height={28}
            className="rounded-lg"
          />
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-400">
              CMS
            </p>
            <p className="font-display text-lg leading-tight text-gray-900">E-Portfolio Admin</p>
          </div>
        </div>
        {managingOther && (
          <p className="mt-2 rounded-lg bg-gray-100 px-2.5 py-1.5 text-[11px] text-gray-600">
            Mengelola: <span className="font-semibold text-gray-900">{asParam}</span>
          </p>
        )}
      </div>

      <nav className="flex-1 space-y-1 px-3">
        <Link
          href="/admin"
          className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
            pathname === "/admin"
              ? "bg-gray-900 text-white"
              : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
          }`}
        >
          <LayoutDashboard size={17} strokeWidth={2} />
          Dashboard
        </Link>

        {role === "admin" && (
          <Link
            href="/admin/users"
            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
              pathname === "/admin/users"
                ? "bg-gray-900 text-white"
                : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
            }`}
          >
            <Users size={17} strokeWidth={2} />
            Manajemen User
          </Link>
        )}

        {showContentNav && (
          <>
            <div className="my-2 border-t border-gray-100" />
            {managingOther && (
              <Link
                href="/admin/users"
                className="mb-1 flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700"
              >
                <ArrowLeft size={14} />
                Kembali ke daftar user
              </Link>
            )}
            {CONTENT_NAV.map(({ href, label, icon: Icon }) => {
              const active = pathname === href;
              return (
                <Link
                  key={href}
                  href={withAs(href)}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    active
                      ? "bg-gray-900 text-white"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                >
                  <Icon size={17} strokeWidth={2} />
                  {label}
                </Link>
              );
            })}
          </>
        )}
      </nav>

      <div className="space-y-1 border-t border-gray-100 px-3 py-4">
        <p className="px-3 pb-1 text-xs text-gray-400">
          Masuk sebagai <span className="font-medium text-gray-600">{displayName}</span>
        </p>
        {(role === "user" || managingOther) && (
          <a
            href={publicHref}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900"
          >
            <ExternalLink size={17} strokeWidth={2} />
            Lihat Situs
          </a>
        )}
        <form action={logoutAction}>
          <button
            type="submit"
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
          >
            <LogOut size={17} strokeWidth={2} />
            Keluar
          </button>
        </form>
      </div>
    </>
  );
}
