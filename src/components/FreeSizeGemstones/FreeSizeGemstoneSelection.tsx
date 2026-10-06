"use client";

import { getFreeSizeFilteredData } from "@/apis/api";
import { FreeSizeGridView } from "@/components/FreeSizeGemtones/FreeSizeGridView";
import { FreeSizeGridViewTopFilters } from "@/components/FreeSizeGemtones/FreeSizeGridViewTopFilters";
import { sortBySizeAsc } from "@/utils/sortUtils";
import { Divider, Grid, GridCol, Skeleton, Card } from "@mantine/core";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { freeSizeFilterOptions, FreeSizeShapeFilterList, SapphireLooseGemstoneColorOptions } from "@/utils/constants";
import React, { useEffect, useState } from "react";
import { useMediaQuery } from "@mantine/hooks";

export default function FreeSizeGemstoneSelection() {
  const path = usePathname();
  const segments = path.split("/").filter(Boolean);
  const isMobile = useMediaQuery("(max-width: 1023px)");

  const gemstoneType =
    segments.length >= 2 && segments[1].toLowerCase() !== "free-size-gemstones"
      ? segments[1]
      : null;

  const [isViewAll, setIsViewAll] = useState(false);
  const [isFancySapphire, setIsFancySapphire] = useState(false);

  useEffect(() => {
    if (segments.length === 1) {
      setIsViewAll(true);
    } else {
      segments[1]?.toLowerCase()?.includes("fancy") && setIsFancySapphire(true);
      setIsViewAll(false);
    }
  }, [segments]);

  const [filteredGemstones, setFilteredGemstones] = useState<any[]>([]);
  const [filterTrigger, setFilterTrigger] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  const [lotSearch, setLotSearch] = useState("");
  const [selectedStones, setSelectedStones] = useState<string[]>(
    gemstoneType
      ? [gemstoneType.toLowerCase() === "sapphire" ? "Blue Sapphire" : gemstoneType.toLowerCase() === "fancy-sapphire" ? "Fancy Sapphire" : gemstoneType.charAt(0).toUpperCase() + gemstoneType.slice(1).replace("-", " ")]
      : []
  );
  
  // If we land on the base /sapphire URL, we want to auto-select "Blue" unless a color is already specified in the URL
  const [selectedColors, setSelectedColors] = useState<string[]>(
    gemstoneType && gemstoneType.toLowerCase() === "fancy-sapphire"
      ? SapphireLooseGemstoneColorOptions.map((c: any) => c.value).filter((c: string) => c.toLowerCase() !== "blue")
      : []
  );
  const [selectedShapes, setSelectedShapes] = useState<string[]>([]);
  const [selectedOrigins, setSelectedOrigins] = useState<string[]>([]);

  // ✨ Weight range now starts EMPTY and only filters when user enters a value
  const [weightRange, setWeightRange] = useState<
    [string, string]
  >(["", ""]);

  const [singleOrMatched, setSingleOrMatched] = useState<string[]>([]);
  const [enhancement, setEnhancement] = useState<string[]>([]);
  const [certified, setCertified] = useState<boolean | null>(null);
  const [length, setLength] = useState<any>({ min: "", max: "" });
  const [width, setWidth] = useState<any>({ min: "", max: "" });
  const [toleranceEnabled, setToleranceEnabled] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();

  const [lastPath, setLastPath] = useState(path);

  useEffect(() => {
    // If the path changes (e.g. user clicked a Nav Bar link), reset the base states
    if (isInitialized && path !== lastPath) {
      setLastPath(path);
      if (gemstoneType) {
        let newStone = gemstoneType.charAt(0).toUpperCase() + gemstoneType.slice(1).replace("-", " ");
        if (gemstoneType.toLowerCase() === "sapphire") newStone = "Blue Sapphire";
        if (gemstoneType.toLowerCase() === "fancy-sapphire") {
          newStone = "Fancy Sapphire";
          setSelectedColors(SapphireLooseGemstoneColorOptions.map((c: any) => c.value).filter((c: string) => c.toLowerCase() !== "blue"));
        } else {
          setSelectedColors([]);
        }
        setSelectedStones([newStone]);
      } else {
        setSelectedStones([]);
        setSelectedColors([]);
      }
      setSelectedShapes([]);
      setWeightRange(["", ""]);
      setLength({ min: "", max: "" });
      setWidth({ min: "", max: "" });
    }
  }, [path, isInitialized, lastPath, gemstoneType]);

  useEffect(() => {
    const shape = searchParams.get("shape")?.split(",").filter(Boolean) || [];
    const color = searchParams.get("color")?.split(",").filter(Boolean) || [];
    const weightStr = searchParams.get("weight") || "";

    if (shape.length > 0) setSelectedShapes(shape);
    
    if (color.length > 0) {
      setSelectedColors(color);
    } else if (gemstoneType?.toLowerCase() === "sapphire") {
      // Auto-select Blue if on the sapphire page and no colors are in URL
      setSelectedColors(["Blue"]);
    }

    // parse "weight=min-max" but allow blanks (e.g., "weight=1.2-" or "-5")
    if (weightStr) {
      const [minStr, maxStr] = weightStr.split("-");
      setWeightRange([
        minStr?.trim() || "",
        maxStr?.trim() || "",
      ]);
    }

    setIsInitialized(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!isInitialized) return;

    const params = new URLSearchParams();
    if (selectedShapes.length) params.set("shape", selectedShapes.join(","));
    if (selectedColors.length) params.set("color", selectedColors.join(","));

    // only write weight to URL if at least one bound is provided
    if (weightRange[0] !== "" || weightRange[1] !== "") {
      const weightStr = `${weightRange[0]}-${weightRange[1]}`;
      params.set("weight", weightStr);
    }

    const query = params.toString();
    router.replace(query ? `?${query}` : "?", { scroll: false });
  }, [selectedShapes, selectedColors, weightRange, isInitialized, router]);

  const sortBySize = (data: any[]) => {
    return [...data].sort((a, b) => sortBySizeAsc(a, b, 'dimension'));
  };

  const fetchFilteredData = async () => {
    setLoading(true);
    let gemstoneTypeFilter: string[] = [];

    if (selectedStones.length > 0) {
      gemstoneTypeFilter = selectedStones.filter((stone) => {
        // If it's Sapphire but no specific color is selected, ignore it as a filter
        if (stone === "Sapphire" && selectedColors.length === 0) {
          return false;
        }
        return true;
      });
    }

    const filterOptions: any = {
      lot_number: lotSearch,
      gemstone_type: gemstoneTypeFilter,
      color: selectedColors,
      shape: selectedShapes,
      origin: selectedOrigins,

      // only include weight if user provided min and/or max
      weight: (weightRange[0] !== "" || weightRange[1] !== "") ? [
        weightRange[0] !== "" ? Number(weightRange[0]) - (toleranceEnabled ? 0.2 : 0) : null,
        weightRange[1] !== "" ? Number(weightRange[1]) + (toleranceEnabled ? 0.2 : 0) : null
      ] : undefined,

      single_or_matched: singleOrMatched,
      enhancement,
      is_certified: certified,
      length: {
        min: length.min !== "" ? Number(length.min) - (toleranceEnabled ? 0.2 : 0) : undefined,
        max: length.max !== "" ? Number(length.max) + (toleranceEnabled ? 0.2 : 0) : undefined,
      },
      width: {
        min: width.min !== "" ? Number(width.min) - (toleranceEnabled ? 0.2 : 0) : undefined,
        max: width.max !== "" ? Number(width.max) + (toleranceEnabled ? 0.2 : 0) : undefined,
      },
    };

    // Clean up undefined keys so the API only receives applied filters
    Object.keys(filterOptions).forEach((k) => {
      if (
        filterOptions[k] === undefined ||
        (Array.isArray(filterOptions[k]) && filterOptions[k].length === 0)
      ) {
        delete filterOptions[k];
      }
    });

    const response = await getFreeSizeFilteredData(filterOptions);
    const sorted = sortBySize(response?.data || []);
    setFilteredGemstones(sorted);
    setLoading(false);
    setFilterTrigger((prev) => prev + 1);
  };

  useEffect(() => {
    if (!isInitialized) return;

    fetchFilteredData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    isInitialized,
    lotSearch,
    selectedColors,
    selectedShapes,
    selectedOrigins,
    weightRange, // reacts when user actually enters a min/max
    singleOrMatched,
    enhancement,
    certified,
    length,
    width,
    selectedStones,
    toleranceEnabled
  ]);

  const resetAll = () => {
    setSelectedStones([]);
    setSelectedColors([]);
    setSelectedShapes([]);
    setSelectedOrigins([]);
    setLotSearch("");
    setSingleOrMatched([]);
    setEnhancement([]);
    setCertified(null);
    setWeightRange(["", ""]);
    setLength({ min: "", max: "" });
    setWidth({ min: "", max: "" });
    setToleranceEnabled(false);
  };

  return (
    <div className="px-4 md:px-8 py-10 max-w-[1600px] mx-auto w-full">
      <div className="flex justify-center mb-10">
        <h1 className="text-4xl text-violet-800 text-center uppercase tracking-widest font-light">
          {isFancySapphire
            ? "Fancy Sapphires"
            : gemstoneType
              ? gemstoneType.charAt(0).toUpperCase() + gemstoneType.slice(1)
              : "Free Size Gemstones"}
        </h1>
      </div>

      <FreeSizeGridViewTopFilters
        gemstoneOptions={freeSizeFilterOptions}
        shapeOptions={FreeSizeShapeFilterList}
        selectedGems={selectedStones}
        setSelectedGems={setSelectedStones}
        selectedShapes={selectedShapes}
        setSelectedShapes={setSelectedShapes}
        weightRange={{ min: weightRange[0], max: weightRange[1] }}
        setWeightRange={(val) => setWeightRange([val.min as string, val.max as string])}
        weightBounds={{ min: 0, max: 100 }}
        lengthRange={length}
        setLengthRange={setLength}
        lengthBounds={{ min: 0, max: 30 }}
        widthRange={width}
        setWidthRange={setWidth}
        widthBounds={{ min: 0, max: 30 }}
        sapphireColors={SapphireLooseGemstoneColorOptions.map((o: any) => o.value)}
        selectedSapphireColors={selectedColors}
        setSelectedSapphireColors={setSelectedColors}
        lotSearch={lotSearch}
        setLotSearch={setLotSearch}
        selectedOrigins={selectedOrigins}
        setSelectedOrigins={setSelectedOrigins}
        singleOrMatched={singleOrMatched}
        setSingleOrMatched={setSingleOrMatched}
        enhancement={enhancement}
        setEnhancement={setEnhancement}
        certified={certified}
        setCertified={setCertified}
        toleranceEnabled={toleranceEnabled}
        setToleranceEnabled={setToleranceEnabled}
        resetAll={resetAll}
      />

      <Grid gutter="lg">
        <GridCol span={12}>
          {loading ? (
            <Grid gutter="xl" className="mt-8">
              {Array.from({ length: 16 }).map((_, i) => (
                <GridCol span={{ base: 12, sm: 6, md: 4, lg: 3 }} key={i}>
                  <Card className="flex flex-col justify-start bg-white h-[250]" padding="lg" withBorder shadow="md">
                    <Skeleton height={200} mb="sm" />
                    <Skeleton height={24} width="60%" radius="sm" />
                    <Skeleton height={16} mt="xs" width="40%" radius="sm" />
                  </Card>
                </GridCol>
              ))}
            </Grid>
          ) : (
            <FreeSizeGridView
              isViewAll={isViewAll}
              gemstones={filteredGemstones}
              loadingTrigger={filterTrigger}
            />
          )}
        </GridCol>
      </Grid>
    </div>
  );
}
