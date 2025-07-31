import { GetProductByHandle } from "@/app/Graphql/queries";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const handle = url.searchParams.get("handle");

    if (!handle) {
      return NextResponse.json({ error: "Missing handle" }, { status: 400 });
    }

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
          query: GetProductByHandle,
          variables: { handle },
        }),
      }
    );

    const result = await shopifyRes.json();
    console.log('resss',result)

    return NextResponse.json(
      { product: result.data.productByHandle },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET error:", error);
    return new Response(JSON.stringify({ flag: false }), { status: 500 });
  }
}
