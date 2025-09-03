// app/api/blogs/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const endpoint = process.env.SHOPIFY_STOREFRONT_URL as string;

    const query = `
      {
        blogs(first: 1) {
          edges {
            node {
              handle
              title
              articles(first: 10, sortKey: PUBLISHED_AT, reverse: true) {
                edges {
                  node {
                    id
                    title
                    handle
                    excerpt
                    contentHtml
                    publishedAt
                    image {
                      url
                      altText
                    }
                  }
                }
              }
            }
          }
        }
      }
    `;

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": process.env
          .SHOPIFY_STOREFRONT_ACCESS_TOKEN as string,
      },
      body: JSON.stringify({ query }),
    });

    const result = await response.json();

    const articles =
      result?.data?.blogs?.edges?.[0]?.node?.articles?.edges?.map(
        (edge: any) => edge.node
      ) || [];

    return NextResponse.json({ data: articles }, { status: 200 });
  } catch (error) {
    console.error("Error in fetching blogs:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
