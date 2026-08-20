"use client";

import React from "react";
import { Container, Grid } from "@mantine/core";
import Image from "next/image";
import { AnimatedText } from "../CommonComponents/AnimatedText";
import { useRouter } from "next/navigation";
import { gemstoneOptions } from "@/utils/constants";

export const ShopCalibrated = () => {
  const router = useRouter();

  return (
    <Container size={1350} className="mt-20">
      <AnimatedText
        text="Shop Calibrated Gemstones"
        className="text-center text-4xl text-[#0b182d] mb-10"
      />

      <Grid gutter="xl" justify="center">
        {gemstoneOptions?.map((item: any, idx: number) => (
          <Grid.Col
            key={idx}
            span={{ base: 6, sm: 4, md: 3, lg: 2 }}
            className="flex justify-center"
          >
            <div
              onClick={() =>
                router.push(`${item?.link}`)
              }
              className="cursor-pointer flex flex-col items-center justify-center bg-transparent"
            >
              <div className="relative w-[160px] h-[160px] flex items-center justify-center">
                <Image loading="lazy"
                  src={item?.shopImage}
                  alt={`Calibrated ${item?.label} gemstones`}
                  fill
                  className="object-contain"
                />
              </div>
              <p className="text-sm text-[#0b182d] text-center mt-3 font-medium tracking-wide">
                {item?.label}
              </p>
            </div>
          </Grid.Col>
        ))}
      </Grid>
    </Container>
  );
};
