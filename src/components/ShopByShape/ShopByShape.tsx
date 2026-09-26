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
    router.push(`/calibrated-stones?${query}`);
  };
  return (
    <div className="mt-20 mb-20 bg-gray-100 px-20 py-10">
      <AnimatedText
        text="Shop Gemstones By Shape"
        className="text-center text-4xl text-[#0b182d] mb-14"
      />
      <div className="max-w-5xl mx-auto">
        <SimpleGrid cols={{ base: 2, sm: 3, md: 5, lg: 5 }} spacing="xl" verticalSpacing="xl">
          {ShapeFilterList.map((shape, index) => (
            <Link
              href={`/calibrated-stones?shape=${shape.label.toLowerCase()}`}
              className="flex justify-center flex-col items-center cursor-pointer no-underline hover:opacity-75 transition-opacity"
              rel="nofollow"
              key={index}
            >
              <div className="relative w-[55px] h-[55px] mb-3" style={{ maxWidth: "70px" }}>
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
      </div>
    </div>
  );
};
