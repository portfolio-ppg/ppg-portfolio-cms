"use server";

import { requireSessionUser, canManagePortfolio } from "@/lib/auth";
import { deleteMediaFile } from "@/lib/upload";

export async function deleteMediaAction(username: string, id: string) {
  const session = await requireSessionUser();
  if (!canManagePortfolio(session, username)) {
    throw new Error("Anda tidak memiliki izin untuk mengedit media ini.");
  }
  // No revalidatePath: the Media Library manages its own list optimistically
  // and no public page reads this data directly.
  await deleteMediaFile(username, id);
}
