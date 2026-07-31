"use client";

import React, { useEffect, useState } from "react";
import { AnimatedText } from "../CommonComponents/AnimatedText";
import { Container, Image } from "@mantine/core";
import { getBestSellingProducts } from "@/apis/api";
import { motion } from "framer-motion";
import { Carousel } from "@mantine/carousel";
import { useRouter } from "next/navigation";
import { IconChevronRight } from "@tabler/icons-react";

export const BestSellingProductsComponents = () => {
  const [bestSellingProducts, setBestSellingProducts] = useState<any[]>([]);

  const router = useRouter();
  const fetchBestSellingProducts = async () => {
    const response = await getBestSellingProducts();
    setBestSellingProducts(response?.data || []);
  };

  useEffect(() => {
    fetchBestSellingProducts();
  }, []);

  return (
    <Container size={1350} className="mt-25">
      <AnimatedText
        text="Best Sellers"
        className="text-center text-4xl text-[#0b182d] mb-6"
      />
      <div
        onClick={() => {
          router?.push("/jewelry/rings");
        }}
        className="flex justify-end items-center cursor-pointer hover:underline"
      >
        <span>View All</span>
        <IconChevronRight size={19} />
      </div>
      <Carousel
        height={350}
        slideSize={{ base: "100%", sm: "50%", md: "25%" }}
        slideGap="md"
        emblaOptions={{ loop: true }}
        className="py-3"
      >
        {bestSellingProducts?.map((item: any, idx: number) => {
          console.log("item node", item);
          return (
            <Carousel.Slide key={idx}>
              <motion.div
                onClick={() => {
                  router?.push(
                    `/jewelry-details/${item?.node?.productType?.toLowerCase()}/${
                      item?.node?.handle
                    }/${item?.node?.variants.edges[0]?.node?.title
                      .toLowerCase()
                      .replace(/\s+/g, "-")}`
                  );
                }}
                whileHover={{ scale: 1.05 }}
                className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer p-6 flex flex-col items-center justify-between h-[300px]"
              >
                <div className="w-full flex justify-center">
                  <Image loading="lazy"
                    radius="md"
                    h={200}
                    fit="contain"
                    src={item?.node?.images?.edges[0]?.node?.url}
                    alt={item?.node?.title || "Product image"}
                    className="object-contain transition-transform duration-300 hover:scale-105"
                  />
                </div>
                <p className="text-sm text-gray-700 mt-2 text-center">
                  {item?.node?.title}
                </p>
              </motion.div>
            </Carousel.Slide>
          );
        })}
      </Carousel>
    </Container>
  );
};
