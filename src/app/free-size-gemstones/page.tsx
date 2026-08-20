import type { Metadata } from "next";
import { FreeSizeGemstonesCard } from "@/components/FreeSizeGemtones/FreeSizeGemstonesCard";
import FreeSizeGemstoneSelection from "@/components/FreeSizeGemstones/FreeSizeGemstoneSelection";
import { Suspense } from "react";

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

export default function FreeSizeGemstonePage() {
  return (
    <Suspense fallback={<div className="p-10 text-center">Loading gemstone selection...</div>}>
      <FreeSizeGemstoneSelection />
    </Suspense>
  );
  // <>
  //   {/* <div className="flex justify-center gap-6 py-10 bg-[#E5E7EB]">
  //     <h1 className="text-3xl text-[#6B7280]">Free Size Gemstones</h1>
  //   </div> */}
  //   {/* <FreeSizeGemstonesCard /> */}
  // </>
}
