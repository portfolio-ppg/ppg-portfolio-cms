import type { NextConfig } from "next";

// NOTE: `output: "export"` was removed. The CMS (admin login, file uploads,
// dynamic pages) needs a live Node.js server to run — a static export has
// no backend to talk to. Deploy with `npm run build && npm start` on any
// Node host (VPS, Railway, Render, a Docker container, etc). GitHub Pages
// (static hosting) can no longer be used for this project. See
// README-CMS.md for details.
const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com",
      },
    ],
  },
};

export default nextConfig;
