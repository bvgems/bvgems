// app/free-size-gemstones/page.tsx
import type { Metadata } from "next";
import { PageHeader } from "@/components/CommonComponents/PageHeader";
import FreeSizeGemstoneSelection from "@/components/FreeSizeGemstones/FreeSizeGemstoneSelection";

export const metadata: Metadata = {
  title: "Free Size Gemstones – Sapphire, Ruby & Emerald | B.V. Gems",
  description:
    "Explore free size gemstones at B.V. Gems. Shop natural sapphires, rubies, emeralds & more. Perfect for unique jewelry designs. Ethically sourced & certified.",
  openGraph: {
    title: "Free Size Gemstones – Sapphire, Ruby & Emerald | B.V. Gems",
    description:
      "Browse our exclusive free size gemstone collection at B.V. Gems. From sapphires to rubies and emeralds, find unique cuts perfect for your custom jewelry.",
    url: "https://www.bvgems.com/free-size-gemstones",
    siteName: "B.V. Gems",
    type: "website",
  },
};

export default async function FreeSizeGemstonePage({ params }: { params: Promise<{ stone: string }> }) {
  const { stone } = await params;
  const formattedStone = stone.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase());

  return (
    <div className="w-full">
      <PageHeader 
        title={`${formattedStone} Free Size`} 
        subtitle={`Explore our exclusive collection of ${formattedStone} free size gemstones.`} 
      />
      <FreeSizeGemstoneSelection />
    </div>
  );
}
