import { getCategoryData } from "@/apis/api";
import { CategoryContent } from "@/components/Category/CategoryContent";
import { Button, Container, Grid, GridCol, Image, Text } from "@mantine/core";

export default async function CategoryPage({
  params,
}: {
  params: { handle: string };
}) {
  const handle = params.handle;

  const data: any = await getCategoryData(handle);
  const shapes = data?.shapes?.value?.split(",").map((s: any) => s.trim());
  const allSizes = JSON.parse(data?.shapeSizes?.value);

  return (
    <div>
      <CategoryContent data={data} shapes={shapes} allSizes={allSizes} />
    </div>
  );
}
