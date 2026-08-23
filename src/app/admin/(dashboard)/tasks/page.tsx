import { resolveTargetPortfolio } from "@/lib/admin-target";
import { PageHeader } from "@/components/admin/ui";
import TasksManager from "./TasksManager";

export default async function TasksAdminPage({
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
        title="Tugas"
        description={
          managingOther
            ? `Mengedit daftar tugas milik "${targetUsername}".`
            : "Unggah dan kelola daftar tugas yang bisa diunduh pengunjung."
        }
      />
      <TasksManager
        tasks={portfolio.tasks}
        categories={portfolio.taskCategories}
        media={portfolio.media}
        username={targetUsername}
      />
    </div>
  );
}
