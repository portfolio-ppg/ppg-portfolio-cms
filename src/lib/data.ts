import { readJson, writeJson, deleteJsonFile, listPortfolioUsernames, newId, renameUploadsFolder } from "./store";
import { hashPassword } from "./auth";
import type { User, Portfolio, Profile, Appearance, TaskCategory } from "./types";
import { TEMPLATE_DEFAULTS } from "./templates";

// ---------------------------------------------------------------------------
// Users
// ---------------------------------------------------------------------------

let seeded = false;

/**
 * Ensures at least one admin account exists, created from ADMIN_USERNAME /
 * ADMIN_PASSWORD env vars (falls back to admin/admin123 for local dev).
 * Runs lazily the first time users are read, so a fresh `data/` folder
 * bootstraps itself without a separate setup script.
 */
async function ensureSeedAdmin(): Promise<User[]> {
  const users = await readJson<User[]>("users.json", []);
  if (users.length > 0 || seeded) return users;
  seeded = true;

  const username = (process.env.ADMIN_USERNAME || "admin").toLowerCase().trim();
  const password = process.env.ADMIN_PASSWORD || "admin123";

  const admin: User = {
    username,
    displayName: "Administrator",
    passwordHash: hashPassword(password),
    role: "admin",
    createdAt: new Date().toISOString(),
  };
  const withAdmin = [admin];
  await writeJson("users.json", withAdmin);
  return withAdmin;
}

export async function getUsers(): Promise<User[]> {
  return ensureSeedAdmin();
}

export async function getUserByUsername(username: string): Promise<User | undefined> {
  const users = await getUsers();
  return users.find((u) => u.username === username.toLowerCase());
}

export async function saveUsers(users: User[]): Promise<void> {
  await writeJson("users.json", users);
}

export async function createUser(input: {
  username: string;
  displayName: string;
  password: string;
  role: User["role"];
}): Promise<User> {
  const users = await getUsers();
  const username = input.username.toLowerCase();
  if (users.some((u) => u.username === username)) {
    throw new Error(`Username "${username}" sudah dipakai.`);
  }
  const user: User = {
    username,
    displayName: input.displayName || username,
    passwordHash: hashPassword(input.password),
    role: input.role,
    createdAt: new Date().toISOString(),
  };
  users.push(user);
  await saveUsers(users);
  await createPortfolioForUser(username, user.displayName);
  return user;
}

export async function deleteUser(username: string): Promise<void> {
  const users = await getUsers();
  const remainingAdmins = users.filter((u) => u.role === "admin" && u.username !== username);
  const target = users.find((u) => u.username === username);
  if (target?.role === "admin" && remainingAdmins.length === 0) {
    throw new Error("Tidak bisa menghapus admin terakhir.");
  }
  await saveUsers(users.filter((u) => u.username !== username));
  await deleteJsonFile(`portfolios/${username}.json`);
}

export async function resetUserPassword(username: string, newPassword: string): Promise<void> {
  const users = await getUsers();
  const idx = users.findIndex((u) => u.username === username);
  if (idx === -1) throw new Error("Pengguna tidak ditemukan.");
  users[idx] = { ...users[idx], passwordHash: hashPassword(newPassword) };
  await saveUsers(users);
}

export async function updateUserDisplayName(username: string, displayName: string): Promise<void> {
  const users = await getUsers();
  const idx = users.findIndex((u) => u.username === username.toLowerCase());
  if (idx === -1) throw new Error("Pengguna tidak ditemukan.");
  users[idx] = { ...users[idx], displayName };
  await saveUsers(users);
}

/** Replaces every "/uploads/<oldUsername>/..." reference inside a portfolio with the new username. */
function rewritePortfolioUsername(portfolio: Portfolio, oldUsername: string, newUsername: string): Portfolio {
  const oldSeg = `/uploads/${oldUsername}/`;
  const newSeg = `/uploads/${newUsername}/`;
  const swap = (url: string) => (url.includes(oldSeg) ? url.split(oldSeg).join(newSeg) : url);

  return {
    ...portfolio,
    username: newUsername,
    profile: { ...portfolio.profile, avatarUrl: swap(portfolio.profile.avatarUrl) },
    hometown: portfolio.hometown.map((h) => ({ ...h, image: swap(h.image) })),
    tasks: portfolio.tasks.map((t) => ({ ...t, fileUrl: swap(t.fileUrl) })),
    appearance: { ...portfolio.appearance, backgroundImageUrl: swap(portfolio.appearance.backgroundImageUrl) },
    media: portfolio.media.map((m) => ({ ...m, url: swap(m.url) })),
  };
}

/**
 * Renames a user's username (and therefore their public URL /<username>).
 * Moves the portfolio JSON file, rewrites every uploaded-file URL inside it,
 * and moves the on-disk uploads folder to match.
 */
export async function renameUser(oldUsername: string, newUsernameRaw: string): Promise<void> {
  const oldKey = oldUsername.toLowerCase();
  const newKey = newUsernameRaw.toLowerCase();
  if (oldKey === newKey) return;

  const users = await getUsers();
  if (users.some((u) => u.username === newKey)) {
    throw new Error(`Username "${newKey}" sudah dipakai.`);
  }
  const idx = users.findIndex((u) => u.username === oldKey);
  if (idx === -1) throw new Error("Pengguna tidak ditemukan.");

  users[idx] = { ...users[idx], username: newKey };
  await saveUsers(users);

  const portfolio = await readJson<Portfolio | null>(`portfolios/${oldKey}.json`, null);
  if (portfolio) {
    const updated = rewritePortfolioUsername(portfolio, oldKey, newKey);
    await writeJson(`portfolios/${newKey}.json`, updated);
    await deleteJsonFile(`portfolios/${oldKey}.json`);
  }

  await renameUploadsFolder(oldKey, newKey);
}

// ---------------------------------------------------------------------------
// Portfolios (profile + hometown + tasks + appearance + media, per user)
// ---------------------------------------------------------------------------

function defaultProfile(displayName: string): Profile {
  return {
    name: displayName || "Nama Lengkap",
    role: "Mahasiswi",
    program: "PPG Prajabatan",
    campus: "Nama Kampus",
    originRegion: "Asal Daerah",
    description: "Tuliskan deskripsi profil Anda di sini.",
    tagline: "Tuliskan tagline singkat di sini.",
    visiMisi: "Tuliskan visi dan misi Anda di sini.",
    email: "",
    avatarUrl: "",
  };
}

function defaultTaskCategories(): TaskCategory[] {
  return [
    { id: newId(), name: "Refleksi Pengalaman Belajar Semester 1" },
    { id: newId(), name: "Refleksi Pengalaman Belajar Semester 2" },
    { id: newId(), name: "Refleksi PPG Secara Keseluruhan" },
    { id: newId(), name: "Karya Inovasi Pendidikan" },
  ];
}

function defaultAppearance(): Appearance {
  const d = TEMPLATE_DEFAULTS.nature;
  return {
    templateId: "nature",
    paletteType: "solid",
    solidColor: d.solidColor,
    gradientFrom: d.gradientFrom,
    gradientTo: d.gradientTo,
    gradientAngle: 135,
    backgroundImageUrl: "",
    backgroundColor: d.backgroundColor,
    backgroundColorDeep: d.backgroundColorDeep,
    textColor: d.textColor,
    textColorSoft: d.textColorSoft,
    borderColor: d.borderColor,
    surfaceColor: d.surfaceColor,
  };
}

function defaultPortfolio(username: string, displayName: string): Portfolio {
  const now = new Date().toISOString();
  return {
    username,
    profile: defaultProfile(displayName),
    hometown: [],
    tasks: [],
    taskCategories: defaultTaskCategories(),
    appearance: defaultAppearance(),
    media: [],
    createdAt: now,
    updatedAt: now,
  };
}

export async function createPortfolioForUser(username: string, displayName: string): Promise<Portfolio> {
  const portfolio = defaultPortfolio(username, displayName);
  await writeJson(`portfolios/${username}.json`, portfolio);
  return portfolio;
}

export async function getPortfolio(username: string): Promise<Portfolio | null> {
  const key = username.toLowerCase();
  const user = await getUserByUsername(key);
  if (!user) return null;
  return readJson<Portfolio>(`portfolios/${key}.json`, defaultPortfolio(key, user.displayName));
}

export async function savePortfolio(portfolio: Portfolio): Promise<void> {
  const updated: Portfolio = { ...portfolio, updatedAt: new Date().toISOString() };
  await writeJson(`portfolios/${portfolio.username}.json`, updated);
}

export async function listAllPortfolioUsernames(): Promise<string[]> {
  return listPortfolioUsernames();
}

export { newId };
