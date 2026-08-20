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
  return <CommonGridView isBead={true} initialData={{ beads }} />;
}
