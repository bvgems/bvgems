// app/api/blogs/route.ts
import { NextRequest, NextResponse } from "next/server";
import { customBlogPosts } from "@/data/customBlogs";

export async function GET(req: NextRequest) {
  let shopifyArticles: any[] = [];
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

    shopifyArticles =
      result?.data?.blogs?.edges?.[0]?.node?.articles?.edges?.map(
        (edge: any) => edge.node
      ) || [];
  } catch (error) {
    console.error("Error in fetching Shopify blogs:", error);
  }

  const customFormatted = customBlogPosts.map((post) => ({
    id: post.id,
    title: post.title,
    handle: post.handle,
    excerpt: post.excerpt,
    contentHtml: post.contentHtml,
    publishedAt: post.publishedAt,
    author: post.author,
    authorV2: post.authorV2,
    image: post.image,
  }));

  // Combine custom articles and Shopify articles (custom featured first)
  const combined = [...customFormatted, ...shopifyArticles];

  return NextResponse.json({ data: combined }, { status: 200 });
}
