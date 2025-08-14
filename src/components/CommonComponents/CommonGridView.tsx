"use client";
import { useGridView } from "@/hooks/useGridView";
import { ViewAllProductComponent } from "./ViewAllProductComponent";
import { JewelryCategoryCard } from "../Jewerly/JewerlyCard";
import { Skeleton, Grid, GridCol } from "@mantine/core";

export const CommonGridView = ({ isBead }: any) => {
  const { category, activeTab, allProducts, beads } = useGridView();

  const isLoading = !allProducts?.length && !beads?.length;

  // Skeleton placeholders
  if (isLoading) {
    return (
      <div className="px-4 sm:px-8 pt-6 pb-14">
        <Grid gutter="lg">
          {Array.from({ length: 8 }).map((_, i) => (
            <GridCol span={{ base: 6, sm: 4, md: 3 }} key={i}>
              <Skeleton height={260} radius="md" mb="sm" />
              <Skeleton height={20} width="80%" mb="xs" />
              <Skeleton height={16} width="40%" />
            </GridCol>
          ))}
        </Grid>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-8 pt-6 pb-14">
      <ViewAllProductComponent
        keyProp={activeTab}
        items={allProducts?.length ? allProducts : beads}
        renderItem={(product, index) => (
          <JewelryCategoryCard
            isBead={isBead}
            category={category}
            product={product}
            index={index}
          />
        )}
      />
    </div>
  );
};
