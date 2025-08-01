"use client";

import { Card } from "@mantine/core";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { FreeSizeGemstonesList } from "@/utils/constants";
import { useRouter } from "next/navigation";

export const FreeSizeGemstonesCard = () => {
  const [hovered, setHovered] = useState<number | null>(null);
  const router = useRouter();

  const redirectToProduct = (product: any) => {
    console.log("Redirecting to:", product?.label);
    router?.push(`/free-size-gemstones/${product?.label?.toLowerCase()}`);
  };

  return (
    <div className="w-full px-4 py-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {FreeSizeGemstonesList?.map((item, index) => (
          <Card
            key={index}
            withBorder
            padding="lg"
            className="flex flex-col justify-between bg-white shadow-md transition hover:shadow-lg h-full cursor-pointer"
            onClick={() => redirectToProduct(item)}
          >
            <div
              className="relative w-full h-[280px] flex items-center justify-center overflow-hidden"
              onMouseEnter={() => setHovered(index)}
              onMouseLeave={() => setHovered(null)}
            >
              <motion.img
                src={item?.image}
                alt={item?.label}
                className="object-contain w-full h-full transition-all duration-300"
                initial={{ opacity: 0.9, scale: 1 }}
                animate={{
                  opacity: hovered === index ? 0.75 : 1,
                  scale: hovered === index ? 1.05 : 1,
                }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              />
            </div>

            <div className="mt-4 text-center">
              <h3 className="text-lg font-medium text-gray-800 truncate">
                {item?.label}
              </h3>
            </div>

            <div className="mt-2 text-center">
              <motion.button
                className="relative text-sm font-medium text-gray-600 hover:text-black cursor-pointer"
                initial="rest"
                whileHover="hover"
                animate="rest"
              >
                VIEW MORE
                <motion.span
                  variants={{
                    rest: { width: "0%" },
                    hover: { width: "100%" },
                  }}
                  transition={{ duration: 0.3 }}
                  className="absolute left-0 bottom-0 h-[1.5px] bg-gray-600"
                />
              </motion.button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
