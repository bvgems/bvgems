import type { Metadata } from "next";
import { Montserrat, Alice } from "next/font/google";
import "@mantine/core/styles.css";
import "@mantine/carousel/styles.css";
import "@mantine/notifications/styles.css";
import "./globals.css";
import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { ClientOnlyLayout } from "@/components/Layout/ClientOnlyLayout";
import { EmailSubscribeModal } from "@/components/CommonComponents/EmailSubscribeModal";
import Script from "next/script";

const siteUrl = "https://bvgems.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "B. V. Gems | Fine Gemstones & Jewelry",
    template: "%s | B. V. Gems",
  },
  description:
    "Shop exquisite natural & lab-grown gemstones, fine jewelry, and custom designs at B. V. Gems. Quality, craftsmanship, and timeless beauty—delivered worldwide.",
  keywords: [
    "B. V. Gems",
    "gemstones",
    "jewelry",
    "engagement rings",
    "lab-grown diamonds",
    "natural gemstones",
    "custom jewelry",
    "precious stones",
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
    siteName: "B. V. Gems",
    title: "B. V. Gems | Fine Gemstones & Jewelry",
    description:
      "Discover exquisite gemstones & handcrafted jewelry. Natural and lab-grown stones with worldwide shipping.",
    images: [
      {
        url: `https://res.cloudinary.com/dabdvgxd4/image/upload/v1755204867/hv55w43ddxqmlpjkb2tc.png`,
        width: 1200,
        height: 630,
        alt: "B. V. Gems - Fine Gemstones & Jewelry",
      },
    ],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  themeColor: "#ffffff",
};

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const alice = Alice({
  subsets: ["latin"],
  weight: "400",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
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
        <Script
          id="ld-json-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "JewelryStore",
              name: "B. V. Gems",
              image: `${siteUrl}/og-image.jpg`,
              "@id": siteUrl,
              url: siteUrl,
              telephone: "+1-XXX-XXX-XXXX",
              address: {
                "@type": "PostalAddress",
                streetAddress: "Your Street Address",
                addressLocality: "New York",
                addressRegion: "NY",
                postalCode: "10001",
                addressCountry: "US",
              },
              sameAs: [
                "https://www.instagram.com/bvgems",
                "https://www.facebook.com/bvgems",
              ],
            }),
          }}
        />
      </head>
      <body className={`${montserrat.className} ${alice.className}`}>
        <MantineProvider>
          <Notifications />
          <ClientOnlyLayout>
            <EmailSubscribeModal />
            {children}
          </ClientOnlyLayout>
        </MantineProvider>
      </body>
    </html>
  );
}
