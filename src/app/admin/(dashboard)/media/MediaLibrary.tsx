"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Upload, Trash2, FileText, Copy, Check } from "lucide-react";
import { deleteMediaAction } from "@/lib/actions/media";
import { uploadFile } from "@/lib/upload-client";
import { buttonPrimaryClass, Card } from "@/components/admin/ui";
import { useToast } from "@/components/admin/Toast";
import type { MediaItem } from "@/lib/types";

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

interface PendingUpload {
  key: string;
  name: string;
  size: number;
  progress: number;
}

export default function MediaLibrary({
  media,
  maxMb,
  username,
}: {
  media: MediaItem[];
  maxMb: number;
  username: string;
}) {
  const [items, setItems] = useState(media);
  const [pending, setPending] = useState<PendingUpload[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const toast = useToast();

  async function uploadFiles(files: FileList | File[]) {
    const fileList = Array.from(files);
    // Show every selected file as a pending card immediately — bulk selects
    // no longer look "stuck" behind one shared spinner.
    const withKeys = fileList.map((file, i) => ({
      file,
      key: `pending-${Date.now()}-${i}-${file.name}`,
    }));
    setPending((prev) => [
      ...withKeys.map(({ key, file }) => ({ key, name: file.name, size: file.size, progress: 0 })),
      ...prev,
    ]);

    for (const { file, key } of withKeys) {
      const result = await uploadFile(file, username, ({ percentage }) => {
        setPending((prev) => prev.map((p) => (p.key === key ? { ...p, progress: percentage } : p)));
      });
      if (!result.ok || !result.item) {
        toast(result.error || `Gagal mengunggah ${file.name}.`, "error");
      } else {
        setItems((prev) => [result.item!, ...prev]);
        toast(`"${file.name}" berhasil diunggah.`);
      }
      setPending((prev) => prev.filter((p) => p.key !== key));
    }
  }

  function copyUrl(item: MediaItem) {
    const fullUrl = `${window.location.origin}${item.url}`;
    navigator.clipboard.writeText(fullUrl).then(() => {
      setCopiedId(item.id);
      setTimeout(() => setCopiedId(null), 1500);
    });
  }

  async function handleDelete(id: string) {
    const removed = items.find((m) => m.id === id);
    setItems((prev) => prev.filter((m) => m.id !== id));
    toast("File berhasil dihapus.");
    try {
      await deleteMediaAction(username, id);
    } catch {
      if (removed) setItems((prev) => [removed, ...prev]);
      toast("Gagal menghapus file. Coba lagi.", "error");
    }
  }

  return (
    <div className="space-y-6">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          if (e.dataTransfer.files?.length) uploadFiles(e.dataTransfer.files);
        }}
        className={`flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed px-6 py-10 text-center transition-colors ${
          dragOver ? "border-gray-400 bg-gray-50" : "border-gray-200 bg-white"
        }`}
      >
        <Upload size={22} className="text-gray-400" />
        <p className="text-sm text-gray-600">Seret file ke sini, atau</p>
        <button onClick={() => inputRef.current?.click()} className={buttonPrimaryClass}>
          Pilih File
        </button>
        <p className="text-xs text-gray-400">Gambar & dokumen, maksimal {maxMb} MB per file. Bisa pilih beberapa sekaligus.</p>
        <input
          ref={inputRef}
          type="file"
          multiple
          className="hidden"
          onChange={(e) => {
            if (e.target.files?.length) uploadFiles(e.target.files);
            e.target.value = "";
          }}
        />
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
        {pending.map((p) => (
          <Card key={p.key} className="!p-3 opacity-80">
            <div className="relative mb-2 flex h-28 items-center justify-center overflow-hidden rounded-lg bg-gray-100">
              <span className="text-sm font-semibold text-gray-500">{Math.round(p.progress)}%</span>
            </div>
            <p className="truncate text-xs font-medium text-gray-900" title={p.name}>
              {p.name}
            </p>
            <p className="text-[10px] text-gray-400">{formatSize(p.size)} · mengunggah…</p>
            <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-gray-200">
              <div
                className="h-full rounded-full bg-gray-900 transition-[width] duration-200"
                style={{ width: `${Math.max(4, p.progress)}%` }}
              />
            </div>
          </Card>
        ))}
        {items.map((item) => (
          <Card key={item.id} className="!p-3">
            <div className="relative mb-2 flex h-28 items-center justify-center overflow-hidden rounded-lg bg-gray-100">
              {item.kind === "image" ? (
                <Image src={item.url} alt={item.originalName} fill sizes="200px" className="object-cover" />
              ) : (
                <FileText size={28} className="text-gray-400" />
              )}
            </div>
            <p className="truncate text-xs font-medium text-gray-900" title={item.originalName}>
              {item.originalName}
            </p>
            <p className="text-[10px] text-gray-400">{formatSize(item.size)}</p>
            <div className="mt-2 flex items-center gap-3">
              <button
                onClick={() => copyUrl(item)}
                className="flex items-center gap-1 text-[10px] font-medium text-gray-600 hover:underline"
              >
                {copiedId === item.id ? <Check size={11} /> : <Copy size={11} />}
                {copiedId === item.id ? "Tersalin" : "Salin URL"}
              </button>
              <button
                onClick={() => handleDelete(item.id)}
                className="flex items-center gap-1 text-[10px] font-medium text-red-600 hover:underline"
              >
                <Trash2 size={11} /> Hapus
              </button>
            </div>
          </Card>
        ))}
      </div>
      {items.length === 0 && pending.length === 0 && (
        <p className="text-sm text-gray-500">Belum ada file yang diunggah.</p>
      )}
    </div>
  );
}
