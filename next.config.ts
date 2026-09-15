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
        destination: "/trade/calibrated-stones/sapphire", 
        permanent: true,
      },
      {
        source: "/gemstone-collection",
        destination: "/trade/calibrated-stones",
        permanent: true,
      },
      {
        source: "/account-aprooval",
        destination: "/trade/apply",
        permanent: true,
      },
      {
        source: "/account-approval",
        destination: "/trade/apply",
        permanent: true,
      },
      {
        source: "/calibrated-faceted-gemstones",
        destination: "/trade/calibrated-stones",
        permanent: true,
      },
      {
        source: "/calibrated-faceted-gemstones/:stone",
        destination: "/trade/calibrated-stones/:stone",
        permanent: true,
      },
      {
        source: "/colorstone-layouts",
        destination: "/trade/layouts",
        permanent: true,
      },
      {
        source: "/colorstone-layouts/:handle",
        destination: "/trade/layouts/:handle",
        permanent: true,
      },
      {
        source: "/precious-beads",
        destination: "/trade/beads",
        permanent: true,
      },
      {
        source: "/finished-bead-necklaces",
        destination: "/trade/finished-bead-necklaces",
        permanent: true,
      },
      {
        source: "/trade",
        destination: "/",
        permanent: true,
      }
    ];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains; preload",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          }
        ],
      },
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
