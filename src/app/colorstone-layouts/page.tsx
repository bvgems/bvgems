"use client";

import { getColorstoneLayouts, getFilteredColorStoneLayouts } from "@/apis/api";
import {
  Divider,
  Grid,
  GridCol,
  Drawer,
  ActionIcon,
  Skeleton,
  Card,
  Center,
  Text,
} from "@mantine/core";
import { useEffect, useRef, useState, useCallback } from "react";
import { useDisclosure } from "@mantine/hooks";
import { IconFilter } from "@tabler/icons-react";
import { ColorstoneLayoutsGridView } from "@/components/ColorstoneLayoutsGridView/ColorstoneLayoutsGridView";
import { ColorstoneFilterSidebar } from "@/components/ColorstoneLayoutsGridView/ColorstoneFilterSidebar";
import Script from "next/script";

export default function ColorStoneLayouts() {
  const [selectedShapes, setSelectedShapes] = useState<string[]>([]);
  const [selectedGemstones, setSelectedGemstones] = useState<string[]>([]);
  const [selectedType, setSelectedType] = useState([]);
  const [selectedLayoutType, setSelectedLayoutType] = useState([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([100, 15000]);
  const [length, setLength] = useState<number | string>("");
  const [width, setWidth] = useState<number | string>("");
  const [layouts, setLayouts] = useState<any>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRoundSizes, setSelectedRoundSizes] = useState<string[]>([]);
  const [selectedQuality, setSelectedQuality] = useState<string>("AA");
  const [drawerOpened, { open, close }] = useDisclosure(false);

  // Track whether the initial load is done
  const isInitialized = useRef(false);
  // Abort controller to cancel in-flight requests when a new one starts
  const abortRef = useRef<AbortController | null>(null);

  const fetchColorstoneLayouts = useCallback(async () => {
    setLoading(true);
    const response = await getColorstoneLayouts();
    const products = response?.edges || [];
    setTimeout(() => {
      setLayouts(products);
      setLoading(false);
      isInitialized.current = true; // Mark initialized AFTER state is set
    }, 800);
  }, []); // No dependencies — this never changes

  const fetchFilteredData = useCallback(async () => {
    // Cancel the previous in-flight request
    if (abortRef.current) abortRef.current.abort();
    abortRef.current = new AbortController();

    setLoading(true);
    const filterOptions = {
      gemstone: selectedGemstones,
      shape: selectedShapes,
      type: selectedType,
      layoutType: selectedLayoutType,
      size: selectedRoundSizes,
      length,
      width,
      quality: selectedQuality,
    };

    try {
      const response = await getFilteredColorStoneLayouts(filterOptions);
      const products = response?.data || [];
      setTimeout(() => {
        setLayouts(products);
        setLoading(false);
      }, 800);
    } catch (err: any) {
      if (err.name !== "AbortError") {
        setLoading(false);
      }
    }
  }, [
    selectedShapes,
    selectedGemstones,
    selectedType,
    selectedLayoutType,
    selectedRoundSizes,
    length,
    width,
    priceRange,
    selectedQuality,
  ]);

  // Run once on mount
  useEffect(() => {
    fetchColorstoneLayouts();
  }, [fetchColorstoneLayouts]);

  // Run only after initialization, when filters actually change
  useEffect(() => {
    if (!isInitialized.current) return;
    fetchFilteredData();
  }, [fetchFilteredData]);

  // Shared sidebar props — avoids duplicating this object for desktop + drawer
  const sidebarProps = {
    selectedShapes,
    setSelectedShapes,
    selectedGemstones,
    setSelectedGemstones,
    selectedType,
    setSelectedType,
    selectedLayoutType,
    setSelectedLayoutType,
    priceRange,
    setPriceRange,
    length,
    width,
    setLength,
    setWidth,
    selectedRoundSizes,
    setSelectedRoundSizes,
    selectedQuality,
    setSelectedQuality,
  };

  return (
    <div>
      <div className="lg:hidden flex justify-end px-4 mb-2 mt-5">
        <ActionIcon onClick={open} variant="outline" color="gray" size="lg">
          <IconFilter size={20} />
        </ActionIcon>
      </div>

      <Grid gutter="lg">
        <GridCol span={{ base: 12, md: 3 }} className="hidden lg:flex">
          <ColorstoneFilterSidebar {...sidebarProps} />
          <Divider orientation="vertical" />
        </GridCol>

        <GridCol span={{ base: 12, md: 9 }}>
          {loading ? (
            <div>
              <Grid gutter="lg">
                {Array.from({ length: 8 }).map((_, i) => (
                  <GridCol key={i} span={{ base: 12, sm: 6, md: 4, lg: 3 }}>
                    <Card shadow="sm" radius="md" padding="md">
                      <Skeleton height={220} radius="md" mb="sm" />
                      <Skeleton height={18} width="80%" mb="xs" />
                      <Skeleton height={14} width="60%" mb="xs" />
                      <Skeleton height={16} width="40%" />
                    </Card>
                  </GridCol>
                ))}
              </Grid>
              <Center mt="lg">
                <Text size="sm" c="dimmed">
                  Loading gemstones...
                </Text>
              </Center>
            </div>
          ) : (
            <ColorstoneLayoutsGridView
              products={layouts}
              selectedQuality={selectedQuality}
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
        <ColorstoneFilterSidebar {...sidebarProps} />
      </Drawer>

      {!loading && layouts?.length > 0 && (
        <Script
          id="colorstone-itemlist-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ItemList",
              itemListElement: layouts.map((item: any, i: number) => ({
                "@type": "ListItem",
                position: i + 1,
                url: `https://bvgems.com/color-stone-layouts/${item?.id || i}`,
                name: item?.title || `Color Stone Layout ${i + 1}`,
              })),
            }),
          }}
        />
      )}
    </div>
  );
}
