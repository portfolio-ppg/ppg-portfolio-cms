import type { FontPairId } from "./types";

export interface FontPairDef {
  id: FontPairId;
  name: string;
  description: string;
  /** CSS variable (loaded via next/font in the root layout) providing the heading font. */
  displayVar: string;
  /** CSS variable providing the body font. */
  bodyVar: string;
  previewDisplay: string;
  previewBody: string;
}

export const FONT_PAIRS: FontPairDef[] = [
  {
    id: "fraunces-jakarta",
    name: "Klasik",
    description: "Serif hangat & sans modern — gaya bawaan e-portofolio.",
    displayVar: "--font-fraunces",
    bodyVar: "--font-jakarta",
    previewDisplay: "Fraunces",
    previewBody: "Plus Jakarta Sans",
  },
  {
    id: "sora-inter",
    name: "Modern Sans",
    description: "Bersih & lugas — kesan profesional dan modern.",
    displayVar: "--font-sora",
    bodyVar: "--font-inter",
    previewDisplay: "Sora",
    previewBody: "Inter",
  },
  {
    id: "playfair-source",
    name: "Editorial",
    description: "Serif elegan bergaya majalah dengan teks isi yang mudah dibaca.",
    displayVar: "--font-playfair",
    bodyVar: "--font-source-sans",
    previewDisplay: "Playfair Display",
    previewBody: "Source Sans 3",
  },
  {
    id: "baloo-nunito",
    name: "Ceria",
    description: "Bulat & ramah — cocok untuk kesan hangat dan playful.",
    displayVar: "--font-baloo",
    bodyVar: "--font-nunito",
    previewDisplay: "Baloo 2",
    previewBody: "Nunito",
  },
  {
    id: "grotesk-plex",
    name: "Kreatif",
    description: "Geometris & khas — tampil beda dengan sentuhan kontemporer.",
    displayVar: "--font-grotesk",
    bodyVar: "--font-plex",
    previewDisplay: "Space Grotesk",
    previewBody: "IBM Plex Sans",
  },
  {
    id: "lora-mulish",
    name: "Hangat",
    description: "Serif lembut dan sans nyaman dibaca, kesan tenang.",
    displayVar: "--font-lora",
    bodyVar: "--font-mulish",
    previewDisplay: "Lora",
    previewBody: "Mulish",
  },
  {
    id: "poppins-work",
    name: "Geometris",
    description: "Tegas & rapi — bentuk geometris yang bersih dan profesional.",
    displayVar: "--font-poppins",
    bodyVar: "--font-work-sans",
    previewDisplay: "Poppins",
    previewBody: "Work Sans",
  },
  {
    id: "cormorant-karla",
    name: "Elegan",
    description: "Serif tinggi-kontras dengan sans minimalis — mewah dan artistik.",
    displayVar: "--font-cormorant",
    bodyVar: "--font-karla",
    previewDisplay: "Cormorant Garamond",
    previewBody: "Karla",
  },
];

export function getFontPair(id: FontPairId | undefined): FontPairDef {
  return FONT_PAIRS.find((f) => f.id === id) ?? FONT_PAIRS[0];
}
