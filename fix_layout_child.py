import os

file_path = "src/app/trade/layouts/[handle]/page.tsx"
with open(file_path, "r") as f:
    content = f.read()

import_statement = "import { PageHeader } from \"@/components/CommonComponents/PageHeader\";\n"
if "PageHeader" not in content:
    content = content.replace("import LayoutProductPage from \"@/components/ColorstoneLayoutsGridView/LayoutProductPage\";", import_statement + "import LayoutProductPage from \"@/components/ColorstoneLayoutsGridView/LayoutProductPage\";")

old_return = "  return <LayoutProductPage product={layoutData} />;"
new_return = """  return (
    <div className="w-full">
      <PageHeader 
        title={layoutData?.title || "Color Stone Layout"} 
        subtitle="Explore the details of this beautifully matched color stone layout." 
      />
      <LayoutProductPage product={layoutData} />
    </div>
  );"""

content = content.replace(old_return, new_return)

with open(file_path, "w") as f:
    f.write(content)
