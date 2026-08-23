"use server";

import { revalidatePath } from "next/cache";
import { requireSessionUser, canManagePortfolio } from "@/lib/auth";
import { getPortfolio, savePortfolio, newId } from "@/lib/data";
import type { TaskItem } from "@/lib/types";

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

async function loadAuthorizedPortfolio(username: string) {
  const session = await requireSessionUser();
  if (!canManagePortfolio(session, username)) {
    throw new Error("Anda tidak memiliki izin untuk mengedit portofolio ini.");
  }
  const portfolio = await getPortfolio(username);
  if (!portfolio) throw new Error("Portofolio tidak ditemukan.");
  return portfolio;
}

export async function createTaskAction(username: string, formData: FormData) {
  const portfolio = await loadAuthorizedPortfolio(username);

  const title = String(formData.get("title") || "").trim();
  const course = String(formData.get("course") || "").trim();
  const date = String(formData.get("date") || "").trim();
  const categoryId = String(formData.get("categoryId") || "").trim();
  const fileUrl = String(formData.get("fileUrl") || "").trim();
  const fileSize = Number(formData.get("fileSize") || 0);

  if (!title) throw new Error("Judul tugas wajib diisi.");
  if (!fileUrl) throw new Error("Silakan pilih file dari Media Library terlebih dahulu.");

  const item: TaskItem = {
    id: newId(),
    title,
    course,
    date,
    categoryId,
    fileUrl,
    size: fileSize ? formatSize(fileSize) : "-",
  };
  portfolio.tasks.unshift(item);
  await savePortfolio(portfolio);

  // Not revalidating /admin/tasks: the admin UI already updates itself
  // optimistically, and a background refresh here only adds perceived lag.
  revalidatePath(`/${username}/tugas`);
}

export async function deleteTaskAction(username: string, id: string) {
  const portfolio = await loadAuthorizedPortfolio(username);
  portfolio.tasks = portfolio.tasks.filter((i) => i.id !== id);
  await savePortfolio(portfolio);
  revalidatePath(`/${username}/tugas`);
}
