"use client";

import { useRef, useState } from "react";
import { Upload, X, Loader2, FileText, FolderOpen, Image as ImageIcon } from "lucide-react";
import type { MediaItem } from "@/lib/types";

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function FilePicker({
  urlName,
  sizeName,
  label = "Berkas",
  defaultUrl = "",
  defaultSize = 0,
  username,
  media = [],
}: {
  urlName: string;
  sizeName: string;
  label?: string;
  defaultUrl?: string;
  defaultSize?: number;
  /** Portfolio username this upload belongs to (self, or the user an admin is managing). */
  username: string;
  /** Already-uploaded files the user can pick from instead of uploading again. */
  media?: MediaItem[];
}) {
  const [url, setUrl] = useState(defaultUrl);
  const [size, setSize] = useState(defaultSize);
  const [name, setName] = useState(defaultUrl ? defaultUrl.split("/").pop() ?? "" : "");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showLibrary, setShowLibrary] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    setUploading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("username", username);
      const res = await fetch("/api/uploads", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Gagal mengunggah file.");
      } else {
        setUrl(data.item.url);
        setSize(data.item.size);
        setName(data.item.originalName);
      }
    } catch {
      setError("Gagal mengunggah file. Periksa koneksi Anda.");
    } finally {
      setUploading(false);
    }
  }

  function pickFromLibrary(item: MediaItem) {
    setUrl(item.url);
    setSize(item.size);
    setName(item.originalName);
    setShowLibrary(false);
  }

  return (
    <div>
      <span className="mb-1.5 block text-sm font-medium text-gray-700">{label}</span>
      <input type="hidden" name={urlName} value={url} />
      <input type="hidden" name={sizeName} value={size} />

      {url ? (
        <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
          <FileText size={18} className="shrink-0 text-gray-500" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-gray-900">{name}</p>
            <p className="text-xs text-gray-400">{formatSize(size)}</p>
          </div>
          <button
            type="button"
            onClick={() => {
              setUrl("");
              setSize(0);
              setName("");
            }}
            className="shrink-0 text-gray-400 hover:text-red-600"
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-2 rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 px-4 py-4 sm:flex-row">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700"
          >
            {uploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
            {uploading ? "Mengunggah..." : "Unggah dari komputer"}
          </button>
          <div className="hidden w-px self-stretch bg-gray-200 sm:block" />
          <button
            type="button"
            onClick={() => setShowLibrary(true)}
            disabled={uploading}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700"
          >
            <FolderOpen size={16} />
            Pilih dari media library
          </button>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          e.target.value = "";
        }}
      />
      {error && <p className="mt-1.5 text-xs text-red-600">{error}</p>}

      {showLibrary && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => setShowLibrary(false)}
        >
          <div
            className="flex max-h-[80vh] w-full max-w-2xl flex-col rounded-2xl bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm font-semibold text-gray-900">Pilih dari Media Library</p>
              <button
                type="button"
                onClick={() => setShowLibrary(false)}
                className="text-gray-400 hover:text-gray-900"
              >
                <X size={18} />
              </button>
            </div>

            {media.length === 0 ? (
              <p className="text-sm text-gray-500">Belum ada file di media library.</p>
            ) : (
              <div className="grid grid-cols-2 gap-3 overflow-y-auto sm:grid-cols-3">
                {media.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => pickFromLibrary(item)}
                    className="flex flex-col items-start gap-2 rounded-xl border border-gray-200 p-3 text-left transition-colors hover:border-gray-400 hover:bg-gray-50"
                  >
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 text-gray-500">
                      {item.kind === "image" ? <ImageIcon size={16} /> : <FileText size={16} />}
                    </span>
                    <span className="w-full truncate text-xs font-medium text-gray-900" title={item.originalName}>
                      {item.originalName}
                    </span>
                    <span className="text-[10px] text-gray-400">{formatSize(item.size)}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
