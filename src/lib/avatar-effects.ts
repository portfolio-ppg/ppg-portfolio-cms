import type { AvatarShadowId, AvatarAnimationId } from "./types";

export interface AvatarShadowDef {
  id: AvatarShadowId;
  name: string;
  description: string;
  className: string;
}

export const AVATAR_SHADOWS: AvatarShadowDef[] = [
  {
    id: "soft",
    name: "Lembut",
    description: "Bayangan halus di bawah foto (bawaan).",
    className: "shadow-[0_20px_50px_-20px_rgba(0,0,0,0.25)]",
  },
  {
    id: "none",
    name: "Tanpa Bayangan",
    description: "Tidak ada bayangan sama sekali.",
    className: "",
  },
  {
    id: "glow",
    name: "Glow Aksen",
    description: "Cahaya lembut berwarna aksen menyebar di sekeliling foto.",
    className: "shadow-[0_0_70px_-8px_var(--color-clay)]",
  },
  {
    id: "sharp",
    name: "Tegas",
    description: "Bayangan lebih pekat dan dekat untuk kesan lebih solid.",
    className: "shadow-[0_14px_28px_-8px_rgba(0,0,0,0.5)]",
  },
  {
    id: "ring",
    name: "Ring Aksen",
    description: "Cincin tipis berwarna aksen mengelilingi foto.",
    className: "shadow-[0_20px_50px_-20px_rgba(0,0,0,0.25)] ring-4 ring-clay/40 ring-offset-4 ring-offset-cream",
  },
];

export interface AvatarAnimationDef {
  id: AvatarAnimationId;
  name: string;
  description: string;
  className: string;
}

export const AVATAR_ANIMATIONS: AvatarAnimationDef[] = [
  {
    id: "float",
    name: "Melayang",
    description: "Foto naik-turun perlahan (bawaan).",
    className: "animate-float",
  },
  {
    id: "none",
    name: "Diam",
    description: "Tidak ada animasi.",
    className: "",
  },
  {
    id: "pulse",
    name: "Berdenyut",
    description: "Foto membesar dan mengecil perlahan.",
    className: "animate-avatar-pulse",
  },
  {
    id: "bounce-in",
    name: "Muncul Memantul",
    description: "Foto memantul masuk sekali saat halaman dimuat.",
    className: "animate-avatar-bounce-in",
  },
  {
    id: "wiggle",
    name: "Goyang",
    description: "Foto bergoyang halus secara berkala.",
    className: "animate-avatar-wiggle",
  },
];

export function getAvatarShadow(id: AvatarShadowId | undefined): AvatarShadowDef {
  return AVATAR_SHADOWS.find((s) => s.id === id) ?? AVATAR_SHADOWS[0];
}

export function getAvatarAnimation(id: AvatarAnimationId | undefined): AvatarAnimationDef {
  return AVATAR_ANIMATIONS.find((a) => a.id === id) ?? AVATAR_ANIMATIONS[0];
}
