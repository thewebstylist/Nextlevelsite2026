import type { NextConfig } from "next";

// `PAGES_BASE_PATH` is set by the GitHub Pages workflow (e.g. "/Nextlevelsite2026")
// so assets resolve under the project sub-path. Local dev/build leave it empty.
const basePath = process.env.PAGES_BASE_PATH || "";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  ...(basePath ? { basePath, assetPrefix: basePath } : {}),
};

export default nextConfig;
