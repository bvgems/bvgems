import type { Metadata } from "next";
import { getParticularProductsData } from "@/apis/api";

type Props = {
  searchParams: Promise<{ id: string }>; // ✅ Already a Promise, but need to await it
};

export async function generateMetadata({
  searchParams,
}: Props): Promise<Metadata> {
  const { id } = await searchParams; // ✅ Await searchParams
  const product = await getParticularProductsData(id);

  if (!product) {
    return {
      title: "Gemstone Not Found – B.V. Gems",
      description: "This gemstone is currently unavailable at B.V. Gems.",
    };
  }

  return {
    title: `${product.collection_slug} ${product.shape} ${product.size} ${product.ct_weight}ct ${product.quality} Quality – B.V. Gems`,
    description: `Buy ${product.collection_slug} ${product.shape} ${product.size}, ${product.ct_weight} ct, ${product.quality} quality at B.V. Gems. Ethically sourced, precision cut, free U.S. shipping.`,
    openGraph: {
      title: `${product.collection_slug} ${product.shape} ${product.size} ${product.ct_weight}ct ${product.quality} Quality – B.V. Gems`,
      description: `Shop ${product.collection_slug} gemstones at B.V. Gems. Ethically sourced, precision cut, and shipped worldwide.`,
      images: [product.image_url],
    },
  };
}
