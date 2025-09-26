"use client";

import { getFilteredData } from "@/apis/api";
import { GridView } from "@/components/GridView/GridView";
import { FilterSideBar } from "@/components/LooseGemstones/FilterSideBar";
import { Divider, Grid, GridCol, Drawer, ActionIcon } from "@mantine/core";
import { useSearchParams, useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { useDisclosure } from "@mantine/hooks";
import { IconFilter } from "@tabler/icons-react";

export default function Layout({ children }: { children: React.ReactNode }) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const colorParam = searchParams.get("color");
  const shapeParam = searchParams.get("shape");
  const typeParam = searchParams.get("type");
  const priceParam = searchParams.get("price");
  const stoneParam = searchParams.get("stone"); // 👈 added

  const capitalizeWords = (str: string) =>
    str
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");

  const color = colorParam ? capitalizeWords(colorParam) : null;
  const shape = shapeParam ? capitalizeWords(shapeParam) : null;

  // --- FILTER STATES ---
  const [selectedStones, setSelectedStones] = useState<string[]>(
    stoneParam ? stoneParam.split(",").map(capitalizeWords) : []
  );
  const [selectedTypes, setSelectedTypes] = useState<any>(
    typeParam ? [typeParam] : []
  );
  const [selectedColors, setSelectedColors] = useState<string[]>(
    color ? [color] : []
  );
  const [selectedShapes, setSelectedShapes] = useState<string[]>(
    shape ? [shape] : []
  );
  const [selectedRoundSizes, setSelectedRoundSizes] = useState<string[]>([]);
  const [length, setLength] = useState<number | string>("");
  const [width, setWidth] = useState<number | string>("");

  const [priceRange, setPriceRange] = useState<[number, number]>(
    priceParam
      ? (priceParam.split("-").map(Number) as [number, number])
      : [100, 5000]
  );

  const [filteredGemstones, setFilteredGemstones] = useState<any[]>([]);
  const [filterTrigger, setFilterTrigger] = useState(0);
  const [loading, setLoading] = useState(true);

  const [drawerOpened, { open, close }] = useDisclosure(false);
  const didMount = useRef(false);

  const fetchFilteredData = async () => {
    setLoading(true);
    const filterOptions = {
      types: selectedTypes,
      collection_slug: selectedStones, // 👈 stone filter is used here
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

  // Restore filters from URL on first mount
  useEffect(() => {
    if (color) setSelectedColors([color]);
    if (shape) setSelectedShapes([shape]);
    if (typeParam) setSelectedTypes([typeParam]);
    if (stoneParam)
      setSelectedStones(stoneParam.split(",").map(capitalizeWords));
    if (priceParam) {
      const parsed = priceParam.split("-").map(Number);
      if (parsed.length === 2) setPriceRange(parsed as [number, number]);
    }
  }, []);

  // Persist filters into URL whenever they change
  useEffect(() => {
    if (!didMount.current) return;

    const params = new URLSearchParams();
    if (selectedColors.length) params.set("color", selectedColors.join(","));
    if (selectedShapes.length) params.set("shape", selectedShapes.join(","));
    if (selectedTypes.length) params.set("type", selectedTypes.join(","));
    if (selectedStones.length) params.set("stone", selectedStones.join(",")); // 👈 persist stones
    if (priceRange) params.set("price", priceRange.join("-"));

    router.replace(`?${params.toString()}`);
  }, [
    selectedColors,
    selectedShapes,
    selectedTypes,
    selectedStones,
    priceRange,
    router,
  ]);

  useEffect(() => {
    fetchFilteredData().finally(() => {
      didMount.current = true;
    });
  }, []);

  useEffect(() => {
    if (!didMount.current) return;
    fetchFilteredData();
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
