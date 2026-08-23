import Link from "next/link";
import { User, MapPin, FolderOpen, Image as ImageIcon, Palette, Users, ArrowRight } from "lucide-react";
import { requireSessionUser } from "@/lib/auth";
import { getPortfolio, getUsers } from "@/lib/data";
import { Card, PageHeader } from "@/components/admin/ui";

const TILES = [
  { href: "/admin/profile", label: "Profil", icon: User },
  { href: "/admin/hometown", label: "Tempat Asal", icon: MapPin },
  { href: "/admin/tasks", label: "Tugas", icon: FolderOpen },
  { href: "/admin/media", label: "Media Library", icon: ImageIcon },
  { href: "/admin/appearance", label: "Tampilan", icon: Palette },
];

export default async function AdminDashboard() {
  const session = await requireSessionUser();

  if (session.role === "admin") {
    return <AdminOverview displayName={session.displayName} />;
  }

  const portfolio = await getPortfolio(session.username);
  const stats = [
    { label: "Tempat Asal", value: portfolio?.hometown.length ?? 0 },
    { label: "Tugas", value: portfolio?.tasks.length ?? 0 },
    { label: "File Media", value: portfolio?.media.length ?? 0 },
  ];

  return (
    <div>
      <PageHeader
        title={`Halo, ${session.displayName.split(" ")[0]} 👋`}
        description="Kelola konten portofolio kamu di sini."
      />

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {stats.map((s) => (
          <Card key={s.label} className="text-center">
            <p className="font-display text-2xl text-gray-900">{s.value}</p>
            <p className="mt-1 text-xs text-gray-500">{s.label}</p>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {TILES.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="group rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-gray-100 text-gray-700 transition-colors group-hover:bg-gray-900 group-hover:text-white">
              <Icon size={20} strokeWidth={2} />
            </span>
            <p className="mt-4 text-sm font-semibold text-gray-900">{label}</p>
            <p className="mt-1 text-xs text-gray-500">Kelola {label.toLowerCase()}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

async function AdminOverview({ displayName }: { displayName: string }) {
  const users = await getUsers();
  const regularUsers = users.filter((u) => u.role === "user");

  return (
    <div>
      <PageHeader
        title={`Halo, ${displayName.split(" ")[0]} 👋`}
        description="Sebagai admin, kelola pengguna dan portofolio mereka lewat Manajemen User. Admin tidak memiliki portofolio publik sendiri."
      />

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Card className="text-center">
          <p className="font-display text-2xl text-gray-900">{users.length}</p>
          <p className="mt-1 text-xs text-gray-500">Total Pengguna</p>
        </Card>
        <Card className="text-center">
          <p className="font-display text-2xl text-gray-900">{regularUsers.length}</p>
          <p className="mt-1 text-xs text-gray-500">Portofolio Aktif</p>
        </Card>
      </div>

      <Link
        href="/admin/users"
        className="group flex items-center justify-between rounded-xl border border-gray-200 bg-gray-900 p-5 text-white shadow-sm transition-colors hover:bg-gray-800"
      >
        <div className="flex items-center gap-4">
          <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-white/10">
            <Users size={20} strokeWidth={2} />
          </span>
          <div>
            <p className="text-sm font-semibold text-white">Manajemen User</p>
            <p className="mt-0.5 text-xs text-white/70">
              Tambah pengguna baru, edit username, reset kata sandi, atau kelola portofolio mereka
            </p>
          </div>
        </div>
        <ArrowRight size={16} className="text-white/70 transition-transform group-hover:translate-x-1 group-hover:text-white" />
      </Link>

      {regularUsers.length > 0 && (
        <div className="mt-8">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-gray-400">
            Pengguna Terbaru
          </p>
          <div className="space-y-3">
            {regularUsers.slice(0, 5).map((u) => (
              <Card key={u.username} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-900">{u.displayName}</p>
                  <p className="text-xs text-gray-400">/{u.username}</p>
                </div>
                <Link
                  href={`/admin/profile?as=${u.username}`}
                  className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50"
                >
                  Kelola
                </Link>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
