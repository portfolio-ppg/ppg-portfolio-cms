import { get, put, del, list, head, rename, BlobNotFoundError } from "@vercel/blob";

// Vercel Blob backend for /data and /public/uploads. Used in production
// (when BLOB_READ_WRITE_TOKEN is set) because Vercel's serverless
// filesystem is read-only/ephemeral — see store-fs.ts for local dev.

const token = () => process.env.BLOB_READ_WRITE_TOKEN;

/** file may be a relative path like "users.json" or "portfolios/elva.json". */
export async function readJson<T>(file: string, fallback: T): Promise<T> {
  const result = await get(file, { access: "public", token: token() });
  if (!result || !result.stream) {
    await writeJson(file, fallback);
    return fallback;
  }
  const text = await new Response(result.stream).text();
  return JSON.parse(text) as T;
}

export async function fileExists(file: string): Promise<boolean> {
  try {
    await head(file, { token: token() });
    return true;
  } catch (err) {
    if (err instanceof BlobNotFoundError) return false;
    throw err;
  }
}

export async function writeJson<T>(file: string, data: T): Promise<void> {
  await put(file, JSON.stringify(data, null, 2), {
    access: "public",
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/json",
    token: token(),
  });
}

export async function deleteJsonFile(file: string): Promise<void> {
  await del(file, { token: token() });
}

export async function listPortfolioUsernames(): Promise<string[]> {
  const { blobs } = await list({ prefix: "portfolios/", token: token() });
  return blobs
    .filter((b) => b.pathname.endsWith(".json"))
    .map((b) => b.pathname.replace(/^portfolios\//, "").replace(/\.json$/, ""));
}

/** Renames every blob under uploads/<oldUsername>/ to uploads/<newUsername>/. */
export async function renameUploadsFolder(oldUsername: string, newUsername: string): Promise<void> {
  const oldPrefix = `uploads/${oldUsername}/`;
  const newPrefix = `uploads/${newUsername}/`;
  const { blobs } = await list({ prefix: oldPrefix, token: token() });
  for (const blob of blobs) {
    const newPathname = newPrefix + blob.pathname.slice(oldPrefix.length);
    await rename(blob.pathname, newPathname, {
      access: "public",
      addRandomSuffix: false,
      allowOverwrite: true,
      token: token(),
    });
  }
}
