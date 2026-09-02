"use client";

import { motion } from "framer-motion";
import { FileText, Download, ExternalLink, CalendarDays } from "lucide-react";

export type Task = {
  title: string;
  course: string;
  date: string;
  size: string;
  href: string;
};

function getFileExt(href: string): string {
  const ext = href.split(/[?#]/)[0].split(".").pop() || "";
  return ext.length > 0 && ext.length <= 5 ? ext.toUpperCase() : "FILE";
}

// Browsers ignore the `download` attribute on cross-origin links (e.g. Vercel
// Blob URLs) and open the file instead — route those through our own API so
// the response carries a same-origin Content-Disposition: attachment header.
function getDownloadHref(task: Task): string {
  if (!/^https?:\/\//i.test(task.href)) return task.href;
  const ext = task.href.split(".").pop()?.split(/[?#]/)[0] || "";
  const filename = `${task.title}${ext ? `.${ext}` : ""}`;
  return `/api/download?url=${encodeURIComponent(task.href)}&name=${encodeURIComponent(filename)}`;
}

export default function TaskCard({ task, index }: { task: Task; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.5, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
      className="group flex flex-col gap-4 rounded-2xl border border-stone/30 bg-white-warm p-5 transition-colors duration-300 hover:border-clay/50 sm:flex-row sm:items-center sm:justify-between"
    >
      <div className="flex flex-col items-start gap-4 md:flex-row">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-clay/12 text-clay-deep transition-colors duration-300 group-hover:bg-clay group-hover:text-white-warm">
          <FileText className="h-4 w-4 md:h-[22px] md:w-[22px]" strokeWidth={1.7} />
        </span>
        <div>
          <p className="text-[10px]! font-semibold uppercase tracking-[0.16em] text-sage-deep">
            {task.course}
          </p>
          <h3 className="mt-1 font-display text-[16px]! leading-snug text-ink">
            {task.title}
          </h3>
          <div className="mt-1.5 flex items-center gap-3 text-[10px]! text-ink-soft">
            <span className="flex items-center gap-1">
              <CalendarDays size={13} strokeWidth={1.8} />
              {task.date}
            </span>
            <span>&middot;</span>
            <span>{task.href ? getFileExt(task.href) : "FILE"} &middot; {task.size}</span>
          </div>
        </div>
      </div>

      {task.href ? (
        <div className="flex shrink-0 items-center gap-2 self-start sm:self-auto">
          <a
            href={getDownloadHref(task)}
            download
            className="flex items-center justify-center gap-2 rounded-full border border-clay/50 px-4 py-2 text-[10px]! font-semibold text-clay-deep transition-colors duration-300 hover:bg-clay hover:text-white-warm"
          >
            <Download size={14} strokeWidth={2} />
            Unduh
          </a>
          <a
            href={task.href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 rounded-full border border-clay/50 px-4 py-2 text-[10px]! font-semibold text-clay-deep transition-colors duration-300 hover:bg-clay hover:text-white-warm"
          >
            <ExternalLink size={14} strokeWidth={2} />
            Buka
          </a>
        </div>
      ) : (
        <span className="self-start text-[10px]! font-medium text-ink-soft/70 sm:self-auto">
          Berkas belum tersedia
        </span>
      )}
    </motion.div>
  );
}
