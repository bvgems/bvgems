"use client";

import {
  Container,
  Image,
  Grid,
  Card,
  Text,
  GridCol,
  SegmentedControl,
} from "@mantine/core";
import { motion } from "framer-motion";
import { shopByColorOptions } from "@/utils/constants";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AnimatedText } from "../CommonComponents/AnimatedText";

// Ring base images by gold color
const ringBaseOptions = {
  white: "/assets/ring-base-white.png",
  yellow: "/assets/ring-base-yellow.png",
  rose: "/assets/ring-base-rose.png",
};

export default function ShopByColor() {
  const router = useRouter();
  const [activeStone, setActiveStone] = useState(shopByColorOptions[0]);
  const [goldColor, setGoldColor] = useState<"white" | "yellow" | "rose">(
    "white"
  );

  const handleShopByColor = (item: any) => {
    router.push(`/loose-gemstones?color=${item.color}`);
  };

  return (
    <div className="mt-20 py-12 bg-[#f9f9f9]">
      <Grid>
        <GridCol span={{ base: 12, sm: 4 }}>
          <h1 className="text-center text-2xl text-[#0b182d]">
            Shop Gemstones By Color
          </h1>
          <div className="relative w-[250px] mx-auto mt-5">
            <Image
              src={ringBaseOptions[goldColor]}
              alt={`Ring Base - ${goldColor}`}
              w={250}
              h="auto"
              className="mx-auto"
            />

            <Image
              src={activeStone?.image}
              alt={activeStone?.name}
              // make Tanzanite smaller on ring
              w={activeStone?.name === "Tanzanite" ? 80 : 95}
              h={
                activeStone?.name === "Tanzanite"
                  ? 130
                  : activeStone?.name === "Blue Sapphire" ||
                    activeStone?.name === "Yellow Sapphire" ||
                    activeStone?.name === "Pink Sapphire"
                  ? 150
                  : 140
              }
              className={`absolute ${
                activeStone?.name === "Tanzanite"
                  ? "top-[7%]"
                  : activeStone?.name === "Blue Sapphire" ||
                    activeStone?.name === "Yellow Sapphire" ||
                    activeStone?.name === "Pink Sapphire"
                  ? "top-[3%]"
                  : "top-[6%]"
              }  ${
                activeStone?.name === "Emerald Green"
                  ? "left-[50%]"
                  : "left-[49%]"
              } -translate-x-1/2`}
            />
          </div>

          {/* Gold Color Selector */}
          <div className="flex items-center justify-center mt-6 gap-5">
            <SegmentedControl
              value={goldColor}
              onChange={(val: "white" | "yellow" | "rose") => setGoldColor(val)}
              data={[
                { label: "White", value: "white" },
                { label: "Yellow", value: "yellow" },
                { label: "Rose", value: "rose" },
              ]}
              className="w-full max-w-[290px]"
            />
          </div>
        </GridCol>

        <GridCol span={{ base: 12, sm: 8 }}>
          <div className="grid grid-cols-3 gap-x-6 gap-y-4">
            {shopByColorOptions?.map((item: any, index: number) => (
              <div
                key={index}
                className="p-2 cursor-pointer transition-all flex flex-col items-center"
                onMouseEnter={() => setActiveStone(item)}
                onClick={() => handleShopByColor(item)}
              >
                <Image
                  h={130}
                  w={130}
                  src={item?.image}
                  alt={item?.name}
                  className={`transition-transform duration-300 ${
                    item?.name === "Tanzanite"
                      ? "hover:scale-90"
                      : "hover:scale-110"
                  }`}
                />
                <Text mt={4} className="text-base text-[#0b182d]">
                  {item?.name}
                </Text>
              </div>
            ))}
          </div>
        </GridCol>
      </Grid>
    </div>
  );
}
