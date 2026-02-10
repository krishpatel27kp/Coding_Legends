import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["lucide-react"],
  serverExternalPackages: ["lightningcss"],
};

export default nextConfig;
