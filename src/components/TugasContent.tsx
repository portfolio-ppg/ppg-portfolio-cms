"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FolderOpen } from "lucide-react";
import TaskCard, { type Task } from "@/components/TaskCard";
import type { TaskItem, TaskCategory } from "@/lib/types";

function formatDate(iso: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
}

const ALL = "__all__";

/**
 * Orders tasks by category (matching the category tabs' order, with
 * uncategorized tasks last), and within each category puts "Analisis ..."
 * items first. Array.prototype.sort is stable, so tasks that are equal on
 * both keys keep their original relative order.
 */
function sortTasks(tasks: TaskItem[], categories: TaskCategory[]): TaskItem[] {
  const categoryOrder = new Map(categories.map((c, i) => [c.id, i]));
  const rank = (t: TaskItem) => ({
    category: categoryOrder.get(t.categoryId) ?? categories.length,
    analysisFirst: t.title.trim().toLowerCase().startsWith("analisis") ? 0 : 1,
  });

  return [...tasks].sort((a, b) => {
    const ra = rank(a);
    const rb = rank(b);
    return ra.category - rb.category || ra.analysisFirst - rb.analysisFirst;
  });
}

export default function TugasContent({
  tasks,
  categories,
}: {
  tasks: TaskItem[];
  categories: TaskCategory[];
}) {
  const [activeCategory, setActiveCategory] = useState(ALL);

  const filtered = sortTasks(tasks, categories).filter(
    (t) => activeCategory === ALL || t.categoryId === activeCategory
  );

  const list: Task[] = filtered.map((t) => ({
    title: t.title,
    course: t.course,
    date: formatDate(t.date),
    size: t.size,
    href: t.fileUrl,
  }));

  return (
    <main className="mx-auto max-w-6xl px-6 py-12 md:px-10 md:py-12 lg:px-10 lg:py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="max-w-2xl"
      >
        <span className="inline-flex items-center gap-2 rounded-full border border-clay/40 bg-white-warm px-4 py-1.5 text-[9.5px]! font-semibold uppercase tracking-[0.16em] text-clay-deep">
          <FolderOpen size={11} strokeWidth={2} />
          Arsip Perkuliahan
        </span>
        <h1 className="mt-5 font-display text-[30px] text-ink sm:text-5xl">
          Daftar Tugas
        </h1>
        <p className="mt-4 text-[15px] leading-relaxed text-ink-soft">
          Kumpulan tugas dan dokumen perkuliahan. Setiap berkas dapat diunduh
          langsung.
        </p>
      </motion.div>

      {categories.length > 0 && (
        <div className="mt-8 flex flex-wrap gap-2">
          <button
            onClick={() => setActiveCategory(ALL)}
            className={`cursor-pointer rounded-full border px-4 py-2 text-[12px] font-semibold transition-colors duration-300 ${
              activeCategory === ALL
                ? "border-clay bg-clay text-white-warm"
                : "border-stone/50 text-ink-soft hover:border-clay hover:text-ink"
            }`}
          >
            Semua
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`cursor-pointer rounded-full border px-4 py-2 text-[12px] font-semibold transition-colors duration-300 ${
                activeCategory === cat.id
                  ? "border-clay bg-clay text-white-warm"
                  : "border-stone/50 text-ink-soft hover:border-clay hover:text-ink"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      )}

      {list.length === 0 ? (
        <p className="mt-10 text-sm text-ink-soft">
          Belum ada tugas yang diunggah.
        </p>
      ) : (
        <div className="mt-10 flex flex-col gap-4">
          {list.map((task, i) => (
            <TaskCard key={task.href + i} task={task} index={i} />
          ))}
        </div>
      )}
    </main>
  );
}
