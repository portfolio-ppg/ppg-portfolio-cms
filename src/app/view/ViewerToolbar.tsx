"use client";

import { Download, X } from "lucide-react";

export default function ViewerToolbar({
  title,
  downloadHref,
}: {
  title: string;
  downloadHref: string;
}) {
  function handleClose() {
    // Works when this tab was opened via target="_blank" (has an opener);
    // otherwise falls back to browser history.
    window.close();
    if (window.history.length > 1) window.history.back();
  }

  return (
    <div className="flex items-center justify-between gap-4 bg-black/90 px-4 py-3 text-white">
      <p className="min-w-0 flex-1 truncate text-sm font-medium">{title}</p>
      <div className="flex shrink-0 items-center gap-2">
        <a
          href={downloadHref}
          download
          className="flex items-center gap-2 rounded-full border border-white/30 px-4 py-2 text-xs font-semibold transition-colors hover:bg-white/10"
        >
          <Download size={14} /> Unduh
        </a>
        <button
          type="button"
          onClick={handleClose}
          className="flex items-center gap-2 rounded-full border border-white/30 px-4 py-2 text-xs font-semibold transition-colors hover:bg-white/10"
        >
          <X size={14} /> Tutup
        </button>
      </div>
    </div>
  );
}
