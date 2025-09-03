import { NextRequest, NextResponse } from "next/server";
import { getAllJeweleryProducts } from "../lib/commonFunctions";

export async function GET(req: NextRequest) {
  try {
    const rings = await getAllJeweleryProducts("rings");
    const necklaces = await getAllJeweleryProducts("necklaces");
    const earrings = await getAllJeweleryProducts("earrings");
    const bracelets = await getAllJeweleryProducts("bracelets");

    const allProducts = [
      ...rings?.edges,
      ...necklaces?.edges,
      ...earrings?.edges,
      ...bracelets?.edges,
    ];

    const bestSellingProducts = allProducts.filter(
      (product: any) =>
        product?.node?.bestSelling &&
        product?.node?.bestSelling?.value === "true"
    );

    return NextResponse.json({ data: bestSellingProducts }, { status: 200 });
  } catch (error) {
    console.error("Error in returning best selling:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
