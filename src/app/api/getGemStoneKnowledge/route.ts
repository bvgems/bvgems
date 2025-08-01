import { getGemStoneKnowledge } from "@/app/Graphql/queries";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const stone = url.searchParams.get("stone");
    console.log("stoneee", stone);

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
          query: getGemStoneKnowledge,
          variables: {
            cursor: null,
          },
        }),
      }
    );

    const json = await shopifyRes.json();

    const allCollections = json?.data?.collections?.edges || [];

    const matchedCollection = allCollections.find(
      (edge: any) => edge.node.title.toLowerCase() === stone?.toLowerCase()
    );

    if (!matchedCollection) {
      return new Response(JSON.stringify({ error: "Collection not found" }), {
        status: 404,
      });
    }

    return new Response(JSON.stringify(matchedCollection.node), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.log("error", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch Shopify data" }),
      { status: 500 }
    );
  }
}
