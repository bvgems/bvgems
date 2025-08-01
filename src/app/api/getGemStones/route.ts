import { getAllProductsQuery } from "@/app/Graphql/queries";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const gemstoneProducts: any[] = [];
  let hasNextPage = true;
  let cursor: string | null = null;

  try {
    while (hasNextPage) {
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
            query: getAllProductsQuery,
            variables: { cursor },
          }),
        }
      );

      const result: any = await shopifyRes.json();

      const edges = result?.data?.products?.edges || [];
      hasNextPage = result?.data?.products?.pageInfo?.hasNextPage;
      cursor = hasNextPage ? edges[edges.length - 1].cursor : null;

      const gemstoneFiltered = edges
        .map((edge: any) => edge.node)
        .filter((product: any) => product.productType === "Gemstones");

      gemstoneProducts.push(...gemstoneFiltered);
    }

    return new Response(JSON.stringify({ products: gemstoneProducts }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error fetching gemstone products:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch gemstone products" }),
      { status: 500 }
    );
  }
}
