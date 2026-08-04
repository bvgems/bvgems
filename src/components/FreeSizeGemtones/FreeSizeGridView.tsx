"use client";

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
} from "@mantine/core";
import { useEffect, useState } from "react";
import { getGemstonesList } from "@/apis/api";
import { IconSearch } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
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

  const ITEMS_PER_PAGE = 18;
  const router = useRouter();

  const isMobile = useMediaQuery("(max-width: 1024px)");

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

            {/* --- Row 2: Sort dropdown --- */}
            <div className="w-full md:w-[180px]">
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
          <Grid className="px-5 mt-5">
            {displayItems
              .slice(0, visibleCount)
              .map((item: any, index: number) => (
                <Grid.Col
                  key={item?.id || index}
                  span={{ base: 6, sm: 6, md: 4 }}
                  className="mobile-card"
                >
                  <AnimatedCard
                    item={item}
                    index={index}
                    baseDelay={0.6}
                    isFreeSize={true}
                  />
                </Grid.Col>
              ))}
          </Grid>

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
    </div>
  );
}
