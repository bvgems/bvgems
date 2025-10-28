"use client";

import { getFreeSizeFilteredData } from "@/apis/api";
import { FreeSizeGridView } from "@/components/FreeSizeGemtones/FreeSizeGridView";
import { FreeSizeFilterSideBar } from "@/components/FreeSizeGemtones/FreeSizeFilterSideBar";
import { Divider, Grid, GridCol } from "@mantine/core";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
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
      ? [gemstoneType.charAt(0).toUpperCase() + gemstoneType.slice(1)]
      : []
  );
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedShapes, setSelectedShapes] = useState<string[]>([]);
  const [selectedOrigins, setSelectedOrigins] = useState<string[]>([]);

  // ✨ Weight range now starts EMPTY and only filters when user enters a value
  const [weightRange, setWeightRange] = useState<
    [number | null, number | null]
  >([null, null]);

  const [singleOrMatched, setSingleOrMatched] = useState<string[]>([]);
  const [enhancement, setEnhancement] = useState<string[]>([]);
  const [certified, setCertified] = useState<boolean | null>(null);
  const [length, setLength] = useState<any>({ min: "", max: "" });
  const [width, setWidth] = useState<any>({ min: "", max: "" });

  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const shape = searchParams.get("shape")?.split(",").filter(Boolean) || [];
    const color = searchParams.get("color")?.split(",").filter(Boolean) || [];
    const weightStr = searchParams.get("weight") || "";

    if (shape.length > 0) setSelectedShapes(shape);
    if (color.length > 0) setSelectedColors(color);

    // parse "weight=min-max" but allow blanks (e.g., "weight=1.2-" or "-5")
    if (weightStr) {
      const [minStr, maxStr] = weightStr.split("-");
      const min = minStr?.trim() ? Number(minStr) : null;
      const max = maxStr?.trim() ? Number(maxStr) : null;
      setWeightRange([
        typeof min === "number" && !Number.isNaN(min) ? min : null,
        typeof max === "number" && !Number.isNaN(max) ? max : null,
      ]);
    }

    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (!isInitialized) return;

    const params = new URLSearchParams();
    if (selectedShapes.length) params.set("shape", selectedShapes.join(","));
    if (selectedColors.length) params.set("color", selectedColors.join(","));

    // only write weight to URL if at least one bound is provided
    if (weightRange[0] != null || weightRange[1] != null) {
      const weightStr = `${weightRange[0] ?? ""}-${weightRange[1] ?? ""}`;
      params.set("weight", weightStr);
    }

    const query = params.toString();
    router.replace(query ? `?${query}` : "?", { scroll: false });
  }, [selectedShapes, selectedColors, weightRange, isInitialized, router]);

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
    let gemstoneTypeFilter: string[] = [];

    if (gemstoneType) {
      const formattedType =
        gemstoneType.charAt(0).toUpperCase() + gemstoneType.slice(1);
      gemstoneTypeFilter = [formattedType];
    }

    const filterOptions: any = {
      lot_number: lotSearch,
      gemstone_type: gemstoneTypeFilter,
      color: selectedColors,
      shape: selectedShapes,
      origin: selectedOrigins,

      // only include weight if user provided min and/or max
      weight:
        weightRange[0] != null || weightRange[1] != null
          ? weightRange
          : undefined,

      single_or_matched: singleOrMatched,
      enhancement,
      is_certified: certified,
      length,
      width,
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
    gemstoneType,
  ]);

  return (
    <div className="px-3 lg:px-0">
      <Grid gutter="lg">
        {/* Desktop Sidebar */}
        <GridCol span={{ base: 12, md: 3 }} className="hidden lg:flex">
          <FreeSizeFilterSideBar
            isFancySapphire={isFancySapphire}
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

        {/* Main Content (Grid + Filters on Mobile) */}
        <GridCol span={{ base: 12, md: 9 }}>
          {isMobile && (
            <div className="mb-4">
              <FreeSizeFilterSideBar
                isFancySapphire={isFancySapphire}
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
              <Divider className="mt-3"/>
            </div>
          )}

          {loading ? (
            <div className="px-5 py-10 text-center text-gray-500">
              Loading gemstones...
            </div>
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
