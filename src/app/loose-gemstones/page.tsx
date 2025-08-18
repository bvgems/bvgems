import type { Metadata } from "next";
import { GridView } from "@/components/GridView/GridView";

export const metadata: Metadata = {
  title: "Loose Calibrated Faceted Gemstones – Shop Online | B.V. Gems",
  description:
    "Discover over 5,000 calibrated faceted gemstones at B.V. Gems. Shop natural & lab-grown sapphires, emeralds, rubies, citrine & more. Free U.S. shipping.",
  openGraph: {
    title: "Loose Calibrated Faceted Gemstones – Shop Online | B.V. Gems",
    description:
      "Shop over 5,000 calibrated faceted gemstones at B.V. Gems. Ethically sourced natural & lab-grown sapphires, emeralds, rubies, citrine & more.",
    url: "https://bvgems.com/loose-gemstones",
    siteName: "B.V. Gems",
    type: "website",
  },
};

export default function LooseGemStonesPage() {
  return <GridView />;
}
