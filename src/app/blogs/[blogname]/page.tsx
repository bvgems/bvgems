import type { Metadata } from "next";
import { Image } from "@mantine/core";
import { PageHeader } from "@/components/CommonComponents/PageHeader";
import React from "react";
import { getCustomBlogByHandle } from "@/data/customBlogs";
import Link from "next/link";
import { IconArrowLeft } from "@tabler/icons-react";

async function getBlogByHandle(handle: string) {
  const custom = getCustomBlogByHandle(handle);
  if (custom) return custom;

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

  try {
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
  } catch (error) {
    console.error("Error fetching Shopify blog post:", error);
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ blogname: string }>;
}): Promise<Metadata> {
  const { blogname } = await params;
  const post = await getBlogByHandle(blogname);

  if (!post) {
    return {
      title: "Blog Not Found | B.V. Gems",
    };
  }

  return {
    title: `${post.title} | B.V. Gems Blog`,
    description: post.excerpt || post.title,
    openGraph: {
      title: post.title,
      description: post.excerpt || post.title,
      url: `https://www.bvgems.com/blogs/${blogname}`,
      images: post.image?.url ? [{ url: post.image.url }] : [],
      type: "article",
      publishedTime: post.publishedAt,
    },
  };
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
        <h2 className="text-2xl font-semibold mb-4">Blog not found</h2>
        <Link
          href="/blogs"
          className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:underline"
        >
          <IconArrowLeft size={16} /> Back to all articles
        </Link>
      </div>
    );
  }

  return (
    <article className="flex flex-col">
      <PageHeader 
        title={post.title} 
        subtitle={`${post.authorV2?.name || post.author || "B.V. Gems"} · ${new Date(post.publishedAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}`} 
      />

      <div className="container mx-auto max-w-5xl px-5 md:px-0 mt-6">
        <Link
          href="/blogs"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-slate-500 hover:text-[#0b182d] transition-colors"
        >
          <IconArrowLeft size={16} /> Back to all blogs
        </Link>
      </div>

      {/* Render blog hero image below the header if it exists */}
      {post.image?.url && (
        <div className="w-full max-w-5xl mx-auto px-5 md:px-0 mt-6">
          <Image loading="lazy"
            src={post.image?.url}
            alt={post.image?.altText || post.title}
            className="w-full max-h-[500px] object-cover rounded-2xl shadow-sm border border-slate-100"
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

        <div className="mt-12 pt-8 border-t border-slate-200 flex justify-between items-center">
          <Link
            href="/blogs"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#0b182d] hover:text-blue-700 transition-colors"
          >
            <IconArrowLeft size={16} /> Back to all blogs
          </Link>
          <Link
            href="/colorstone-layouts"
            className="inline-flex items-center gap-2 text-sm font-semibold text-blue-700 hover:underline"
          >
            Explore Colorstone Layouts &rarr;
          </Link>
        </div>
      </div>
    </article>
  );
}
