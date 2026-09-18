"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { getSearchResult } from "@/apis/api";
import { Container, Grid, Title, Text, Loader, Badge, Card } from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
import Image from "next/image";
import { generateCalibratedStoneUrl, generateFreeSizeStoneUrl } from "@/utils/seoUrlHelpers";

export function SearchClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get("q") || "";
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!query) {
      setResults([]);
      setLoading(false);
      return;
    }

    const fetchResults = async () => {
      setLoading(true);
      try {
        const data: any = await getSearchResult(query, "all");
        setResults(data || []);
      } catch (error) {
        console.error("Search error:", error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query]);

  const handleCardClick = (item: any) => {
    if (item?.gemstone_type) {
      const stoneHandle = item?.gemstone_type?.toLowerCase() || "unknown-stone";
      router.push(generateFreeSizeStoneUrl(item, stoneHandle));
    } else if (item?.collection_slug) {
      const stoneHandle = item?.collection_slug?.toLowerCase() || "unknown-stone";
      router.push(generateCalibratedStoneUrl(item, stoneHandle));
    }
  };

  return (
    <Container size="xl" py="xl">
      <div className="mb-8">
        <Title order={1} className="text-3xl font-serif text-gray-900 mb-2">
          Search Results
        </Title>
        <Text color="dimmed" size="lg">
          {query ? (
            <>
              Showing results for <span className="font-semibold text-gray-900">"{query}"</span>
            </>
          ) : (
            "Enter a search term to find gemstones."
          )}
        </Text>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader size="lg" color="#0b182d" />
        </div>
      ) : results.length > 0 ? (
        <Grid>
          {results.map((item, idx) => {
            const lotPrefix = item.lot_number ? `${item.lot_number} - ` : "";
            const title = `${lotPrefix}${item.collection_slug ?? item.gemstone_type ?? ""} ${item.shape ?? ""} ${item.size ?? item.dimension ?? ""}`.trim();
            
            return (
              <Grid.Col key={idx} span={{ base: 12, sm: 6, md: 4, lg: 3 }}>
                <Card 
                  shadow="sm" 
                  padding="lg" 
                  radius="md" 
                  withBorder 
                  className="cursor-pointer hover:shadow-md transition-shadow h-full flex flex-col"
                  onClick={() => handleCardClick(item)}
                >
                  <Card.Section>
                    <div className="relative w-full aspect-square bg-gray-100">
                      <Image
                        src={item.images?.edges?.[0]?.node?.url ?? item?.image_url ?? "/default-gemstone.jpg"}
                        alt={title}
                        fill
                        className="object-cover rounded-t-md"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                      />
                    </div>
                  </Card.Section>
                  <div className="mt-4 flex flex-col flex-grow">
                    <Text fw={500} size="md" lineClamp={2} className="mb-2">
                      {title}
                    </Text>
                    <Badge color="gray" variant="light" className="mb-2 self-start">
                      {item.category}
                    </Badge>
                    <Text size="sm" c="dimmed" className="mt-auto">
                      ID: {item.id}
                    </Text>
                  </div>
                </Card>
              </Grid.Col>
            );
          })}
        </Grid>
      ) : query ? (
        <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-lg border border-gray-200">
          <IconSearch size={48} className="text-gray-300 mb-4" />
          <Title order={3} className="text-gray-900 mb-2">No Results Found</Title>
          <Text color="dimmed" className="max-w-md">
            We couldn't find any gemstones matching "{query}". Try checking your spelling or using more general terms like "Sapphire" or "Oval".
          </Text>
        </div>
      ) : null}
    </Container>
  );
}
