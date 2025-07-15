"use client";
import { motion, useAnimation } from "framer-motion";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { Card, CardSection, Group } from "@mantine/core";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface AnimatedCardProps {
  item: any;
  index: number;
  baseDelay?: number;
}

export const AnimatedCard = ({
  item,
  index,
  baseDelay = 0,
}: AnimatedCardProps) => {
  const controls = useAnimation();
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const router = useRouter();
  const getProductName = (item: any) => {
    return `${item?.ct_weight} cttw. ${item?.color} ${item?.shape} ${item?.collection_slug}, ${item?.quality} Quality - ${item?.size}mm`;
  };

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

  const redirectToStonePage = () => {
    router.push(
      `/product-details?id=${
        item?.id
      }&name=${item?.collection_slug?.toLowerCase()}`
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
    >
      <Card
        className="flex flex-col justify-start bg-white cursor-pointer h-[350px]"
        padding="lg"
        withBorder
        shadow="md"
        onClick={redirectToStonePage}
      >
        <CardSection
          h={250}
          component="a"
          className="overflow-hidden border border-black"
        >
          <motion.img
            src={item?.image_url}
            alt={item?.title}
            className="w-full h-full"
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        </CardSection>

        <h1 className="text-gray-700 text-[1rem] mt-3">
          {getProductName(item)}
        </h1>

        <Link href={`/${item.handle}`}>
          <motion.button
            className="relative text-gray-500 text-sm px-0 py-1 border-none bg-transparent focus:outline-none"
            initial="rest"
            whileHover="hover"
            animate="rest"
          >
            View More
            <motion.span
              variants={{
                rest: { width: "0%" },
                hover: { width: "100%" },
              }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="absolute left-0 bottom-0 h-[1.5px] bg-gray-500"
            />
          </motion.button>
        </Link>
      </Card>
    </motion.div>
  );
};
