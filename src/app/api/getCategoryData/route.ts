import { getGemstoneByHandle } from "@/app/Graphql/queries";
import { NextRequest } from "next/server";
import { withPriceGating } from "@/lib/priceGating";
import { getDbShapesForGemstone } from "@/lib/gemstoneShapes";

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const handle = url.searchParams.get("handle");

    const [shopifyRes, dbShapes] = await Promise.all([
      fetch(
        process.env.SHOPIFY_STOREFRONT_URL as string,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Shopify-Storefront-Access-Token":
              "c64a5e6dbfa340f0bff88be9fde4b7a8",
          },
          body: JSON.stringify({
            query: getGemstoneByHandle,
            variables: {
              handle,
            },
          }),
        }
      ),
      getDbShapesForGemstone(handle || ""),
    ]);

    const data = await shopifyRes.json();
    
    const securedData = await withPriceGating(req, data?.data?.productByHandle);

    if (!securedData) {
      const formattedName = (handle || "")
        .split("-")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");

      return new Response(
        JSON.stringify({
          title: formattedName,
          name: formattedName,
          handle,
          shapes: { value: dbShapes.join(", ") },
          dbShapes,
        }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    securedData.dbShapes = dbShapes;
    securedData.shapes = { value: dbShapes.join(", ") };

    return new Response(JSON.stringify(securedData), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Failed to fetch category data" }),
      { status: 500 }
    );
  }
}
