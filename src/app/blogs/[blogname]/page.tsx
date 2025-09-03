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
    next: { revalidate: 60 },
  });

  const result = await response.json();
  console.log("hey", result?.data?.blog?.articleByHandle);
  return result?.data?.blog?.articleByHandle;
}

export default async function BlogPostPage({
  params,
}: {
  params: { blogname: string };
}) {
  const post = await getBlogByHandle(params.blogname);

  if (!post) {
    return (
      <div className="container mx-auto py-20 text-center">
        <h2 className="text-2xl font-semibold">Blog not found</h2>
      </div>
    );
  }

  return (
    <article className="container mx-auto px-4 md:px-8 py-12">
      {post.image?.url && (
        <div className="relative w-full h-[300px] mb-10">
          <Image
            src={post.image?.url}
            alt={post.title}
            h={300}
            fit="contain"
            className="object-cover rounded-2xl shadow-lg"
          />
        </div>
      )}

      {/* Title */}
      <h1 className="text-4xl font-bold text-[#0b182d] mb-4">{post.title}</h1>

      {/* Author + Date */}
      <p className="text-gray-500 text-sm mb-8">
        {post.authorV2?.name || "B.V. Gems"} ·{" "}
        {new Date(post.publishedAt).toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        })}
      </p>

      {/* Content */}
      <div
        className="prose prose-lg max-w-none prose-headings:text-[#0b182d] prose-a:text-blue-600 hover:prose-a:underline"
        dangerouslySetInnerHTML={{ __html: post.contentHtml }}
      />
    </article>
  );
}
