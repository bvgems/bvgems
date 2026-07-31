import { Image } from "@mantine/core";
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
      {/* Hero Section */}
      {post.image?.url && (
        <div className="relative w-full h-[400px]">
          <Image loading="lazy"
            src={post.image?.url}
            alt={post.image?.altText || post.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
          <div className="absolute bottom-6 left-6 text-white max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              {post.title}
            </h1>
            <p className="mt-2 text-sm opacity-90">
              {post.authorV2?.name || "B.V. Gems"} ·{" "}
              {new Date(post.publishedAt).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          </div>
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
