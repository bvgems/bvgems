import { redirect, permanentRedirect } from "next/navigation";
import { getParticularProductsData } from "@/apis/api";
import { generateCalibratedStoneUrl } from "@/utils/seoUrlHelpers";

type Props = {
  searchParams: Promise<{ id?: string; name?: string }>;
};

export default async function ProductDetailsRedirect({ searchParams }: Props) {
  const { id, name } = await searchParams;
  if (!id) permanentRedirect("/calibrated-stones");
  
  const productData = await getParticularProductsData(id);
  if (!productData) permanentRedirect("/calibrated-stones");

  const stoneHandle = name || productData.collection_slug?.toLowerCase() || "unknown-stone";
  const newUrl = generateCalibratedStoneUrl(productData, stoneHandle);
  
  permanentRedirect(newUrl);
}
