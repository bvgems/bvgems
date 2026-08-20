import { getCategoryData } from "@/apis/api";
import { CategoryContent } from "@/components/Category/CategoryContent";
import { Metadata } from "next";

type PageProps = {
  params: Promise<{ handle: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { handle } = await params;
  const data: any = await getCategoryData(handle);

  if (!data) {
    return {
      title: "Gemstone Collection | B.V. Gems",
      description:
        "Explore natural & lab-grown gemstones from B.V. Gems — trusted NYC Diamond District supplier of sapphires, rubies, emeralds & more.",
      keywords: [
        "loose gemstones",
        "wholesale gemstones NYC",
        "diamond district gemstones",
        "calibrated gemstones",
        "custom jewelry stones",
      ],
      alternates: {
        canonical: `https://www.bvgems.com/${handle}`,
      },
      openGraph: {
        title: "Gemstone Collection | B.V. Gems",
        description:
          "Shop ethically sourced gemstones for fine jewelry & custom designs. Calibrated stones available for wholesale in New York.",
        url: `https://www.bvgems.com/${handle}`,
        siteName: "B.V. Gems",
        type: "website",
        images: [
          {
            url: data?.image || "/default-gemstone.jpg",
            width: 800,
            height: 800,
            alt: "B.V. Gems gemstone collection",
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: "Gemstone Collection | B.V. Gems",
        description:
          "Natural & lab-grown gemstones from B.V. Gems in NYC Diamond District. Shop sapphires, rubies, emeralds & more.",
        images: [data?.image || "/default-gemstone.jpg"],
      },
    };
  }

  const gemstoneName = data?.name || handle;
  const formattedName =
    gemstoneName.charAt(0).toUpperCase() + gemstoneName.slice(1);

  return {
    title: `${formattedName} – Natural & Wholesale Loose ${formattedName} Gemstones | B.V. Gems NYC`,
    description: `Shop ${formattedName.toLowerCase()} gemstones at B.V. Gems, NYC Diamond District. Discover natural & lab-grown loose ${formattedName.toLowerCase()} stones in calibrated sizes, perfect for rings, necklaces, and custom jewelry.`,
    keywords: [
      `${formattedName} gemstones`,
      `loose ${formattedName}`,
      `wholesale ${formattedName} NYC`,
      `calibrated ${formattedName} stones`,
      `natural ${formattedName} jewelry`,
      "diamond district gemstones",
    ],
    alternates: {
      canonical: `https://www.bvgems.com/${handle}`,
    },
    openGraph: {
      title: `${formattedName} – Natural & Wholesale Loose ${formattedName} Gemstones | B.V. Gems`,
      description: `Browse our ${formattedName.toLowerCase()} gemstone collection. Ethically sourced, calibrated stones in a variety of shapes & sizes for jewelers & designers.`,
      url: `https://www.bvgems.com/${handle}`,
      siteName: "B.V. Gems",
      type: "website",
      images: [
        {
          url: data?.image || "/default-gemstone.jpg",
          width: 800,
          height: 800,
          alt: `${formattedName} gemstone collection`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${formattedName} Gemstones | B.V. Gems NYC`,
      description: `Explore ${formattedName.toLowerCase()} gemstones at B.V. Gems. Loose calibrated stones available for wholesale in NYC’s Diamond District.`,
      images: [data?.image || "/default-gemstone.jpg"],
    },
  };
}

export default async function CategoryPage({ params }: PageProps) {
  const { handle } = await params;

  const isSapphire = handle === "sapphire";
  const isEmerald = handle === "emerald";
  const data: any = await getCategoryData(handle);

  const shapes = data?.shapes?.value?.split(",").map((s: any) => s.trim());

  return (
    <div>
      <CategoryContent
        isSapphire={isSapphire}
        isEmerald={isEmerald}
        data={data}
        shapes={shapes}
        handle={handle}
      />
    </div>
  );
}
