import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getPortfolio } from "@/lib/data";
import { buildThemeCss } from "@/lib/theme";
import { getLayout } from "@/lib/layouts";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ username: string }>;
}): Promise<Metadata> {
  const { username } = await params;
  const portfolio = await getPortfolio(username);
  if (!portfolio) return {};
  const { profile } = portfolio;
  const title = `E-Portfolio - ${profile.name}`;
  const description = `E-portofolio ${profile.role.toLowerCase()} ${profile.program}, ${profile.campus}, asal ${profile.originRegion}.`;
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [{ url: "/images/e-portfolio-og.png", width: 512, height: 512, alt: title }],
      locale: "id_ID",
      type: "profile",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/images/e-portfolio-og.png"],
    },
  };
}

export default async function UserPortfolioLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const portfolio = await getPortfolio(username);
  if (!portfolio) notFound();

  const { profile } = portfolio;
  const themeCss = buildThemeCss(portfolio.appearance);

  const navItems = [
    { href: `/${username}`, label: "Profil" },
    { href: `/${username}/tugas`, label: "Tugas" },
  ];

  return (
    <div data-layout={getLayout(portfolio.appearance.layoutId).id}>
      {/* Per-user appearance overrides. Root layout has no <head> access this
          deep in the tree, but a plain <style> tag works anywhere in React. */}
      <style id="cms-theme" dangerouslySetInnerHTML={{ __html: themeCss }} />
      <Header
        name={profile.name}
        subtitle={`E-Portofolio · ${profile.program}`}
        navItems={navItems}
      />
      {children}
      <Footer
        name={profile.name}
        description={`${profile.role} ${profile.program}, ${profile.campus}. Berasal dari ${profile.originRegion}.`}
        email={profile.email}
        location={profile.campus}
        navItems={navItems}
      />
    </div>
  );
}
