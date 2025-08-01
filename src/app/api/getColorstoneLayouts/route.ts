import { getProductsByCategory } from "@/app/Graphql/queries";

export async function GET(req: Request) {
  try {
    const category = "Layout";

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
          query: getProductsByCategory,
          variables: {
            first: 100,
          },
        }),
      }
    );

    const result = await shopifyRes.json();

    const allProducts = result?.data?.products?.edges || [];
    const filtered = allProducts.filter(
      (p: any) => p?.node?.metafield?.value === category
    );

    return new Response(JSON.stringify(filtered), {
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
