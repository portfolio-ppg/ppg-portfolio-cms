"use server";

import { requireAdmin } from "@/lib/auth";
import { createUser, deleteUser, resetUserPassword, renameUser, updateUserDisplayName, getUsers } from "@/lib/data";
import { validateUsername } from "@/lib/slug";
import type { UserRole } from "@/lib/types";

export async function createUserAction(
  _prevState: { error?: string; ok?: boolean } | undefined,
  formData: FormData
): Promise<{ error?: string; ok?: boolean }> {
  await requireAdmin();

  const rawUsername = String(formData.get("username") || "");
  const displayName = String(formData.get("displayName") || "").trim();
  const password = String(formData.get("password") || "");
  const role = (String(formData.get("role") || "user") as UserRole);

  const check = validateUsername(rawUsername);
  if (!check.ok) return { error: check.error };
  if (password.length < 6) return { error: "Kata sandi minimal 6 karakter." };
  if (role !== "admin" && role !== "user") return { error: "Role tidak valid." };

  try {
    await createUser({ username: check.value, displayName, password, role });
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Gagal membuat pengguna." };
  }

  return { ok: true };
}

export async function deleteUserAction(username: string) {
  const admin = await requireAdmin();
  if (admin.username === username) {
    throw new Error("Tidak bisa menghapus akun yang sedang digunakan untuk login.");
  }
  await deleteUser(username);
}

export async function resetPasswordAction(
  _prevState: { error?: string; ok?: boolean } | undefined,
  formData: FormData
): Promise<{ error?: string; ok?: boolean }> {
  await requireAdmin();
  const username = String(formData.get("username") || "").trim().toLowerCase();
  const password = String(formData.get("password") || "");

  if (password.length < 6) return { error: "Kata sandi minimal 6 karakter." };

  try {
    await resetUserPassword(username, password);
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Gagal mereset kata sandi." };
  }

  return { ok: true };
}

export async function listUsersForAdmin() {
  await requireAdmin();
  return getUsers();
}

export async function renameUserAction(
  _prevState: { error?: string; ok?: boolean } | undefined,
  formData: FormData
): Promise<{ error?: string; ok?: boolean }> {
  await requireAdmin();

  const oldUsername = String(formData.get("oldUsername") || "").toLowerCase();
  const newUsernameRaw = String(formData.get("newUsername") || "");
  const displayName = String(formData.get("displayName") || "").trim();

  const check = validateUsername(newUsernameRaw);
  if (!check.ok) return { error: check.error };

  try {
    if (check.value !== oldUsername) {
      await renameUser(oldUsername, check.value);
    }
    if (displayName) {
      await updateUserDisplayName(check.value, displayName);
    }
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Gagal mengubah username." };
  }

  return { ok: true };
}
