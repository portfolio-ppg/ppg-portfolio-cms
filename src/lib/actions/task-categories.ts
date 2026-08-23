"use server";

import { revalidatePath } from "next/cache";
import { requireSessionUser, canManagePortfolio } from "@/lib/auth";
import { getPortfolio, savePortfolio, newId } from "@/lib/data";

async function loadAuthorizedPortfolio(username: string) {
  const session = await requireSessionUser();
  if (!canManagePortfolio(session, username)) {
    throw new Error("Anda tidak memiliki izin untuk mengedit portofolio ini.");
  }
  const portfolio = await getPortfolio(username);
  if (!portfolio) throw new Error("Portofolio tidak ditemukan.");
  return portfolio;
}

export async function createTaskCategoryAction(username: string, formData: FormData) {
  const portfolio = await loadAuthorizedPortfolio(username);
  const name = String(formData.get("name") || "").trim();
  if (!name) throw new Error("Nama kategori wajib diisi.");

  portfolio.taskCategories.push({ id: newId(), name });
  await savePortfolio(portfolio);

  revalidatePath(`/${username}/tugas`);
}

export async function updateTaskCategoryAction(username: string, id: string, formData: FormData) {
  const portfolio = await loadAuthorizedPortfolio(username);
  const name = String(formData.get("name") || "").trim();
  if (!name) throw new Error("Nama kategori wajib diisi.");

  const idx = portfolio.taskCategories.findIndex((c) => c.id === id);
  if (idx === -1) throw new Error("Kategori tidak ditemukan.");
  portfolio.taskCategories[idx] = { id, name };
  await savePortfolio(portfolio);

  revalidatePath(`/${username}/tugas`);
}

export async function deleteTaskCategoryAction(username: string, id: string) {
  const portfolio = await loadAuthorizedPortfolio(username);
  portfolio.taskCategories = portfolio.taskCategories.filter((c) => c.id !== id);
  portfolio.tasks = portfolio.tasks.map((t) =>
    t.categoryId === id ? { ...t, categoryId: "" } : t
  );
  await savePortfolio(portfolio);

  revalidatePath(`/${username}/tugas`);
}
