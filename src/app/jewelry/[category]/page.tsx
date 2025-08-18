import type { Metadata } from "next";
import { CommonGridView } from "@/components/CommonComponents/CommonGridView";

type Props = {
  params: Promise<{ category: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;

  const formattedCategory =
    category.charAt(0).toUpperCase() + category.slice(1).toLowerCase();

  return {
    title: `Fine Gemstone ${formattedCategory} – Shop Online | B.V. Gems`,
    description: `Shop fine gemstone ${formattedCategory.toLowerCase()} at B.V. Gems. Discover sapphire, emerald, ruby & diamond jewelry. Ethically sourced, free U.S. shipping.`,
    openGraph: {
      title: `Fine Gemstone ${formattedCategory} – Shop Online | B.V. Gems`,
      description: `Explore exquisite ${formattedCategory.toLowerCase()} from B.V. Gems. Sapphire, emerald, ruby & diamond jewelry crafted with precision.`,
      url: `https://bvgems.com/jewelry/${category}`,
      siteName: "B.V. Gems",
      type: "website",
    },
  };
}

export default function JewelryCategoryPage() {
  return <CommonGridView />;
}
