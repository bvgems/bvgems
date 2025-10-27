"use client";

import React from "react";
import {
  Container,
  Grid,
  GridCol,
  Image,
  Text,
  Paper,
  SimpleGrid,
} from "@mantine/core";
import { AnimatedText } from "../CommonComponents/AnimatedText";
import { ShapeFilterList } from "@/utils/constants";
import { useRouter } from "next/navigation";

export const ShopByShape = () => {
  const router = useRouter();
  const handleNav = (query: string) => {
    router.push(`/loose-gemstones?${query}`);
  };
  return (
    <div className="mt-20 mb-20 bg-gray-100 px-20 py-10">
      <AnimatedText
        text="Shop Gemstones By Shape"
        className="text-center text-4xl text-[#0b182d] mb-14"
      />

      <Grid gutter="xl" align="center">
        <GridCol span={{ base: 12, md: 5 }}>
          <div className="flex justify-center">
            <Image
              src="/assets/shop-by-shape.png"
              alt="Gemstone model"
              h={450}
              w={450}
              fit="cover"
            />
          </div>
        </GridCol>

        <GridCol span={{ base: 12, md: 7 }}>
          <SimpleGrid cols={{ base: 2, sm: 3, md: 3, lg: 4 }} spacing="xl">
            {ShapeFilterList.map((shape, index) => (
              <div
                onClick={() => handleNav(`shape=${shape.label.toLowerCase()}`)}
                className="flex justify-center flex-col items-center cursor-pointer"
                key={index}
              >
                <Image
                  src={shape.image}
                  alt={shape.label}
                  width={45}
                  height={45}
                  fit="contain"
                  className="mb-2 opacity-90"
                  style={{ maxWidth: "50px" }}
                />
                <Text
                  size="sm"
                  fw={500}
                  className="text-[#0b182d] leading-tight"
                >
                  {shape.label}
                </Text>
              </div>
            ))}
          </SimpleGrid>
        </GridCol>
      </Grid>
    </div>
  );
};
