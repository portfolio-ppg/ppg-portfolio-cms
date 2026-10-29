export type UserRole = "admin" | "user";

export interface User {
  username: string; // unique, lowercase, also the public URL: /<username>
  displayName: string;
  passwordHash: string; // format: "<saltHex>:<hashHex>"
  role: UserRole;
  createdAt: string;
}

export type Role = "Mahasiswa" | "Mahasiswi";

/** A CMS-editable text section on the public page. `body` is sanitized HTML (or legacy plain text). */
export interface ContentSection {
  label: string; // small uppercase eyebrow above the heading
  title: string;
  body: string;
}

export interface Profile {
  name: string;
  role: Role;
  program: string;
  campus: string;
  originRegion: string;
  description: string;
  tagline: string;
  /** Eyebrow + heading for the visiMisi section (body = visiMisi). */
  visiMisiLabel: string;
  visiMisiTitle: string;
  visiMisi: string;
  /** Extra sections — each only renders on the public page once its body is non-empty. */
  inspirasi: ContentSection;
  visiPribadi: ContentSection;
  komitmen: ContentSection;
  email: string;
  avatarUrl: string;
  /** Small logos shown side by side under the Program/Kampus facts in the hero. */
  programLogoUrl: string;
  campusLogoUrl: string;
}

export interface SchoolProfile {
  name: string;
  description: string;
  logoUrl: string;
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
  | "charcoal"
  | "mocha";

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
  | "cormorant-karla"
  | "playfair-jakarta";

/** Box-shadow style applied to the profile photo on the public page. */
export type AvatarShadowId = "soft" | "none" | "glow" | "sharp" | "ring";

/** Animation applied to the profile photo on the public page. */
export type AvatarAnimationId = "float" | "none" | "pulse" | "bounce-in" | "wiggle";

export interface Appearance {
  templateId: TemplateId;
  layoutId: LayoutId;
  fontId: FontPairId;
  avatarShadow: AvatarShadowId;
  avatarAnimation: AvatarAnimationId;
  /** Manual marquee text (one item per entry). Empty = auto-derive from hometown/originRegion. */
  marqueeTop: string[];
  /** Manual marquee text for the closing/reverse-scrolling marquee. Empty = auto-derive. */
  marqueeBottom: string[];
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
  schoolProfile: SchoolProfile;
  hometown: HometownItem[];
  tasks: TaskItem[];
  taskCategories: TaskCategory[];
  appearance: Appearance;
  media: MediaItem[];
  createdAt: string;
  updatedAt: string;
}
