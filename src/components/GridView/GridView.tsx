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
import { IconList, IconLayoutGrid, IconShoppingCart } from "@tabler/icons-react";
import { AddToCartModal } from "@/components/CommonComponents/AddToCartModal";
import { Table, ActionIcon, Modal, Pagination } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { gemstoneOptions, ShapeFilterList, shopByColorOptions } from "@/utils/constants";
import { parseSize } from "./parseSizeHelper";
import { useAuth } from "@/hooks/useAuth";
import { AuthForm } from "../Auth/AuthForm";
import { getPerCaratPrice, getPerStonePrice } from "@/utils/priceHelpers";

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
  
  const [weight, setWeight] = useState<string>("");
  const [dimension, setDimension] = useState<string>("");

  const [toleranceEnabled, setToleranceEnabled] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const { user } = useAuth();
  const [authModalOpened, { open: openAuthModal, close: closeAuthModal }] = useDisclosure(false);

  const [productModal, { open: openProductModal, close: closeProductModal }] = useDisclosure(false);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);


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

  const availableDimensions = useMemo(() => {
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
    if (selectedSapphireColors.length > 0) {
      preFiltered = preFiltered.filter(item => {
        const color = String(item.color || "").toLowerCase();
        return selectedSapphireColors.some(c => color.includes(c.toLowerCase()));
      });
    }
    if (selectedTypes.length > 0) {
      preFiltered = preFiltered.filter(item => {
        const type = String(item.type || "").toLowerCase();
        return selectedTypes.some(t => type === t.toLowerCase());
      });
    }

    const dimsSet = new Set<string>();
    preFiltered.forEach(item => {
      const dims = parseSize(item.size);
      if (dims) {
         dimsSet.add(`${dims[0]}x${dims[1]}`);
      }
    });

    return Array.from(dimsSet).sort((a, b) => {
       const [la, wa] = a.split('x').map(Number);
       const [lb, wb] = b.split('x').map(Number);
       if (la !== lb) return la - lb; // Ascending by length
       return wa - wb; // Ascending by width
    });
  }, [searchItems, selectedGems, selectedShapes, selectedSapphireColors, selectedTypes]);

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
      setWeight("");
      setDimension("");
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
    if (weight !== "") {
      filtered = filtered.filter(item => {
        const wt = parseFloat(item.ct_weight) || 0;
        const targetWt = Number(weight);
        const tol = toleranceEnabled ? 5 : 0;
        return Math.abs(wt - targetWt) <= tol;
      });
    }

    // Filter by Dimensions
    if (dimension !== "") {
      filtered = filtered.filter(item => {
        const dims = parseSize(item.size);
        if (!dims) return false;
        
        const targetDims = dimension.split('x').map(Number);
        if (targetDims.length !== 2) return false;
        const [targetL, targetW] = targetDims;
        const tol = toleranceEnabled ? 5 : 0;

        let valid = true;
        valid = valid && Math.abs(dims[0] - targetL) <= tol;
        valid = valid && Math.abs(dims[1] - targetW) <= tol;
        
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
    weight, 
    dimension,
    toleranceEnabled
  ]);

  const resetAll = () => {
    setSelectedGems([]);
    setSelectedShapes([]);
    setSelectedSapphireColors([]);
    setSelectedTypes([]);
    setWeight("");
    setDimension("");
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
          
          dimension={dimension}
          setDimension={setDimension}
          availableDimensions={availableDimensions}
          
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
                     <Table.Th className="w-[45px] md:w-[60px] pl-3 md:pl-4">Pic</Table.Th>
                     <Table.Th className="w-[28%] md:w-[12%]">Type</Table.Th>
                     <Table.Th className="hidden md:table-cell md:w-[12%]">Shape</Table.Th>
                     <Table.Th className="w-[32%] md:w-[18%]">Size</Table.Th>
                     <Table.Th className="w-[15%] md:w-[10%]">Ct.</Table.Th>
                     <Table.Th className="hidden md:table-cell md:w-[12%]">Quality</Table.Th>
                     <Table.Th className="hidden md:table-cell md:w-[12%]">Make</Table.Th>
                     <Table.Th className="w-[25%] md:w-[12%]">Price/Ct</Table.Th>
                     <Table.Th className="hidden md:table-cell md:w-[12%]">Price/St</Table.Th>
                     <Table.Th className="w-[50px] md:w-[140px] pr-3 md:pr-4"></Table.Th>
                   </Table.Tr>
                 </Table.Thead>
                 <Table.Tbody>
                   {displayItems.slice(0, visibleCount).length > 0 ? (
                     displayItems.slice(0, visibleCount).map((row: any, idx: number) => (
                       <Table.Tr key={row.id || idx}>
                         <Table.Td className="p-1 md:p-2 pl-3 md:pl-4">
                           {row.image_url ? <img src={row.image_url} alt={row.collection_slug} className="w-8 h-8 md:w-10 md:h-10 rounded object-contain mix-blend-multiply" /> : <div className="w-8 h-8 md:w-10 md:h-10 bg-gray-200 rounded"></div>}
                         </Table.Td>
                         <Table.Td className="text-xs md:text-sm font-medium whitespace-normal p-1 md:p-2 leading-tight">{row.collection_slug || "-"}</Table.Td>
                         <Table.Td className="hidden md:table-cell text-xs md:text-sm p-1 md:p-2 capitalize">{row.shape || "-"}</Table.Td>
                         <Table.Td className="text-xs md:text-sm p-1 md:p-2">
                           <span className="md:hidden">{formatListSize(row.size)}</span>
                           <span className="hidden md:inline">{row.size || "-"}</span>
                         </Table.Td>
                         <Table.Td className="text-xs md:text-sm whitespace-nowrap p-1 md:p-2">{row.ct_weight || "-"}</Table.Td>
                         <Table.Td className="hidden md:table-cell text-xs md:text-sm p-1 md:p-2">{row.quality || "-"}</Table.Td>
                         <Table.Td className="hidden md:table-cell text-xs md:text-sm p-1 md:p-2">{row.type || "-"}</Table.Td>
                         <Table.Td className="text-xs md:text-sm p-1 md:p-2">
                           {user ? (
                             <span className="font-semibold text-gray-900">{row.price ? `$${getPerCaratPrice(row)}` : "Req"}</span>
                           ) : (
                             <button onClick={() => openAuthModal()} className="underline text-blue-600 hover:text-blue-800 bg-transparent border-none p-0 cursor-pointer text-left">
                               Sign in
                             </button>
                           )}
                         </Table.Td>
                         <Table.Td className="hidden md:table-cell text-xs md:text-sm p-1 md:p-2">
                           {user ? (
                             <span className="font-semibold text-gray-900">{row.price ? `$${getPerStonePrice(row)}` : "Req"}</span>
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
                                  onClick={() => {
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

    </div>
  );
}
