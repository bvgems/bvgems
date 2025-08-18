import { fetchFreeSizeGemstonesById } from "@/apis/api";
import { Metadata } from "next";
import FreeSizeGemstoneDetails from "@/components/FreeSizeGemstones/FreeSizeGemstonesDetails";

type PageProps = {
  params: { id: string };
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const product = await fetchFreeSizeGemstonesById(params.id);

  if (!product) {
    return {
      title: "Gemstone not found | B.V. Gems",
      description: "The gemstone you're looking for is not available.",
    };
  }

  return {
    title: `${product.gemstone_type} ${product.shape} ${product.ct_weight}cts. | B.V. Gems`,
    description: `Buy ${
      product.ct_weight
    } carat ${product.color.toLowerCase()} ${product.gemstone_type.toLowerCase()} (${
      product.shape
    }) at B.V. Gems. Perfect for rings, necklaces & custom jewelry.`,
    openGraph: {
      title: `${product.gemstone_type} ${product.shape} ${product.ct_weight}cts. | B.V. Gems`,
      description: `Ethically sourced ${product.gemstone_type.toLowerCase()} gemstones. Lot #${
        product.lot_number
      }, size ${product.dimension}, color ${
        product.color
      }. Shop now at B.V. Gems.`,
      url: `https://bvgems.com/free-size-gemstone-details/${params.id}`,
      siteName: "B.V. Gems",
      type: "website",
      images: [
        {
          url: product.image_url,
          width: 800,
          height: 800,
          alt: `${product.gemstone_type} ${product.shape} gemstone`,
        },
      ],
    },
  };
}

export default function Page({ params }: PageProps) {
  return <FreeSizeGemstoneDetails id={params.id} />;
}
