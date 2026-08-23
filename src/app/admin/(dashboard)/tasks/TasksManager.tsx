"use client";

import { useOptimistic, useRef, useState, useTransition } from "react";
import { Plus, Trash2, X, Pencil, FileText, CalendarDays, Tag } from "lucide-react";
import { createTaskAction, deleteTaskAction } from "@/lib/actions/tasks";
import {
  createTaskCategoryAction,
  updateTaskCategoryAction,
  deleteTaskCategoryAction,
} from "@/lib/actions/task-categories";
import { Field, inputClass, buttonPrimaryClass, buttonSecondaryClass, Card } from "@/components/admin/ui";
import FilePicker from "@/components/admin/FilePicker";
import { useToast } from "@/components/admin/Toast";
import type { TaskItem, TaskCategory, MediaItem } from "@/lib/types";

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

type TaskAction = { type: "add"; task: TaskItem } | { type: "delete"; id: string };
type CategoryAction =
  | { type: "add"; category: TaskCategory }
  | { type: "update"; id: string; name: string }
  | { type: "delete"; id: string };

export default function TasksManager({
  tasks,
  categories,
  media,
  username,
}: {
  tasks: TaskItem[];
  categories: TaskCategory[];
  media: MediaItem[];
  username: string;
}) {
  const toast = useToast();
  const [, startTransition] = useTransition();
  const tempId = useRef(0);
  const [adding, setAdding] = useState(false);

  const [optimisticTasks, applyTask] = useOptimistic<TaskItem[], TaskAction>(tasks, (state, action) => {
    if (action.type === "add") return [action.task, ...state];
    if (action.type === "delete") return state.filter((t) => t.id !== action.id);
    return state;
  });

  const [optimisticCategories, applyCategory] = useOptimistic<TaskCategory[], CategoryAction>(
    categories,
    (state, action) => {
      if (action.type === "add") return [...state, action.category];
      if (action.type === "update") return state.map((c) => (c.id === action.id ? { ...c, name: action.name } : c));
      if (action.type === "delete") return state.filter((c) => c.id !== action.id);
      return state;
    }
  );

  const categoryName = (id: string) => optimisticCategories.find((c) => c.id === id)?.name || "Tanpa kategori";

  async function handleCreateTask(formData: FormData) {
    const title = String(formData.get("title") || "").trim();
    const course = String(formData.get("course") || "").trim();
    const date = String(formData.get("date") || "").trim();
    const categoryId = String(formData.get("categoryId") || "").trim();
    const fileUrl = String(formData.get("fileUrl") || "").trim();
    const fileSize = Number(formData.get("fileSize") || 0);

    applyTask({
      type: "add",
      task: {
        id: `optimistic-${++tempId.current}`,
        title,
        course,
        date,
        categoryId,
        fileUrl,
        size: fileSize ? formatSize(fileSize) : "-",
      },
    });
    setAdding(false);
    toast(`Tugas "${title}" berhasil ditambahkan.`);

    try {
      await createTaskAction(username, formData);
    } catch (e) {
      toast(e instanceof Error ? e.message : "Gagal menambahkan tugas.", "error");
    }
  }

  function handleDeleteTask(id: string, title: string) {
    startTransition(async () => {
      applyTask({ type: "delete", id });
      toast(`Tugas "${title}" berhasil dihapus.`);
      try {
        await deleteTaskAction(username, id);
      } catch {
        toast("Gagal menghapus tugas. Coba lagi.", "error");
      }
    });
  }

  async function handleCreateCategory(formData: FormData) {
    const name = String(formData.get("name") || "").trim();
    applyCategory({ type: "add", category: { id: `optimistic-${++tempId.current}`, name } });
    toast(`Kategori "${name}" berhasil ditambahkan.`);
    try {
      await createTaskCategoryAction(username, formData);
    } catch (e) {
      toast(e instanceof Error ? e.message : "Gagal menambahkan kategori.", "error");
    }
  }

  async function handleUpdateCategory(id: string, formData: FormData) {
    const name = String(formData.get("name") || "").trim();
    applyCategory({ type: "update", id, name });
    toast("Kategori berhasil diperbarui.");
    try {
      await updateTaskCategoryAction(username, id, formData);
    } catch (e) {
      toast(e instanceof Error ? e.message : "Gagal memperbarui kategori.", "error");
    }
  }

  function handleDeleteCategory(id: string, name: string) {
    startTransition(async () => {
      applyCategory({ type: "delete", id });
      toast(`Kategori "${name}" berhasil dihapus.`);
      try {
        await deleteTaskCategoryAction(username, id);
      } catch {
        toast("Gagal menghapus kategori. Coba lagi.", "error");
      }
    });
  }

  return (
    <div className="space-y-8">
      <CategoryManager
        categories={optimisticCategories}
        onCreate={handleCreateCategory}
        onUpdate={handleUpdateCategory}
        onDelete={handleDeleteCategory}
      />

      <div className="space-y-6">
        {adding ? (
          <AddForm
            categories={optimisticCategories}
            media={media}
            username={username}
            onSubmit={handleCreateTask}
            onClose={() => setAdding(false)}
          />
        ) : (
          <button onClick={() => setAdding(true)} className={buttonPrimaryClass}>
            <Plus size={16} /> Tambah Tugas
          </button>
        )}

        <div className="space-y-3">
          {optimisticTasks.map((task) => (
            <Card key={task.id} className="flex items-center justify-between gap-4">
              <div className="flex min-w-0 items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-600">
                  <FileText size={18} />
                </span>
                <div className="min-w-0">
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                    {categoryName(task.categoryId)}
                  </p>
                  <p className="truncate text-sm font-semibold text-gray-900">{task.title}</p>
                  <div className="mt-1 flex items-center gap-2 text-xs text-gray-500">
                    {task.course && <span>{task.course}</span>}
                    {task.date && (
                      <span className="flex items-center gap-1">
                        <CalendarDays size={11} /> {task.date}
                      </span>
                    )}
                    <span>&middot;</span>
                    <span>{task.size}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => handleDeleteTask(task.id, task.title)}
                className="flex shrink-0 items-center gap-1 text-xs font-medium text-red-600 hover:underline"
              >
                <Trash2 size={12} /> Hapus
              </button>
            </Card>
          ))}
          {optimisticTasks.length === 0 && <p className="text-sm text-gray-500">Belum ada tugas.</p>}
        </div>
      </div>
    </div>
  );
}

function CategoryManager({
  categories,
  onCreate,
  onUpdate,
  onDelete,
}: {
  categories: TaskCategory[];
  onCreate: (formData: FormData) => void | Promise<void>;
  onUpdate: (id: string, formData: FormData) => void | Promise<void>;
  onDelete: (id: string, name: string) => void;
}) {
  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState<TaskCategory | null>(null);

  return (
    <Card className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-gray-900">Kategori Tugas</p>
        {!adding && (
          <button
            onClick={() => setAdding(true)}
            className="flex items-center gap-1 text-xs font-medium text-gray-600 hover:underline"
          >
            <Plus size={12} /> Tambah Kategori
          </button>
        )}
      </div>

      {adding && (
        <CategoryForm
          onSubmit={async (formData) => {
            setAdding(false);
            await onCreate(formData);
          }}
          onClose={() => setAdding(false)}
        />
      )}

      <div className="space-y-2">
        {categories.map((cat) =>
          editing?.id === cat.id ? (
            <CategoryForm
              key={cat.id}
              category={cat}
              onSubmit={async (formData) => {
                setEditing(null);
                await onUpdate(cat.id, formData);
              }}
              onClose={() => setEditing(null)}
            />
          ) : (
            <div
              key={cat.id}
              className="flex items-center justify-between gap-3 rounded-lg border border-gray-200 px-3.5 py-2.5"
            >
              <span className="flex items-center gap-2 text-sm text-gray-900">
                <Tag size={13} className="text-gray-400" />
                {cat.name}
              </span>
              <div className="flex shrink-0 gap-3">
                <button
                  onClick={() => setEditing(cat)}
                  className="flex items-center gap-1 text-xs font-medium text-gray-600 hover:underline"
                >
                  <Pencil size={12} /> Edit
                </button>
                <button
                  onClick={() => onDelete(cat.id, cat.name)}
                  className="flex items-center gap-1 text-xs font-medium text-red-600 hover:underline"
                >
                  <Trash2 size={12} /> Hapus
                </button>
              </div>
            </div>
          )
        )}
        {categories.length === 0 && !adding && (
          <p className="text-sm text-gray-500">Belum ada kategori tugas.</p>
        )}
      </div>
    </Card>
  );
}

function CategoryForm({
  category,
  onSubmit,
  onClose,
}: {
  category?: TaskCategory;
  onSubmit: (formData: FormData) => void | Promise<void>;
  onClose: () => void;
}) {
  return (
    <form
      action={onSubmit}
      className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 p-2.5"
    >
      <input
        name="name"
        defaultValue={category?.name}
        placeholder="Nama kategori"
        required
        autoFocus
        className={`${inputClass} bg-white`}
      />
      <button type="submit" className={buttonPrimaryClass}>
        Simpan
      </button>
      <button type="button" onClick={onClose} className={buttonSecondaryClass}>
        <X size={16} />
      </button>
    </form>
  );
}

function AddForm({
  categories,
  media,
  username,
  onSubmit,
  onClose,
}: {
  categories: TaskCategory[];
  media: MediaItem[];
  username: string;
  onSubmit: (formData: FormData) => void | Promise<void>;
  onClose: () => void;
}) {
  return (
    <Card className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-gray-900">Tambah Tugas Baru</p>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-900">
          <X size={16} />
        </button>
      </div>

      <form action={onSubmit} className="space-y-4">
        <Field label="Judul Tugas">
          <input name="title" required className={inputClass} />
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Mata Kuliah">
            <input name="course" className={inputClass} />
          </Field>
          <Field label="Tanggal">
            <input name="date" type="date" className={inputClass} />
          </Field>
        </div>

        <Field label="Kategori">
          <select name="categoryId" defaultValue="" className={inputClass}>
            <option value="">Tanpa kategori</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </Field>

        <FilePicker urlName="fileUrl" sizeName="fileSize" label="Berkas Tugas" username={username} media={media} />

        <div className="flex gap-3">
          <button type="submit" className={buttonPrimaryClass}>
            Simpan
          </button>
          <button type="button" onClick={onClose} className={buttonSecondaryClass}>
            Batal
          </button>
        </div>
      </form>
    </Card>
  );
}
