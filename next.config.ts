import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/bracelets",
        destination: "/jewelry/bracelets", 
        permanent: true,
      },
      {
        source: "/sapphire",
        destination: "sapphires", 
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
