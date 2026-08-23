"use client";

import { useActionState, useEffect, useOptimistic, useState, useTransition } from "react";
import Link from "next/link";
import { Plus, Trash2, KeyRound, X, ShieldCheck, User as UserIcon, ExternalLink, Pencil } from "lucide-react";
import { createUserAction, deleteUserAction, resetPasswordAction, renameUserAction } from "@/lib/actions/users";
import { Field, inputClass, buttonPrimaryClass, buttonSecondaryClass, Card, Badge } from "@/components/admin/ui";
import { useToast } from "@/components/admin/Toast";

interface SafeUser {
  username: string;
  displayName: string;
  role: "admin" | "user";
  createdAt: string;
}

export default function UsersManager({
  users,
  currentUsername,
}: {
  users: SafeUser[];
  currentUsername: string;
}) {
  const toast = useToast();
  const [, startTransition] = useTransition();
  const [adding, setAdding] = useState(false);
  const [resetTarget, setResetTarget] = useState<string | null>(null);
  const [editTarget, setEditTarget] = useState<SafeUser | null>(null);

  const [optimisticUsers, removeOptimisticUser] = useOptimistic<SafeUser[], string>(users, (state, username) =>
    state.filter((u) => u.username !== username)
  );

  function handleDelete(username: string) {
    if (!confirm(`Hapus pengguna "${username}"? Portofolionya juga akan terhapus.`)) return;
    startTransition(async () => {
      removeOptimisticUser(username);
      toast(`Pengguna "${username}" berhasil dihapus.`);
      try {
        await deleteUserAction(username);
      } catch {
        toast("Gagal menghapus pengguna. Coba lagi.", "error");
      }
    });
  }

  return (
    <div className="space-y-6">
      {adding ? (
        <CreateUserForm onClose={() => setAdding(false)} />
      ) : (
        <button onClick={() => setAdding(true)} className={buttonPrimaryClass}>
          <Plus size={16} /> Tambah User
        </button>
      )}

      <div className="space-y-3">
        {optimisticUsers.map((u) => (
          <Card key={u.username} className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-600">
                {u.role === "admin" ? <ShieldCheck size={17} /> : <UserIcon size={17} />}
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-gray-900">{u.displayName}</p>
                  <Badge tone={u.role === "admin" ? "dark" : "neutral"}>{u.role}</Badge>
                </div>
                <p className="text-xs text-gray-400">
                  @{u.username} &middot; dibuat {new Date(u.createdAt).toLocaleDateString("id-ID")}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <a
                href={`/${u.username}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50"
              >
                <ExternalLink size={12} /> /{u.username}
              </a>
              <Link
                href={`/admin/profile?as=${u.username}`}
                className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50"
              >
                Kelola Portofolio
              </Link>
              <button
                onClick={() => setEditTarget(u)}
                className="flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50"
              >
                <Pencil size={12} /> Edit
              </button>
              <button
                onClick={() => setResetTarget(u.username)}
                className="flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50"
              >
                <KeyRound size={12} /> Reset Sandi
              </button>
              {u.username !== currentUsername && (
                <button
                  onClick={() => handleDelete(u.username)}
                  className="flex items-center gap-1 rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50"
                >
                  <Trash2 size={12} /> Hapus
                </button>
              )}
            </div>
          </Card>
        ))}
      </div>

      {resetTarget && (
        <ResetPasswordModal username={resetTarget} onClose={() => setResetTarget(null)} />
      )}
      {editTarget && (
        <EditUserModal user={editTarget} onClose={() => setEditTarget(null)} />
      )}
    </div>
  );
}

function CreateUserForm({ onClose }: { onClose: () => void }) {
  const [state, formAction, pending] = useActionState(createUserAction, undefined);
  const toast = useToast();

  useEffect(() => {
    if (state?.ok) {
      toast("Pengguna berhasil ditambahkan.");
      onClose();
    }
    if (state?.error) toast(state.error, "error");
  }, [state, onClose, toast]);

  return (
    <Card className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-gray-900">Tambah User Baru</p>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-900">
          <X size={16} />
        </button>
      </div>

      <form action={formAction} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Username" hint="Akan jadi URL publik: /username">
            <input name="username" required pattern="[a-zA-Z0-9-]+" className={inputClass} placeholder="elva" />
          </Field>
          <Field label="Nama Tampilan">
            <input name="displayName" required className={inputClass} placeholder="Elva Arini Mardatillah" />
          </Field>
          <Field label="Kata Sandi" hint="Minimal 6 karakter">
            <input name="password" type="password" required minLength={6} className={inputClass} />
          </Field>
          <Field label="Role">
            <select name="role" defaultValue="user" className={inputClass}>
              <option value="user">User (kelola portofolio sendiri)</option>
              <option value="admin">Admin (kelola semua portofolio)</option>
            </select>
          </Field>
        </div>

        {state?.error && <p className="text-sm text-red-600">{state.error}</p>}

        <div className="flex gap-3">
          <button type="submit" disabled={pending} className={buttonPrimaryClass}>
            {pending ? "Menyimpan..." : "Buat User"}
          </button>
          <button type="button" onClick={onClose} className={buttonSecondaryClass}>
            Batal
          </button>
        </div>
      </form>
    </Card>
  );
}

function ResetPasswordModal({ username, onClose }: { username: string; onClose: () => void }) {
  const [state, formAction, pending] = useActionState(resetPasswordAction, undefined);
  const toast = useToast();

  useEffect(() => {
    if (state?.ok) {
      toast("Kata sandi berhasil diperbarui.");
      onClose();
    }
    if (state?.error) toast(state.error, "error");
  }, [state, onClose, toast]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-6">
      <Card className="w-full max-w-sm">
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm font-semibold text-gray-900">Reset Kata Sandi &mdash; @{username}</p>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-900">
            <X size={16} />
          </button>
        </div>
        <form action={formAction} className="space-y-4">
          <input type="hidden" name="username" value={username} />
          <Field label="Kata Sandi Baru" hint="Minimal 6 karakter">
            <input name="password" type="password" required minLength={6} autoFocus className={inputClass} />
          </Field>
          {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
          <div className="flex gap-3">
            <button type="submit" disabled={pending} className={buttonPrimaryClass}>
              {pending ? "Menyimpan..." : "Simpan"}
            </button>
            <button type="button" onClick={onClose} className={buttonSecondaryClass}>
              Batal
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
}

function EditUserModal({ user, onClose }: { user: SafeUser; onClose: () => void }) {
  const [state, formAction, pending] = useActionState(renameUserAction, undefined);
  const toast = useToast();

  useEffect(() => {
    if (state?.ok) {
      toast("Pengguna berhasil diperbarui.");
      onClose();
    }
    if (state?.error) toast(state.error, "error");
  }, [state, onClose, toast]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-6">
      <Card className="w-full max-w-sm">
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm font-semibold text-gray-900">Edit Pengguna &mdash; @{user.username}</p>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-900">
            <X size={16} />
          </button>
        </div>
        <form action={formAction} className="space-y-4">
          <input type="hidden" name="oldUsername" value={user.username} />
          <Field label="Nama Tampilan">
            <input name="displayName" defaultValue={user.displayName} required className={inputClass} />
          </Field>
          <Field
            label="Username"
            hint={`Mengubah ini memindahkan halaman publik dari /${user.username} ke username baru.`}
          >
            <input
              name="newUsername"
              defaultValue={user.username}
              required
              pattern="[a-zA-Z0-9-]+"
              autoFocus
              className={inputClass}
            />
          </Field>
          {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
          <div className="flex gap-3">
            <button type="submit" disabled={pending} className={buttonPrimaryClass}>
              {pending ? "Menyimpan..." : "Simpan Perubahan"}
            </button>
            <button type="button" onClick={onClose} className={buttonSecondaryClass}>
              Batal
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
}
