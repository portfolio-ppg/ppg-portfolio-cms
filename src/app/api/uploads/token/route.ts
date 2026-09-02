import { NextRequest, NextResponse } from "next/server";
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { getSessionUser, canManagePortfolio } from "@/lib/auth";
import { MAX_UPLOAD_MB } from "@/lib/upload";

/**
 * Issues short-lived client tokens so the browser can upload straight to
 * Vercel Blob (see src/lib/upload-client.ts), bypassing this server's
 * request-body limit entirely. Only used when BLOB_READ_WRITE_TOKEN is set —
 * self-hosted/local dev uploads go through /api/uploads instead.
 */
export async function POST(request: NextRequest) {
  const session = await getSessionUser();
  if (!session) {
    return NextResponse.json({ error: "Anda harus masuk untuk mengunggah file." }, { status: 401 });
  }

  const body = (await request.json()) as HandleUploadBody;

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname, clientPayloadRaw) => {
        const payload = clientPayloadRaw ? JSON.parse(clientPayloadRaw) : {};
        const username = String(payload.username || session.username).toLowerCase();

        if (!canManagePortfolio(session, username)) {
          throw new Error("Anda tidak memiliki izin mengunggah ke portofolio ini.");
        }
        if (!pathname.startsWith(`uploads/${username}/`)) {
          throw new Error("Path unggah tidak valid.");
        }

        return {
          allowedContentTypes: undefined,
          maximumSizeInBytes: MAX_UPLOAD_MB * 1024 * 1024,
          addRandomSuffix: false,
          allowOverwrite: true,
        };
      },
    });

    return NextResponse.json(jsonResponse);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Gagal membuat token unggah." },
      { status: 400 }
    );
  }
}
