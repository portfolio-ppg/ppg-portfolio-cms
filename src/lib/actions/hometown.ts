"use server";

import { revalidatePath } from "next/cache";
import { requireSessionUser, canManagePortfolio } from "@/lib/auth";
import { getPortfolio, savePortfolio, newId } from "@/lib/data";
import type { HometownItem } from "@/lib/types";

function fromForm(formData: FormData): Omit<HometownItem, "id"> {
  return {
    label: String(formData.get("label") || "").trim(),
    title: String(formData.get("title") || "").trim(),
    description: String(formData.get("description") || "").trim(),
    image: String(formData.get("image") || "").trim(),
    imageAlt: String(formData.get("imageAlt") || "").trim(),
  };
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

export async function createHometownItemAction(username: string, formData: FormData) {
  const portfolio = await loadAuthorizedPortfolio(username);
  const data = fromForm(formData);
  if (!data.title) throw new Error("Judul wajib diisi.");
  portfolio.hometown.push({ id: newId(), ...data });
  await savePortfolio(portfolio);
  revalidatePath(`/${username}`);
}

export async function updateHometownItemAction(username: string, id: string, formData: FormData) {
  const portfolio = await loadAuthorizedPortfolio(username);
  const idx = portfolio.hometown.findIndex((i) => i.id === id);
  if (idx === -1) throw new Error("Item tidak ditemukan.");
  portfolio.hometown[idx] = { id, ...fromForm(formData) };
  await savePortfolio(portfolio);
  revalidatePath(`/${username}`);
}

export async function deleteHometownItemAction(username: string, id: string) {
  const portfolio = await loadAuthorizedPortfolio(username);
  portfolio.hometown = portfolio.hometown.filter((i) => i.id !== id);
  await savePortfolio(portfolio);
  revalidatePath(`/${username}`);
}
