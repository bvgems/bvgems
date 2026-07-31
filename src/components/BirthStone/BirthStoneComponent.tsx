"use client";
import React, { useEffect, useMemo, useState } from "react";
import { Container, Image, Text } from "@mantine/core";
import { Carousel } from "@mantine/carousel";
import { AnimatedText } from "../CommonComponents/AnimatedText";
import { GemstonesByBirthMonths } from "@/utils/constants";
import { motion } from "framer-motion";
import { useMediaQuery } from "@mantine/hooks";
import { BirthStoneProducts } from "./BirthStoneProducts";
import { useRouter } from "next/navigation";

type BirthstoneItem = {
  month: string;
  gemstone: string;
  image_url: string;
};

export const BirthStoneComponent = () => {
  const router = useRouter();
  const monthName = new Date().toLocaleString("en-US", { month: "long" });

  const isMobile = useMediaQuery("(max-width: 768px)");

  const orderedGemstones = useMemo(() => {
    if (!isMobile) return GemstonesByBirthMonths;
    const currentMonthIndex = GemstonesByBirthMonths.findIndex(
      (item: BirthstoneItem) => item.month === monthName
    );
    if (currentMonthIndex === -1) return GemstonesByBirthMonths;

    return [
      GemstonesByBirthMonths[currentMonthIndex],
      ...GemstonesByBirthMonths.slice(0, currentMonthIndex),
      ...GemstonesByBirthMonths.slice(currentMonthIndex + 1),
    ];
  }, [isMobile, monthName]);

  const initialIndex = useMemo(() => {
    if (isMobile) {
      return 0;
    }
    const idx = GemstonesByBirthMonths.findIndex(
      (item) => item.month === monthName
    );
    return idx === -1 ? 0 : idx;
  }, [isMobile, monthName]);

  const [activeIndex, setActiveIndex] = useState(initialIndex);

  useEffect(() => {
    setActiveIndex(initialIndex);
  }, [initialIndex]);

  const handleSetCurrent = (item: any, index: any) => {
    if (!isMobile) {
      if (!item?.products) {
        router?.push(
          `/calibrated-faceted-gemstones/${item?.gemstone?.toLowerCase()}`
        );
      }
      setActiveIndex(index);
    }
  };

  const currentItem = orderedGemstones[activeIndex];
  const currentMonth = currentItem?.month;
  const currentStone = currentItem?.gemstone;

  return (
    <Container size={1350} className="mt-20">
      <AnimatedText
        text="Shop By Birthstone"
        className="text-center text-4xl text-[#0b182d] mb-12"
      />

      <Carousel
        height={320}
        slideSize={isMobile ? "100%" : "23%"}
        slideGap="md"
        emblaOptions={{ loop: true }}
        onSlideChange={(index) => setActiveIndex(index)}
        initialSlide={initialIndex} // 🔹 ensures carousel highlights correct month initially
      >
        {orderedGemstones.map((item: BirthstoneItem, index: number) => {
          const isCurrent = index === activeIndex;
          return (
            <Carousel.Slide key={`${item.month}-${index}`}>
              <motion.div
                onClick={() => handleSetCurrent(item, index)}
                className="flex flex-col items-center justify-center p-4 bg-white cursor-pointer relative shadow-md"
              >
                {isCurrent && (
                  <div className="absolute inset-0 border border-[#0b182d] pointer-events-none"></div>
                )}
                <Image loading="lazy"
                  fit="contain"
                  src={item.image_url}
                  h={150}
                  w={150}
                  alt={`${item.gemstone} birthstone for ${item.month}`}
                />
                <Text
                  fw={700}
                  size="md"
                  mt="md"
                  className="text-[#0b182d] text-center"
                >
                  {item.gemstone}
                </Text>
                <Text size="sm" className="text-gray-600 text-center">
                  {item.month}
                </Text>
              </motion.div>
            </Carousel.Slide>
          );
        })}
      </Carousel>

      {/* Products follow correct gemstone */}
      <BirthStoneProducts currentStone={currentStone} />
    </Container>
  );
};
