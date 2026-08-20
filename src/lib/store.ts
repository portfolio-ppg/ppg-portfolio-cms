import * as fsStore from "./store-fs";
import * as blobStore from "./store-blob";

// BLOB_READ_WRITE_TOKEN is only set on Vercel once a Blob store is connected
// to the project. Locally it's unset, so we keep using the filesystem —
// no extra setup needed for `npm run dev`.
const impl = process.env.BLOB_READ_WRITE_TOKEN ? blobStore : fsStore;

export const readJson = impl.readJson;
export const writeJson = impl.writeJson;
export const deleteJsonFile = impl.deleteJsonFile;
export const fileExists = impl.fileExists;
export const listPortfolioUsernames = impl.listPortfolioUsernames;
export const renameUploadsFolder = impl.renameUploadsFolder;

export function newId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}
