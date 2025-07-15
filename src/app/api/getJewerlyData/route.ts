import { shopifyQuery } from "@/app/Graphql/queries";
import { NextRequest, NextResponse } from "next/server";
import { getAllJeweleryProducts } from "../lib/commonFunctions";

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const category = url.searchParams.get("category");

    const result = await getAllJeweleryProducts(category);
    return NextResponse.json(
      { products: result},
      { status: 200 }
    );
  } catch (error) {
    console.error("GET error:", error);
    return new Response(JSON.stringify({ flag: false }), { status: 500 });
  }
}
