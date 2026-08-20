// One-time migration: uploads the current local data/*.json content into
// Vercel Blob, so production doesn't start from an empty store.
//
// Usage: put BLOB_READ_WRITE_TOKEN in your environment (e.g. in .env, then
// `node --env-file=.env scripts/migrate-to-blob.mjs`), then run:
//   node scripts/migrate-to-blob.mjs
//
// NOTE: this only migrates JSON data (users.json, portfolios/*.json).
// Files under public/uploads/ are NOT migrated — they don't exist on this
// machine (never committed to git, lost in earlier restores). Affected
// users need to re-upload their media via the admin dashboard once live.

import { readFile, readdir } from "fs/promises";
import path from "path";
import { put } from "@vercel/blob";

const token = process.env.BLOB_READ_WRITE_TOKEN;
if (!token) {
  console.error("BLOB_READ_WRITE_TOKEN is not set. Copy it from Vercel > Storage > (your Blob store) into your local .env first.");
  process.exit(1);
}

const DATA_DIR = path.join(process.cwd(), "data");

async function migrateFile(relPath) {
  const absPath = path.join(DATA_DIR, relPath);
  const content = await readFile(absPath, "utf-8");
  await put(relPath, content, {
    access: "public",
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/json",
    token,
  });
  console.log(`  uploaded ${relPath}`);
}

async function main() {
  console.log("Migrating data/*.json to Vercel Blob...\n");

  await migrateFile("users.json");

  const portfolioDir = path.join(DATA_DIR, "portfolios");
  const files = (await readdir(portfolioDir)).filter((f) => f.endsWith(".json"));
  for (const file of files) {
    await migrateFile(`portfolios/${file}`);
  }

  console.log(`\nDone. Migrated users.json + ${files.length} portfolio file(s).`);
  console.log("Reminder: uploaded media (images/PDFs) was NOT migrated - it doesn't exist locally.");
  console.log("Affected users will need to re-upload their files via the admin dashboard.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
