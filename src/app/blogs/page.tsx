"use client";

import { getBlogPosts } from "@/apis/api";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { IconArrowRight } from "@tabler/icons-react";
import { useRouter } from "next/navigation";

export default function BlogPage() {
  const router = useRouter();
  const [blogPosts, setBlogPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBlogs = async () => {
    try {
      const response = await getBlogPosts();
      setBlogPosts(response?.data || []);
    } catch (error) {
      console.error("Error fetching blogs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  return (
    <div className="container mx-auto py-16 px-4">
      {/* Blog Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {loading
          ? Array.from({ length: 6 }).map((_, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl shadow-md overflow-hidden animate-pulse"
              >
                {/* Skeleton Image */}
                <div className="w-full h-60 bg-gray-200"></div>

                {/* Skeleton Content */}
                <div className="p-6">
                  <div className="h-6 bg-gray-200 rounded mb-4 w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2 w-1/2"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2 w-full"></div>
                  <div className="h-4 bg-gray-200 rounded mb-6 w-5/6"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                </div>
              </div>
            ))
          : blogPosts.map((post: any) => (
              <div
                key={post.id}
                className="group relative bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300"
              >
                {/* Image with hover zoom */}
                <div className="overflow-hidden">
                  {post.image?.url && (
                    <img
                      src={post.image.url}
                      alt={post.image.altText || post.title}
                      className="w-full h-60 object-cover transform group-hover:scale-105 transition-transform duration-500"
                    />
                  )}
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col h-full">
                  {/* Title */}
                  <h2 className="text-xl font-semibold text-[#0b182d] mb-3 group-hover:text-blue-700 transition-colors duration-300 line-clamp-2">
                    <Link href={`/blogs/${post.handle}`}>{post.title}</Link>
                  </h2>

                  {/* Author + Date */}
                  <p className="text-sm text-gray-500 mb-4">
                    {post.author || "B.V. Gems"} ·{" "}
                    {new Date(post.publishedAt).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>

                  <p className="text-gray-700 text-base mb-6 line-clamp-3">
                    {post.excerpt}
                  </p>
                  <div
                    onClick={() => {
                      router?.push(`/blogs/${post?.handle}`);
                    }}
                    className="flex items-center gap-1 cursor-pointer hover:underline"
                  >
                    <span>Read More</span>
                    <IconArrowRight size={20} />
                  </div>
                </div>
              </div>
            ))}
      </div>
    </div>
  );
}
