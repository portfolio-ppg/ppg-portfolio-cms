import { notFound } from "next/navigation";
import HomeContent from "@/components/HomeContent";
import { getPortfolio } from "@/lib/data";

export default async function UserProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const portfolio = await getPortfolio(username);
  if (!portfolio) notFound();

  return (
    <HomeContent
      username={username}
      profile={portfolio.profile}
      schoolProfile={portfolio.schoolProfile}
      hometown={portfolio.hometown}
      appearance={portfolio.appearance}
    />
  );
}
