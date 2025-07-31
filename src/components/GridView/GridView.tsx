"use client";

import { Grid, Skeleton, Card, Autocomplete } from "@mantine/core";
import { useEffect, useState } from "react";
import { AnimatedCard } from "./AnimatedCard";
import { getGemstonesList } from "@/apis/api";
import { IconSearch } from "@tabler/icons-react";
import { useRouter } from "next/navigation";

interface GridViewProps {
  gemstones?: any;
  loadingTrigger?: any;
}

export function GridView({ gemstones, loadingTrigger }: GridViewProps) {
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [searchItems, setSearchItems] = useState<any>([]);
  const [displayItems, setDisplayItems] = useState<any>([]);

  const router = useRouter();

  useEffect(() => {
    if (gemstones === undefined) {
      setLoading(true);
      fetchGemstones();
    } else {
      setLoading(true);
      const timer = setTimeout(() => {
        setDisplayItems(gemstones);
        setLoading(false);
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [gemstones, loadingTrigger]);

  const fetchGemstones = async () => {
    try {
      const response = await getGemstonesList();

      setDisplayItems(response?.data || []);
      setSearchItems(response?.allGemstones);
    } catch (error) {
      console.error("Error fetching fallback gemstones", error);

      setDisplayItems([]);
    } finally {
      setLoading(false);
    }
  };

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
      className="flex flex-col justify-start bg-white h-[300px]"
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

  if (displayItems.length === 0) {
    return (
      <div className="text-center text-gray-500 py-6">No gemstones found.</div>
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
          placeholder="Search Gemstone Here"
          clearable
        />
      </div>
      <Grid gutter="xl" className="px-8 mt-5">
        {displayItems.map((item: any, index: number) => (
          <Grid.Col key={item?.id || index} span={{ base: 12, sm: 6, md: 4 }}>
            <AnimatedCard item={item} index={index} baseDelay={0.6} />
          </Grid.Col>
        ))}
      </Grid>
    </div>
  );
}
