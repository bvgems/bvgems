import os

file_path = "src/app/blogs/[blogname]/page.tsx"
with open(file_path, "r") as f:
    content = f.read()

import_statement = "import { PageHeader } from \"@/components/CommonComponents/PageHeader\";\n"
if "PageHeader" not in content:
    content = content.replace("import React from \"react\";", import_statement + "import React from \"react\";")

old_return = """    <article className="flex flex-col">
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
      )}"""

new_return = """    <article className="flex flex-col">
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
      )}"""

content = content.replace(old_return, new_return)

with open(file_path, "w") as f:
    f.write(content)
