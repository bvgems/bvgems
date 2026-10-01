"use client";

import { IconList, IconLayoutGrid, IconShoppingCart } from "@tabler/icons-react";
import { Table, ActionIcon } from "@mantine/core";
import { useAuth } from "@/hooks/useAuth";
import { getPerCaratPrice, getPerStonePrice } from "@/utils/priceHelpers";
import { QuoteRequestModal } from "@/components/CommonComponents/QuoteRequestModal";
import { AddToCartModal } from "@/components/CommonComponents/AddToCartModal";
import { useDisclosure } from "@mantine/hooks";
import { generateFreeSizeStoneUrl } from "@/utils/seoUrlHelpers";


import {
  Grid,
  Skeleton,
  Card,
  Autocomplete,
  Button,
  Loader,
  Select,
  Flex,
  Text,
  Group,
  Modal,
} from "@mantine/core";
import { useEffect, useState, useRef } from "react";
import { getGemstonesList } from "@/apis/api";
import { IconSearch } from "@tabler/icons-react";
import { useRouter, useSearchParams } from "next/navigation";
import { AnimatedCard } from "../GridView/AnimatedCard";
import { FreeSizeGemstonesList } from "@/utils/constants";
import { useMediaQuery } from "@mantine/hooks";

interface GridViewProps {
  isViewAll: any;
  gemstones?: any;
  loadingTrigger?: any;
  color?: any;
}

export function FreeSizeGridView({
  isViewAll,
  gemstones,
  loadingTrigger,
}: GridViewProps) {
  const [loading, setLoading] = useState(false);
  const [loadMoreLoading, setLoadMoreLoading] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [selectedGem, setSelectedGem] = useState<string | null>(null);
  const [searchItems, setSearchItems] = useState<string[]>([]);
  const [allItems, setAllItems] = useState<any>([]);
  const [displayItems, setDisplayItems] = useState<any>([]);
  const [visibleCount, setVisibleCount] = useState(18);
  const [sortOrder, setSortOrder] = useState<any>("lowToHigh");

  
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const { user } = useAuth();
  const [quoteProduct, setQuoteProduct] = useState<any>(null);
  const [productModal, { open: openProductModal, close: closeProductModal }] = useDisclosure(false);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);

const ITEMS_PER_PAGE = 18;
  const router = useRouter();

    const isMobile = useMediaQuery("(max-width: 1024px)");

  const searchParams = useSearchParams();
  const currentFiltersStr = searchParams.get("filters");
  const isInitialized = useRef(false);

  // 1. Sync URL -> State
  useEffect(() => {
    if (allItems.length === 0) return;

    if (currentFiltersStr) {
      try {
        const parsed = JSON.parse(decodeURIComponent(currentFiltersStr));
        if (parsed.searchValue !== undefined) setSearchValue(parsed.searchValue);
        if (parsed.selectedGem !== undefined) setSelectedGem(parsed.selectedGem);
        if (parsed.sortOrder !== undefined) setSortOrder(parsed.sortOrder);
        if (parsed.viewMode !== undefined) setViewMode(parsed.viewMode);
        isInitialized.current = true;
        return;
      } catch (e) {
        console.error("Failed to parse FreeSize filters from URL");
      }
    }

    if (!isInitialized.current) {
      // Just initialize once
      isInitialized.current = true;
    }
  }, [allItems, currentFiltersStr]);

  // 2. Sync State -> URL
  useEffect(() => {
    if (!isInitialized.current) return;

    const state = {
      searchValue,
      selectedGem,
      sortOrder,
      viewMode
    };
    
    const newFiltersStr = encodeURIComponent(JSON.stringify(state));
    
    if (newFiltersStr !== currentFiltersStr) {
      const params = new URLSearchParams(searchParams.toString());
      params.set("filters", newFiltersStr);
      router.replace(`?${params.toString()}`, { scroll: false });
    }
  }, [
    searchValue,
    selectedGem,
    sortOrder,
    viewMode,
    currentFiltersStr,
    router,
    searchParams
  ]);

  useEffect(() => {
    if (gemstones === undefined) {
      setLoading(true);
      fetchGemstones();
    } else {
      setLoading(true);
      const timer = setTimeout(() => {
        setAllItems(gemstones || []);
        setDisplayItems(gemstones || []);
        // FIX: Filter out null/undefined lot_numbers
        setSearchItems(
          (gemstones || [])
            .map((g: any) => g.lot_number)
            .filter((lot: any) => lot != null && lot !== "")
        );
        setVisibleCount(ITEMS_PER_PAGE);
        setLoading(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [gemstones, loadingTrigger]);

  const fetchGemstones = async () => {
    try {
      const response = await getGemstonesList();
      setAllItems(response?.data || []);
      setDisplayItems(response?.data || []);
      // FIX: Filter out null/undefined lot_numbers
      setSearchItems(
        (response?.data || [])
          .map((g: any) => g.lot_number)
          .filter((lot: any) => lot != null && lot !== "")
      );
      setVisibleCount(ITEMS_PER_PAGE);
    } catch (error) {
      console.error("Error fetching fallback gemstones", error);
      setDisplayItems([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (value: string) => {
    setSearchValue(value);
    if (!value || value.trim() === "") {
      setVisibleCount(ITEMS_PER_PAGE);
    } else {
      setVisibleCount(1);
    }
  };

  useEffect(() => {
    if (!allItems.length) return;
    let sorted = [...allItems];
    if (searchValue && searchValue.trim() !== "") {
      sorted = sorted.filter((item: any) => item.lot_number === searchValue);
    }
    if (sortOrder === "lowToHigh") {
      sorted.sort((a, b) => parseFloat(a.ct_weight) - parseFloat(b.ct_weight));
    } else if (sortOrder === "highToLow") {
      sorted.sort((a, b) => parseFloat(b.ct_weight) - parseFloat(a.ct_weight));
    }
    setDisplayItems(sorted);
  }, [sortOrder, allItems, searchValue]);

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

  if (loading) {
    return (
      <Grid gutter="xl" className="p-8">
        {Array(8)
          .fill(null)
          .map((_, i) => (
            <Grid.Col key={i} span={{ base: 12, sm: 6, md: 3 }}>
              <SkeletonCard />
            </Grid.Col>
          ))}
      </Grid>
    );
  }

  return (
    <div>
      {/* === Top Controls Section === */}
      <div className="mt-6 px-4 md:px-8">
        <Flex
          justify="space-between"
          align="center"
          direction={{ base: "column", md: "row" }}
          wrap="wrap"
          gap="md"
        >
          <Text fw={500}>Showing {displayItems?.length} results</Text>

          <div className="w-full flex flex-col gap-2 md:flex-row md:items-center md:justify-end">
            {/* --- Row 1: Two side-by-side inputs --- */}
            <div className="flex flex-row gap-2 w-full md:w-auto">
              {!isMobile && (
                <Autocomplete
                  placeholder="Choose Gemstone"
                  data={FreeSizeGemstonesList.map((item) => item.label)}
                  size="md"
                  w="100%"
                  value={selectedGem || ""}
                  onChange={setSelectedGem}
                  renderOption={({ option }) => {
                    const gem = FreeSizeGemstonesList.find(
                      (g) => g.label === option.value
                    );
                    return (
                      <Group gap="sm">
                        <img
                          src={gem?.image}
                          alt={gem?.label}
                          width={35}
                          height={35}
                          style={{ objectFit: "contain", borderRadius: "8px" }}
                        />
                        <Text size="sm" fw={500}>
                          {gem?.label}
                        </Text>
                      </Group>
                    );
                  }}
                  onOptionSubmit={(value) => {
                    const gem = FreeSizeGemstonesList.find(
                      (g) => g.label === value
                    );
                    if (gem) {
                      setSelectedGem(gem.label);
                      router.push(
                        `/free-size-gemstones/${gem.label.toLowerCase()}`
                      );
                    }
                  }}
                />
              )}

              <Autocomplete
                size="md"
                w="100%"
                data={searchItems}
                value={searchValue}
                onChange={setSearchValue}
                onOptionSubmit={handleSelect}
                leftSectionPointerEvents="none"
                leftSection={<IconSearch size={16} />}
                placeholder="Search by lot number"
                clearable
              />
            </div>

            {/* --- Row 2: Sort and Toggle --- */}
            <div className="flex flex-row items-center justify-between md:justify-end gap-2 w-full md:w-auto mt-2 md:mt-0">
              <div className="w-full md:w-[180px] flex-grow">
                <Select
                  size="md"
                  placeholder="Sort by Carat"
                  value={sortOrder}
                  onChange={setSortOrder}
                  data={[
                    { label: "Ctw. Low to High", value: "lowToHigh" },
                    { label: "Ctw. High to Low", value: "highToLow" },
                  ]}
                  clearable={false}
                  className="w-full"
                />
              </div>

              {/* View Toggle */}
              <div className="flex border border-gray-300 rounded-md overflow-hidden bg-white shrink-0 h-[42px]">
                <ActionIcon radius="0" variant={viewMode === "list" ? "filled" : "transparent"} color="dark" onClick={() => setViewMode("list")} size={42}><IconList size={20} /></ActionIcon>
                <ActionIcon radius="0" variant={viewMode === "grid" ? "filled" : "transparent"} color="dark" onClick={() => setViewMode("grid")} size={42}><IconLayoutGrid size={20} /></ActionIcon>
              </div>
            </div>
          </div>
        </Flex>
      </div>

      {/* === Grid Section === */}
      {displayItems.length === 0 ? (
        <div className="text-center text-gray-500 py-6">
          No gemstones found matching your search.
        </div>
      ) : (
        <>
          
          {viewMode === "list" ? (
             <div className="bg-white rounded shadow-sm border border-gray-100 p-1 md:p-2 w-full overflow-hidden mt-5">
               <Table highlightOnHover highlightOnHoverColor="#f5f5f5" striped verticalSpacing="sm" horizontalSpacing="xs" style={{ tableLayout: "fixed", width: "100%" }}>
                 <Table.Thead>
                   <Table.Tr className="font-bold text-xs text-gray-700 uppercase">
                     <Table.Th className="w-[45px] md:w-[60px] pl-3 md:pl-4"></Table.Th>
                     <Table.Th className="hidden md:table-cell md:w-[20%]">Shape</Table.Th>
                     <Table.Th className="hidden md:table-cell md:w-[15%]">Color</Table.Th>
                     <Table.Th className="w-[45%] md:w-[22%]">Dimensions</Table.Th>
                     <Table.Th className="w-[20%] md:w-[10%]">Ct.</Table.Th>
                     <Table.Th className="hidden md:table-cell md:w-[12%]">Price/Ct</Table.Th>
                     <Table.Th className="w-[35%] md:w-[12%]">Price/St</Table.Th>
                     <Table.Th className="w-[50px] md:w-[100px] pr-3 md:pr-4"></Table.Th>
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
                          router.push(generateFreeSizeStoneUrl(row, stoneHandle));
                        }}
                        className="cursor-pointer hover:bg-gray-50 transition-colors"
                      >
                         <Table.Td className="p-1 md:p-2 pl-3 md:pl-4">
                           {row.image_url ? <img src={row.image_url} alt={row.collection_slug} className="w-8 h-8 md:w-10 md:h-10 rounded object-contain mix-blend-multiply" /> : <div className="w-8 h-8 md:w-10 md:h-10 bg-gray-200 rounded"></div>}
                         </Table.Td>
                         <Table.Td className="hidden md:table-cell text-xs md:text-sm p-1 md:p-2 capitalize">{row.shape || "-"}</Table.Td>
                         <Table.Td className="hidden md:table-cell text-xs md:text-sm p-1 md:p-2">{row.color || "-"}</Table.Td>
                         <Table.Td className="text-xs md:text-sm p-1 md:p-2">
                           <span className="md:hidden">{row.dimension?.replace(/mm/gi, '').trim() || "-"}</span>
                           <span className="hidden md:inline">{row.dimension || "-"}</span>
                         </Table.Td>
                         <Table.Td className="text-xs md:text-sm whitespace-nowrap p-1 md:p-2">{row.ct_weight || "-"}</Table.Td>
                         <Table.Td className="hidden md:table-cell text-xs md:text-sm p-1 md:p-2">
                           {user ? (
                             <span className="font-semibold text-gray-900">
                               {row.price ? (
                                 getPerCaratPrice(row) > 0 ? `$${getPerCaratPrice(row).toFixed(2)}` : "-"
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
                             <span className="text-gray-400 text-[10px] italic">Sign in</span>
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
                             <span className="text-gray-400 text-[10px] italic">Sign in</span>
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
                                  onClick={(e) => {
                                    e.stopPropagation();
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
                     <Table.Tr><Table.Td colSpan={9} className="text-center py-12 text-gray-500 italic">No matching stones found.</Table.Td></Table.Tr>
                   )}
                 </Table.Tbody>
               </Table>
             </div>
          ) : (
          <Grid className="px-5 mt-5">
            {displayItems
              .slice(0, visibleCount)
              .map((item: any, index: number) => (
                <Grid.Col
                  key={item?.id || index}
                  span={{ base: 6, sm: 6, md: 4, lg: 3 }}
                  className="mobile-card"
                >
                  <AnimatedCard
                    item={item}
                    index={index}
                    baseDelay={0.6}
                    isFreeSize={true}
                                        onOpenQuote={(item: any) => setQuoteProduct(item)}
                    onAddToCart={() => {
                      setSelectedProduct(item);
                      openProductModal();
                    }}
                  />
                </Grid.Col>
              ))}
          </Grid>
          )}


          {visibleCount < displayItems.length && (
            <div className="flex justify-center my-6">
              <Button
                onClick={() => {
                  setLoadMoreLoading(true);
                  setTimeout(() => {
                    setVisibleCount((prev) => prev + ITEMS_PER_PAGE);
                    setLoadMoreLoading(false);
                  }, 800);
                }}
                variant="outline"
                color="gray"
                disabled={loadMoreLoading}
              >
                {loadMoreLoading ? (
                  <Loader size="sm" color="gray" />
                ) : (
                  "Load More"
                )}
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
            name={`${selectedProduct.gemstone_type || selectedProduct.collection_slug || ''} ${selectedProduct.shape || ''}`.trim()}
            size={selectedProduct.dimension}
            quality={selectedProduct.type || selectedProduct.quality}
            ct_weight={selectedProduct.ct_weight}
            color={selectedProduct.color}
            product={selectedProduct}
            hideShadeOptions={true}
          />
        )}
      </Modal>
      {quoteProduct && (
        <QuoteRequestModal 
          opened={!!quoteProduct} 
          onClose={() => setQuoteProduct(null)} 
          product={quoteProduct} 
        />
      )}
    </div>
  );
}
