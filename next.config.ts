import type { NextConfig } from "next";

const remotePatterns: any[] = [
  {
    protocol: "https",
    hostname: "images.unsplash.com",
    pathname: "/**",
  },
];

const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;
if (serverUrl) {
  try {
    const url = new URL(serverUrl);
    remotePatterns.push({
      protocol: url.protocol.replace(":", ""),
      hostname: url.hostname,
      port: url.port || "",
      pathname: "/**",
    });
  } catch (e) {
    console.error("Invalid NEXT_PUBLIC_SERVER_URL in next.config.ts:", e);
  }
}

const nextConfig: NextConfig = {
  images: {
    remotePatterns,
    qualities: [70, 75, 100],
  },
  serverExternalPackages: ["sequelize"],
};

export default nextConfig;
