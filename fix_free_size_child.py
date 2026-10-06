import os

file_path = "src/app/free-size-gemstones/[stone]/page.tsx"
with open(file_path, "r") as f:
    content = f.read()

import_statement = "import { PageHeader } from \"@/components/CommonComponents/PageHeader\";\n"
if "PageHeader" not in content:
    content = content.replace("import FreeSizeGemstoneSelection from \"@/components/FreeSizeGemstones/FreeSizeGemstoneSelection\";", import_statement + "import FreeSizeGemstoneSelection from \"@/components/FreeSizeGemstones/FreeSizeGemstoneSelection\";")

# Change export default function FreeSizeGemstonePage() {
# to export default async function FreeSizeGemstonePage({ params }: { params: Promise<{ stone: string }> }) {

old_func = "export default function FreeSizeGemstonePage() {"
new_func = """export default async function FreeSizeGemstonePage({ params }: { params: Promise<{ stone: string }> }) {
  const { stone } = await params;
  const formattedStone = stone.replace(/-/g, " ").replace(/\\b\\w/g, l => l.toUpperCase());
"""
content = content.replace(old_func, new_func)

old_return = "  return <FreeSizeGemstoneSelection />;"
new_return = """  return (
    <div className="w-full">
      <PageHeader 
        title={`${formattedStone} Free Size`} 
        subtitle={`Explore our exclusive collection of ${formattedStone} free size gemstones.`} 
      />
      <FreeSizeGemstoneSelection />
    </div>
  );"""
content = content.replace(old_return, new_return)

with open(file_path, "w") as f:
    f.write(content)
