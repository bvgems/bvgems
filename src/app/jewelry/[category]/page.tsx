import type { Metadata } from "next";
import { CommonGridView } from "@/components/CommonComponents/CommonGridView";
import { getJewelryData } from "@/apis/api";

type Props = {
  params: Promise<{ category: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;

  const formattedCategory =
    category.charAt(0).toUpperCase() + category.slice(1).toLowerCase();

  return {
    title: `Fine Gemstone ${formattedCategory} – Shop Online | B.V. Gems`,
    description: `Shop fine gemstone ${formattedCategory.toLowerCase()} at B.V. Gems. Discover sapphire, emerald, ruby & diamond jewelry. Ethically sourced, free U.S. shipping on or above $200.`,
    openGraph: {
      title: `Fine Gemstone ${formattedCategory} – Shop Online | B.V. Gems`,
      description: `Explore exquisite ${formattedCategory.toLowerCase()} from B.V. Gems. Sapphire, emerald, ruby & diamond jewelry crafted with precision.`,
      url: `https://www.bvgems.com/jewelry/${category}`,
      siteName: "B.V. Gems",
      type: "website",
    },
  };
}

export default async function JewelryCategoryPage({ params }: Props) {
  const { category } = await params;
  const response = await getJewelryData(category);
  const products = response?.products || [];

  return <CommonGridView initialData={{ allProducts: products }} />;
}
