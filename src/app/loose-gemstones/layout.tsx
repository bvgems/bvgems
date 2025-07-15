"use client";

import { getFilteredData } from "@/apis/api";
import { GridView } from "@/components/GridView/GridView";
import { FilterSideBar } from "@/components/LooseGemstones/FilterSideBar";
import { Divider, Grid, GridCol } from "@mantine/core";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  const searchParams = useSearchParams();
  const color = searchParams.get("color");

  const [selectedStones, setSelectedStones] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>(
    color ? [color.toLowerCase()] : []
  );
  const [selectedShapes, setSelectedShapes] = useState<string[]>([]);
  const [selectedRoundSizes, setSelectedRoundSizes] = useState<string[]>([]);
  const [length, setLength] = useState<number | string>("");
  const [width, setWidth] = useState<number | string>("");
  const [priceRange, setPriceRange] = useState<[number, number]>([100, 5000]);

  const [filteredGemstones, setFilteredGemstones] = useState<any>(undefined);
  const [filterTrigger, setFilterTrigger] = useState(0);
  const [filtersChanged, setFiltersChanged] = useState(false);

  const fetchFilteredData = async () => {
    const filterOptions = {
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
    setFilterTrigger((prev) => prev + 1);
  };

  useEffect(() => {
    if (!filtersChanged) return;
    fetchFilteredData();
  }, [
    selectedStones,
    selectedColors,
    selectedShapes,
    selectedRoundSizes,
    length,
    width,
    priceRange,
    filtersChanged,
  ]);

  return (
    <div>
      <div className="flex justify-center gap-6 py-10 bg-[#E5E7EB]">
        <h1 className="text-3xl text-[#6B7280]">
          Calibrated Faceted Gemstones
        </h1>
      </div>
      <Grid>
        <GridCol className="flex" span={{ base: 12, md: 3 }}>
          <FilterSideBar
            selectedStones={selectedStones}
            setSelectedStones={(value: any) => {
              setSelectedStones(value);
              setFiltersChanged(true);
            }}
            selectedColors={selectedColors}
            setSelectedColors={(value: any) => {
              setSelectedColors(value);
              setFiltersChanged(true);
            }}
            selectedShapes={selectedShapes}
            setSelectedShapes={(value: any) => {
              setSelectedShapes(value);
              setFiltersChanged(true);
            }}
            length={length}
            setLength={(value: any) => {
              setLength(value);
              setFiltersChanged(true);
            }}
            width={width}
            setWidth={(value: any) => {
              setWidth(value);
              setFiltersChanged(true);
            }}
            priceRange={priceRange}
            setPriceRange={(value: any) => {
              setPriceRange(value);
              setFiltersChanged(true);
            }}
            selectedRoundSizes={selectedRoundSizes}
            setSelectedRoundSizes={(value: any) => {
              setSelectedRoundSizes(value);
              setFiltersChanged(true);
            }}
            color={color}
          />
          <Divider orientation="vertical" />
        </GridCol>

        <GridCol span={{ base: 12, md: 9 }}>
          <GridView
            gemstones={filteredGemstones}
            loadingTrigger={filterTrigger}
          />
        </GridCol>
      </Grid>
    </div>
  );
}
