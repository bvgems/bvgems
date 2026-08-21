"use client";

import React from "react";
import {
  Container,
  Grid,
  GridCol,
  Text,
  Paper,
  SimpleGrid,
} from "@mantine/core";
import Image from "next/image";
import { AnimatedText } from "../CommonComponents/AnimatedText";
import { ShapeFilterList } from "@/utils/constants";
import { useRouter } from "next/navigation";
import Link from "next/link";

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
        <GridCol span={{ base: 12 }}>
          <SimpleGrid cols={{ base: 2, sm: 3, md: 3, lg: 4 }} spacing="xl">
            {ShapeFilterList.map((shape, index) => (
              <Link
                href={`/loose-gemstones?shape=${shape.label.toLowerCase()}`}
                className="flex justify-center flex-col items-center cursor-pointer no-underline"
                key={index}
              >
                <div className="relative w-[45px] h-[45px] mb-2" style={{ maxWidth: "60px" }}>
                  <Image loading="lazy"
                    src={shape.image}
                    alt={`${shape.label} shaped gemstones`}
                    fill
                    className="object-contain opacity-90"
                  />
                </div>
                <Text
                  size="sm"
                  fw={500}
                  className="text-[#0b182d] leading-tight"
                >
                  {shape.label}
                </Text>
              </Link>
            ))}
          </SimpleGrid>
        </GridCol>
      </Grid>
    </div>
  );
};
