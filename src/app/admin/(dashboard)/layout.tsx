import { Suspense } from "react";
import Image from "next/image";
import { requireSessionUser } from "@/lib/auth";
import { logoutAction } from "@/lib/actions/auth";
import AdminSidebar from "@/components/admin/Sidebar";
import { ToastProvider } from "@/components/admin/Toast";
import BackgroundPattern from "@/components/BackgroundPattern";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await requireSessionUser();

  return (
    <ToastProvider>
      <div className="relative min-h-screen bg-gray-50 text-gray-900">
        <BackgroundPattern opacity={0.04} />
        <div className="relative flex min-h-screen">
          <aside className="hidden w-64 shrink-0 border-r border-gray-200 bg-white md:flex md:flex-col">
            <Suspense fallback={null}>
              <AdminSidebar role={user.role} displayName={user.displayName} username={user.username} />
            </Suspense>
          </aside>

          <div className="flex-1">
            <header className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4 md:hidden">
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
            <main className="mx-auto max-w-4xl px-6 py-8 md:px-10 md:py-10">{children}</main>
          </div>
        </div>
      </div>
    </ToastProvider>
  );
}
