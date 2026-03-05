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
import { useEffect, useRef, useState } from "react";
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
  const didMount = useRef(false);

  const fetchFilteredData = async () => {
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

    const response = await getFilteredColorStoneLayouts(filterOptions);
    let products = response?.data || [];

    // artificial delay for smooth skeleton effect
    setTimeout(() => {
      setLayouts(products);
      setLoading(false);
    }, 800);
  };

  const fetchColorstoneLayouts = async () => {
    setLoading(true);
    const response = await getColorstoneLayouts();
    let products = response?.edges || [];

    setTimeout(() => {
      setLayouts(products);
      setLoading(false);
    }, 800);
  };

  useEffect(() => {
    fetchColorstoneLayouts().finally(() => {
      didMount.current = true;
    });
  }, []);

  useEffect(() => {
    if (!didMount?.current) return;
    fetchFilteredData();
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

  return (
    <div>
      <div className="lg:hidden flex justify-end px-4 mb-2 mt-5">
        <ActionIcon onClick={open} variant="outline" color="gray" size="lg">
          <IconFilter size={20} />
        </ActionIcon>
      </div>

      <Grid gutter="lg">
        <GridCol span={{ base: 12, md: 3 }} className="hidden lg:flex">
          <ColorstoneFilterSidebar
            selectedShapes={selectedShapes}
            setSelectedShapes={setSelectedShapes}
            selectedGemstones={selectedGemstones}
            setSelectedGemstones={setSelectedGemstones}
            selectedType={selectedType}
            setSelectedType={setSelectedType}
            selectedLayoutType={selectedLayoutType}
            setSelectedLayoutType={setSelectedLayoutType}
            priceRange={priceRange}
            setPriceRange={setPriceRange}
            length={length}
            width={width}
            setLength={setLength}
            setWidth={setWidth}
            selectedRoundSizes={selectedRoundSizes}
            setSelectedRoundSizes={setSelectedRoundSizes}
            selectedQuality={selectedQuality}
            setSelectedQuality={setSelectedQuality}
          />
          <Divider orientation="vertical" />
        </GridCol>

        {/* Products Grid */}
        <GridCol span={{ base: 12, md: 9 }}>
          {loading ? (
            <div>
              <Grid gutter="lg">
                {Array.from({ length: 8 }).map((_, i) => (
                  <GridCol key={i} span={{ base: 12, sm: 6, md: 4, lg: 3 }}>
                    <Card shadow="sm" radius="md" padding="md">
                      {/* Image placeholder */}
                      <Skeleton height={220} radius="md" mb="sm" />
                      {/* Title placeholder */}
                      <Skeleton height={18} width="80%" mb="xs" />
                      {/* Subtitle placeholder */}
                      <Skeleton height={14} width="60%" mb="xs" />
                      {/* Price placeholder */}
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

      {/* Drawer Filter (Mobile) */}
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
        <ColorstoneFilterSidebar
          selectedShapes={selectedShapes}
          setSelectedShapes={setSelectedShapes}
          selectedGemstones={selectedGemstones}
          setSelectedGemstones={setSelectedGemstones}
          selectedType={selectedType}
          setSelectedType={setSelectedType}
          selectedLayoutType={selectedLayoutType}
          setSelectedLayoutType={setSelectedLayoutType}
          priceRange={priceRange}
          setPriceRange={setPriceRange}
          length={length}
          width={width}
          setLength={setLength}
          setWidth={setWidth}
          selectedRoundSizes={selectedRoundSizes}
          setSelectedRoundSizes={setSelectedRoundSizes}
          selectedQuality={selectedQuality}
          setSelectedQuality={setSelectedQuality}
        />
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
