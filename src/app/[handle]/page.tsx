import { getCategoryData } from "@/apis/api";
import { CategoryContent } from "@/components/Category/CategoryContent";

export default async function CategoryPage({
  params,
}: {
  params: { handle: string };
}) {
  const handle = params.handle;

  const data: any = await getCategoryData(handle);


  const shapes = data?.shapes?.value?.split(",").map((s: any) => s.trim());

  const rawSizes = data?.shapeSizes?.value;
  const allSizes = rawSizes ? JSON.parse(rawSizes) : {};

  return (
    <div>
      <CategoryContent data={data} shapes={shapes} allSizes={allSizes} />
    </div>
  );
}
