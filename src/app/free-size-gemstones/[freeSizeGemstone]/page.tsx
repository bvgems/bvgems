// app/free-size-gemstones/page.tsx
import type { Metadata } from "next";
import FreeSizeGemstoneSelection from "@/components/FreeSizeGemstones/FreeSizeGemstoneSelection";

export const metadata: Metadata = {
  title: "Free Size Gemstones – Sapphire, Ruby & Emerald | B.V. Gems",
  description:
    "Explore free size gemstones at B.V. Gems. Shop natural sapphires, rubies, emeralds & more. Perfect for unique jewelry designs. Ethically sourced & certified.",
  openGraph: {
    title: "Free Size Gemstones – Sapphire, Ruby & Emerald | B.V. Gems",
    description:
      "Browse our exclusive free size gemstone collection at B.V. Gems. From sapphires to rubies and emeralds, find unique cuts perfect for your custom jewelry.",
    url: "https://bvgems.com/free-size-gemstones",
    siteName: "B.V. Gems",
    type: "website",
  },
};

export default function FreeSizeGemstonePage() {
  return <FreeSizeGemstoneSelection />;
}
