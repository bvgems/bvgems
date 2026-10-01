"use client";

import {
  Grid,
  Skeleton,
  Card,
  Button,
  Loader,
} from "@mantine/core";
import { useEffect, useState, useMemo, useRef } from "react";
import { AnimatedCard } from "./AnimatedCard";
import { getGemstonesList } from "@/apis/api";
import { useRouter, useSearchParams } from "next/navigation";
import { GridViewTopFilters } from "./GridViewTopFilters";
import { IconList, IconLayoutGrid, IconShoppingCart } from "@tabler/icons-react";
import { AddToCartModal } from "@/components/CommonComponents/AddToCartModal";
import { QuoteRequestModal } from "@/components/CommonComponents/QuoteRequestModal";
import { Table, ActionIcon, Modal, Pagination } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { gemstoneOptions, ShapeFilterList, shopByColorOptions } from "@/utils/constants";
import { parseSize } from "./parseSizeHelper";
import { useAuth } from "@/hooks/useAuth";
import { AuthForm } from "../Auth/AuthForm";
import { getPerCaratPrice, getPerStonePrice } from "@/utils/priceHelpers";
import { generateCalibratedStoneUrl } from "@/utils/seoUrlHelpers";

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
  const [selectedGrades, setSelectedGrades] = useState<string[]>([]);
  const autoSelectedTypeRef = useRef<string | null>(null);
  
  const [weight, setWeight] = useState<string>("");
  const [selectedDimensions, setSelectedDimensions] = useState<Record<string, string[]>>({});

  const [toleranceEnabled, setToleranceEnabled] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");

  const { user } = useAuth();
  const [authModalOpened, { open: openAuthModal, close: closeAuthModal }] = useDisclosure(false);

  const [productModal, { open: openProductModal, close: closeProductModal }] = useDisclosure(false);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [quoteProduct, setQuoteProduct] = useState<any>(null);


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

  const { weightBounds, availableSapphireColors } = useMemo(() => {
    let minWt = 0, maxWt = 0;
    const colors = new Set<string>();

    searchItems.forEach((d: any) => {
       const wt = parseFloat(d.ct_weight) || 0;
       if (wt > maxWt) maxWt = wt;

       if (String(d.collection_slug || "").toLowerCase().includes("sapphire") && d.color) {
         colors.add(d.color);
       }
    });

    const colorOrder = ["blue", "pink", "yellow", "green", "purple", "orange", "red", "black", "white"];
    const sortedColors = Array.from(colors).sort((a, b) => {
      const idxA = colorOrder.indexOf(a.toLowerCase());
      const idxB = colorOrder.indexOf(b.toLowerCase());
      
      if (idxA !== -1 && idxB !== -1) return idxA - idxB;
      if (idxA !== -1) return -1;
      if (idxB !== -1) return 1;
      return a.localeCompare(b);
    });

    return {
      weightBounds: { min: 0, max: Math.ceil(maxWt) || 100 },
      availableSapphireColors: sortedColors
    };
  }, [searchItems]);

  const availableDimensionsGrouped = useMemo(() => {
    let preFiltered = [...searchItems];

    if (selectedShapes.length > 0) {
      preFiltered = preFiltered.filter(item => {
        const shape = String(item.shape || "").toLowerCase();
        return selectedShapes.some(s => shape.includes(s.toLowerCase()));
      });
    }

    if (selectedTypes.length > 0) {
      preFiltered = preFiltered.filter(item => {
        const type = String(item.type || "").toLowerCase();
        return selectedTypes.some(t => type === t.toLowerCase());
      });
    }

    const groups: Record<string, Set<string>> = {};
    preFiltered.forEach(item => {
      let key = item.collection_slug || "";
      if (key.toLowerCase() === "sapphire" && item.color) {
        key = `Sapphire ${item.color}`;
      }
      if (!groups[key]) groups[key] = new Set<string>();
      if (item.size) groups[key].add(item.size);
    });

    const result: Record<string, string[]> = {};
    for (const k in groups) {
      result[k] = Array.from(groups[k]).sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
    }
    return result;
  }, [searchItems, selectedShapes, selectedTypes]);

  const availableTypes = useMemo(() => {
    let preFiltered = [...searchItems];

    if (selectedGems.length > 0) {
      preFiltered = preFiltered.filter(item => {
        const slug = String(item.collection_slug || "").toLowerCase();
        return selectedGems.some(g => slug.includes(g.toLowerCase()));
      });
    }

    if (selectedShapes.length > 0) {
      preFiltered = preFiltered.filter(item => {
        const shape = String(item.shape || "").toLowerCase();
        return selectedShapes.some(s => shape.includes(s.toLowerCase()));
      });
    }

    const typesSet = new Set<string>();
    preFiltered.forEach(item => {
      // Default to "Natural" if no type is explicitly set
      const type = item.type || "Natural";
      typesSet.add(type);
    });

    return Array.from(typesSet);
  }, [searchItems, selectedGems, selectedShapes]);

  const availableGrades = useMemo(() => {
    if (!selectedTypes.includes("Natural")) return [];
    
    let preFiltered = searchItems.filter((item: any) => {
      const type = String(item.type || "").toLowerCase();
      return type === "natural";
    });

    if (selectedGems.length > 0) {
      preFiltered = preFiltered.filter((item: any) => {
        const slug = String(item.collection_slug || "").toLowerCase();
        return selectedGems.some(g => slug.includes(g.toLowerCase()));
      });
    }

    if (selectedShapes.length > 0) {
      preFiltered = preFiltered.filter((item: any) => {
        const shape = String(item.shape || "").toLowerCase();
        return selectedShapes.some(s => shape.includes(s.toLowerCase()));
      });
    }

    const gradesSet = new Set<string>();
    preFiltered.forEach((item: any) => {
      if (item.quality) gradesSet.add(item.quality);
    });

    return Array.from(gradesSet).sort();
  }, [searchItems, selectedGems, selectedShapes, selectedTypes]);

  useEffect(() => {
    if (!selectedTypes.includes("Natural") && selectedGrades.length > 0) {
      setSelectedGrades([]);
    }
  }, [selectedTypes, selectedGrades]);

  useEffect(() => {
    if (availableTypes.length === 1) {
      if (selectedTypes.length !== 1 || selectedTypes[0] !== availableTypes[0]) {
        autoSelectedTypeRef.current = availableTypes[0];
        setSelectedTypes([availableTypes[0]]);
      }
    } else if (availableTypes.length > 1) {
      if (
        autoSelectedTypeRef.current &&
        selectedTypes.length === 1 &&
        selectedTypes[0] === autoSelectedTypeRef.current
      ) {
        // If we expand from 1 available type to multiple, and the user hasn't
        // manually changed the type from what we auto-selected, clear it.
        setSelectedTypes([]);
    setSelectedGrades([]);
        autoSelectedTypeRef.current = null;
      } else if (selectedTypes.length > 0) {
        // Validate existing manual selections
        const valid = selectedTypes.filter(t => availableTypes.includes(t));
        if (valid.length !== selectedTypes.length) {
          setSelectedTypes(valid);
        }
        autoSelectedTypeRef.current = null;
      } else {
        autoSelectedTypeRef.current = null;
      }
    } else {
      autoSelectedTypeRef.current = null;
    }
  }, [availableTypes, selectedTypes]);

  // --- URL State Sync Logic ---
  const currentFiltersStr = searchParams.get("filters");
  const isInitialized = useRef(false);

  // 1. Sync URL -> State (runs on mount and when user clicks Back/Forward)
  useEffect(() => {
    if (searchItems.length === 0) return;

    if (currentFiltersStr) {
      try {
        const parsed = JSON.parse(decodeURIComponent(currentFiltersStr));
        setSelectedGems(parsed.selectedGems || []);
        setSelectedShapes(parsed.selectedShapes || []);
        setSelectedSapphireColors(parsed.selectedSapphireColors || []);
        setSelectedTypes(parsed.selectedTypes || []);
        setSelectedGrades(parsed.selectedGrades || []);
        setWeight(parsed.weight || "");
        setSelectedDimensions(parsed.selectedDimensions || {});
        setToleranceEnabled(parsed.toleranceEnabled || false);
        if (parsed.viewMode) setViewMode(parsed.viewMode);
        isInitialized.current = true;
        return;
      } catch (e) {
        console.error("Failed to parse filters from URL");
      }
    }

    // If no filters in URL (fresh load or navigating from Home)
    if (!isInitialized.current) {
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
    setSelectedGrades([]);
      }

      setSelectedGrades([]);

      setSelectedGems([]);
      setWeight("");
      setSelectedDimensions({});
      isInitialized.current = true;
    }
  }, [searchItems, currentFiltersStr]); // Re-run if URL filters change (e.g. Back button)

  // 2. Sync State -> URL (runs when user changes a filter)
  useEffect(() => {
    if (!isInitialized.current) return;

    const state = {
      selectedGems,
      selectedShapes,
      selectedSapphireColors,
      selectedTypes,
      selectedGrades,
      weight,
      selectedDimensions,
      toleranceEnabled,
      viewMode
    };
    
    const newFiltersStr = encodeURIComponent(JSON.stringify(state));
    
    if (newFiltersStr !== currentFiltersStr) {
      const params = new URLSearchParams(searchParams.toString());
      params.set("filters", newFiltersStr);
      // Remove the old query params if we are transitioning to state-based URL
      params.delete("shape");
      params.delete("color");
      params.delete("type");
      router.replace(`?${params.toString()}`, { scroll: false });
    }
  }, [
    selectedGems,
    selectedShapes,
    selectedSapphireColors,
    selectedTypes,
    selectedGrades,
    weight,
    selectedDimensions,
    toleranceEnabled,
    viewMode,
    currentFiltersStr,
    router,
    searchParams
  ]);
  // ----------------------------

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

    // Filter by Grade
    if (selectedGrades.length > 0) {
      filtered = filtered.filter(item => {
        const grade = String(item.quality || "").toLowerCase();
        return selectedGrades.some(g => grade === g.toLowerCase());
      });
    }

    // Filter by Weight
    if (weight !== "") {
      filtered = filtered.filter(item => {
        const wt = parseFloat(item.ct_weight) || 0;
        const targetWt = Number(weight);
        const tol = toleranceEnabled ? 5 : 0;
        return Math.abs(wt - targetWt) <= tol;
      });
    }

    // Filter by Dimensions
    if (Object.keys(selectedDimensions).length > 0) {
      filtered = filtered.filter(item => {
        if (selectedDimensions["Any"] && selectedDimensions["Any"].length > 0) {
           return selectedDimensions["Any"].includes(item.size);
        }

        let groupKey = item.collection_slug || "";
        if (groupKey.toLowerCase() === "sapphire" && item.color) {
          groupKey = `Sapphire ${item.color}`;
        }
        
        const selectedForGroup = selectedDimensions[groupKey];
        if (!selectedForGroup || selectedForGroup.length === 0) {
           return true;
        }

        return selectedForGroup.includes(item.size);
      });
    }

    // Sort all filtered items by size ascending
    filtered.sort((a, b) => {
      const sizeA = String(a.size || "");
      const sizeB = String(b.size || "");
      return sizeA.localeCompare(sizeB, undefined, { numeric: true });
    });

    setDisplayItems(filtered);
    setVisibleCount(ITEMS_PER_PAGE);
  }, [
    searchItems, 
    selectedGems, 
    selectedShapes, 
    selectedSapphireColors,
    selectedTypes,
    selectedGrades,
        weight, 
    selectedDimensions,
    toleranceEnabled
  ]);

  const resetAll = () => {
    setSelectedGems([]);
    setSelectedShapes([]);
    setSelectedSapphireColors([]);
    setSelectedTypes([]);
    setSelectedGrades([]);
    setWeight("");
    setSelectedDimensions({});
    setToleranceEnabled(false);
    router.replace("/calibrated-stones");
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

  const formatListSize = (sizeStr: string) => {
    if (!sizeStr) return "-";
    const parts = sizeStr.split(/\s*x\s*/i);
    if (parts.length > 1) {
      return (
        <div className="flex flex-col leading-tight whitespace-nowrap">
          <span>{parts[0]} x</span>
          <span>{parts.slice(1).join(" x ")}</span>
        </div>
      );
    }
    return <span className="whitespace-nowrap">{sizeStr}</span>;
  };

  return (
    <div className="mt-0 lg:mt-4 px-4 md:px-8 pb-8 pt-4 lg:pt-8 max-w-[1600px] mx-auto w-full">
      <div className="flex justify-center mb-6 lg:mb-10">
        <h1 className="text-2xl lg:text-4xl text-violet-800 text-center uppercase tracking-widest font-light">
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
          
          weight={weight}
          setWeight={setWeight}
          weightBounds={weightBounds}
          
          selectedTypes={selectedTypes}
          setSelectedTypes={setSelectedTypes}
          availableTypes={availableTypes}
          selectedGrades={selectedGrades}
          setSelectedGrades={setSelectedGrades}
          availableGrades={availableGrades}
          
          selectedDimensions={selectedDimensions}
          setSelectedDimensions={setSelectedDimensions}
          availableDimensionsGrouped={availableDimensionsGrouped}
          
          toleranceEnabled={toleranceEnabled}
          setToleranceEnabled={setToleranceEnabled}

          sapphireColors={availableSapphireColors}
          selectedSapphireColors={selectedSapphireColors}
          setSelectedSapphireColors={setSelectedSapphireColors}
          
          resetAll={resetAll}
        />
      )}

      {loading ? (
        <Grid gutter={{ base: "md", sm: "lg", md: "xl" }} className="mt-8">
          {[...Array(12)].map((_, index) => (
            <Grid.Col key={index} span={{ base: 12, sm: 6, md: 4, lg: 3 }}>
              <SkeletonCard />
            </Grid.Col>
          ))}
        </Grid>
      ) : (
        <>
          <div className="flex flex-col md:flex-row justify-between items-center mt-8 mb-8 gap-4">
            <div className="text-sm text-gray-500 font-medium">
              Showing {displayItems.length} result{displayItems.length !== 1 ? 's' : ''}
            </div>
            <div className="flex border border-gray-300 rounded-md overflow-hidden bg-white">
              <ActionIcon radius="0" variant={viewMode === "list" ? "filled" : "transparent"} color="dark" onClick={() => setViewMode("list")} size="lg"><IconList size={18} /></ActionIcon>
              <ActionIcon radius="0" variant={viewMode === "grid" ? "filled" : "transparent"} color="dark" onClick={() => setViewMode("grid")} size="lg"><IconLayoutGrid size={18} /></ActionIcon>
            </div>
          </div>
          
          {viewMode === "list" ? (
             <div className="bg-white rounded shadow-sm border border-gray-100 p-1 md:p-2 w-full overflow-hidden">
               <Table highlightOnHover highlightOnHoverColor="#f5f5f5" striped verticalSpacing="sm" horizontalSpacing="xs" style={{ tableLayout: "fixed", width: "100%" }}>
                 <Table.Thead>
                   <Table.Tr className="font-bold text-xs text-gray-700 uppercase">
                     <Table.Th className="w-[45px] md:w-[60px] pl-3 md:pl-4"></Table.Th>
                     <Table.Th className="w-[28%] md:w-[12%]">Gem Type</Table.Th>
                     <Table.Th className="hidden md:table-cell md:w-[10%]">Shape</Table.Th>
                     <Table.Th className="hidden md:table-cell md:w-[10%]">Color</Table.Th>
                     <Table.Th className="w-[32%] md:w-[14%]">Size</Table.Th>
                     <Table.Th className="w-[15%] md:w-[8%]">Ct.</Table.Th>
                     <Table.Th className="hidden md:table-cell md:w-[10%]">Quality</Table.Th>
                     <Table.Th className="hidden md:table-cell md:w-[10%]">Type</Table.Th>
                     <Table.Th className="hidden md:table-cell md:w-[12%]">Price/Ct</Table.Th>
                     <Table.Th className="w-[25%] md:w-[12%]">Price/St</Table.Th>
                     <Table.Th className="w-[50px] md:w-[140px] pr-3 md:pr-4"></Table.Th>
                   </Table.Tr>
                 </Table.Thead>
                 <Table.Tbody>
                   {displayItems.slice(0, visibleCount).length > 0 ? (
                     displayItems.slice(0, visibleCount).map((row: any, idx: number) => (
                       <Table.Tr 
                        key={row.id || idx}
                        onClick={(e: any) => {
                          if (e.target?.closest?.('button, input, [role="button"]')) return;
                          const stoneHandle = row?.collection_slug?.toLowerCase() || "unknown";
                          router.push(generateCalibratedStoneUrl(row, stoneHandle));
                        }}
                        className="cursor-pointer hover:bg-gray-50 transition-colors"
                      >
                         <Table.Td className="p-1 md:p-2 pl-3 md:pl-4">
                           {row.image_url ? <img src={row.image_url} alt={row.collection_slug} className="w-8 h-8 md:w-10 md:h-10 rounded object-contain mix-blend-multiply" /> : <div className="w-8 h-8 md:w-10 md:h-10 bg-gray-200 rounded"></div>}
                         </Table.Td>
                         <Table.Td className="text-xs md:text-sm font-medium whitespace-normal p-1 md:p-2 leading-tight">{row.collection_slug || "-"}</Table.Td>
                         <Table.Td className="hidden md:table-cell text-xs md:text-sm p-1 md:p-2 capitalize">{row.shape || "-"}</Table.Td>
                         <Table.Td className="hidden md:table-cell text-xs md:text-sm p-1 md:p-2 capitalize">{row.color || "-"}</Table.Td>
                         <Table.Td className="text-xs md:text-sm p-1 md:p-2">
                           <span className="md:hidden">{formatListSize(row.size)}</span>
                           <span className="hidden md:inline">{row.size || "-"}</span>
                         </Table.Td>
                         <Table.Td className="text-xs md:text-sm whitespace-nowrap p-1 md:p-2">{row.ct_weight || "-"}</Table.Td>
                         <Table.Td className="hidden md:table-cell text-xs md:text-sm p-1 md:p-2">{row.quality || "-"}</Table.Td>
                         <Table.Td className="hidden md:table-cell text-xs md:text-sm p-1 md:p-2">{row.type || "-"}</Table.Td>
                         <Table.Td className="hidden md:table-cell text-xs md:text-sm p-1 md:p-2">
                           {user ? (
                             <span className="font-semibold text-gray-900">
                               {row.price ? (
                                 getPerCaratPrice(row) > 0 ? `$${getPerCaratPrice(row)}` : "-"
                               ) : (
                                 <button 
                                   onClick={(e) => { e.preventDefault(); e.stopPropagation(); setQuoteProduct(row); }} 
                                   className="text-blue-600 underline bg-transparent border-none p-0 cursor-pointer text-xs md:text-sm flex flex-col md:inline-block text-left leading-tight"
                                 >
                                   <span className="md:hidden">Request<br/>Pricing</span>
                                   <span className="hidden md:inline whitespace-nowrap">Request Pricing</span>
                                 </button>
                               )}
                             </span>
                           ) : (
                             <button onClick={() => openAuthModal()} className="underline text-blue-600 hover:text-blue-800 bg-transparent border-none p-0 cursor-pointer text-left">
                               Sign in
                             </button>
                           )}
                         </Table.Td>
                         <Table.Td className="text-xs md:text-sm p-1 md:p-2">
                           {user ? (
                             <span className="font-semibold text-gray-900">
                               {row.price ? (
                                 `$${getPerStonePrice(row)}`
                               ) : (
                                 <button 
                                   onClick={(e) => { e.preventDefault(); e.stopPropagation(); setQuoteProduct(row); }} 
                                   className="text-blue-600 underline bg-transparent border-none p-0 cursor-pointer text-xs md:text-sm flex flex-col md:inline-block text-left leading-tight"
                                 >
                                   <span className="md:hidden">Request<br/>Pricing</span>
                                   <span className="hidden md:inline whitespace-nowrap">Request Pricing</span>
                                 </button>
                               )}
                             </span>
                           ) : (
                             <button onClick={() => openAuthModal()} className="underline text-blue-600 hover:text-blue-800 bg-transparent border-none p-0 cursor-pointer text-left">
                               Sign in
                             </button>
                           )}
                         </Table.Td>
                         <Table.Td className="p-1 md:p-2 pr-3 md:pr-4">
                           <div className="flex justify-end">
                              {/* Mobile Cart Icon */}
                              <div className="md:hidden">
                                <ActionIcon
                                  variant="outline"
                                  color="#0b182d"
                                  size="md"
                                  radius="md"
                                  onClick={() => {
                                    setSelectedProduct(row);
                                    openProductModal();
                                  }}
                                >
                                  <IconShoppingCart size={16} />
                                </ActionIcon>
                              </div>
                              
                              {/* Desktop Cart Button */}
                              <div className="hidden md:block">
                                <Button
                                  variant="outline"
                                  color="#0b182d"
                                  size="xs"
                                  radius="md"
                                  leftSection={<IconShoppingCart size={16} />}
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setSelectedProduct(row);
                                    openProductModal();
                                  }}
                                >
                                  ADD TO CART
                                </Button>
                              </div>
                           </div>
                         </Table.Td>
                       </Table.Tr>
                     ))
                   ) : (
                     <Table.Tr><Table.Td colSpan={8} className="text-center py-12 text-gray-500 italic">No matching stones found.</Table.Td></Table.Tr>
                   )}
                 </Table.Tbody>
               </Table>
             </div>
          ) : (
            <Grid gutter={{ base: "md", sm: "lg", md: "xl" }} className="mt-2">
              {displayItems
                .slice(0, visibleCount)
                .map((item: any, index: number) => (
                  <Grid.Col key={item?.id || index} span={{ base: 6, sm: 6, md: 4, lg: 3 }} className="flex flex-col">
                    <AnimatedCard 
                      item={item} 
                      index={index} 
                      baseDelay={0.1} 
                      onAddToCart={() => {
                        setSelectedProduct(item);
                        openProductModal();
                      }}
                      onOpenQuote={(item) => setQuoteProduct(item)}
                    />
                  </Grid.Col>
                ))}
            </Grid>
          )}

          {displayItems.length === 0 && (
            <div className="text-center text-gray-500 mt-20 text-lg">
              No gemstones found matching your criteria.
            </div>
          )}

          {visibleCount < displayItems.length && (
            <div className="flex justify-center mt-12 mb-8">
              <Button
                variant="outline"
                size="md"
                color="#0b182d"
                radius="xl"
                onClick={() => {
                  setLoadMoreLoading(true);
                  setTimeout(() => {
                    setVisibleCount((prev) => prev + ITEMS_PER_PAGE);
                    setLoadMoreLoading(false);
                  }, 400);
                }}
                className="hover:bg-gray-50 transition-colors px-10 font-medium tracking-wide"
              >
                {loadMoreLoading ? <Loader size="sm" color="#0b182d" /> : "LOAD MORE"}
              </Button>
            </div>
          )}
        </>
      )}

      <Modal
        p={0}
        size={1000}
        opened={productModal}
        onClose={closeProductModal}
        overlayProps={{ style: { backdropFilter: "blur(4px)" } }}
        transitionProps={{ transition: "slide-right" }}
        centered
      >
        {selectedProduct && (
          <AddToCartModal
            opened={productModal}
            onClose={closeProductModal}
            price={selectedProduct.price}
            image_url={selectedProduct.image_url}
            name={`${selectedProduct.collection_slug} ${selectedProduct.shape}`}
            size={selectedProduct.size}
            quality={selectedProduct.quality}
            ct_weight={selectedProduct.ct_weight}
            color={selectedProduct.color}
            product={selectedProduct}
            hideShadeOptions={true}
          />
        )}
      </Modal>
      <Modal
        opened={authModalOpened}
        onClose={closeAuthModal}
        title="Sign In"
        centered
        overlayProps={{ style: { backdropFilter: "blur(4px)" } }}
      >
        <AuthForm onClose={closeAuthModal} />
      </Modal>

      <QuoteRequestModal 
        opened={!!quoteProduct} 
        onClose={() => setQuoteProduct(null)} 
        product={quoteProduct} 
      />

    </div>
  );
}
