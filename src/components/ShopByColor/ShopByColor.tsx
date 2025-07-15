"use client";

import { Container, Image } from "@mantine/core";
import { motion } from "framer-motion";
import { AnimatedText } from "../CommonComponents/AnimatedText";
import { shopByColorOptions } from "@/utils/constants";
import { useRouter } from "next/navigation";

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
    <Container size={1250} className="mt-20">
      <AnimatedText
        text="Shop Stone By Color"
        className="text-center text-4xl text-[#0b182d] mb-8"
      />

      <div className="flex items-center justify-center gap-10 flex-nowrap overflow-x-auto">
        {shopByColorOptions?.map((item: any, index: number) => (
          <motion.div
            key={index}
            className="flex flex-col justify-center items-center cursor-pointer group"
            custom={index}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={itemVariants}
          >
            <motion.div
              onClick={() => handleShopByColor(item)}
              transition={{ duration: 0.8, ease: "easeInOut" }}
            >
              <Image
                h={150}
                w={150}
                src={item?.image}
                alt={item?.name}
                className="transition-transform"
              />
            </motion.div>
            <span className="italic text-[#0b182d] mt-2">{item?.name}</span>
          </motion.div>
        ))}
      </div>
    </Container>
  );
}
