export function Field({
  label,
  children,
  hint,
}: {
  label: string;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-gray-700">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-xs text-gray-400">{hint}</span>}
    </label>
  );
}

export const inputClass =
  "w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-gray-400 focus:ring-2 focus:ring-gray-100";

export const buttonPrimaryClass =
  "inline-flex items-center justify-center gap-2 rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-gray-700 active:bg-gray-800 disabled:opacity-50 disabled:hover:bg-gray-900";

export const buttonSecondaryClass =
  "inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50";

export const buttonDangerClass =
  "inline-flex items-center justify-center gap-2 rounded-lg border border-red-200 bg-white px-3.5 py-2 text-xs font-medium text-red-600 transition-colors hover:bg-red-50";

export function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-xl border border-gray-200 bg-white p-6 shadow-sm ${className}`}>
      {children}
    </div>
  );
}

export function PageHeader({ title, description }: { title: string; description?: string }) {
  return (
    <div className="mb-8">
      <h1 className="font-display text-2xl text-gray-900">{title}</h1>
      {description && <p className="mt-1.5 text-sm text-gray-500">{description}</p>}
    </div>
  );
}

export function Badge({
  children,
  tone = "neutral",
}: {
  children: React.ReactNode;
  tone?: "neutral" | "dark" | "danger";
}) {
  const toneClass =
    tone === "dark"
      ? "bg-gold-500 text-white"
      : tone === "danger"
        ? "bg-red-50 text-red-600"
        : "bg-gray-100 text-gray-600";
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide ${toneClass}`}>
      {children}
    </span>
  );
}
