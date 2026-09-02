"use server";

import { requireSessionUser, canManagePortfolio } from "@/lib/auth";
import { deleteMediaFile, registerUploadedMedia } from "@/lib/upload";
import type { MediaItem } from "@/lib/types";

export async function deleteMediaAction(username: string, id: string) {
  const session = await requireSessionUser();
  if (!canManagePortfolio(session, username)) {
    throw new Error("Anda tidak memiliki izin untuk mengedit media ini.");
  }
  // No revalidatePath: the Media Library manages its own list optimistically
  // and no public page reads this data directly.
  await deleteMediaFile(username, id);
}

/** Persists metadata for a file the browser already uploaded directly to Blob storage. */
export async function registerUploadedMediaAction(
  username: string,
  input: { url: string; originalName: string; mimeType: string; size: number }
): Promise<MediaItem> {
  const session = await requireSessionUser();
  if (!canManagePortfolio(session, username)) {
    throw new Error("Anda tidak memiliki izin mengunggah ke portofolio ini.");
  }
  const result = await registerUploadedMedia(username, input);
  if (!result.ok || !result.item) {
    throw new Error(result.error || "Gagal menyimpan data file.");
  }
  return result.item;
}
