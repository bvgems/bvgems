import { fetchFreeSizeGemstonesById } from "@/apis/api";
import { Metadata } from "next";
import { PageHeader } from "@/components/CommonComponents/PageHeader";
import FreeSizeGemstoneDetails from "@/components/FreeSizeGemstones/FreeSizeGemstonesDetails";

type PageProps = {
  params: Promise<{ stone: string; slug: string }>;
};

// Extractor function to get ID from slug (e.g., natural-blue-sapphire-oval-12345 -> 12345)
const extractIdFromSlug = (slug: string) => {
  const parts = slug.split("-");
  return parts[parts.length - 1]; // Return the last segment which is the ID
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { stone, slug } = await params;
  const id = extractIdFromSlug(slug);
  const product = await fetchFreeSizeGemstonesById(id);

  if (!product) {
    return {
      title: "Gemstone not found | B.V. Gems",
      description: "The gemstone you're looking for is not available.",
    };
  }

  const gemstoneType = product.gemstone_type || "Gemstone";
  const shape = product.shape || "";
  const color = product.color ? `${product.color.toLowerCase()} ` : "";
  const ctWeight = product.ct_weight ?? "";

  return {
    title: `${gemstoneType} ${shape} ${ctWeight}cts. | B.V. Gems`,
    description: `Buy ${ctWeight} carat ${color}${gemstoneType.toLowerCase()}${
      shape ? ` (${shape})` : ""
    } at B.V. Gems. Perfect for rings, necklaces & custom jewelry.`,
    alternates: {
      canonical: `https://www.bvgems.com/free-size-gemstones/${stone}/${slug}`,
    },
    openGraph: {
      title: `${gemstoneType} ${shape} ${ctWeight}cts. | B.V. Gems`,
      description: `Ethically sourced ${gemstoneType.toLowerCase()} gemstones. Lot #${
        product.lot_number || "-"
      }, size ${product.dimension || "-"}, color ${
        product.color || "-"
      }. Shop now at B.V. Gems.`,
      url: `https://www.bvgems.com/free-size-gemstones/${stone}/${slug}`,
      siteName: "B.V. Gems",
      type: "website",
      images: [
        {
          url: product.image_url || "/assets/logo2.webp",
          width: 800,
          height: 800,
          alt: `${gemstoneType} ${shape} gemstone`,
        },
      ],
    },
  };
}

export default async function Page({ params }: PageProps) {
  const { stone, slug } = await params;
  const id = extractIdFromSlug(slug);
  const product = await fetchFreeSizeGemstonesById(id);

  const rawStone = product?.gemstone_type || (stone && stone !== "unknown" && stone !== "unknown-stone" ? stone : "Gemstone");
  const formattedStone = rawStone.replace(/-/g, " ").replace(/\b\w/g, (l: string) => l.toUpperCase());

  return (
    <div className="w-full">
      <PageHeader
        title={`${formattedStone}`}
        subtitle="Review the specifications and high-resolution media for this unique gemstone."
      />
      <FreeSizeGemstoneDetails id={id} />
    </div>
  );
}
