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
        destination: "/sapphire", 
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
