import type { Metadata } from "next";
import { fetchProductByHandle } from "@/apis/api";
import JewelryProductPage from "@/components/Jewerly/JewerlyProductPage";

type Props = {
  params: Promise<{ product: string; category: string }>; // ✅ Changed to Promise
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { product: productHandle, category } = await params; // ✅ Await params
  const response = await fetchProductByHandle(productHandle);
  const product = response?.product;

  if (!product) {
    return {
      title: "Jewelry Not Found – B.V. Gems",
      description: "This jewelry item is currently unavailable at B.V. Gems.",
    };
  }

  const title = product?.title || "Fine Jewelry";
  const gemstone = product?.gemstone?.value || "";
  const price = product?.variants?.edges?.[0]?.node?.price?.amount || "";

  return {
    title: `${title} ${gemstone ? `– ${gemstone}` : ""} | B.V. Gems`,
    description: `Shop ${title}${
      gemstone ? ` with ${gemstone}` : ""
    } at B.V. Gems. Ethically sourced, crafted with precision, starting at $${price}. Free U.S. shipping.`,
    openGraph: {
      title: `${title} | B.V. Gems`,
      description: `Explore ${title} at B.V. Gems. Ethically sourced gemstones, precision craftsmanship, insured delivery.`,
      images: product?.images?.edges?.map((img: any) => img?.node?.url) || [],
      url: `https://bvgems.com/jewelry/${category}/${productHandle}`,
      siteName: "B.V. Gems",
      type: "website",
    },
  };
}

export default function Page() {
  // ✅ No props needed - JewelryProductPage uses useParams() internally
  return <JewelryProductPage />;
}

