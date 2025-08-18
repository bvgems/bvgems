import FreeSizeGemstoneSelection from "@/components/FreeSizeGemstones/FreeSizeGemstoneSelection";
import { Metadata } from "next";

export async function generateMetadata({ params }: any): Promise<Metadata> {
  const gemstoneType = params.slug || "Gemstone";
  const formattedType =
    gemstoneType.charAt(0).toUpperCase() + gemstoneType.slice(1);
  console.log("foprmatyyedd", params.slug);

  return {
    title: `Free Size ${formattedType} – Natural Loose ${formattedType} | B.V. Gems`,
    description: `Discover free size ${formattedType.toLowerCase()} gemstones at B.V. Gems. Shop natural loose ${formattedType.toLowerCase()} stones, perfect for rings, necklaces & custom jewelry. Ethically sourced.`,
    openGraph: {
      title: `Free Size ${formattedType} – Natural Loose ${formattedType} | B.V. Gems`,
      description: `Browse our exclusive free size ${formattedType.toLowerCase()} gemstones collection. Find natural loose ${formattedType.toLowerCase()}s, perfect for fine jewelry & custom designs.`,
      url: `https://bvgems.com/free-size-gemstones/${gemstoneType}`,
      siteName: "B.V. Gems",
      type: "website",
    },
  };
}

export default function Page(props: any) {
  return <FreeSizeGemstoneSelection {...props} />;
}
