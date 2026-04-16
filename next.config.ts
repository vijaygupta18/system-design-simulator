import type { NextConfig } from "next";

const allowedDevOrigins =
  process.env.NEXT_DEV_ORIGINS?.split(",").map((s) => s.trim()).filter(Boolean) ??
  ["localhost:3000", "192.168.1.17:3000", "192.168.1.17"];

const nextConfig: NextConfig = {
  allowedDevOrigins,
  devIndicators: false,
};

export default nextConfig;
