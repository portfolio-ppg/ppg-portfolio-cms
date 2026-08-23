"use server";

import { revalidatePath } from "next/cache";
import { requireSessionUser, canManagePortfolio } from "@/lib/auth";
import { getPortfolio, savePortfolio } from "@/lib/data";
import type { Role } from "@/lib/types";

export async function updateProfileAction(
  _prevState: { ok?: boolean; error?: string } | undefined,
  formData: FormData
): Promise<{ ok?: boolean; error?: string }> {
  const session = await requireSessionUser();
  const username = String(formData.get("username") || session.username).toLowerCase();

  if (!canManagePortfolio(session, username)) {
    return { error: "Anda tidak memiliki izin untuk mengedit portofolio ini." };
  }

  const name = String(formData.get("name") || "").trim();
  const role = String(formData.get("role") || "Mahasiswi") as Role;
  const program = String(formData.get("program") || "").trim();
  const campus = String(formData.get("campus") || "").trim();
  const originRegion = String(formData.get("originRegion") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const tagline = String(formData.get("tagline") || "").trim();
  const visiMisi = String(formData.get("visiMisi") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const avatarUrl = String(formData.get("avatarUrl") || "").trim();

  if (!name) return { error: "Nama wajib diisi." };
  if (role !== "Mahasiswa" && role !== "Mahasiswi") {
    return { error: "Role tidak valid." };
  }

  const portfolio = await getPortfolio(username);
  if (!portfolio) return { error: "Portofolio tidak ditemukan." };

  portfolio.profile = {
    ...portfolio.profile,
    name,
    role,
    program,
    campus,
    originRegion,
    description,
    tagline,
    visiMisi,
    email,
    avatarUrl,
  };
  await savePortfolio(portfolio);

  revalidatePath(`/${username}`);
  return { ok: true };
}
