/**
 * Upload helpers with no Node-only imports, so they can be called from both
 * client components (building the blob pathname before upload) and server
 * code (classifying a stored file's kind). Keep this file free of "fs",
 * "path", "crypto" (Node) etc. — use only Web APIs available in browsers too.
 */

export const IMAGE_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
]);

export function classifyKind(mimeType: string): "image" | "document" {
  return IMAGE_MIME_TYPES.has(mimeType) ? "image" : "document";
}

/** Mirrors the on-disk/Blob layout: uploads/<username>/images|documents/<unique>-<name>.<ext> */
export function buildUploadPathname(username: string, file: { name: string; type: string }): string {
  const kind = classifyKind(file.type);
  const subdir = kind === "image" ? "images" : "documents";

  const dot = file.name.lastIndexOf(".");
  const ext = dot > -1 ? file.name.slice(dot) : "";
  const base = dot > -1 ? file.name.slice(0, dot) : file.name;
  const safeBase = base.replace(/[^a-zA-Z0-9-_]/g, "-").slice(0, 60);
  const uniquePrefix = crypto.randomUUID().replace(/-/g, "").slice(0, 8);

  return `uploads/${username}/${subdir}/${uniquePrefix}-${safeBase || "file"}${ext}`;
}
