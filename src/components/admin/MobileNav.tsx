"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import AdminSidebar from "./Sidebar";
import { logoutAction } from "@/lib/actions/auth";

export default function MobileNav({
  role,
  displayName,
  username,
}: {
  role: "admin" | "user";
  displayName: string;
  username: string;
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const [lastPathname, setLastPathname] = useState(pathname);

  // Close the drawer on navigation. Adjusting state during render (rather
  // than in an effect) avoids an extra commit — React bails out of this
  // render and re-renders immediately with the reset state.
  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    setOpen(false);
  }

  return (
    <>
      <header className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4 md:hidden">
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Buka menu"
          className="text-gray-500 hover:text-gray-900"
        >
          <Menu size={22} />
        </button>
        <span className="flex items-center gap-2">
          <Image src="/images/e-portfolio-logo.webp" alt="" width={22} height={22} className="rounded-md" />
          <p className="font-display text-base text-gray-900">E-Portfolio Admin</p>
        </span>
        <form action={logoutAction}>
          <button type="submit" className="text-sm text-red-600">
            Keluar
          </button>
        </form>
      </header>

      {open && (
        <div className="fixed inset-0 z-100 flex md:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <div className="relative flex h-full w-72 max-w-[80vw] flex-col overflow-y-auto bg-white shadow-xl">
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Tutup menu"
              className="absolute right-3 top-3 text-gray-400 hover:text-gray-900"
            >
              <X size={20} />
            </button>
            <AdminSidebar role={role} displayName={displayName} username={username} />
          </div>
        </div>
      )}
    </>
  );
}
