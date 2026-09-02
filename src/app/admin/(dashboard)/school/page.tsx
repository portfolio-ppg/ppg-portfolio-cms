import { resolveTargetPortfolio } from "@/lib/admin-target";
import SchoolProfileForm from "./SchoolProfileForm";
import { PageHeader } from "@/components/admin/ui";

export default async function SchoolAdminPage({
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
        title="Profil Sekolah"
        description={
          managingOther
            ? `Mengedit profil sekolah milik "${targetUsername}".`
            : "Nama, deskripsi, dan logo sekolah/instansi yang tampil di halaman publik kamu."
        }
      />
      <SchoolProfileForm schoolProfile={portfolio.schoolProfile} media={portfolio.media} username={targetUsername} />
    </div>
  );
}
