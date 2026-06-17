import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  transpilePackages: ["@malay/shared", "@malay/db"],
};

export default nextConfig;
