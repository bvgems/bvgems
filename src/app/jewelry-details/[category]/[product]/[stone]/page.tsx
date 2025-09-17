import type { Metadata } from "next";
import { fetchProductByHandle } from "@/apis/api";
import JewelryProductPage from "@/components/Jewerly/JewerlyProductPage";

type Props = {
  params: any;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { product: productHandle, category, stone } = await params;
  const response = await fetchProductByHandle(productHandle);
  const product = response?.product;

  if (!product) {
    return {
      title: "Jewelry Not Found – B.V. Gems",
      description: "This jewelry item is currently unavailable at B.V. Gems.",
    };
  }

  const baseTitle = product?.title || "Fine Jewelry";
  const gemstone = stone ? stone.replace(/-/g, " ") : "";

  return {
    title: `${baseTitle} in ${gemstone} | B.V. Gems`,
    description: `Shop the ${baseTitle} crafted with ${gemstone} and diamonds at B.V. Gems. Ethically sourced, free U.S. shipping.`,
    openGraph: {
      title: `${baseTitle} in ${gemstone} | B.V. Gems`,
      description: `Explore ${gemstone} ${baseTitle} at B.V. Gems.`,
      images: product?.images?.edges?.map((img: any) => img?.node?.url) || [],
      url: `https://bvgems.com/jewelry-details/${category}/${productHandle}/${stone}`,
      siteName: "B.V. Gems",
      type: "website",
    },
  };
}

export default async function Page({ params }: { params: any }) {
  return <JewelryProductPage />;
}
