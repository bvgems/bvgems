import { getLayouts } from "../lib/commonFunctions";
import { withPriceGating } from "@/lib/priceGating";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const result = await getLayouts();
    
    // Apply price gating based on user session
    const securedResult = await withPriceGating(req, result);

    return new Response(JSON.stringify(securedResult), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Failed to fetch Shopify data" }),
      { status: 500 }
    );
  }
}
