"use client";

import { useEffect, useRef, useState } from "react";
import {
  Bold,
  Italic,
  Underline,
  Heading3,
  Pilcrow,
  List,
  ListOrdered,
  Quote,
  Link2,
  RemoveFormatting,
} from "lucide-react";
import { plainTextToHtml } from "@/components/RichText";

type Command = {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  run: () => void;
};

// document.execCommand is deprecated but still supported by every browser
// and is all a small paragraph/list editor needs — no editor dependency.
function exec(command: string, value?: string) {
  document.execCommand(command, false, value);
}

/**
 * Lightweight WYSIWYG field. Submits its HTML through a hidden input named
 * `name`, so it drops into existing server-action forms; the server
 * sanitizes it (lib/rich-text.ts) before saving.
 */
export default function RichTextEditor({
  name,
  defaultValue = "",
  minHeight = 160,
}: {
  name: string;
  defaultValue?: string;
  minHeight?: number;
}) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [html, setHtml] = useState(() => plainTextToHtml(defaultValue));

  // Set initial content once — re-rendering innerHTML on every keystroke
  // would reset the caret position.
  useEffect(() => {
    if (editorRef.current) editorRef.current.innerHTML = html;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function sync() {
    setHtml(editorRef.current?.innerHTML ?? "");
  }

  function apply(fn: () => void) {
    editorRef.current?.focus();
    fn();
    sync();
  }

  const commands: Command[] = [
    { icon: Bold, label: "Tebal", run: () => exec("bold") },
    { icon: Italic, label: "Miring", run: () => exec("italic") },
    { icon: Underline, label: "Garis bawah", run: () => exec("underline") },
    { icon: Heading3, label: "Subjudul", run: () => exec("formatBlock", "<h3>") },
    { icon: Pilcrow, label: "Paragraf", run: () => exec("formatBlock", "<p>") },
    { icon: List, label: "Daftar poin", run: () => exec("insertUnorderedList") },
    { icon: ListOrdered, label: "Daftar bernomor", run: () => exec("insertOrderedList") },
    { icon: Quote, label: "Kutipan", run: () => exec("formatBlock", "<blockquote>") },
    {
      icon: Link2,
      label: "Tautan",
      run: () => {
        const url = window.prompt("Masukkan URL tautan:", "https://");
        if (url) exec("createLink", url);
      },
    },
    {
      icon: RemoveFormatting,
      label: "Hapus format",
      run: () => {
        exec("removeFormat");
        exec("formatBlock", "<p>");
      },
    },
  ];

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white focus-within:border-gray-400 focus-within:ring-2 focus-within:ring-gray-100">
      <input type="hidden" name={name} value={html} />
      <div className="flex flex-wrap gap-0.5 border-b border-gray-200 bg-gray-50 px-1.5 py-1">
        {commands.map(({ icon: Icon, label, run }) => (
          <button
            key={label}
            type="button"
            title={label}
            aria-label={label}
            // preventDefault keeps the editor's text selection while clicking the toolbar.
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => apply(run)}
            className="rounded-md p-1.5 text-gray-600 transition-colors hover:bg-gray-200 hover:text-gray-900"
          >
            <Icon className="h-4 w-4" />
          </button>
        ))}
      </div>
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={sync}
        onBlur={sync}
        className="rich-text px-3.5 py-2.5 text-sm text-gray-900 outline-none"
        style={{ minHeight }}
      />
    </div>
  );
}
