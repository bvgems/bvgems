import React from "react";
import ColorStoneLayouts from "@/app/colorstone-layouts/page";

export const metadata = {
  title: "Colorstone Layouts - Wholesale | B.V. Gems",
  description: "Expertly matched gemstone layouts for your custom jewelry designs.",
};

export default function TradeLayoutsPage() {
  return (
    <div className="w-full">
      <div className="bg-[#0b182d] text-white py-12 px-6 text-center">
        <h1 className="text-3xl md:text-4xl uppercase tracking-widest font-light mb-4">
          Colorstone Layouts
        </h1>
        <p className="text-gray-300 font-light max-w-2xl mx-auto">
          Expertly matched wholesale gemstone layouts for bespoke and production jewelry.
        </p>
      </div>
      <ColorStoneLayouts />
    </div>
  );
}
