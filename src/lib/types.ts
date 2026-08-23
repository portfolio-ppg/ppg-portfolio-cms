export type UserRole = "admin" | "user";

export interface User {
  username: string; // unique, lowercase, also the public URL: /<username>
  displayName: string;
  passwordHash: string; // format: "<saltHex>:<hashHex>"
  role: UserRole;
  createdAt: string;
}

export type Role = "Mahasiswa" | "Mahasiswi";

export interface Profile {
  name: string;
  role: Role;
  program: string;
  campus: string;
  originRegion: string;
  description: string;
  tagline: string;
  visiMisi: string;
  email: string;
  avatarUrl: string;
}

export interface HometownItem {
  id: string;
  label: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
}

export interface TaskCategory {
  id: string;
  name: string;
}

export interface TaskItem {
  id: string;
  title: string;
  course: string;
  date: string; // yyyy-mm-dd
  size: string;
  fileUrl: string;
  categoryId: string; // "" = uncategorized, otherwise references TaskCategory.id
}

export type PaletteType = "solid" | "gradient" | "image";
export type TemplateId =
  | "nature"
  | "minimal"
  | "midnight"
  | "ocean"
  | "sunset"
  | "forest"
  | "lavender"
  | "charcoal";

/** Structural layout of the public portfolio page — independent of the color Template. */
export type LayoutId =
  | "classic"
  | "mirrored"
  | "centered"
  | "editorial"
  | "soft-card"
  | "bold-lines"
  | "split-banner"
  | "compact";

/** Heading/body font pairing for the public portfolio page. */
export type FontPairId =
  | "fraunces-jakarta"
  | "sora-inter"
  | "playfair-source"
  | "baloo-nunito"
  | "grotesk-plex"
  | "lora-mulish"
  | "poppins-work"
  | "cormorant-karla";

export interface Appearance {
  templateId: TemplateId;
  layoutId: LayoutId;
  fontId: FontPairId;
  paletteType: PaletteType;
  solidColor: string;
  gradientFrom: string;
  gradientTo: string;
  gradientAngle: number;
  backgroundImageUrl: string;
  backgroundColor: string;
  backgroundColorDeep: string;
  textColor: string;
  textColorSoft: string;
  /** Border/divider color used everywhere (cards, header pill, footer rule, task list, buttons). */
  borderColor: string;
  /** Card/surface background (nav pill, badges, task cards, media cards). */
  surfaceColor: string;
}

export interface MediaItem {
  id: string;
  filename: string;
  originalName: string;
  url: string;
  kind: "image" | "document";
  mimeType: string;
  size: number; // bytes
  uploadedAt: string;
}

/** Everything that makes up one user's public portfolio. */
export interface Portfolio {
  username: string;
  profile: Profile;
  hometown: HometownItem[];
  tasks: TaskItem[];
  taskCategories: TaskCategory[];
  appearance: Appearance;
  media: MediaItem[];
  createdAt: string;
  updatedAt: string;
}
