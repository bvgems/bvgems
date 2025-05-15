import { getAllCollectionsQuery } from "@/app/Graphql/queries";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const allCollections: any[] = [];
  let hasNextPage = true;
  let cursor: string | null = null;

  try {
    while (hasNextPage) {
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
            query: getAllCollectionsQuery,
            variables: { cursor },
          }),
        }
      );

      const result: any = await shopifyRes.json();
      const edges = result?.data?.collections?.edges || [];

      allCollections.push(...edges.map((edge: any) => edge.node));

      hasNextPage = result?.data?.collections?.pageInfo?.hasNextPage;
      cursor = hasNextPage ? edges[edges.length - 1].cursor : null;
    }

    return new Response(JSON.stringify({ collections: allCollections }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error fetching collections:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch all collections" }),
      { status: 500 }
    );
  }
}
