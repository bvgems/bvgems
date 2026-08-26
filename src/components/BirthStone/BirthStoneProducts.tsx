import { Image } from "@mantine/core";
import React from "react";
import { motion } from "framer-motion";
import { GemstonesByBirthMonths } from "@/utils/constants";
import { useRouter } from "next/navigation";

export const BirthStoneProducts = ({ currentStone }: any) => {
  const router = useRouter();
  const matchedGemstone = GemstonesByBirthMonths.find(
    (item: any) => item.gemstone === currentStone
  );

  if (!matchedGemstone || !matchedGemstone.products) {
    return null;
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-6">
      {matchedGemstone.products.map((product: any, idx: number) => (
        <motion.div
          key={idx}
          whileHover={{ scale: 1.05 }}
          className="bg-white rounded-2xl shadow-[0px_0px_10px_rgba(0,0,0,0.08)] hover:shadow-[0px_0px_20px_rgba(0,0,0,0.12)] transition-all duration-300 cursor-pointer p-6 flex flex-col items-center justify-between"
        >
          <div
            onClick={() => {
              router?.push(product?.link);
            }}
            className="w-full flex justify-center"
          >
            <Image loading="lazy"
              radius="md"
              h={220}
              fit="contain"
              src={product.image}
              alt={`${matchedGemstone.gemstone} product ${idx + 1}`}
              className="object-contain transition-transform duration-300 hover:scale-105"
            />
          </div>

          <p className="text-sm text-gray-500 mt-1 text-center">
            Shop {product?.title}
          </p>
        </motion.div>
      ))}
    </div>
  );
};
