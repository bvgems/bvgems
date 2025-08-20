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
        "Explore our exquisite collection of natural & lab-grown gemstones at B.V. Gems.",
      openGraph: {
        title: "Gemstone Collection | B.V. Gems",
        description:
          "Shop ethically sourced gemstones for fine jewelry & custom designs.",
        url: `https://bvgems.com/${handle}`,
        siteName: "B.V. Gems",
        type: "website",
      },
    };
  }

  const gemstoneName = data?.name || handle;
  const formattedName =
    gemstoneName.charAt(0).toUpperCase() + gemstoneName.slice(1);

  return {
    title: `${formattedName} – Natural & Lab Grown Loose ${formattedName} Gemstones | B.V. Gems`,
    description: `Shop ${formattedName.toLowerCase()} gemstones at B.V. Gems. Discover natural loose ${formattedName.toLowerCase()} stones in various shapes and sizes, perfect for rings, necklaces, and custom jewelry.`,
    openGraph: {
      title: `${formattedName} – Natural & Lab Grown Loose ${formattedName} Gemstones | B.V. Gems`,
      description: `Browse our ${formattedName.toLowerCase()} gemstone collection. Choose from a variety of shapes, sizes, and qualities, ethically sourced for your jewelry needs.`,
      url: `https://bvgems.com/${handle}`,
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
  };
}

export default async function CategoryPage({ params }: PageProps) {
  const { handle } = await params;
  console.log('handle ********',handle)
  const isSapphire = handle === "sapphire";
  const isEmerald = handle === "emerald";
  const data: any = await getCategoryData(handle);
  console.log('dataaaa',data)
  const shapes = data?.shapes?.value?.split(",").map((s: any) => s.trim());

  return (
    <div>
      <CategoryContent
        isSapphire={isSapphire}
        isEmerald={isEmerald}
        data={data}
        shapes={shapes}
      />
    </div>
  );
}
