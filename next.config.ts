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
        destination: "/calibrated-faceted-gemstones/sapphire", 
        permanent: true,
      }
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'cdn.shopify.com',
      },
      {
        protocol: 'https',
        hostname: 'agta.org',
      },
      {
        protocol: 'https',
        hostname: 'www.jisshow.com',
      },
      {
        protocol: 'https',
        hostname: 'gjx.rocks',
      }
    ],
  },
};

export default nextConfig;
