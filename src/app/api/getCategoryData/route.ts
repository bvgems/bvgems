import { getGemstoneByHandle } from "@/app/Graphql/queries";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const handle = url.searchParams.get("handle");
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
          query: getGemstoneByHandle,
          variables: {
            handle,
          },
        }),
      }
    );

    const data = await shopifyRes.json();
    console.log("dataaaa", data);

    return new Response(JSON.stringify(data?.data?.collection), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Failed to fetch Shopify data" }),
      { status: 500 }
    );
  }
}
