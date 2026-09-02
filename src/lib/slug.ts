export function slugify(input: string): string {
  return input
    .toString()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "") // strip accents
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "") || "pengguna-baru";
}

/**
 * Usernames double as public URLs (/<username>), so they must never collide
 * with a route the app already owns.
 */
export const RESERVED_USERNAMES = [
  "admin",
  "api",
  "login",
  "logout",
  "uploads",
  "pdf",
  "profile",
  "tugas",
  "_next",
  "favicon.ico",
  "icon.svg",
  "public",
  "assets",
  "static",
];

export interface UsernameValidation {
  ok: boolean;
  error?: string;
  value: string;
}

export function validateUsername(raw: string): UsernameValidation {
  const value = slugify(raw);
  if (!raw || !raw.trim()) {
    return { ok: false, error: "Username wajib diisi.", value };
  }
  if (value.length < 3) {
    return { ok: false, error: "Username minimal 3 karakter (huruf/angka/tanda hubung).", value };
  }
  if (value.length > 100) {
    return { ok: false, error: "Username maksimal 100 karakter.", value };
  }
  if (RESERVED_USERNAMES.includes(value)) {
    return { ok: false, error: `Username "${value}" tidak boleh dipakai (kata baku sistem).`, value };
  }
  return { ok: true, value };
}
