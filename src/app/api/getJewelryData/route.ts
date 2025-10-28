import { shopifyQuery } from "@/app/Graphql/queries";
import { NextRequest, NextResponse } from "next/server";
import { getAllJeweleryProducts } from "../lib/commonFunctions";

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const category = url.searchParams.get("category");

    const result = await getAllJeweleryProducts(category);
    let products: any = [];
    if (category === "earrings") {
      const goldEarrings = result?.edges?.filter((item: any) => {
        return item?.node?.jewelryType?.value === "Gold";
      });

      const silverEarrings = result?.edges?.filter((item: any) => {
        return item?.node?.jewelryType?.value === "Silver";
      });

      products = [...goldEarrings, ...silverEarrings];
    } else {
      products = result?.edges;
    }
    return NextResponse.json({ products: products }, { status: 200 });
  } catch (error) {
    console.error("GET error:", error);
    return new Response(JSON.stringify({ flag: false }), { status: 500 });
  }
}
