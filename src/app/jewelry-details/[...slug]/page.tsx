import { permanentRedirect } from "next/navigation";
import { formatJewelryVariantSlug } from "@/utils/seoUrlHelpers";

type Props = {
  params: Promise<{ slug?: string[] }>;
};

export default async function JewelryDetailsCatchAll({ params }: Props) {
  const resolvedParams = await params;
  const slug = resolvedParams?.slug || [];

  if (slug.length === 0) {
    permanentRedirect("/jewelry/rings");
  }

  if (slug.length === 1) {
    permanentRedirect(`/jewelry/${slug[0]}`);
  }

  if (slug.length === 2) {
    permanentRedirect(`/jewelry/${slug[0]}/${slug[1]}`);
  }

  // 3 or more segments: category, product, stone
  const category = slug[0];
  const product = slug[1];
  const rawStone = slug.slice(2).join("-");
  const stone = formatJewelryVariantSlug(rawStone);

  if (stone) {
    permanentRedirect(`/jewelry/${category}/${product}/${stone}`);
  } else {
    permanentRedirect(`/jewelry/${category}/${product}`);
  }
}
