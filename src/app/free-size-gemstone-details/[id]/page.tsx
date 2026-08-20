import { fetchFreeSizeGemstonesById } from "@/apis/api";
import { Metadata } from "next";
import FreeSizeGemstoneDetails from "@/components/FreeSizeGemstones/FreeSizeGemstonesDetails";

type PageProps = {
  params: Promise<{ id: string }>; // ✅ Changed to Promise
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params; // ✅ Await params
  const product = await fetchFreeSizeGemstonesById(id);

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
      url: `https://www.bvgems.com/free-size-gemstone-details/${id}`,
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

export default async function Page({ params }: PageProps) {
  const { id } = await params; // ✅ Await params
  return <FreeSizeGemstoneDetails id={id} />;
}
