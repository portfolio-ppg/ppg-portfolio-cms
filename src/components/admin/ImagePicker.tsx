"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Upload, X, Loader2, FolderOpen, FileText } from "lucide-react";
import type { MediaItem } from "@/lib/types";

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function ImagePicker({
  name,
  defaultValue = "",
  label = "Gambar",
  value,
  onChange,
  username,
  shape = "rect",
  media = [],
}: {
  name: string;
  defaultValue?: string;
  label?: string;
  /** Optional controlled mode — pass both value & onChange to let a parent own the URL. */
  value?: string;
  onChange?: (url: string) => void;
  /** Portfolio username this upload belongs to (self, or the user an admin is managing). */
  username: string;
  /** "arch" mirrors the public profile-photo frame (rounded top, flat bottom) — use for the avatar field so the admin preview matches the live site exactly, regardless of the uploaded photo's original orientation. */
  shape?: "rect" | "arch";
  /** Already-uploaded files the user can pick from instead of uploading again. */
  media?: MediaItem[];
}) {
  const [internalUrl, setInternalUrl] = useState(defaultValue);
  const controlled = value !== undefined && onChange !== undefined;
  const url = controlled ? value! : internalUrl;
  const setUrl = controlled ? onChange! : setInternalUrl;
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showLibrary, setShowLibrary] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const imageMedia = media.filter((m) => m.kind === "image");

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
      }
    } catch {
      setError("Gagal mengunggah file. Periksa koneksi Anda.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <span className="mb-1.5 block text-sm font-medium text-gray-700">{label}</span>
      <input type="hidden" name={name} value={url} />

      {url ? (
        <div className="relative w-fit">
          <div
            className={
              shape === "arch"
                ? "relative aspect-[5/6] w-32 overflow-hidden rounded-t-full border-4 border-gray-200 bg-gray-100"
                : "relative h-32 w-48 overflow-hidden rounded-xl border border-gray-200 bg-gray-100"
            }
          >
            <Image src={url} alt="" fill sizes="192px" className="object-cover object-top" />
          </div>
          <button
            type="button"
            onClick={() => setUrl("")}
            className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-white text-red-600 shadow-sm ring-1 ring-gray-200"
          >
            <X size={13} />
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
        accept="image/*"
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
          className="fixed inset-0 z-100 flex items-center justify-center bg-black/40 p-4"
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

            {imageMedia.length === 0 ? (
              <p className="text-sm text-gray-500">Belum ada gambar di media library.</p>
            ) : (
              <div className="grid grid-cols-2 gap-3 overflow-y-auto sm:grid-cols-3">
                {imageMedia.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setUrl(item.url);
                      setShowLibrary(false);
                    }}
                    className="flex flex-col items-start gap-2 rounded-xl border border-gray-200 p-2 text-left transition-colors hover:border-gray-400 hover:bg-gray-50"
                  >
                    <div className="relative h-20 w-full overflow-hidden rounded-lg bg-gray-100">
                      {item.kind === "image" ? (
                        <Image src={item.url} alt={item.originalName} fill sizes="200px" className="object-cover" />
                      ) : (
                        <FileText size={20} className="m-auto text-gray-400" />
                      )}
                    </div>
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
