// app/api/blogs/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    console.log("first*****************");

    const { searchParams } = new URL(req.url);
    const handle = searchParams.get("blogName");

    if (!handle) {
      return NextResponse.json(
        { error: "Missing blogName query param" },
        { status: 400 }
      );
    }
    const endpoint = process.env.SHOPIFY_STOREFRONT_URL as string;

    const query = `
      {
        articleByHandle(blogHandle: "journal", handle: "${handle}") {
          id
          title
          contentHtml
          excerpt
          publishedAt
          authorV2 {
            name
          }
          image {
            url
            altText
          }
        }
      }
    `;

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": process.env
          .SHOPIFY_STOREFRONT_TOKEN as string,
      },
      body: JSON.stringify({ query }),
      next: { revalidate: 60 },
    });

    const result = await response.json();
    return NextResponse.json(result?.data?.articleByHandle, { status: 200 });
  } catch (error) {
    console.error("Error in fetching blogs:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
