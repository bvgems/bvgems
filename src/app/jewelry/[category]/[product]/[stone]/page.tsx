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
      robots: { index: false, follow: true },
    };
  }

  const baseTitle = product?.title || "Fine Jewelry";
  const gemstone = stone ? stone.replace(/-/g, " ") : "";
  const metal = product?.goldType?.value || "14K Gold";
  const cleanTitle = gemstone ? `${gemstone} ${baseTitle} in ${metal}` : `${baseTitle} in ${metal}`;

  return {
    title: `${cleanTitle} | B.V. Gems`,
    description: `Shop the ${cleanTitle} at B.V. Gems. Ethically sourced, free U.S. shipping on or above $200.`,
    robots: { index: false, follow: true },
    openGraph: {
      title: `${cleanTitle} | B.V. Gems`,
      description: `Explore ${cleanTitle} at B.V. Gems.`,
      images: product?.images?.edges?.map((img: any) => img?.node?.url) || [],
      url: `https://www.bvgems.com/jewelry/${category}/${productHandle}/${stone}`,
      siteName: "B.V. Gems",
      type: "website",
    },
    alternates: {
      canonical: `https://www.bvgems.com/jewelry/${category}/${productHandle}/${stone}`,
    },
  };
}

export default async function Page({ params }: { params: any }) {
  return <JewelryProductPage />;
}
