"use client";
import { Container, Grid, GridCol, SimpleGrid } from "@mantine/core";
import { useEffect, useState } from "react";
import { getAllGemstones } from "@/apis/api";
import { AnimatedCard } from "./AnimatedCard";
import { AnimatedText } from "../CommonComponents/AnimatedText";

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
    <div className="mt-16 p-8">
      <div className="flex justify-center">
        <h1 className="text-4xl text-violet-800">
          Calibrated Faceted Gemstones
        </h1>
      </div>
      <Grid gutter="xl" className="mt-6">
        {gemstonesCategories
          .filter((item: any) => item.title !== "Home page")
          .map((item: any, index: number) => (
            <Grid.Col key={item?.id || index} span={{ base: 12, sm: 6, md: 3 }}>
              <AnimatedCard item={item} index={index} baseDelay={0.6} />
            </Grid.Col>
          ))}
      </Grid>
    </div>
  );
}
