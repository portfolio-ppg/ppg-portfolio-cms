import { put, del, list, head, rename, BlobNotFoundError } from "@vercel/blob";

// Vercel Blob backend for /data and /public/uploads. Used in production
// (when BLOB_READ_WRITE_TOKEN is set) because Vercel's serverless
// filesystem is read-only/ephemeral — see store-fs.ts for local dev.

const token = () => process.env.BLOB_READ_WRITE_TOKEN;

/**
 * JSON app data (users.json, portfolios/*.json) is written to the SAME
 * pathname over and over as the admin edits things. Fetching a blob's
 * canonical URL can return a CDN-cached stale copy for a while after an
 * overwrite — the "action says success but the change doesn't show up until
 * a refresh (or several)" symptom.
 *
 * NOTE: an earlier version of this fix switched these to `access: "private"`
 * plus `useCache: false` (Vercel's documented way to bypass the CDN for a
 * `get()` read) — but public and private blobs live under different
 * domains (`constructBlobUrl` in the SDK: `${storeId}.${access}.blob...`),
 * so requesting an already-`public` blob as `private` 400s outright instead
 * of just being stale. All existing data here was written `public`, so it
 * has to stay `public` to be reachable at all.
 *
 * Instead: `head()` hits the control-plane API directly (not the CDN) so it
 * always returns the current URL/metadata, and appending a unique query
 * param to that URL before fetching forces a cache-key miss — a plain HTTP
 * cache can't serve a stale response for a URL it's never seen before.
 */
export async function readJson<T>(file: string, fallback: T): Promise<T> {
  let meta;
  try {
    meta = await head(file, { token: token() });
  } catch (err) {
    if (err instanceof BlobNotFoundError) {
      await writeJson(file, fallback);
      return fallback;
    }
    throw err;
  }

  const bustUrl = `${meta.url}${meta.url.includes("?") ? "&" : "?"}v=${Date.now()}-${Math.random().toString(36).slice(2)}`;
  const response = await fetch(bustUrl, { cache: "no-store" });
  if (!response.ok) {
    await writeJson(file, fallback);
    return fallback;
  }
  return JSON.parse(await response.text()) as T;
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
