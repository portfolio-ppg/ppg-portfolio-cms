import { resolveTargetPortfolio } from "@/lib/admin-target";
import { PageHeader } from "@/components/admin/ui";
import HometownManager from "./HometownManager";

export default async function HometownAdminPage({
  searchParams,
}: {
  searchParams: Promise<{ as?: string }>;
}) {
  const { portfolio, targetUsername, managingOther } = await resolveTargetPortfolio(
    await searchParams
  );

  return (
    <div>
      <PageHeader
        title="Tempat Asal"
        description={
          managingOther
            ? `Mengedit kartu tempat asal milik "${targetUsername}".`
            : "Kartu-kartu yang menampilkan profil kampung halaman: judul, deskripsi, gambar, dan keterangan gambar."
        }
      />
      <HometownManager items={portfolio.hometown} media={portfolio.media} username={targetUsername} />
    </div>
  );
}
