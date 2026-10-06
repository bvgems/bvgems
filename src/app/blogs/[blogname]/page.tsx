import { Image } from "@mantine/core";
import { PageHeader } from "@/components/CommonComponents/PageHeader";
import React from "react";

async function getBlogByHandle(handle: string) {
  const endpoint = process.env.SHOPIFY_STOREFRONT_URL as string;
  const query = `
    {
      blog(handle: "news") {
        articleByHandle(handle: "${handle}") {
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
    next: { revalidate: 60 }, // ISR
  });

  const result = await response.json();
  return result?.data?.blog?.articleByHandle;
}

// 🚀 This stays a Server Component (async is allowed)
export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ blogname: string }>;
}) {
  const { blogname } = await params;
  const post = await getBlogByHandle(blogname);

  if (!post) {
    return (
      <div className="container mx-auto py-20 text-center">
        <h2 className="text-2xl font-semibold">Blog not found</h2>
      </div>
    );
  }

  return (
    <article className="flex flex-col">
      <PageHeader 
        title={post.title} 
        subtitle={`${post.authorV2?.name || "B.V. Gems"} · ${new Date(post.publishedAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}`} 
      />
      {/* Optional: Render blog hero image below the header if it exists */}
      {post.image?.url && (
        <div className="w-full max-w-5xl mx-auto px-5 md:px-0 mt-8">
          <Image loading="lazy"
            src={post.image?.url}
            alt={post.image?.altText || post.title}
            className="w-full h-[400px] object-cover rounded-xl shadow-sm"
          />
        </div>
      )}

      {/* Content Section */}
      <div className="container mx-auto max-w-3xl px-5 md:px-0 py-12">
        <div
          className="prose prose-lg prose-blue max-w-none
          prose-headings:text-[#0b182d] prose-headings:font-semibold
          prose-p:text-gray-700 prose-li:marker:text-blue-600
          prose-a:text-blue-600 hover:prose-a:underline
          leading-relaxed"
          dangerouslySetInnerHTML={{ __html: post.contentHtml }}
        />
      </div>
    </article>
  );
}
