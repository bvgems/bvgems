import { getCategoryData } from "@/apis/api";
import { CategoryContent } from "@/components/Category/CategoryContent";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDbShapesForGemstone } from "@/lib/gemstoneShapes";
import { formatShapeDisplay } from "@/utils/constants";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ stone: string; shape: string; size: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

// Convert URL shape format to DB shape (e.g., "emerald-cut" -> "Emerald Cut", "cushion" / "square-cushion" -> "Cushion")
const resolveDbShape = (shapeParam: string) => {
  const normalized = shapeParam.toLowerCase().replace(/[-\s]+/g, " ").trim();
  if (normalized === "square cushion" || normalized === "cushion") {
    return "Cushion";
  }
  return shapeParam
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const formatSizeParam = (sizeParam: string) => {
  let s = decodeURIComponent(sizeParam).replace(/-/g, " ").trim();
  if (s.includes("x") && !s.includes(" x ")) {
    s = s.replace(/x/gi, " x ");
  }
  if (!s.endsWith("mm") && !s.includes("mm")) {
    s = s + " mm";
  } else if (s.includes("mm") && !s.includes(" mm")) {
    s = s.replace(/mm/gi, " mm");
  }
  return s.replace(/\s+/g, " ").trim();
};

export async function generateMetadata({
  params,
  searchParams,
}: PageProps): Promise<Metadata> {
  const { stone, shape: shapeParam, size: sizeParam } = await params;
  const searchParamsResolved = await searchParams;
  const color = searchParamsResolved?.color as string | undefined;
  
  const dbShape = resolveDbShape(shapeParam);
  const displayShape = formatShapeDisplay(dbShape);
  const size = formatSizeParam(sizeParam);
  
  let prefix = `${size} ${displayShape} `;
  if (color && (stone === "sapphire" || stone === "topaz")) {
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
  if (color && (stone === "sapphire" || stone === "topaz")) urlParams.set("color", color);
  const paramString = urlParams.toString();
  const canonicalUrl = `https://www.bvgems.com/calibrated-stones/${stone}/${shapeParam}/${sizeParam}${paramString ? '?' + paramString : ''}`;

  return {
    title: `${formattedName} – Natural & Wholesale Loose ${formattedName} Gemstones | B.V. Gems NYC`,
    description: `Shop ${formattedName.toLowerCase()} gemstones at B.V. Gems, NYC Diamond District. Discover natural & lab-grown loose ${formattedName.toLowerCase()} stones in calibrated sizes, perfect for rings, necklaces, and custom jewelry.`,
    alternates: {
      canonical: canonicalUrl,
    },
  };
}

export default async function StoneShapeSizePage({ params }: PageProps) {
  const { stone, shape: shapeParam, size: sizeParam } = await params;

  const isSapphire = stone === "sapphire";
  const isEmerald = stone === "emerald";
  const isTopaz = stone === "topaz";
  const [data, shapes] = await Promise.all([
    getCategoryData(stone),
    getDbShapesForGemstone(stone),
  ]);
  const shape = resolveDbShape(shapeParam);
  const size = formatSizeParam(sizeParam);

  if (!shapes.some((s) => s.toLowerCase() === shape.toLowerCase())) {
    notFound();
  }

  return (
    <div>
      <CategoryContent
        isSapphire={isSapphire}
        isEmerald={isEmerald}
        isTopaz={isTopaz}
        data={data}
        shapes={shapes}
        handle={stone}
        routeStone={stone}
        routeShape={shape}
        routeSize={size}
      />
    </div>
  );
}
