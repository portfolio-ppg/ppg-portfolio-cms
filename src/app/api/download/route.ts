import { NextRequest, NextResponse } from "next/server";

// Only proxy files from our own blob storage — this route must not become
// an open proxy for arbitrary URLs (SSRF risk).
const ALLOWED_HOSTNAME = /\.public\.blob\.vercel-storage\.com$/;

function sanitizeFilename(name: string): string {
  return name.replace(/["\r\n]/g, "").trim() || "file";
}

export async function GET(req: NextRequest) {
  const rawUrl = req.nextUrl.searchParams.get("url");
  const rawName = req.nextUrl.searchParams.get("name");

  if (!rawUrl) {
    return NextResponse.json({ error: "Parameter url wajib diisi." }, { status: 400 });
  }

  let target: URL;
  try {
    target = new URL(rawUrl);
  } catch {
    return NextResponse.json({ error: "URL tidak valid." }, { status: 400 });
  }

  if (target.protocol !== "https:" || !ALLOWED_HOSTNAME.test(target.hostname)) {
    return NextResponse.json({ error: "Sumber berkas tidak diizinkan." }, { status: 400 });
  }

  const upstream = await fetch(target.toString());
  if (!upstream.ok || !upstream.body) {
    return NextResponse.json({ error: "Gagal mengambil berkas." }, { status: 502 });
  }

  const filename = sanitizeFilename(rawName || target.pathname.split("/").pop() || "file");

  const headers = new Headers();
  headers.set("Content-Type", upstream.headers.get("content-type") || "application/octet-stream");
  const contentLength = upstream.headers.get("content-length");
  if (contentLength) headers.set("Content-Length", contentLength);
  headers.set(
    "Content-Disposition",
    `attachment; filename="${filename}"; filename*=UTF-8''${encodeURIComponent(filename)}`
  );

  return new NextResponse(upstream.body, { headers });
}
