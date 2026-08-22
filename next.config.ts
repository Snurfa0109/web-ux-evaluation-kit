import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  generateBuildId: async () => {
    return `evalux-${Date.now()}`
  },
};

export default nextConfig;
