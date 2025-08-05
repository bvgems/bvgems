"use client";

import { getFilteredData } from "@/apis/api";
import { GridView } from "@/components/GridView/GridView";
import { FilterSideBar } from "@/components/LooseGemstones/FilterSideBar";
import {
  Divider,
  Grid,
  GridCol,
  Drawer,
  Button,
  ActionIcon,
  Group,
} from "@mantine/core";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useDisclosure } from "@mantine/hooks";
import { IconFilter } from "@tabler/icons-react";

export default function Layout({ children }: { children: React.ReactNode }) {
  const searchParams = useSearchParams();
  const colorParam = searchParams.get("color");
  const color = colorParam
    ? colorParam.charAt(0).toUpperCase() + colorParam.slice(1).toLowerCase()
    : null;

  const [selectedStones, setSelectedStones] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>(
    color ? [color] : []
  );
  const [selectedShapes, setSelectedShapes] = useState<string[]>([]);
  const [selectedRoundSizes, setSelectedRoundSizes] = useState<string[]>([]);
  const [length, setLength] = useState<number | string>("");
  const [width, setWidth] = useState<number | string>("");
  const [priceRange, setPriceRange] = useState<[number, number]>([100, 5000]);

  const [filteredGemstones, setFilteredGemstones] = useState<any>(undefined);
  const [filterTrigger, setFilterTrigger] = useState(0);
  const [filtersChanged, setFiltersChanged] = useState(false);

  const [drawerOpened, { open, close }] = useDisclosure(false);

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
    console.log("selected color change", color, filtersChanged);
    if (!filtersChanged) {
      if (color) {
        fetchFilteredData();
        return;
      } else {
        return;
      }
    }
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

      <div className="lg:hidden flex justify-end px-4 mb-2 mt-5">
        <ActionIcon onClick={open} variant="outline" color="gray" size="lg">
          <IconFilter size={20} />
        </ActionIcon>
      </div>

      <Grid gutter="lg">
        <GridCol span={{ base: 12, md: 3 }} className="hidden lg:flex">
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
            color={color}
          />
          {/* {filteredGemstones !== undefined ? (
            <GridView
              gemstones={filteredGemstones}
              loadingTrigger={filterTrigger}
            />
          ) : (
            <div className="px-5 py-10 text-center text-gray-500">
              Loading gemstones...
            </div>
          )} */}
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
      </Drawer>
    </div>
  );
}
