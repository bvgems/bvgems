"use client";

import {
  Grid,
  Skeleton,
  Card,
  Autocomplete,
  Button,
  Loader,
  Select,
} from "@mantine/core";
import { useEffect, useState } from "react";
import { getGemstonesList } from "@/apis/api";
import { IconSearch } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { AnimatedCard } from "../GridView/AnimatedCard";

interface GridViewProps {
  gemstones?: any;
  loadingTrigger?: any;
  color?: any;
}

export function FreeSizeGridView({ gemstones, loadingTrigger }: GridViewProps) {
  const [loading, setLoading] = useState(false);
  const [loadMoreLoading, setLoadMoreLoading] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [searchItems, setSearchItems] = useState<any>([]);
  const [allItems, setAllItems] = useState<any>([]);
  const [displayItems, setDisplayItems] = useState<any>([]);
  const [visibleCount, setVisibleCount] = useState(18);
  const [sortOrder, setSortOrder] = useState<any>("lowToHigh");

  const ITEMS_PER_PAGE = 18;
  const router = useRouter();

  useEffect(() => {
    if (gemstones === undefined) {
      setLoading(true);
      fetchGemstones();
    } else {
      setLoading(true);
      const timer = setTimeout(() => {
        setAllItems(gemstones || []);
        setDisplayItems(gemstones || []);
        setSearchItems(
          (gemstones || []).map((g: any) => ({
            value: g.lot_number,
            id: g.id,
          }))
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
      setSearchItems(
        (response?.data || []).map((g: any) => ({
          value: g.lot_number,
          id: g.id,
        }))
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

    const selected = allItems.find((item: any) => item.lot_number === value);

    if (selected) {
      setDisplayItems([selected]);
      setVisibleCount(1);
    } else {
      setDisplayItems([]);
    }
  };

  // ✅ Apply sorting whenever sortOrder or allItems changes
  useEffect(() => {
    if (!allItems.length) return;

    let sorted = [...allItems];
    if (sortOrder === "lowToHigh") {
      sorted.sort((a, b) => parseFloat(a.ct_weight) - parseFloat(b.ct_weight));
    } else if (sortOrder === "highToLow") {
      sorted.sort((a, b) => parseFloat(b.ct_weight) - parseFloat(a.ct_weight));
    }
    setDisplayItems(sorted);
  }, [sortOrder, allItems]);

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
      <div className="mt-4 flex flex-col md:flex-row items-center px-4 md:px-8 justify-between gap-4">
        <span>Showing {displayItems?.length} results</span>

        <div className="flex gap-4 items-center">
          <Autocomplete
            size="md"
            w={300}
            data={searchItems}
            value={searchValue}
            onChange={setSearchValue}
            onOptionSubmit={handleSelect}
            leftSectionPointerEvents="none"
            leftSection={<IconSearch />}
            placeholder="Search by lot number"
            clearable
          />

          <Select
            placeholder="Sort by Carat Weight"
            value={sortOrder}
            onChange={setSortOrder}
            data={[
              { label: "Low to High", value: "lowToHigh" },
              { label: "High to Low", value: "highToLow" },
            ]}
            clearable={false} // ✅ prevent clearing, always one option selected
            className="w-[220px] hidden md:block"
          />
        </div>
      </div>

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
