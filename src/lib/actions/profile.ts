"use server";

import { revalidatePath } from "next/cache";
import { requireSessionUser, canManagePortfolio } from "@/lib/auth";
import { getPortfolio, savePortfolio } from "@/lib/data";
import { sanitizeRichText } from "@/lib/rich-text";
import type { ContentSection, Role } from "@/lib/types";

function readSection(formData: FormData, key: string): ContentSection {
  return {
    label: String(formData.get(`${key}Label`) || "").trim(),
    title: String(formData.get(`${key}Title`) || "").trim(),
    body: sanitizeRichText(String(formData.get(`${key}Body`) || "")),
  };
}

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
  const description = sanitizeRichText(String(formData.get("description") || ""));
  const tagline = String(formData.get("tagline") || "").trim();
  const visiMisiLabel = String(formData.get("visiMisiLabel") || "").trim();
  const visiMisiTitle = String(formData.get("visiMisiTitle") || "").trim();
  const visiMisi = sanitizeRichText(String(formData.get("visiMisi") || ""));
  const email = String(formData.get("email") || "").trim();
  const avatarUrl = String(formData.get("avatarUrl") || "").trim();
  const programLogoUrl = String(formData.get("programLogoUrl") || "").trim();
  const campusLogoUrl = String(formData.get("campusLogoUrl") || "").trim();

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
    visiMisiLabel,
    visiMisiTitle,
    visiMisi,
    inspirasi: readSection(formData, "inspirasi"),
    visiPribadi: readSection(formData, "visiPribadi"),
    komitmen: readSection(formData, "komitmen"),
    email,
    avatarUrl,
    programLogoUrl,
    campusLogoUrl,
  };
  await savePortfolio(portfolio);

  revalidatePath(`/${username}`);
  return { ok: true };
}
