import { promises as fs } from "fs";
import path from "path";

// Local filesystem backend for /data and /public/uploads. Used when
// BLOB_READ_WRITE_TOKEN isn't set (local dev). See store-blob.ts for the
// Vercel Blob backend used in production.

const DATA_DIR = path.join(process.cwd(), "data");

async function ensureDir(dir: string) {
  await fs.mkdir(dir, { recursive: true });
}

/** file may be a relative path like "users.json" or "portfolios/elva.json". */
export async function readJson<T>(file: string, fallback: T): Promise<T> {
  const filePath = path.join(DATA_DIR, file);
  await ensureDir(path.dirname(filePath));
  try {
    const raw = await fs.readFile(filePath, "utf-8");
    return JSON.parse(raw) as T;
  } catch {
    await fs.writeFile(filePath, JSON.stringify(fallback, null, 2), "utf-8");
    return fallback;
  }
}

export async function fileExists(file: string): Promise<boolean> {
  const filePath = path.join(DATA_DIR, file);
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

// Very small write queue per file so concurrent server actions don't
// interleave writes and corrupt a JSON file (no real DB = no transactions).
const writeQueues = new Map<string, Promise<unknown>>();

export async function writeJson<T>(file: string, data: T): Promise<void> {
  const filePath = path.join(DATA_DIR, file);
  await ensureDir(path.dirname(filePath));
  const prev = writeQueues.get(file) ?? Promise.resolve();
  const next = prev
    .catch(() => {})
    .then(() => fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf-8"));
  writeQueues.set(file, next);
  await next;
}

export async function deleteJsonFile(file: string): Promise<void> {
  const filePath = path.join(DATA_DIR, file);
  try {
    await fs.unlink(filePath);
  } catch {
    // already gone; ignore
  }
}

export async function listPortfolioUsernames(): Promise<string[]> {
  const dir = path.join(DATA_DIR, "portfolios");
  await ensureDir(dir);
  const entries = await fs.readdir(dir);
  return entries
    .filter((f) => f.endsWith(".json"))
    .map((f) => f.replace(/\.json$/, ""));
}

/** Moves public/uploads/<oldUsername> to public/uploads/<newUsername> on disk, if it exists. */
export async function renameUploadsFolder(oldUsername: string, newUsername: string): Promise<void> {
  const publicUploadsDir = path.join(process.cwd(), "public", "uploads");
  const oldDir = path.join(publicUploadsDir, oldUsername);
  const newDir = path.join(publicUploadsDir, newUsername);
  try {
    await fs.access(oldDir);
  } catch {
    return; // nothing uploaded yet, nothing to move
  }
  await fs.mkdir(publicUploadsDir, { recursive: true });
  await fs.rename(oldDir, newDir);
}
