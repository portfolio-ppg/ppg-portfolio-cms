"use server";

import { revalidatePath } from "next/cache";
import { requireSessionUser, canManagePortfolio } from "@/lib/auth";
import { getPortfolio, savePortfolio } from "@/lib/data";
import { getLayout } from "@/lib/layouts";
import { getFontPair } from "@/lib/fonts";
import type { Appearance, PaletteType, TemplateId, LayoutId, FontPairId } from "@/lib/types";

export async function updateAppearanceAction(
  _prevState: { ok?: boolean; error?: string } | undefined,
  formData: FormData
): Promise<{ ok?: boolean; error?: string }> {
  const session = await requireSessionUser();
  const username = String(formData.get("username") || session.username).toLowerCase();

  if (!canManagePortfolio(session, username)) {
    return { error: "Anda tidak memiliki izin untuk mengedit portofolio ini." };
  }

  const appearance: Appearance = {
    templateId: String(formData.get("templateId") || "nature") as TemplateId,
    layoutId: getLayout(String(formData.get("layoutId") || "") as LayoutId).id,
    fontId: getFontPair(String(formData.get("fontId") || "") as FontPairId).id,
    paletteType: String(formData.get("paletteType") || "solid") as PaletteType,
    solidColor: String(formData.get("solidColor") || "#eda4a3"),
    gradientFrom: String(formData.get("gradientFrom") || "#eda4a3"),
    gradientTo: String(formData.get("gradientTo") || "#f5c8c7"),
    gradientAngle: Number(formData.get("gradientAngle") || 135),
    backgroundImageUrl: String(formData.get("backgroundImageUrl") || ""),
    backgroundColor: String(formData.get("backgroundColor") || "#fdf6f3"),
    backgroundColorDeep: String(formData.get("backgroundColorDeep") || "#fdecec"),
    textColor: String(formData.get("textColor") || "#8a5c54"),
    textColorSoft: String(formData.get("textColorSoft") || "#a67f77"),
    borderColor: String(formData.get("borderColor") || "#f3d7da"),
    surfaceColor: String(formData.get("surfaceColor") || "#ffffff"),
  };

  const portfolio = await getPortfolio(username);
  if (!portfolio) return { error: "Portofolio tidak ditemukan." };

  portfolio.appearance = appearance;
  await savePortfolio(portfolio);

  revalidatePath(`/${username}`, "layout");
  revalidatePath("/admin/appearance");
  return { ok: true };
}
