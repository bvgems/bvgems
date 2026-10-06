import os

file_path = "src/app/free-size-gemstones/[stone]/[slug]/page.tsx"
with open(file_path, "r") as f:
    content = f.read()

import_statement = "import { PageHeader } from \"@/components/CommonComponents/PageHeader\";\n"
if "PageHeader" not in content:
    content = content.replace("import FreeSizeGemstoneDetails from \"@/components/FreeSizeGemstones/FreeSizeGemstonesDetails\";", import_statement + "import FreeSizeGemstoneDetails from \"@/components/FreeSizeGemstones/FreeSizeGemstonesDetails\";")

old_return = "  return <FreeSizeGemstoneDetails id={id} />;"
new_return = """  return (
    <div className="w-full">
      <PageHeader 
        title={`${stone.replace(/-/g, " ").replace(/\\b\\w/g, l => l.toUpperCase())} Detail`} 
        subtitle="Review the specifications and high-resolution media for this unique gemstone." 
      />
      <FreeSizeGemstoneDetails id={id} />
    </div>
  );"""

# I need to get stone into scope since it's destructured earlier but not saved in a way I can just use it.
# Oh wait, `const { stone, slug } = await params;` is in `generateMetadata` but NOT in `Page`.
# Let's fix `Page` to have `stone`.
old_func = """export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  const id = extractIdFromSlug(slug);"""

new_func = """export default async function Page({ params }: PageProps) {
  const { stone, slug } = await params;
  const id = extractIdFromSlug(slug);"""

content = content.replace(old_func, new_func)
content = content.replace(old_return, new_return)

with open(file_path, "w") as f:
    f.write(content)
