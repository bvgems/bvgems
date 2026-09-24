import type { Metadata } from "next";
import { CommonGridView } from "@/components/CommonComponents/CommonGridView";
import { fetchBeads } from "@/apis/api";

export const metadata: Metadata = {
  title: "Precious Gemstone Beads – Moonstone, Emerald & More | B.V. Gems",
  description:
    "Shop precious gemstone beads at B.V. Gems. Discover moonstone, emerald, ruby, sapphire beads and more. Ethically sourced, high quality, free U.S. shipping on or above $200.",
  openGraph: {
    title: "Precious Gemstone Beads – Moonstone, Emerald & More | B.V. Gems",
    description:
      "Explore our collection of precious gemstone beads at B.V. Gems. From moonstone to emerald and ruby, find ethically sourced beads with insured delivery.",
    url: "https://www.bvgems.com/precious-beads",
    siteName: "B.V. Gems",
    type: "website",
  },
};

export default async function PreciousBeads() {
  const beads = await fetchBeads();
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
      <CommonGridView isBead={true} initialData={{ beads }} />
    </div>
  );
}
