import { GetAllBeads } from "@/app/Graphql/queries";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
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
          query: GetAllBeads,
          variables: { first: 100 },
        }),
      }
    );

    const result = await shopifyRes.json();
    const allProducts = result?.data?.products;

    const filteredProducts = allProducts?.edges.filter(
      (product: any) =>
        product?.node?.metafield?.value &&
        product?.node.metafield.value === '["Beads"]'
    );

    return NextResponse.json(filteredProducts);
  } catch (error) {
    console.error("GET error:", error);
    return new Response(JSON.stringify({ flag: false }), { status: 500 });
  }
}
