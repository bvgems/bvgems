"use client";
import { useGridView } from "@/hooks/useGridView";
import { ViewAllProductComponent } from "./ViewAllProductComponent";
import { JewelryCategoryCard } from "../Jewerly/JewerlyCard";
import { Skeleton, Grid, GridCol } from "@mantine/core";
import { useEffect, useState } from "react";

export const CommonGridView = ({
  filteredJewelry,
  isBead = false,
  selectedStones,
}: any) => {
  const { category, activeTab, allProducts, beads } = useGridView();
  console.log("selected stonesss", selectedStones);

  const isLoading = !allProducts?.length && !beads?.length;
  const [totalDisplayedProducts, setTotalDispalyedProducts] = useState<any>();
  const [finalProducts, setFinalProducts] = useState<any>();

  useEffect(() => {
    if (filteredJewelry === undefined) {
      setTotalDispalyedProducts(allProducts?.length);
      setFinalProducts(allProducts);
    } else {
      const timer = setTimeout(() => {
        setTotalDispalyedProducts(filteredJewelry?.length);
        setFinalProducts(filteredJewelry);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [filteredJewelry]);

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
      <p>Showing {totalDisplayedProducts} results</p>
      <ViewAllProductComponent
        keyProp={activeTab}
        items={finalProducts?.length ? finalProducts : beads}
        renderItem={(product, index) => (
          <JewelryCategoryCard
            isBead={isBead}
            category={category}
            product={product}
            index={index}
            selectedStones={selectedStones}
          />
        )}
      />
    </div>
  );
};
