"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import Marquee from "@/components/Marquee";
import ProfileAvatar from "@/components/ProfileAvatar";
import NatureCard from "@/components/NatureCard";
import { getAvatarShadow, getAvatarAnimation } from "@/lib/avatar-effects";
import type { Profile, SchoolProfile, HometownItem, Appearance } from "@/lib/types";

// Small set of acronyms that should stay fully uppercase instead of
// title-casing (e.g. "ppg" -> "PPG", not "Ppg") when turning a username/URL
// slug like "seminar-mahasiswi-ppg-prajabatan" into display text.
const SLUG_ACRONYMS: Record<string, string> = { ppg: "PPG" };

function humanizeSlug(slug: string): string {
  return slug
    .split("-")
    .filter(Boolean)
    .map((word) => SLUG_ACRONYMS[word.toLowerCase()] ?? word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

export default function HomeContent({
  username,
  profile,
  schoolProfile,
  hometown,
  appearance,
}: {
  username: string;
  profile: Profile;
  schoolProfile: SchoolProfile;
  hometown: HometownItem[];
  appearance: Appearance;
}) {
  const facts = [
    { label: "Program", value: profile.program },
    { label: "Kampus", value: profile.campus },
    { label: "Asal Daerah", value: profile.originRegion },
  ];

  const [firstName, ...restName] = profile.name.split(" ");
  const restNameStr = restName.join(" ");

  const autoMarqueeItems = hometown.length
    ? hometown.map((h) => h.label)
    : [profile.originRegion];
  const marqueeTopItems = appearance.marqueeTop.length ? appearance.marqueeTop : autoMarqueeItems;
  const marqueeBottomItems = appearance.marqueeBottom.length
    ? appearance.marqueeBottom
    : ["Terima Kasih", ...autoMarqueeItems];

  const avatarShadowClass = getAvatarShadow(appearance.avatarShadow).className;
  const avatarAnimationClass = getAvatarAnimation(appearance.avatarAnimation).className;

  return (
    <main>
      {/* ===== HERO ===== */}
      {/* cms-hero-surface here (not on a decorative child) so solid /
          gradient / image appearance settings actually cover the hero. */}
      <section className="cms-hero-surface relative overflow-hidden">
        {/* Readability overlay — only visible when the admin picked an image
            background (opacity is driven by --hero-overlay-opacity from theme.ts). */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-ink/10 via-ink/0 to-cream"
          style={{ opacity: "var(--hero-overlay-opacity, 0)" }}
        />
        <div className="decor-blob pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-clay/10 blur-3xl" />
        <div className="decor-blob pointer-events-none absolute -left-16 top-40 h-56 w-56 rounded-full bg-sage/10 blur-3xl" />

        <div className="header-section mx-auto flex max-w-6xl flex-col-reverse items-center gap-10 px-6 py-12 text-center md:grid md:grid-cols-[1.1fr_0.9fr] md:items-center md:gap-14 md:px-10 md:py-12 md:text-left lg:px-10 lg:py-24">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-clay/40 bg-white-warm px-4 py-1.5 text-[9.5px] font-semibold uppercase tracking-[0.16em] text-clay-deep">
              <svg width="11" height="11" viewBox="0 0 100 100" fill="currentColor" aria-hidden="true"><path d=" M50 4 C52 32 68 48 96 50 C68 52 52 68 50 96 C48 68 32 52 4 50 C32 48 48 32 50 4 Z "></path></svg>
              <span className="md:hidden">Portofolio</span>
              <span className="hidden md:inline">Portofolio {humanizeSlug(username)}</span>
            </span>

            <h1 className="mt-6 font-display text-[30px] leading-[1.1] text-ink sm:text-5xl lg:text-6xl">
              {firstName} {restNameStr && <span className="text-clay-deep">{restNameStr}</span>}
            </h1>

            <p className="mt-5 mx-auto max-w-full text-[15px] leading-relaxed text-ink-soft md:mx-0 md:max-w-lg">
              {profile.tagline}
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-4 md:justify-start">
              <Link
                href={`/${username}/tugas`}
                className="group inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-semibold text-cream transition-colors duration-300 hover:bg-clay-deep"
              >
                Lihat Daftar Tugas
              </Link>
              {hometown.length > 0 && (
                <a
                  href="#kampung-halaman"
                  className="inline-flex items-center gap-2 rounded-full border border-stone/50 px-6 py-3 text-sm font-semibold text-ink-soft transition-colors duration-300 hover:border-clay hover:text-ink"
                >
                  Kenali Kampung Halamanku
                </a>
              )}
              {(schoolProfile.name || schoolProfile.description || schoolProfile.logoUrl) && (
                <a
                  href="#profil-sekolah"
                  className="inline-flex items-center gap-2 rounded-full border border-stone/50 px-6 py-3 text-sm font-semibold text-ink-soft transition-colors duration-300 hover:border-clay hover:text-ink"
                >
                  Lihat Profil Sekolah PPL
                </a>
              )}
            </div>

            <dl className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-stone/25 pt-10 min-[767px]:flex-row min-[767px]:pt-6">
              {facts.map(({ label, value }) => (
                <div key={label} className="flex items-start gap-2.5">
                  <div>
                    <dt className="text-[10px] uppercase tracking-[0.14em] text-ink-soft/80">
                      {label}
                    </dt>
                    <dd className="text-sm text-ink">{value}</dd>
                  </div>
                </div>
              ))}
            </dl>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
            className="relative mx-auto w-full max-w-sm"
          >
            {appearance.avatarShadow !== "none" && (
              <div className="animate-float-slow absolute -inset-4 -z-10 rounded-[46%_54%_58%_42%/48%_42%_58%_52%] bg-sage/15 blur-2xl" />
            )}
            <div className={`aspect-[5/6] w-full ${avatarAnimationClass}`}>
              <ProfileAvatar
                src={profile.avatarUrl || undefined}
                alt={`Foto profil ${profile.name}`}
                shadowClassName={avatarShadowClass}
              />
            </div>
          </motion.div>
        </div>

        <Marquee items={marqueeTopItems} />
      </section>

      {/* ===== TENTANG SAYA ===== */}
      <section className="about-section mx-auto max-w-6xl px-6 py-12 text-center md:px-10 md:py-12 md:text-left lg:px-10 lg:py-24">
        <div className="grid gap-6 md:grid-cols-[0.4fr_0.6fr]">
          <div>
            <p className="text-[10px]! font-semibold uppercase tracking-[0.18em] text-clay-deep sm:text-[12px]">
              Tentang Saya
            </p>
            <h2 className="mt-3 font-display text-[24px] text-ink md:text-[36px]">{profile.name}</h2>
          </div>
          <p className="text-[15px] leading-relaxed text-ink-soft">
            {profile.description}
          </p>
        </div>
      </section>

      {/* ===== VISI MISI ===== */}
      <section className="visi-misi-section bg-cream-deep/60 py-12 text-center md:py-12 md:text-left lg:py-24">
        <div className="mx-auto max-w-6xl px-6 md:px-10 lg:px-10">
          <div className="grid gap-6 md:grid-cols-[0.4fr_0.6fr]">
            <div>
              <p className="text-[10px]! font-semibold uppercase tracking-[0.18em] text-clay-deep sm:text-[12px]">
                Visi Misi
              </p>
              <h2 className="mt-3 font-display text-[24px] text-ink md:text-[36px]">
                Sebagai Calon Guru Profesional
              </h2>
            </div>
            <p className="whitespace-pre-line text-[15px] leading-relaxed text-ink-soft">
              {profile.visiMisi}
            </p>
          </div>
        </div>
      </section>

      {/* ===== PROFIL SEKOLAH ===== */}
      {(schoolProfile.name || schoolProfile.description || schoolProfile.logoUrl) && (
        <section id="profil-sekolah" className="school-section py-12 text-center md:py-12 md:text-left lg:py-24">
          <div className="mx-auto max-w-6xl px-6 md:px-10 lg:px-10">
            <div className="grid gap-8 md:grid-cols-2 md:items-start md:gap-12">
              <div>
                <p className="text-[10px]! font-semibold uppercase tracking-[0.18em] text-clay-deep sm:text-[12px]">
                  Profil Sekolah
                </p>

                {schoolProfile.logoUrl && (
                  <div className="relative mx-auto mt-4 aspect-square w-20 shrink-0 overflow-hidden rounded-2xl border border-stone/40 bg-white-warm sm:w-[110px] md:mx-0">
                    <Image
                      src={schoolProfile.logoUrl}
                      alt={`Logo ${schoolProfile.name}`}
                      fill
                      sizes="110px"
                      className="object-contain p-2"
                    />
                  </div>
                )}

                <h2 className="mt-4 font-display text-[24px] text-ink md:text-[36px]">{schoolProfile.name}</h2>
                <p className="mt-5 text-[15px] leading-relaxed text-ink-soft">{schoolProfile.description}</p>
              </div>

              {schoolProfile.name && (
                <div className="h-72 w-full overflow-hidden rounded-2xl border border-stone/40 md:sticky md:top-[calc(var(--header-h)+3rem)] md:h-80 lg:top-[calc(var(--header-h)+6rem)]">
                  <iframe
                    title={`Peta lokasi ${schoolProfile.name}`}
                    src={`https://www.google.com/maps?q=${encodeURIComponent(schoolProfile.name)}&output=embed`}
                    className="h-full w-full border-0"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ===== KAMPUNG HALAMAN ===== */}
      {hometown.length > 0 && (
        <section id="kampung-halaman" className="kampung-halaman-section bg-white-warm py-12 text-center min-[768px]:text-left lg:py-24">
          <div className="mx-auto max-w-6xl px-6 md:px-10">
            <div className="max-w-6xl">
              <p className="text-[10px]! font-semibold uppercase tracking-[0.18em] text-sage-deep min-[768px]:text-[12px]">
                Profil Tempat Asal
              </p>
              <h2 className="mt-3 font-display text-[24px] text-ink sm:text-[36px]">
                Kampung Halamanku, {profile.originRegion}
              </h2>
            </div>

            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {hometown.map((item, i) => (
                <NatureCard
                  key={item.id}
                  index={i}
                  label={item.label}
                  title={item.title}
                  description={item.description}
                  image={item.image}
                  alt={item.imageAlt}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ===== PENUTUP ===== */}
      <Marquee reverse items={marqueeBottomItems} />
    </main>
  );
}
