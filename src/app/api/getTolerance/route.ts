import {
  getGemstoneByHandle,
  getToleranceByHandle,
} from "@/app/Graphql/queries";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const handle = url.searchParams.get("collection");
    console.log("handle********", handle);

    if (!handle) {
      return NextResponse.json(
        { error: "Missing collection handle" },
        { status: 400 }
      );
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
          query: getToleranceByHandle,
          variables: { handle },
        }),
      }
    );

    const result = await shopifyRes.json();

    const collection = result?.data?.collection;

    if (!collection) {
      return NextResponse.json(
        { error: "Collection not found" },
        { status: 404 }
      );
    }
    console.log("first", collection);

    return NextResponse.json({ collection }, { status: 200 });
  } catch (error) {
    console.error("Shopify fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch Shopify data" },
      { status: 500 }
    );
  }
}
