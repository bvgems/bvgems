import { getBlogPosts } from "@/apis/api";
import { Button, Container, Grid, GridCol } from "@mantine/core";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { IconArrowRight, IconChevronRight } from "@tabler/icons-react";
import { AnimatedText } from "../CommonComponents/AnimatedText";

export const BlogsSection = () => {
  const router = useRouter();
  const [blogPosts, setBlogPosts] = useState<any[]>([]);

  const fetchBlogs = async () => {
    try {
      const response = await getBlogPosts();
      setBlogPosts(response?.data || []);
    } catch (error) {
      console.error("Error fetching blogs:", error);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  return (
    <Container size={1350} className="py-12">
      <AnimatedText
        text="From Our Blogs"
        className="text-center text-3xl sm:text-4xl text-[#0b182d] mb-12"
      />
      <Grid gutter="xl">
        {[blogPosts[0], blogPosts[4]]
          .filter(Boolean) // ✅ prevents rendering if 5th doesn’t exist
          .map((post) => (
            <GridCol key={post.id} span={{ base: 12, md: 6 }}>
              <div className="group bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col h-full">
                {/* Image section */}
                {post.image?.url && (
                  <div className="w-full h-[280px] overflow-hidden">
                    <img
                      src={post.image.url}
                      alt={post.image.altText || post.title}
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                )}

                {/* Content section */}
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-lg font-semibold text-[#0b182d] mb-2 transition-colors duration-300 line-clamp-2">
                    <Link href={`/blogs/${post.handle}`}>{post.title}</Link>
                  </h3>

                  <p className="text-sm text-gray-500 mb-3">
                    {post.author || "B.V. Gems"} ·{" "}
                    {new Date(post.publishedAt).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>

                  <p className="text-gray-700 text-base mb-5 line-clamp-3">
                    {post.excerpt}
                  </p>
                </div>
              </div>
            </GridCol>
          ))}
      </Grid>
      <div className="flex justify-center mt-10">
        <Button
          onClick={() => router.push(`/blogs`)}
          size="compact-md"
          variant="outline"
          color="#0b182d"
        >
          Read All
        </Button>
      </div>
    </Container>
  );
};
