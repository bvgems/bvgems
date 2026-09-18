import type { Metadata } from "next";
import { getParticularProductsData } from "@/apis/api";
import { generateCalibratedStoneUrl } from "@/utils/seoUrlHelpers";

type Props = {
  params: Promise<{ slug?: string; id?: string }>;
  searchParams: Promise<{ id?: string }>;
};

export async function generateMetadata({
  params,
  searchParams,
}: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  
  let id = resolvedSearchParams?.id;
  if (resolvedParams?.slug) {
    id = resolvedParams.slug.split("-").pop();
  } else if (resolvedParams?.id) {
    id = resolvedParams.id;
  }
  
  const product = await getParticularProductsData(id || "");

  if (!product) {
    return {
      title: "Gemstone Not Found – B.V. Gems",
      description: "This gemstone is currently unavailable at B.V. Gems.",
    };
  }

  const canonicalUrl = `https://www.bvgems.com${generateCalibratedStoneUrl(product, product.collection_slug)}`;

  return {
    title: `${product.collection_slug} ${product.shape} ${product.size} ${product.ct_weight}ct ${product.quality} Quality – B.V. Gems`,
    description: `Buy ${product.collection_slug} ${product.shape} ${product.size}, ${product.ct_weight} ct, ${product.quality} quality at B.V. Gems. Ethically sourced, precision cut, free U.S. shipping on or above $200.`,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${product.collection_slug} ${product.shape} ${product.size} ${product.ct_weight}ct ${product.quality} Quality – B.V. Gems`,
      description: `Shop ${product.collection_slug} gemstones at B.V. Gems. Ethically sourced, precision cut, and shipped worldwide.`,
      url: canonicalUrl,
      images: [product.image_url],
    },
  };
}
