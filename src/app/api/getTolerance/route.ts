import {
  getGemstoneByHandle,
  getToleranceByHandle,
} from "@/app/Graphql/queries";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const handle = url.searchParams.get("collection");

    if (!handle) {
      return NextResponse.json(
        { error: "Missing collection handle" },
        { status: 400 }
      );
    }

    const shopifyRes = await fetch(
      process.env.SHOPIFY_STOREFRONT_URL as string,
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

    return NextResponse.json({ collection }, { status: 200 });
  } catch (error) {
    console.error("Shopify fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch Shopify data" },
      { status: 500 }
    );
  }
}
