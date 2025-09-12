"use client";

import { ColorstoneLayoutListing } from "@/components/ColorstoneLayouts/ColorstoneLayoutListing";
import { ColorstoneLayoutsHero } from "@/components/ColorstoneLayouts/ColorstoneLayoutsHero";
import { MostSoldLayouts } from "@/components/ColorstoneLayouts/MostSoldLayouts";
import { AnimatedText } from "@/components/CommonComponents/AnimatedText";

export default function ColorstoneLayouts() {
  return (
    <div>
      <ColorstoneLayoutsHero />
      {/* <AnimatedText
        text="Limited Time Offers"
        className="text-center text-4xl text-[#6B7280] mt-12"
      /> */}
      {/* <MostSoldLayouts /> */}
      <ColorstoneLayoutListing />
    </div>
  );
}
