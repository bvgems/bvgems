import { getCategoryData } from "@/apis/api";
import { CategoryContent } from "@/components/Category/CategoryContent";
import { Metadata } from "next";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ stone: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({
  params,
  searchParams,
}: PageProps): Promise<Metadata> {
  const { stone } = await params;
  const searchParamsResolved = await searchParams;
  const shape = searchParamsResolved?.shape as string | undefined;
  const color = searchParamsResolved?.color as string | undefined;
  
  let prefix = "";
  if (shape) {
    prefix += `${shape} `;
  }
  if (color && stone === "sapphire") {
    prefix += `${color} `;
  }
  const data: any = await getCategoryData(stone);

  if (!data) {
    return {
      title: "Gemstone Collection | B.V. Gems",
      description: "Explore natural & lab-grown gemstones from B.V. Gems.",
    };
  }

  const gemstoneName = data?.name || stone;
  const formattedName =
    prefix + (gemstoneName.charAt(0).toUpperCase() + gemstoneName.slice(1));
  const urlParams = new URLSearchParams();
  if (shape) urlParams.set("shape", shape);
  if (color && stone === "sapphire") urlParams.set("color", color);
  const paramString = urlParams.toString();
  const canonicalUrl = `https://www.bvgems.com/calibrated-stones/${stone}${paramString ? '?' + paramString : ''}`;

  return {
    title: `${formattedName} – Natural & Wholesale Loose ${formattedName} Gemstones | B.V. Gems NYC`,
    description: `Shop ${formattedName.toLowerCase()} gemstones at B.V. Gems, NYC Diamond District. Discover natural & lab-grown loose ${formattedName.toLowerCase()} stones in calibrated sizes, perfect for rings, necklaces, and custom jewelry.`,
    alternates: {
      canonical: canonicalUrl,
    },
  };
}

export default async function StonePage({ params }: PageProps) {
  const { stone } = await params;

  const isSapphire = stone === "sapphire";
  const isEmerald = stone === "emerald";
  const data: any = await getCategoryData(stone);

  const shapes = data?.shapes?.value?.split(",").map((s: any) => s.trim());

  return (
    <div>
      <CategoryContent
        isSapphire={isSapphire}
        isEmerald={isEmerald}
        data={data}
        shapes={shapes}
        handle={stone}
        routeStone={stone}
      />
    </div>
  );
}
