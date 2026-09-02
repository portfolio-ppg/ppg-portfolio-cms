import { promises as fs } from "fs";
import path from "path";
import crypto from "crypto";
import { put, del } from "@vercel/blob";
import type { MediaItem } from "./types";
import { getPortfolio, savePortfolio } from "./data";
import { classifyKind } from "./upload-shared";

const blobToken = () => process.env.BLOB_READ_WRITE_TOKEN;

// Practical ceiling for a single upload. Configure via MAX_UPLOAD_MB in .env.
// When BLOB_READ_WRITE_TOKEN is set, uploads go straight from the browser to
// Vercel Blob (see /api/uploads/token + src/lib/upload-client.ts), so this
// limit isn't constrained by a serverless function's request-body cap.
// Without it (self-hosted / local dev), files are written straight to disk
// via /api/uploads, which has no such cap either — 256MB is safe either way.
export const MAX_UPLOAD_MB = Number(process.env.MAX_UPLOAD_MB || 256);

export interface UploadResult {
  ok: boolean;
  error?: string;
  item?: MediaItem;
}

/** Files are stored per-user under public/uploads/<username>/images|documents/ */
export async function saveUploadedFile(file: File, username: string): Promise<UploadResult> {
  if (!file || file.size === 0) {
    return { ok: false, error: "File kosong atau tidak valid." };
  }

  const maxBytes = MAX_UPLOAD_MB * 1024 * 1024;
  if (file.size > maxBytes) {
    return {
      ok: false,
      error: `File terlalu besar. Maksimal ${MAX_UPLOAD_MB} MB.`,
    };
  }

  const portfolio = await getPortfolio(username);
  if (!portfolio) {
    return { ok: false, error: "Pengguna tidak ditemukan." };
  }

  const kind: MediaItem["kind"] = classifyKind(file.type);
  const subdir = kind === "image" ? "images" : "documents";

  const ext = path.extname(file.name) || "";
  const safeBase = path
    .basename(file.name, ext)
    .replace(/[^a-zA-Z0-9-_]/g, "-")
    .slice(0, 60);
  const uniquePrefix = crypto.randomBytes(4).toString("hex");
  const filename = `${uniquePrefix}-${safeBase || "file"}${ext}`;

  const buffer = Buffer.from(await file.arrayBuffer());
  let url: string;

  if (blobToken()) {
    const blob = await put(`uploads/${username}/${subdir}/${filename}`, buffer, {
      access: "public",
      addRandomSuffix: false,
      allowOverwrite: true,
      contentType: file.type || "application/octet-stream",
      token: blobToken(),
    });
    url = blob.url;
  } else {
    const dir = path.join(process.cwd(), "public", "uploads", username, subdir);
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(path.join(dir, filename), buffer);
    url = `/uploads/${username}/${subdir}/${filename}`;
  }

  const item: MediaItem = {
    id: crypto.randomUUID(),
    filename,
    originalName: file.name,
    url,
    kind,
    mimeType: file.type || "application/octet-stream",
    size: file.size,
    uploadedAt: new Date().toISOString(),
  };

  portfolio.media.unshift(item);
  await savePortfolio(portfolio);

  return { ok: true, item };
}

/**
 * Records a MediaItem for a file that was already uploaded directly from the
 * browser straight to Blob storage (see /api/uploads/token +
 * src/lib/upload-client.ts) — this only persists the metadata, it never
 * touches the file itself.
 */
export async function registerUploadedMedia(
  username: string,
  input: { url: string; originalName: string; mimeType: string; size: number }
): Promise<UploadResult> {
  const maxBytes = MAX_UPLOAD_MB * 1024 * 1024;
  if (input.size > maxBytes) {
    return { ok: false, error: `File terlalu besar. Maksimal ${MAX_UPLOAD_MB} MB.` };
  }

  const portfolio = await getPortfolio(username);
  if (!portfolio) {
    return { ok: false, error: "Pengguna tidak ditemukan." };
  }

  const item: MediaItem = {
    id: crypto.randomUUID(),
    filename: input.url.split("/").pop() || input.originalName,
    originalName: input.originalName,
    url: input.url,
    kind: classifyKind(input.mimeType),
    mimeType: input.mimeType,
    size: input.size,
    uploadedAt: new Date().toISOString(),
  };

  portfolio.media.unshift(item);
  await savePortfolio(portfolio);

  return { ok: true, item };
}

export async function deleteMediaFile(username: string, id: string): Promise<void> {
  const portfolio = await getPortfolio(username);
  if (!portfolio) return;
  const item = portfolio.media.find((m) => m.id === id);
  if (!item) return;
  if (blobToken() && /^https?:\/\//.test(item.url)) {
    await del(item.url, { token: blobToken() });
  } else {
    const filePath = path.join(process.cwd(), "public", item.url.replace(/^\//, ""));
    try {
      await fs.unlink(filePath);
    } catch {
      // file may already be gone; ignore
    }
  }
  portfolio.media = portfolio.media.filter((m) => m.id !== id);
  await savePortfolio(portfolio);
}
