"use client";

import { getFilteredData } from "@/apis/api";
import { GridView } from "@/components/GridView/GridView";
import { FilterSideBar } from "@/components/LooseGemstones/FilterSideBar";
import { Divider, Grid, GridCol, Drawer, ActionIcon } from "@mantine/core";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { useDisclosure } from "@mantine/hooks";
import { IconFilter } from "@tabler/icons-react";

export default function Layout({ children }: { children: React.ReactNode }) {
  const searchParams = useSearchParams();
  const colorParam = searchParams.get("color");
  const shapeParam = searchParams.get("shape");
  const type = searchParams?.get("type");

  const capitalizeWords = (str: string) =>
    str
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");

  const color = colorParam ? capitalizeWords(colorParam) : null;
  const shape = shapeParam ? capitalizeWords(shapeParam) : null;

  const [selectedStones, setSelectedStones] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<any>(type ? [type] : []);
  const [selectedColors, setSelectedColors] = useState<string[]>(
    color ? [color] : []
  );
  const [selectedShapes, setSelectedShapes] = useState<string[]>(
    shape ? [shape] : []
  );
  const [selectedRoundSizes, setSelectedRoundSizes] = useState<string[]>([]);
  const [length, setLength] = useState<number | string>("");
  const [width, setWidth] = useState<number | string>("");
  const [priceRange, setPriceRange] = useState<[number, number]>([100, 5000]);

  const [filteredGemstones, setFilteredGemstones] = useState<any[]>([]);
  const [filterTrigger, setFilterTrigger] = useState(0);
  const [loading, setLoading] = useState(true);

  const [drawerOpened, { open, close }] = useDisclosure(false);

  const didMount = useRef(false);

  const fetchFilteredData = async () => {
    setLoading(true);
    const filterOptions = {
      types: selectedTypes,
      collection_slug: selectedStones,
      color: selectedColors,
      shape: selectedShapes,
      size: selectedRoundSizes,
      length,
      width,
      price: priceRange,
    };
    const response = await getFilteredData(filterOptions);
    setFilteredGemstones(response?.data || []);
    setLoading(false);
    setFilterTrigger((prev) => prev + 1);
  };

  // Update filters when URL params change
  useEffect(() => {
    if (color) {
      setSelectedColors([color]);
    } else {
      setSelectedColors([]);
    }

    if (shape) {
      setSelectedShapes([shape]);
    } else {
      setSelectedShapes([]);
    }
  }, [color, shape]);

  // Always fetch once on mount
  useEffect(() => {
    fetchFilteredData().finally(() => {
      didMount.current = true;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Refetch when any filter changes
  useEffect(() => {
    console.log("vchangesss");
    if (!didMount.current) return;
    fetchFilteredData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    selectedTypes,
    selectedStones,
    selectedColors,
    selectedShapes,
    selectedRoundSizes,
    length,
    width,
    priceRange,
  ]);

  return (
    <div>
      <div className="flex justify-center gap-6 py-10 bg-[#F9F5F0]">
        <h1 className="text-3xl text-[#6B7280]">
          Calibrated Faceted Gemstones
        </h1>
      </div>

      {/* Mobile Filter Button */}
      <div className="lg:hidden flex justify-end px-4 mb-2 mt-5">
        <ActionIcon onClick={open} variant="outline" color="gray" size="lg">
          <IconFilter size={20} />
        </ActionIcon>
      </div>

      <Grid gutter="lg">
        {/* Desktop Sidebar */}
        <GridCol span={{ base: 12, md: 3 }} className="hidden lg:flex">
          <FilterSideBar
            selectedTypes={selectedTypes}
            setSelectedTypes={setSelectedTypes}
            selectedStones={selectedStones}
            setSelectedStones={setSelectedStones}
            selectedColors={selectedColors}
            setSelectedColors={setSelectedColors}
            selectedShapes={selectedShapes}
            setSelectedShapes={setSelectedShapes}
            length={length}
            setLength={setLength}
            width={width}
            setWidth={setWidth}
            priceRange={priceRange}
            setPriceRange={setPriceRange}
            selectedRoundSizes={selectedRoundSizes}
            setSelectedRoundSizes={setSelectedRoundSizes}
            color={color}
          />
          <Divider orientation="vertical" />
        </GridCol>

        {/* Results */}
        <GridCol span={{ base: 12, md: 9 }}>
          {loading ? (
            <div className="px-5 py-10 text-center text-gray-500">
              Loading gemstones...
            </div>
          ) : (
            <GridView
              gemstones={filteredGemstones}
              loadingTrigger={filterTrigger}
              color={color}
            />
          )}
        </GridCol>
      </Grid>

      {/* Mobile Drawer */}
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
        <FilterSideBar
          selectedTypes={selectedTypes}
          setSelectedTypes={setSelectedTypes}
          selectedStones={selectedStones}
          setSelectedStones={setSelectedStones}
          selectedColors={selectedColors}
          setSelectedColors={setSelectedColors}
          selectedShapes={selectedShapes}
          setSelectedShapes={setSelectedShapes}
          length={length}
          setLength={setLength}
          width={width}
          setWidth={setWidth}
          priceRange={priceRange}
          setPriceRange={setPriceRange}
          selectedRoundSizes={selectedRoundSizes}
          setSelectedRoundSizes={setSelectedRoundSizes}
          color={color}
        />
      </Drawer>
    </div>
  );
}
