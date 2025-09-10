"use client";
import { useGridView } from "@/hooks/useGridView";
import { JewelryCategoryCard } from "../Jewerly/JewerlyCard";
import { Skeleton, Grid, GridCol, Anchor, Breadcrumbs } from "@mantine/core";
import { useEffect, useState } from "react";

export const CommonGridView = ({
  filteredJewelry,
  isBead = false,
  selectedStones,
}: any) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const { category, activeTab, allProducts, beads } = useGridView();
  const isLoading = !allProducts?.length && !beads?.length;

  const [totalDisplayedProducts, setTotalDispalyedProducts] = useState<any>();
  const [finalProducts, setFinalProducts] = useState<any>();

  const capitalize = (str: any) =>
    str ? str.charAt(0).toUpperCase() + str.slice(1) : "";

  useEffect(() => {
    if (filteredJewelry === undefined) {
      if (isBead) {
        setTotalDispalyedProducts(beads?.length);
        setFinalProducts(beads);
      } else {
        setTotalDispalyedProducts(allProducts?.length);
        setFinalProducts(allProducts);
      }
    } else {
      const timer = setTimeout(() => {
        if (isBead) {
          setTotalDispalyedProducts(beads?.length);
          setFinalProducts(filteredJewelry || beads);
        } else {
          setTotalDispalyedProducts(filteredJewelry?.length);
          setFinalProducts(filteredJewelry || allProducts);
        }
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [filteredJewelry, isBead, beads, allProducts]);

  if (isLoading) {
    return (
      <div className="px-4 sm:px-8 pt-6 pb-14">
        <Grid gutter="lg">
          {Array.from({ length: 8 }).map((_, i) => (
            <GridCol span={{ base: 6, sm: 6, md: 3, lg: 3 }} key={i}>
              <Skeleton height={260} radius="md" mb="sm" />
              <Skeleton height={20} width="80%" mb="xs" />
              <Skeleton height={16} width="40%" />
            </GridCol>
          ))}
        </Grid>
      </div>
    );
  }

  const breadcrumbItemsForBeads = [
    { title: "Home", href: "/" },
    { title: "Precious Beads" },
  ].map((item, index) => (
    <Anchor
      size="sm"
      href={item.href}
      key={index}
      className="text-gray-600 hover:text-black"
    >
      {item.title}
    </Anchor>
  ));

  const breadcrumbItemsForJewelry = [
    { title: "Home", href: "/" },
    { title: capitalize(category) },
  ].map((item, index) => (
    <Anchor
      size="sm"
      href={item.href}
      key={index}
      className="text-gray-600 hover:text-black"
    >
      {item.title}
    </Anchor>
  ));

  return (
    <div className="px-4 sm:px-8 pt-6 pb-14">
      {isBead ? (
        <Breadcrumbs>{breadcrumbItemsForBeads}</Breadcrumbs>
      ) : (
        <Breadcrumbs className="mb-3">{breadcrumbItemsForJewelry}</Breadcrumbs>
      )}
      <p className="mb-4 text-sm text-gray-600">
        Showing {totalDisplayedProducts} results
      </p>

      {/* ✅ Responsive grid: 2 per row on mobile, 4 per row on desktop */}
      <Grid gutter="lg">
        {(finalProducts?.length ? finalProducts : beads)?.map(
          (product: any, index: number) => (
            <GridCol span={{ base: 6, sm: 6, md: 3, lg: 3 }} key={index}>
              <JewelryCategoryCard
                isBead={isBead}
                category={category}
                product={product}
                index={index}
                selectedStones={selectedStones}
              />
            </GridCol>
          )
        )}
      </Grid>
    </div>
  );
};
