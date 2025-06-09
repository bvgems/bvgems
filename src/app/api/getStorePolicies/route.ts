import { getStorePolicyPage } from "@/app/Graphql/queries";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
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
          query: getStorePolicyPage,
        }),
      }
    );

    const result = await shopifyRes.json();

    console.log("first", result);

    return NextResponse.json({ storePolicies: result }, { status: 200 });
  } catch (error) {
    console.error("Shopify fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch Shopify data" },
      { status: 500 }
    );
  }
}
