import { NextRequest, NextResponse } from "next/server";
import { getBeads } from "../lib/commonFunctions";
import { withPriceGating } from "@/lib/priceGating";

export async function GET(request: NextRequest) {
  try {
    const filteredProducts = await getBeads();
    
    const securedProducts = await withPriceGating(request, filteredProducts);
    return NextResponse.json(securedProducts);
  } catch (error) {
    console.error("GET error:", error);
    return new Response(JSON.stringify({ flag: false }), { status: 500 });
  }
}
