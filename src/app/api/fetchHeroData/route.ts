import { getStorePolicyPage } from "@/app/Graphql/queries";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const query = `
   {
  page(handle: "home") {
    title
    metafields(identifiers: [
      { namespace: "custom", key: "hero_image" },
      { namespace: "custom", key: "hero_heading" },
      { namespace: "custom", key: "hero_subtext" }
    ]) {
      key
      value
      type
      references(first: 10) {
        edges {
          node {
            ... on MediaImage {
              image {
                url
              }
            }
          }
        }
      }
    }
  }
}



  `;
  try {
    const res = await fetch(process.env.SHOPIFY_STOREFRONT_URL!, {
      method: "POST",
      headers: {
        "X-Shopify-Storefront-Access-Token":
          process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN!,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query }),
      next: { revalidate: 60 },
    });

    const { data } = await res.json();
    console.log("fenil data", data);

    return NextResponse.json({ heroData: data }, { status: 200 });
  } catch (error) {
    console.error("Shopify fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch Shopify data" },
      { status: 500 }
    );
  }
}
