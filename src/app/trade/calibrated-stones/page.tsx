import React from "react";
import { LooseGemstones } from "@/components/LooseGemstones/LooseGemstones";

export const metadata = {
  title: "Calibrated Gemstones - Wholesale | B.V. Gems",
  description: "Shop precision-calibrated wholesale gemstones for your custom jewelry designs.",
};

export default function TradeCalibratedStonesPage() {
  return (
    <div className="w-full">
      <div className="bg-[#0b182d] text-white py-12 px-6 text-center">
        <h1 className="text-3xl md:text-4xl uppercase tracking-widest font-light mb-4">
          Calibrated Stones
        </h1>
        <p className="text-gray-300 font-light max-w-2xl mx-auto">
          Precision-cut wholesale gemstones, strictly graded for consistent color and quality.
        </p>
      </div>
      <LooseGemstones />
    </div>
  );
}
