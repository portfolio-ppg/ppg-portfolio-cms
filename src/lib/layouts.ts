import type { LayoutId } from "./types";

export interface LayoutDef {
  id: LayoutId;
  name: string;
  description: string;
}

export const LAYOUTS: LayoutDef[] = [
  {
    id: "classic",
    name: "Klasik",
    description: "Tampilan bawaan — foto di kanan, dekorasi lembut di sekitar hero.",
  },
  {
    id: "mirrored",
    name: "Cermin",
    description: "Foto profil di kiri, teks perkenalan di kanan.",
  },
  {
    id: "centered",
    name: "Terpusat",
    description: "Semua konten hero disusun rapi di tengah, satu kolom.",
  },
  {
    id: "editorial",
    name: "Editorial",
    description: "Gaya majalah — tanpa dekorasi, garis pembatas antar bagian, lapang.",
  },
  {
    id: "soft-card",
    name: "Kartu Lembut",
    description: "Setiap bagian dibungkus kartu putih melayang dengan bayangan lembut.",
  },
  {
    id: "bold-lines",
    name: "Garis Tegas",
    description: "Garis dan sudut lebih tegas, kontras tinggi, tanpa dekorasi blur.",
  },
  {
    id: "split-banner",
    name: "Split Banner",
    description: "Panel warna aksen di belakang foto profil untuk kesan lebih hidup.",
  },
  {
    id: "compact",
    name: "Compact",
    description: "Jarak antar bagian dipadatkan, cocok untuk konten yang ringkas.",
  },
];

export function getLayout(id: LayoutId | undefined): LayoutDef {
  return LAYOUTS.find((l) => l.id === id) ?? LAYOUTS[0];
}
