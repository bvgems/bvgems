import { getCategoryData } from "@/apis/api";
import { CategoryContent } from "@/components/Category/CategoryContent";
import { Metadata } from "next";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ stone: string; shape: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

// Convert URL shape format "emerald-cut" to "Emerald Cut"
const formatShapeParam = (shapeParam: string) => {
  return shapeParam
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export async function generateMetadata({
  params,
  searchParams,
}: PageProps): Promise<Metadata> {
  const { stone, shape: shapeParam } = await params;
  const searchParamsResolved = await searchParams;
  const color = searchParamsResolved?.color as string | undefined;
  
  const shape = formatShapeParam(shapeParam);
  let prefix = `${shape} `;
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
  if (color && stone === "sapphire") urlParams.set("color", color);
  const paramString = urlParams.toString();
  const canonicalUrl = `https://www.bvgems.com/calibrated-stones/${stone}/${shapeParam}${paramString ? '?' + paramString : ''}`;

  return {
    title: `${formattedName} – Natural & Wholesale Loose ${formattedName} Gemstones | B.V. Gems NYC`,
    description: `Shop ${formattedName.toLowerCase()} gemstones at B.V. Gems, NYC Diamond District. Discover natural & lab-grown loose ${formattedName.toLowerCase()} stones in calibrated sizes, perfect for rings, necklaces, and custom jewelry.`,
    alternates: {
      canonical: canonicalUrl,
    },
  };
}

export default async function StoneShapePage({ params }: PageProps) {
  const { stone, shape: shapeParam } = await params;

  const isSapphire = stone === "sapphire";
  const isEmerald = stone === "emerald";
  const data: any = await getCategoryData(stone);

  const shapes = data?.shapes?.value?.split(",").map((s: any) => s.trim());
  const shape = formatShapeParam(shapeParam);

  return (
    <div>
      <CategoryContent
        isSapphire={isSapphire}
        isEmerald={isEmerald}
        data={data}
        shapes={shapes}
        handle={stone}
        routeStone={stone}
        routeShape={shape}
      />
    </div>
  );
}
