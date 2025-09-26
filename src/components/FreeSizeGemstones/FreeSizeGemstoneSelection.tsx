"use client";

import { getFreeSizeFilteredData } from "@/apis/api";
import { FreeSizeGridView } from "@/components/FreeSizeGemtones/FreeSizeGridView";
import { FreeSizeFilterSideBar } from "@/components/FreeSizeGemtones/FreeSizeFilterSideBar";
import { Divider, Drawer, Grid, GridCol, ActionIcon } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconFilter } from "@tabler/icons-react";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function FreeSizeGemstoneSelection() {
  const path = usePathname();
  const segments = path.split("/").filter(Boolean);
  const gemstoneType = segments[1] ? segments[1] : null;

  const [filteredGemstones, setFilteredGemstones] = useState<any[]>([]);
  const [filterTrigger, setFilterTrigger] = useState(0);
  const [loading, setLoading] = useState(true);

  const [drawerOpened, { open, close }] = useDisclosure(false);

  // --- FILTER STATES ---
  const [lotSearch, setLotSearch] = useState("");
  const [selectedStones, setSelectedStones] = useState<string[]>(
    gemstoneType
      ? [gemstoneType.charAt(0).toUpperCase() + gemstoneType.slice(1)]
      : []
  );
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedShapes, setSelectedShapes] = useState<string[]>([]);
  const [selectedOrigins, setSelectedOrigins] = useState<string[]>([]);
  const [weightRange, setWeightRange] = useState<[number, number]>([0.51, 25]);
  const [singleOrMatched, setSingleOrMatched] = useState<string[]>([]);
  const [enhancement, setEnhancement] = useState<string[]>([]);
  const [certified, setCertified] = useState<boolean | null>(null);
  const [length, setLength] = useState<any>({ min: "", max: "" });
  const [width, setWidth] = useState<any>({ min: "", max: "" });

  const router = useRouter();
  const searchParams = useSearchParams();

  // Restore filters from URL on first mount
  useEffect(() => {
    const shape = searchParams.get("shape")?.split(",") || [];
    const color = searchParams.get("color")?.split(",") || [];
    const weight = searchParams.get("weight")?.split("-").map(Number) || [
      0.51, 25,
    ];

    setSelectedShapes(shape);
    setSelectedColors(color);
    setWeightRange(weight as [number, number]);
  }, []);

  useEffect(() => {
    const params = new URLSearchParams();
    if (selectedShapes.length) params.set("shape", selectedShapes.join(","));
    if (selectedColors.length) params.set("color", selectedColors.join(","));
    if (weightRange) params.set("weight", weightRange.join("-"));

    router.replace(`?${params.toString()}`);
  }, [selectedShapes, selectedColors, weightRange, router]);

  const sortBySize = (data: any[]) => {
    return [...data].sort((a, b) => {
      const parseDims = (dimStr: string) => {
        if (!dimStr) return 0;
        const clean = dimStr.trim();

        if (clean.includes("x")) {
          const parts = clean.split("x").map((p) => parseFloat(p.trim()));
          if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
            return parts[0] * parts[1];
          }
        } else {
          const val = parseFloat(clean);
          if (!isNaN(val)) return val;
        }
        return 0;
      };

      const sizeA = parseDims(a.dimension || a.Dimension || "");
      const sizeB = parseDims(b.dimension || b.Dimension || "");
      return sizeB - sizeA;
    });
  };

  const fetchFilteredData = async () => {
    setLoading(true);

    const filterOptions = {
      lot_number: lotSearch,
      gemstone_type: gemstoneType
        ? [gemstoneType.charAt(0).toUpperCase() + gemstoneType.slice(1)]
        : [],
      color: selectedColors,
      shape: selectedShapes,
      origin: selectedOrigins,
      weight: weightRange,
      single_or_matched: singleOrMatched,
      enhancement,
      is_certified: certified,
      length,
      width,
    };

    const response = await getFreeSizeFilteredData(filterOptions);
    const sorted = sortBySize(response?.data || []);
    setFilteredGemstones(sorted);

    setLoading(false);
    setFilterTrigger((prev) => prev + 1);
  };

  // Fetch whenever filters change
  useEffect(() => {
    fetchFilteredData();
  }, [
    lotSearch,
    selectedColors,
    selectedShapes,
    selectedOrigins,
    weightRange,
    singleOrMatched,
    enhancement,
    certified,
    length,
    width,
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
          <FreeSizeFilterSideBar
            lotSearch={lotSearch}
            setLotSearch={setLotSearch}
            selectedStones={selectedStones}
            setSelectedStones={setSelectedStones}
            selectedColors={selectedColors}
            setSelectedColors={setSelectedColors}
            selectedShapes={selectedShapes}
            setSelectedShapes={setSelectedShapes}
            selectedOrigins={selectedOrigins}
            setSelectedOrigins={setSelectedOrigins}
            weightRange={weightRange}
            setWeightRange={setWeightRange}
            singleOrMatched={singleOrMatched}
            setSingleOrMatched={setSingleOrMatched}
            enhancement={enhancement}
            setEnhancement={setEnhancement}
            certified={certified}
            setCertified={setCertified}
            length={length}
            setLength={setLength}
            width={width}
            setWidth={setWidth}
          />
          <Divider orientation="vertical" />
        </GridCol>

        <GridCol span={{ base: 12, md: 9 }}>
          {loading ? (
            <div className="px-5 py-10 text-center text-gray-500">
              Loading gemstones...
            </div>
          ) : (
            <FreeSizeGridView
              gemstones={filteredGemstones}
              loadingTrigger={filterTrigger}
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
        <FreeSizeFilterSideBar
          lotSearch={lotSearch}
          setLotSearch={setLotSearch}
          selectedStones={selectedStones}
          setSelectedStones={setSelectedStones}
          selectedColors={selectedColors}
          setSelectedColors={setSelectedColors}
          selectedShapes={selectedShapes}
          setSelectedShapes={setSelectedShapes}
          selectedOrigins={selectedOrigins}
          setSelectedOrigins={setSelectedOrigins}
          weightRange={weightRange}
          setWeightRange={setWeightRange}
          singleOrMatched={singleOrMatched}
          setSingleOrMatched={setSingleOrMatched}
          enhancement={enhancement}
          setEnhancement={setEnhancement}
          certified={certified}
          setCertified={setCertified}
          length={length}
          setLength={setLength}
          width={width}
          setWidth={setWidth}
        />
      </Drawer>
    </div>
  );
}
