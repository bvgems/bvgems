"use client";
import { Container, SimpleGrid } from "@mantine/core";
import { useEffect, useState } from "react";
import { getAllGemstones } from "@/apis/api";
import { AnimatedCard } from "./AnimatedCard";

export function GridView() {
  const [gemstonesCategories, setGemstonesCategories] = useState<any>([]);

  useEffect(() => {
    fetchGemstones();
  }, []);

  const fetchGemstones = async () => {
    const response = await getAllGemstones();
    setGemstonesCategories(response);
  };

  return (
    <div className="mt-16">
      <div className="flex justify-center">
        <h1 className="text-3xl font-semibold text-violet-800">
          Calibrated Faceted Gemstones
        </h1>
      </div>
      <Container size={"xl"} py="xl">
        <SimpleGrid cols={{ base: 1, sm: 3 }} spacing={{ base: 0, sm: "md" }}>
          {gemstonesCategories
            .filter((item: any) => item.title !== "Home page")
            .map((item: any, index: number) => (
              <AnimatedCard item={item} index={index} key={item?.id} />
            ))}
        </SimpleGrid>
      </Container>
    </div>
  );
}
