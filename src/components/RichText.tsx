/** True when the stored value is editor HTML rather than legacy plain text. */
export function isHtml(value: string): boolean {
  return /<\/?[a-z][\s\S]*>/i.test(value);
}

function escapeHtml(text: string): string {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/** Converts legacy plain text (blank line = new paragraph) into editor HTML. */
export function plainTextToHtml(text: string): string {
  if (!text.trim() || isHtml(text)) return text;
  return text
    .split(/\n\s*\n/)
    .map((para) => `<p>${escapeHtml(para.trim()).replace(/\n/g, "<br>")}</p>`)
    .join("");
}

/**
 * Renders a CMS rich-text body. HTML is sanitized server-side on save
 * (lib/rich-text.ts); older plain-text values render exactly as before.
 */
export default function RichText({ value, className = "" }: { value: string; className?: string }) {
  if (!isHtml(value)) {
    return <p className={`whitespace-pre-line ${className}`}>{value}</p>;
  }
  return <div className={`rich-text ${className}`} dangerouslySetInnerHTML={{ __html: value }} />;
}
