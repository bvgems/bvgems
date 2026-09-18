import { redirect, permanentRedirect } from "next/navigation";
import { fetchFreeSizeGemstonesById } from "@/apis/api";
import { generateFreeSizeStoneUrl } from "@/utils/seoUrlHelpers";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function FreeSizeRedirect({ params }: Props) {
  const { id } = await params;
  if (!id) permanentRedirect("/free-size-gemstones");
  
  const productData = await fetchFreeSizeGemstonesById(id);
  if (!productData) permanentRedirect("/free-size-gemstones");

  const stoneHandle = productData.gemstone_type?.toLowerCase() || productData.collection_slug?.toLowerCase() || "unknown-stone";
  const newUrl = generateFreeSizeStoneUrl(productData, stoneHandle);
  
  permanentRedirect(newUrl);
}
