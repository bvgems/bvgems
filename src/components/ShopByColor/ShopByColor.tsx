"use client";

import { Container, Grid, Card } from "@mantine/core";
import Image from "next/image";
import { motion } from "framer-motion";
import { AnimatedText } from "../CommonComponents/AnimatedText";
import { shopByColorOptions } from "@/utils/constants";
import { useRouter } from "next/navigation";
import Link from "next/link";

const itemVariants = {
  hidden: { opacity: 0, x: 100 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.6,
      type: "spring",
    },
  }),
};

export default function ShopByColor() {
  const router = useRouter();

  const handleShopByColor = (item: any) => {
    router?.push(`/loose-gemstones?color=${item?.name?.toLowerCase()}`);
  };

  return (
    <Container size={1350} className="mt-20">
      <AnimatedText
        text="Shop Gemstone By Color"
        className="text-center text-4xl text-[#0b182d] mb-8"
      />

      {/* FLEX WRAPPER to avoid wrapping issue */}
      <div className="flex flex-wrap justify-center gap-8">
        {shopByColorOptions?.map((item: any, index: number) => (
          <motion.div
            key={index}
            custom={index}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            // variants={itemVariants}
          >
            <Card
              component={Link}
              href={`/loose-gemstones?color=${item?.name?.toLowerCase()}`}
              shadow="sm"
              radius="lg"
              withBorder
              className="w-[150px] flex flex-col items-center justify-center cursor-pointer transition-transform hover:scale-105 hover:shadow-lg block no-underline"
            >
              <div className="relative w-[130px] h-[130px] flex items-center justify-center">
                <Image loading="lazy"
                  fill
                  src={item?.image}
                  alt={`${item?.name} colored gemstones collection`}
                  className="object-contain"
                />
              </div>
              <span className=" text-[#0b182d] mt-3">{item?.name}</span>
            </Card>
          </motion.div>
        ))}
      </div>
    </Container>
  );
}
