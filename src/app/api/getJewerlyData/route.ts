import { shopifyQuery } from "@/app/Graphql/queries";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const category = url.searchParams.get("category");

    const variables = {
      category: `product_type:${category}`,
    };

    const shopifyRes = await fetch(
      "https://e4wqcy-up.myshopify.com/api/2024-04/graphql.json",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Storefront-Access-Token":
            "c64a5e6dbfa340f0bff88be9fde4b7a8",
        },
        body: JSON.stringify({
          query: shopifyQuery,
          variables,
        }),
      }
    );

    const result = await shopifyRes.json();

    return NextResponse.json(
      { products: result.data.products },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET error:", error);
    return new Response(JSON.stringify({ flag: false }), { status: 500 });
  }
}
