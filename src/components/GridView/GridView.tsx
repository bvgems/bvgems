"use client";

import {
  Grid,
  Skeleton,
  Card,
  Autocomplete,
  Button,
  Loader,
} from "@mantine/core";
import { useEffect, useState } from "react";
import { AnimatedCard } from "./AnimatedCard";
import { getGemstonesList } from "@/apis/api";
import { IconSearch } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import Fuse from "fuse.js";

interface GridViewProps {
  gemstones?: any;
  loadingTrigger?: any;
  color?: any;
}

export function GridView({ gemstones, loadingTrigger, color }: GridViewProps) {
  const [loading, setLoading] = useState(false);
  const [loadMoreLoading, setLoadMoreLoading] = useState(false); // NEW
  const [searchValue, setSearchValue] = useState("");
  const [searchItems, setSearchItems] = useState<any>([]);
  const [allItems, setAllItems] = useState<any>([]);
  const [displayItems, setDisplayItems] = useState<any>([]);

  // Load more state
  const [visibleCount, setVisibleCount] = useState(16); // initial items
  const ITEMS_PER_PAGE = 16; // items per "Load More" click

  const router = useRouter();

  useEffect(() => {
    if (gemstones === undefined && !color) {
      setLoading(true);
      fetchGemstones();
    } else {
      setLoading(true);
      const timer = setTimeout(() => {
        setAllItems(gemstones || []);
        setDisplayItems(gemstones || []);
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
      setSearchItems(response?.allGemstones || []);
      setVisibleCount(ITEMS_PER_PAGE);
    } catch (error) {
      console.error("Error fetching fallback gemstones", error);
      setDisplayItems([]);
    } finally {
      setLoading(false);
    }
  };

  // Search
  const performAdvancedSearch = (query: string, items: any[]) => {
    if (!query.trim()) return items;

    const fuse = new Fuse(items, {
      threshold: 0.6,
      distance: 100,
      minMatchCharLength: 2,
      keys: [
        { name: "color", weight: 0.3 },
        { name: "shape", weight: 0.2 },
        { name: "collection_slug", weight: 0.2 },
        { name: "title", weight: 0.3 },
        { name: "quality", weight: 0.2 },
        { name: "size", weight: 0.1 },
        { name: "ct_weight", weight: 0.1 },
        { name: "description", weight: 0.1 },
        { name: "type", weight: 0.2 },
      ],
      includeScore: true,
      useExtendedSearch: true,
      ignoreLocation: true,
      ignoreFieldNorm: true,
    });

    const fuseResults = fuse.search(query);

    const queryTokens = query
      .toLowerCase()
      .split(/\s+/)
      .filter((token) => token.length > 1);

    const tokenMatches = items.filter((item) => {
      const searchableText = [
        item.color,
        item.shape,
        item.collection_slug,
        item.title,
        item.quality,
        item.size?.toString(),
        item.ct_weight?.toString(),
        item.description,
        item.type,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return queryTokens.every(
        (token) =>
          searchableText.includes(token) ||
          searchableText
            .split(" ")
            .some((word) => word.includes(token) || token.includes(word))
      );
    });

    const partialMatches = items.filter((item) => {
      const fields = [
        item.color,
        item.shape,
        item.collection_slug,
        item.title,
        item.quality,
        item.size?.toString(),
        item.ct_weight?.toString(),
      ];

      return fields.some(
        (field) =>
          field && field.toString().toLowerCase().includes(query.toLowerCase())
      );
    });

    const combinedResults = [
      ...fuseResults.map((result) => ({
        ...result.item,
        _score: result.score,
      })),
      ...tokenMatches.map((item) => ({ ...item, _score: 0.5 })),
      ...partialMatches.map((item) => ({ ...item, _score: 0.7 })),
    ];

    const uniqueResults = combinedResults.reduce((acc, current) => {
      const existingItem = acc.find((item: any) => item.id === current.id);
      if (!existingItem) {
        acc.push(current);
      } else if (current._score < existingItem._score) {
        const index = acc.findIndex((item: any) => item.id === current.id);
        acc[index] = current;
      }
      return acc;
    }, [] as any[]);

    return uniqueResults.sort(
      (a: any, b: any) => (a._score || 0) - (b._score || 0)
    );
  };

  useEffect(() => {
    if (!searchValue) {
      setDisplayItems(allItems);
      setVisibleCount(ITEMS_PER_PAGE);
    } else {
      const results = performAdvancedSearch(searchValue, allItems);
      setDisplayItems(results);
      setVisibleCount(ITEMS_PER_PAGE);
    }
  }, [searchValue, allItems]);

  const handleSelect = (value: string) => {
    const selected = searchItems.find((item: any) => item.value === value);
    if (selected && selected.id) {
      router.push(
        `/product-details?id=${
          selected?.id
        }&name=${selected?.collection_slug?.toLowerCase()}`
      );
    }
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
        <Autocomplete
          size="md"
          w={400}
          data={searchItems}
          value={searchValue}
          onChange={setSearchValue}
          onOptionSubmit={handleSelect}
          leftSectionPointerEvents="none"
          leftSection={<IconSearch />}
          placeholder="Search by name, color, shape, weight, quality..."
          clearable
        />
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
                  <AnimatedCard item={item} index={index} baseDelay={0.6} />
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
                  }, 800); // small delay for effect
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
