import { notFound } from "next/navigation";
import ViewerToolbar from "./ViewerToolbar";

// Mirrors /api/download's SSRF guard — this page embeds whatever `url` it's
// given, so it must only ever be pointed at our own uploaded files (either a
// same-origin relative path in local/self-hosted mode, or our own Blob
// storage domain in production).
const ALLOWED_HOSTNAME = /\.public\.blob\.vercel-storage\.com$/;

function isAllowedUrl(url: string): boolean {
  if (url.startsWith("/")) return true;
  try {
    const parsed = new URL(url);
    return parsed.protocol === "https:" && ALLOWED_HOSTNAME.test(parsed.hostname);
  } catch {
    return false;
  }
}

export default async function ViewMediaPage({
  searchParams,
}: {
  searchParams: Promise<{ url?: string; name?: string }>;
}) {
  const { url, name } = await searchParams;
  if (!url || !isAllowedUrl(url)) notFound();

  const ext = url.split(/[?#]/)[0].split(".").pop() || "";
  const title = name || "Video";
  const filename = `${title}${ext ? `.${ext}` : ""}`;
  const downloadHref = /^https?:\/\//i.test(url)
    ? `/api/download?url=${encodeURIComponent(url)}&name=${encodeURIComponent(filename)}`
    : url;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black">
      <ViewerToolbar title={title} downloadHref={downloadHref} />
      <div className="flex flex-1 items-center justify-center overflow-hidden p-4">
        {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
        <video
          src={url}
          controls
          autoPlay
          className="max-h-full max-w-full rounded-lg shadow-2xl"
        />
      </div>
    </div>
  );
}
