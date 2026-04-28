"use client";

import { getFilteredJewelry } from "@/apis/api";
import { GridView } from "@/components/GridView/GridView";
import {
  Divider,
  Grid,
  GridCol,
  Drawer,
  ActionIcon,
  Skeleton,
} from "@mantine/core";
import { usePathname, useSearchParams } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { useDisclosure } from "@mantine/hooks";
import { IconFilter } from "@tabler/icons-react";
import { CommonGridView } from "@/components/CommonComponents/CommonGridView";
import { JewelerySideBar } from "../../components/Jewerly/JewelerySideBar";
import { FilterChips } from "@/components/Jewerly/FilterChips";

export default function Layout({ children }: { children: React.ReactNode }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);
  const collectionSlug = segments[1];

  // ✅ Initialize from URL query
  const initialStone = searchParams.get("stone")
    ? decodeURIComponent(searchParams.get("stone") as string)
    : "";

  const [selectedStones, setSelectedStones] = useState<string[]>(
    initialStone ? [initialStone] : [],
  );
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedShapes, setSelectedShapes] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([100, 15000]);
  const defaultPriceRange: [number, number] = [100, 15000];

  const [filteredJewelry, setFilteredJewelry] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [drawerOpened, { open, close }] = useDisclosure(false);
  const didMount = useRef(false);

  const hasFilters =
    selectedStones.length > 0 ||
    selectedTypes.length > 0 ||
    selectedShapes.length > 0 ||
    priceRange[0] !== defaultPriceRange[0] ||
    priceRange[1] !== defaultPriceRange[1];

  const fetchFilteredData = async () => {
    setLoading(true);
    const filterOptions = {
      shape: selectedShapes,
      price: priceRange,
      types: selectedTypes,
      collection_slug: selectedStones,
    };
    const response = await getFilteredJewelry(filterOptions, collectionSlug);

    let products = response?.data || [];

    if (selectedStones.length > 0) {
      if (collectionSlug === "rings") {
        products = products.map((p: any) => {
          const gemstoneMatch = selectedStones[0];

          const matchedVariant = p?.node?.variants?.edges?.find((v: any) => {
            return v?.node?.metafield
              ? v?.node?.metafield?.value?.toLowerCase() ===
                  gemstoneMatch.toLowerCase()
              : false;
          });

          return {
            ...p,
            mainImage: matchedVariant
              ? matchedVariant?.node?.image?.url
              : p?.images?.edges?.[0]?.node?.url,

            matchedTitle: matchedVariant
              ? matchedVariant?.node?.metafield?.value
              : matchedVariant?.node?.title,
          };
        });
      } else {
        products = products?.filter((p: any) => {
          const gemstoneMatch = selectedStones[0];
          const matchedVariant = p?.node?.gemstone?.value;

          return gemstoneMatch === matchedVariant;
        });
      }
    } else {
      products = products.map((p: any) => ({
        ...p,
        mainImage: p?.images?.edges?.[0]?.node?.url,
      }));
    }
    setFilteredJewelry(products);
    setLoading(false);
  };

  // ✅ On mount, apply filter from URL if present
  useEffect(() => {
    if (initialStone) {
      setSelectedStones([initialStone]);
    }
    fetchFilteredData().finally(() => {
      didMount.current = true;
    });
  }, [collectionSlug]);

  // ✅ Refetch when filters change
  useEffect(() => {
    if (!didMount.current) return;

    fetchFilteredData();
  }, [
    selectedTypes,
    selectedStones,
    selectedShapes,
    priceRange,
    collectionSlug,
  ]);

  return (
    <div>
      {/* Mobile Drawer Filter button */}
      <div className="lg:hidden flex justify-end px-4 mb-2 mt-5">
        <ActionIcon onClick={open} variant="outline" color="gray" size="lg">
          <IconFilter size={20} />
        </ActionIcon>
      </div>

      <FilterChips
        selectedStones={selectedStones}
        setSelectedStones={setSelectedStones}
        selectedShapes={selectedShapes}
        setSelectedShapes={setSelectedShapes}
        selectedTypes={selectedTypes}
        setSelectedTypes={setSelectedTypes}
        priceRange={priceRange}
        setPriceRange={setPriceRange}
        defaultPriceRange={defaultPriceRange}
      />

      <Grid gutter="lg">
        <GridCol span={{ base: 12, md: 3 }} className="hidden lg:flex">
          <JewelerySideBar
            collectionSlug={collectionSlug}
            selectedStones={selectedStones}
            setSelectedStones={setSelectedStones}
            selectedShapes={selectedShapes}
            setSelectedShapes={setSelectedShapes}
            selectedTypes={selectedTypes}
            setSelectedTypes={setSelectedTypes}
            priceRange={priceRange}
            setPriceRange={setPriceRange}
          />
          <Divider orientation="vertical" />
        </GridCol>

        <GridCol span={{ base: 12, md: 9 }}>
          {loading ? (
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
          ) : (
            <CommonGridView
              filteredJewelry={hasFilters ? filteredJewelry : undefined}
              selectedStones={selectedStones}
            />
          )}
        </GridCol>
      </Grid>

      <Drawer
        opened={drawerOpened}
        onClose={close}
        title="Filter Gemstones"
        padding="md"
        size={320}
        overlayProps={{ opacity: 0.3, blur: 3 }}
        hiddenFrom="lg"
        withinPortal={false}
      >
        <JewelerySideBar
          collectionSlug={collectionSlug}
          selectedStones={selectedStones}
          setSelectedStones={setSelectedStones}
          selectedShapes={selectedShapes}
          setSelectedShapes={setSelectedShapes}
          selectedTypes={selectedTypes}
          setSelectedTypes={setSelectedTypes}
          priceRange={priceRange}
          setPriceRange={setPriceRange}
        />
      </Drawer>
    </div>
  );
}
