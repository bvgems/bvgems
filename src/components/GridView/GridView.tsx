"use client";

import {
  Grid,
  Skeleton,
  Card,
  Button,
  Loader,
} from "@mantine/core";
import { useEffect, useState, useMemo } from "react";
import { AnimatedCard } from "./AnimatedCard";
import { getGemstonesList } from "@/apis/api";
import { useRouter, useSearchParams } from "next/navigation";
import { GridViewTopFilters } from "./GridViewTopFilters";
import { gemstoneOptions, ShapeFilterList, shopByColorOptions } from "@/utils/constants";
import { parseSize } from "./parseSizeHelper";

type RangeValue = { min: number | ""; max: number | "" };

interface GridViewProps {
  gemstones?: any;
  loadingTrigger?: any;
  color?: any;
}

export function GridView({ gemstones, loadingTrigger, color }: GridViewProps) {
  const [loading, setLoading] = useState(false);
  const [loadMoreLoading, setLoadMoreLoading] = useState(false);
  
  const [searchItems, setSearchItems] = useState<any>([]); // allGemstones
  const [displayItems, setDisplayItems] = useState<any>([]);

  // Filter States
  const [selectedGems, setSelectedGems] = useState<string[]>([]);
  const [selectedShapes, setSelectedShapes] = useState<string[]>([]);
  const [selectedSapphireColors, setSelectedSapphireColors] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]); // "Natural" or "Lab Grown"
  
  const [weightRange, setWeightRange] = useState<RangeValue>({ min: "", max: "" });
  const [lengthRange, setLengthRange] = useState<RangeValue>({ min: "", max: "" });
  const [widthRange, setWidthRange] = useState<RangeValue>({ min: "", max: "" });

  const [toleranceEnabled, setToleranceEnabled] = useState(false);

  const searchParams = useSearchParams();
  const router = useRouter();

  // Load more state
  const [visibleCount, setVisibleCount] = useState(16);
  const ITEMS_PER_PAGE = 16;

  // Initialize data
  useEffect(() => {
    if (gemstones === undefined && !color) {
      setLoading(true);
      fetchGemstones();
    } else {
      setLoading(true);
      const timer = setTimeout(() => {
        setSearchItems(gemstones || []);
        setVisibleCount(ITEMS_PER_PAGE);
        setLoading(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [gemstones, loadingTrigger]);

  const fetchGemstones = async () => {
    try {
      const response = await getGemstonesList();
      const allData = response?.allGemstones || response?.data || [];
      setSearchItems(allData);
    } catch (error) {
      console.error("Error fetching fallback gemstones", error);
    } finally {
      setLoading(false);
    }
  };

  // Compute Dynamic Bounds and Sapphire Colors
  const { weightBounds, lengthBounds, widthBounds, availableSapphireColors } = useMemo(() => {
    let minWt = 0, maxWt = 0, minL = 0, maxL = 0, minW = 0, maxW = 0;
    const colors = new Set<string>();

    searchItems.forEach((d: any) => {
       const wt = parseFloat(d.ct_weight) || 0;
       if (wt > maxWt) maxWt = wt;

       const dims = parseSize(d.size);
       if (dims) {
           if (dims[0] > maxL) maxL = dims[0];
           if (dims[1] > maxW) maxW = dims[1];
       }

       if (String(d.collection_slug || "").toLowerCase().includes("sapphire") && d.color) {
         colors.add(d.color);
       }
    });

    return {
      weightBounds: { min: 0, max: Math.ceil(maxWt) || 100 },
      lengthBounds: { min: 0, max: Math.ceil(maxL) || 30 },
      widthBounds: { min: 0, max: Math.ceil(maxW) || 30 },
      availableSapphireColors: Array.from(colors).sort()
    };
  }, [searchItems]);

  // Apply Search Params whenever URL changes (once data is loaded)
  useEffect(() => {
    if (searchItems.length > 0) {
      const initShape = searchParams.get("shape");
      const initColor = searchParams.get("color");
      const initType = searchParams.get("type");

      if (initShape) {
        const shapeObj = ShapeFilterList.find(s => s.label.toLowerCase() === initShape.toLowerCase());
        setSelectedShapes(shapeObj ? [shapeObj.value] : []);
      } else {
        setSelectedShapes([]);
      }

      if (initColor) {
        const colorTitle = initColor.charAt(0).toUpperCase() + initColor.slice(1).toLowerCase();
        setSelectedSapphireColors([colorTitle]);
      } else {
        setSelectedSapphireColors([]);
      }

      if (initType) {
        setSelectedTypes([initType]);
      } else {
        setSelectedTypes([]);
      }
      
      // Reset other local filters so it acts as a fresh page load
      setSelectedGems([]);
      setWeightRange({ min: "", max: "" });
      setLengthRange({ min: "", max: "" });
      setWidthRange({ min: "", max: "" });
    }
  }, [searchItems, searchParams]);

  // Filtering Logic
  useEffect(() => {
    let filtered = [...searchItems];

    // Filter by Gem Type (collection_slug)
    if (selectedGems.length > 0) {
      filtered = filtered.filter(item => {
        const slug = String(item.collection_slug || "").toLowerCase();
        return selectedGems.some(g => slug.includes(g.toLowerCase()));
      });
    }

    // Filter by Shape
    if (selectedShapes.length > 0) {
      filtered = filtered.filter(item => {
        const shape = String(item.shape || "").toLowerCase();
        return selectedShapes.some(s => shape.includes(s.toLowerCase()));
      });
    }

    // Filter by Color
    if (selectedSapphireColors.length > 0) {
      filtered = filtered.filter(item => {
        const color = String(item.color || "").toLowerCase();
        return selectedSapphireColors.some(c => color.includes(c.toLowerCase()));
      });
    }

    // Filter by Type (Natural / Lab Grown)
    if (selectedTypes.length > 0) {
      filtered = filtered.filter(item => {
        const type = String(item.type || "").toLowerCase();
        return selectedTypes.some(t => type === t.toLowerCase());
      });
    }

    // Filter by Weight
    if (weightRange.min !== "" || weightRange.max !== "") {
      filtered = filtered.filter(item => {
        const wt = parseFloat(item.ct_weight) || 0;
        const effectiveMin = weightRange.min === "" ? null : Number(weightRange.min) - (toleranceEnabled ? 0.5 : 0);
        const effectiveMax = weightRange.max === "" ? null : Number(weightRange.max) + (toleranceEnabled ? 0.5 : 0);
        
        const meetsMin = effectiveMin === null || wt >= effectiveMin;
        const meetsMax = effectiveMax === null || wt <= effectiveMax;
        return meetsMin && meetsMax;
      });
    }

    // Filter by Dimensions
    if (lengthRange.min !== "" || lengthRange.max !== "" || widthRange.min !== "" || widthRange.max !== "") {
      filtered = filtered.filter(item => {
        const dims = parseSize(item.size);
        if (!dims) return false;
        
        let valid = true;
        if (lengthRange.min !== "") {
          valid = valid && dims[0] >= Number(lengthRange.min) - (toleranceEnabled ? 0.5 : 0);
        }
        if (lengthRange.max !== "") {
          valid = valid && dims[0] <= Number(lengthRange.max) + (toleranceEnabled ? 0.5 : 0);
        }
        if (widthRange.min !== "") {
          valid = valid && dims[1] >= Number(widthRange.min) - (toleranceEnabled ? 0.5 : 0);
        }
        if (widthRange.max !== "") {
          valid = valid && dims[1] <= Number(widthRange.max) + (toleranceEnabled ? 0.5 : 0);
        }
        
        return valid;
      });
    }

    setDisplayItems(filtered);
    setVisibleCount(ITEMS_PER_PAGE);
  }, [
    searchItems, 
    selectedGems, 
    selectedShapes, 
    selectedSapphireColors,
    selectedTypes, 
    weightRange, 
    lengthRange, 
    widthRange,
    toleranceEnabled
  ]);

  const resetAll = () => {
    setSelectedGems([]);
    setSelectedShapes([]);
    setSelectedSapphireColors([]);
    setSelectedTypes([]);
    setWeightRange({ min: "", max: "" });
    setLengthRange({ min: "", max: "" });
    setWidthRange({ min: "", max: "" });
    setToleranceEnabled(false);
    router.replace("/loose-gemstones");
  };

  const SkeletonCard = () => (
    <Card
      className="flex flex-col justify-start bg-white h-[250]"
      padding="lg"
      withBorder
      shadow="md"
    >
      <Skeleton height={200} mb="sm" />
      <Skeleton height={24} width="60%" radius="sm" />
      <Skeleton height={16} mt="xs" width="40%" radius="sm" />
    </Card>
  );

  return (
    <div className="mt-16 px-4 md:px-8 py-8 max-w-[1600px] mx-auto w-full">
      <div className="flex justify-center mb-10">
        <h1 className="text-4xl text-violet-800 text-center uppercase tracking-widest font-light">
          Calibrated Faceted Gemstones
        </h1>
      </div>

      {!loading && searchItems.length > 0 && (
        <GridViewTopFilters 
          gemstoneOptions={gemstoneOptions}
          shapeOptions={ShapeFilterList}
          
          selectedGems={selectedGems}
          setSelectedGems={setSelectedGems}
          
          selectedShapes={selectedShapes}
          setSelectedShapes={setSelectedShapes}
          
          weightRange={weightRange}
          setWeightRange={setWeightRange}
          weightBounds={weightBounds}
          
          lengthRange={lengthRange}
          setLengthRange={setLengthRange}
          lengthBounds={lengthBounds}
          
          widthRange={widthRange}
          setWidthRange={setWidthRange}
          widthBounds={widthBounds}
          
          toleranceEnabled={toleranceEnabled}
          setToleranceEnabled={setToleranceEnabled}

          sapphireColors={availableSapphireColors}
          selectedSapphireColors={selectedSapphireColors}
          setSelectedSapphireColors={setSelectedSapphireColors}
          
          resetAll={resetAll}
        />
      )}

      {loading ? (
        <Grid gutter="xl" className="mt-8">
          {[...Array(12)].map((_, index) => (
            <Grid.Col key={index} span={{ base: 12, sm: 6, md: 4, lg: 3 }}>
              <SkeletonCard />
            </Grid.Col>
          ))}
        </Grid>
      ) : (
        <>
          <div className="mt-6 mb-2 text-sm text-gray-500 font-medium">
            Showing {displayItems.length} result{displayItems.length !== 1 ? 's' : ''}
          </div>
          
          <Grid gutter="xl" className="mt-2">
            {displayItems
              .slice(0, visibleCount)
              .map((item: any, index: number) => (
                <Grid.Col key={item?.id || index} span={{ base: 12, sm: 6, md: 4, lg: 3 }}>
                  <AnimatedCard item={item} index={index} baseDelay={0.1} />
                </Grid.Col>
              ))}
          </Grid>

          {displayItems.length === 0 && (
            <div className="text-center text-gray-500 mt-20 text-lg">
              No gemstones found matching your criteria.
            </div>
          )}

          {visibleCount < displayItems.length && (
            <div className="flex justify-center mt-12 mb-8">
              <Button
                variant="outline"
                size="lg"
                color="#0b182d"
                radius="md"
                onClick={() => {
                  setLoadMoreLoading(true);
                  setTimeout(() => {
                    setVisibleCount((prev) => prev + ITEMS_PER_PAGE);
                    setLoadMoreLoading(false);
                  }, 400);
                }}
                className="hover:bg-gray-50 transition-colors w-full max-w-xs"
              >
                {loadMoreLoading ? <Loader size="sm" color="#0b182d" /> : "LOAD MORE"}
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
