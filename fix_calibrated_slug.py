import os

file_path = "src/app/calibrated-stones/[stone]/[shape]/[size]/[slug]/page.tsx"
with open(file_path, "r") as f:
    content = f.read()

import_statement = "import { PageHeader } from \"@/components/CommonComponents/PageHeader\";\n"
if "PageHeader" not in content:
    content = content.replace("import ProductDetailsPage from \"@/components/ProductDetails/ProductDetailsPage\";", import_statement + "import ProductDetailsPage from \"@/components/ProductDetails/ProductDetailsPage\";")

old_func = """export default function Page(props: any) {
  // We can pass params to ProductDetailsPage which will extract the ID from the slug
  return <ProductDetailsPage {...props} />;
}"""

new_func = """export default async function Page(props: any) {
  const { stone } = await props.params;
  const formattedStone = stone.replace(/-/g, " ").replace(/\\b\\w/g, (l: string) => l.toUpperCase());
  return (
    <div className="w-full">
      <PageHeader 
        title={`${formattedStone} Detail`} 
        subtitle="Review the specifications and high-resolution media for this calibrated gemstone." 
      />
      <ProductDetailsPage {...props} />
    </div>
  );
}"""

content = content.replace(old_func, new_func)

with open(file_path, "w") as f:
    f.write(content)
