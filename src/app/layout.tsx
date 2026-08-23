import type { Metadata } from "next";
import {
  Fraunces,
  Plus_Jakarta_Sans,
  Sora,
  Inter,
  Playfair_Display,
  Source_Sans_3,
  Baloo_2,
  Nunito,
  Space_Grotesk,
  IBM_Plex_Sans,
  Lora,
  Mulish,
  Poppins,
  Work_Sans,
  Cormorant_Garamond,
  Karla,
} from "next/font/google";
import "./globals.css";

// Every font pair a portfolio can pick under Tampilan → Tipografi is loaded
// here so its CSS variable exists globally; the selected pair's variables
// are the only ones actually downloaded per page (see src/lib/fonts.ts and
// src/lib/theme.ts). Only the default pair (fraunces/jakarta) is preloaded —
// the other 14 are opted out of preload so an unused font pair doesn't add
// <link rel="preload"> requests to every single page load.
const fraunces = Fraunces({ subsets: ["latin"], variable: "--font-fraunces", weight: ["300", "400", "500", "600"], display: "swap" });
const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-jakarta", weight: ["300", "400", "500", "600", "700"], display: "swap" });
const sora = Sora({ subsets: ["latin"], variable: "--font-sora", weight: ["400", "600", "700"], display: "swap", preload: false });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", weight: ["400", "500", "600"], display: "swap", preload: false });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair", weight: ["400", "600", "700"], display: "swap", preload: false });
const sourceSans = Source_Sans_3({ subsets: ["latin"], variable: "--font-source-sans", weight: ["400", "500", "600"], display: "swap", preload: false });
const baloo = Baloo_2({ subsets: ["latin"], variable: "--font-baloo", weight: ["400", "600", "700"], display: "swap", preload: false });
const nunito = Nunito({ subsets: ["latin"], variable: "--font-nunito", weight: ["400", "500", "600"], display: "swap", preload: false });
const grotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-grotesk", weight: ["400", "500", "600"], display: "swap", preload: false });
const plexSans = IBM_Plex_Sans({ subsets: ["latin"], variable: "--font-plex", weight: ["400", "500", "600"], display: "swap", preload: false });
const lora = Lora({ subsets: ["latin"], variable: "--font-lora", weight: ["400", "500", "600"], display: "swap", preload: false });
const mulish = Mulish({ subsets: ["latin"], variable: "--font-mulish", weight: ["400", "500", "600"], display: "swap", preload: false });
const poppins = Poppins({ subsets: ["latin"], variable: "--font-poppins", weight: ["400", "500", "600"], display: "swap", preload: false });
const workSans = Work_Sans({ subsets: ["latin"], variable: "--font-work-sans", weight: ["400", "500", "600"], display: "swap", preload: false });
const cormorant = Cormorant_Garamond({ subsets: ["latin"], variable: "--font-cormorant", weight: ["400", "500", "600", "700"], display: "swap", preload: false });
const karla = Karla({ subsets: ["latin"], variable: "--font-karla", weight: ["400", "500", "600"], display: "swap", preload: false });

const fontVariables = [
  fraunces.variable,
  jakarta.variable,
  sora.variable,
  inter.variable,
  playfair.variable,
  sourceSans.variable,
  baloo.variable,
  nunito.variable,
  grotesk.variable,
  plexSans.variable,
  lora.variable,
  mulish.variable,
  poppins.variable,
  workSans.variable,
  cormorant.variable,
  karla.variable,
].join(" ");

const title = "PPG Portfolio — Digital Teaching Portfolio";
const description = "Platform e-portofolio multi-pengguna untuk mahasiswa PPG Prajabatan.";

export const metadata: Metadata = {
  metadataBase: new URL("https://ppg-portfolio.vercel.app"),
  title,
  description,
  icons: { icon: "/images/e-portfolio-logo-white.png" },
  openGraph: {
    title,
    description,
    images: [{ url: "/images/e-portfolio-logo-white.png", width: 512, height: 512, alt: title }],
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/images/e-portfolio-logo-white.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className={`${fontVariables} antialiased bg-cream text-ink selection:bg-clay`}>
        {children}
      </body>
    </html>
  );
}
