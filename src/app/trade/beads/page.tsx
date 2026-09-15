import React from "react";
import PreciousBeads from "@/app/precious-beads/page";

export const metadata = {
  title: "Precious Beads - Wholesale | B.V. Gems",
  description: "Shop wholesale precious gemstone beads including moonstone, emerald, and sapphire.",
};

export default function TradeBeadsPage() {
  return (
    <div className="w-full">
      <div className="bg-[#0b182d] text-white py-12 px-6 text-center">
        <h1 className="text-3xl md:text-4xl uppercase tracking-widest font-light mb-4">
          Precious Beads
        </h1>
        <p className="text-gray-300 font-light max-w-2xl mx-auto">
          High-quality loose beads and finished bead necklaces for the trade.
        </p>
      </div>
      <PreciousBeads />
    </div>
  );
}
