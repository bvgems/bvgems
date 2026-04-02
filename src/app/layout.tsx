import type { Metadata } from "next";

import "@mantine/core/styles.css";
import "@mantine/carousel/styles.css";
import "@mantine/notifications/styles.css";
import "@mantine/dates/styles.css";
import "./globals.css";
import "leaflet/dist/leaflet.css";
import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { ClientOnlyLayout } from "@/components/Layout/ClientOnlyLayout";
import { EmailSubscribeModal } from "@/components/CommonComponents/EmailSubscribeModal";
import Script from "next/script";

const siteUrl = "https://bvgems.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),

  // 🔹 Title & Description
  title: {
    default: "B.V. Gems | Wholesale Gemstones & Fine Jewelry NYC",
    template: "%s | B.V. Gems Diamond District",
  },
  description:
    "B.V. Gems — trusted wholesale dealer in calibrated & free-size gemstones. Explore sapphires, rubies, emeralds & fine jewelry from NYC’s Diamond District.",

  keywords: [
    "B.V. Gems",
    "loose gemstones",
    "wholesale gemstones NYC",
    "diamond district gemstones",
    "gemstone supplier New York",
    "gemstone dealer NYC",
    "gemstone wholesaler USA",
    "calibrated sapphires",
    "loose rubies",
    "emerald gemstones",
    "moonstone beads",
    "tanzanite gemstones",
    "chalcedony beads",
    "peach moonstone",
    "rainbow sapphire jewelry",
    "fine jewelry NYC",
    "engagement rings",
    "gemstone tennis necklaces",
    "emerald cut jewelry",
    "custom gemstone jewelry",
    "sapphire eternity bands",
    "ruby tennis necklace",
    "rainbow sapphire tennis necklace",
    "certified gemstones",
    "ethically sourced gemstones",
    "gemstone certification",
    "loose calibrated stones",
    "wholesale beads NYC",
    "precious stones supplier",
    "semi-precious stones dealer",
    "gemstones for jewelers",
    "NYC diamond district jewelry",
    "wholesale gemstones Manhattan",
    "gemstone dealer Diamond District",
    "New York gemstone supplier",
    "gemstones 47th street NYC",
  ],

  icons: {
    icon: "/favicon.ico",
  },
  alternates: {
    canonical: siteUrl,
  },

  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "B.V. Gems",
    title: "B.V. Gems | Wholesale Gemstones & Fine Jewelry",
    description:
      "Discover sapphires, rubies, emeralds & custom jewelry from NYC’s Diamond District. Trusted wholesale gemstone dealer with six generations of expertise.",
    images: [
      {
        url: `https://res.cloudinary.com/dabdvgxd4/image/upload/v1755204867/hv55w43ddxqmlpjkb2tc.png`,
        width: 1200,
        height: 630,
        alt: "B.V. Gems - Fine Gemstones & Jewelry",
      },
    ],
  },

  // 🔹 Robots
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      // maxSnippet: -1,
      // maxImagePreview: "large",
      // maxVideoPreview: -1,
    },
  },

  themeColor: "#ffffff",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=5"
        />

        {/* 🔹 JSON-LD Schema.org (expanded with Organization + JewelryStore) */}
        <Script
          id="ld-json-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "JewelryStore",
              name: "B.V. Gems",
              description:
                "Wholesale dealer of calibrated gemstones and fine jewelry in NYC’s Diamond District.",
              image: `https://www.bvgems.com/assets/logo2.png`,
              "@id": siteUrl,
              url: siteUrl,
              telephone: "+1-212-944-4382",
              address: {
                "@type": "PostalAddress",
                streetAddress: "66 W 47th St, Suite XXX",
                addressLocality: "New York",
                addressRegion: "NY",
                postalCode: "10036",
                addressCountry: "US",
              },
              sameAs: ["https://www.instagram.com/bvgemsinc/"],
              priceRange: "$$",
              makesOffer: {
                "@type": "OfferCatalog",
                name: "Gemstone Collections",
                itemListElement: [
                  {
                    "@type": "Offer",
                    itemOffered: {
                      "@type": "Product",
                      name: "Loose Sapphires",
                      category: "Gemstones",
                    },
                  },
                  {
                    "@type": "Offer",
                    itemOffered: {
                      "@type": "Product",
                      name: "Loose Rubies",
                      category: "Gemstones",
                    },
                  },
                  {
                    "@type": "Offer",
                    itemOffered: {
                      "@type": "Product",
                      name: "Loose Emeralds",
                      category: "Gemstones",
                    },
                  },
                ],
              },
            }),
          }}
        />
      </head>
      <body>
        <MantineProvider>
          <Notifications />
          <ClientOnlyLayout>
            {/* <EmailSubscribeModal /> */}
            {children}
          </ClientOnlyLayout>
        </MantineProvider>
      </body>
    </html>
  );
}
