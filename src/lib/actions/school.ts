"use server";

import { revalidatePath } from "next/cache";
import { requireSessionUser, canManagePortfolio } from "@/lib/auth";
import { getPortfolio, savePortfolio } from "@/lib/data";

export async function updateSchoolProfileAction(
  _prevState: { ok?: boolean; error?: string } | undefined,
  formData: FormData
): Promise<{ ok?: boolean; error?: string }> {
  const session = await requireSessionUser();
  const username = String(formData.get("username") || session.username).toLowerCase();

  if (!canManagePortfolio(session, username)) {
    return { error: "Anda tidak memiliki izin untuk mengedit portofolio ini." };
  }

  const name = String(formData.get("name") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const logoUrl = String(formData.get("logoUrl") || "").trim();

  const portfolio = await getPortfolio(username);
  if (!portfolio) return { error: "Portofolio tidak ditemukan." };

  portfolio.schoolProfile = { name, description, logoUrl };
  await savePortfolio(portfolio);

  revalidatePath(`/${username}`);
  return { ok: true };
}
