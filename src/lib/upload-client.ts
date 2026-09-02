import { upload } from "@vercel/blob/client";
import type { MediaItem } from "./types";
import { buildUploadPathname } from "./upload-shared";
import { registerUploadedMediaAction } from "./actions/media";

// Inlined at build time from BLOB_READ_WRITE_TOKEN (see next.config.ts).
const DIRECT_UPLOAD = process.env.NEXT_PUBLIC_BLOB_UPLOAD === "1";

export interface UploadProgress {
  percentage: number;
}

export interface UploadOutcome {
  ok: boolean;
  error?: string;
  item?: MediaItem;
}

/**
 * Uploads a file and reports real progress throughout.
 *
 * When Vercel Blob is configured, the file goes straight from the browser to
 * Blob storage (bypassing this server's request-body limit), then a server
 * action records the resulting URL as a MediaItem. Otherwise (self-hosted /
 * local dev) it's proxied through /api/uploads via XHR, which still gives
 * real upload progress via `xhr.upload.onprogress`.
 */
export async function uploadFile(
  file: File,
  username: string,
  onProgress?: (progress: UploadProgress) => void
): Promise<UploadOutcome> {
  return DIRECT_UPLOAD ? uploadDirect(file, username, onProgress) : uploadViaServer(file, username, onProgress);
}

async function uploadDirect(
  file: File,
  username: string,
  onProgress?: (progress: UploadProgress) => void
): Promise<UploadOutcome> {
  try {
    const pathname = buildUploadPathname(username, file);
    const blob = await upload(pathname, file, {
      access: "public",
      handleUploadUrl: "/api/uploads/token",
      clientPayload: JSON.stringify({ username }),
      contentType: file.type || "application/octet-stream",
      onUploadProgress: (p) => onProgress?.({ percentage: p.percentage }),
    });

    const item = await registerUploadedMediaAction(username, {
      url: blob.url,
      originalName: file.name,
      mimeType: file.type || "application/octet-stream",
      size: file.size,
    });

    return { ok: true, item };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : "Gagal mengunggah file." };
  }
}

function uploadViaServer(
  file: File,
  username: string,
  onProgress?: (progress: UploadProgress) => void
): Promise<UploadOutcome> {
  return new Promise((resolve) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("username", username);

    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/uploads");
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) onProgress?.({ percentage: (e.loaded / e.total) * 100 });
    };
    xhr.onload = () => {
      let data: { item?: MediaItem; error?: string } = {};
      try {
        data = JSON.parse(xhr.responseText);
      } catch {
        // fall through to the generic error below
      }
      if (xhr.status >= 200 && xhr.status < 300 && data.item) {
        resolve({ ok: true, item: data.item });
      } else {
        resolve({ ok: false, error: data.error || "Gagal mengunggah file." });
      }
    };
    xhr.onerror = () => resolve({ ok: false, error: "Gagal mengunggah file. Periksa koneksi Anda." });
    xhr.send(formData);
  });
}
