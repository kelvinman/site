import type { NextConfig } from "next";

// Every page is static, so the site is exported as plain HTML into out/ for Cloudflare to serve.
const nextConfig: NextConfig = {
  output: "export",
};

export default nextConfig;
