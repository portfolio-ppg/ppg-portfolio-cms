"use client";

import { useOptimistic, useRef, useState, useTransition } from "react";
import Image from "next/image";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import {
  createHometownItemAction,
  updateHometownItemAction,
  deleteHometownItemAction,
} from "@/lib/actions/hometown";
import { Field, inputClass, buttonPrimaryClass, buttonSecondaryClass, Card } from "@/components/admin/ui";
import ImagePicker from "@/components/admin/ImagePicker";
import { useToast } from "@/components/admin/Toast";
import type { HometownItem, MediaItem } from "@/lib/types";

type HometownAction =
  | { type: "add"; item: HometownItem }
  | { type: "update"; item: HometownItem }
  | { type: "delete"; id: string };

function fromForm(formData: FormData): Omit<HometownItem, "id"> {
  return {
    label: String(formData.get("label") || "").trim(),
    title: String(formData.get("title") || "").trim(),
    description: String(formData.get("description") || "").trim(),
    image: String(formData.get("image") || "").trim(),
    imageAlt: String(formData.get("imageAlt") || "").trim(),
  };
}

export default function HometownManager({
  items,
  media,
  username,
}: {
  items: HometownItem[];
  media: MediaItem[];
  username: string;
}) {
  const toast = useToast();
  const [, startTransition] = useTransition();
  const tempId = useRef(0);
  const [editing, setEditing] = useState<HometownItem | "new" | null>(null);

  const [optimisticItems, applyItem] = useOptimistic<HometownItem[], HometownAction>(items, (state, action) => {
    if (action.type === "add") return [...state, action.item];
    if (action.type === "update") return state.map((i) => (i.id === action.item.id ? action.item : i));
    if (action.type === "delete") return state.filter((i) => i.id !== action.id);
    return state;
  });

  async function handleCreate(formData: FormData) {
    const data = fromForm(formData);
    applyItem({ type: "add", item: { id: `optimistic-${++tempId.current}`, ...data } });
    setEditing(null);
    toast(`Tempat "${data.title}" berhasil ditambahkan.`);
    try {
      await createHometownItemAction(username, formData);
    } catch (e) {
      toast(e instanceof Error ? e.message : "Gagal menambahkan tempat.", "error");
    }
  }

  async function handleUpdate(id: string, formData: FormData) {
    const data = fromForm(formData);
    applyItem({ type: "update", item: { id, ...data } });
    setEditing(null);
    toast(`Tempat "${data.title}" berhasil diperbarui.`);
    try {
      await updateHometownItemAction(username, id, formData);
    } catch (e) {
      toast(e instanceof Error ? e.message : "Gagal memperbarui tempat.", "error");
    }
  }

  function handleDelete(id: string, title: string) {
    startTransition(async () => {
      applyItem({ type: "delete", id });
      toast(`Tempat "${title}" berhasil dihapus.`);
      try {
        await deleteHometownItemAction(username, id);
      } catch {
        toast("Gagal menghapus tempat. Coba lagi.", "error");
      }
    });
  }

  return (
    <div className="space-y-6">
      {editing ? (
        <ItemForm
          key={editing === "new" ? "new" : editing.id}
          item={editing === "new" ? null : editing}
          media={media}
          username={username}
          onSubmit={editing === "new" ? handleCreate : (fd) => handleUpdate((editing as HometownItem).id, fd)}
          onClose={() => setEditing(null)}
        />
      ) : (
        <button onClick={() => setEditing("new")} className={buttonPrimaryClass}>
          <Plus size={16} /> Tambah Tempat
        </button>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        {optimisticItems.map((item) => (
          <Card key={item.id} className="flex gap-4">
            <div className="relative h-20 w-24 shrink-0 overflow-hidden rounded-lg bg-gray-100">
              {item.image && <Image src={item.image} alt="" fill sizes="96px" className="object-cover" />}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">{item.label}</p>
              <p className="truncate text-sm font-semibold text-gray-900">{item.title}</p>
              <p className="mt-1 line-clamp-2 text-xs text-gray-500">{item.description}</p>
              <div className="mt-2 flex gap-3">
                <button
                  onClick={() => setEditing(item)}
                  className="flex items-center gap-1 text-xs font-medium text-gray-600 hover:underline"
                >
                  <Pencil size={12} /> Edit
                </button>
                <button
                  onClick={() => handleDelete(item.id, item.title)}
                  className="flex items-center gap-1 text-xs font-medium text-red-600 hover:underline"
                >
                  <Trash2 size={12} /> Hapus
                </button>
              </div>
            </div>
          </Card>
        ))}
        {optimisticItems.length === 0 && (
          <p className="text-sm text-gray-500">Belum ada item tempat asal.</p>
        )}
      </div>
    </div>
  );
}

function ItemForm({
  item,
  media,
  username,
  onSubmit,
  onClose,
}: {
  item: HometownItem | null;
  media: MediaItem[];
  username: string;
  onSubmit: (formData: FormData) => void | Promise<void>;
  onClose: () => void;
}) {
  return (
    <Card className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-gray-900">
          {item ? "Edit Tempat" : "Tambah Tempat Baru"}
        </p>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-900">
          <X size={16} />
        </button>
      </div>

      <form action={onSubmit} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Label singkat (mis. Pantai)">
            <input name="label" defaultValue={item?.label} className={inputClass} />
          </Field>
          <Field label="Judul">
            <input name="title" defaultValue={item?.title} required className={inputClass} />
          </Field>
        </div>

        <Field label="Deskripsi">
          <textarea name="description" defaultValue={item?.description} rows={3} className={inputClass} />
        </Field>

        <ImagePicker name="image" defaultValue={item?.image} label="Gambar" username={username} media={media} />

        <Field label="Keterangan Gambar (alt text)">
          <input name="imageAlt" defaultValue={item?.imageAlt} className={inputClass} />
        </Field>

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
