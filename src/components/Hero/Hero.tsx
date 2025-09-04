"use client";

import { Button, Image } from "@mantine/core";
import { IconArrowRight } from "@tabler/icons-react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export function Hero({ jewelryRef, heroData }: any) {
  const [revealImage, setRevealImage] = useState(false);
  const router = useRouter();

  const alignment =
    heroData?.heroData?.page?.metafields[4]?.value?.toLowerCase() || "left";

  const textAlignmentClass =
    alignment === "Right"
      ? "right-[8%] text-right items-end"
      : "left-[8%] text-left items-start";

  useEffect(() => {
    const timer = setTimeout(() => {
      setRevealImage(true);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative w-full h-[550px] bg-white overflow-hidden">
      <AnimatePresence>
        {!revealImage && (
          <>
            <motion.div
              initial={{ x: 0 }}
              animate={{ x: "-100%" }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.8 }}
              className="absolute top-0 left-0 w-1/2 h-full bg-[#f7f7f7] z-20"
            />
            <motion.div
              initial={{ x: 0 }}
              animate={{ x: "100%" }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.8 }}
              className="absolute top-0 right-0 w-1/2 h-full bg-[#f7f7f7] z-20"
            />
          </>
        )}
      </AnimatePresence>

      {/* Hero Image */}
      <motion.div
        initial={{ opacity: 0, scale: 1.1 }}
        animate={revealImage ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="w-full h-full absolute top-0 left-0 z-10"
      >
        <Image
          src={
            heroData?.heroData?.page?.metafields[0]?.references?.edges[0]?.node
              ?.image?.url || "/assets/hero-bg2.png"
          }
          alt="Hero Image"
          className="w-full h-full object-cover"
        />
      </motion.div>
      {revealImage && (
        <div className="absolute top-0 left-0 w-full h-full bg-black opacity-10 md:opacity-0 z-20 pointer-events-none" />
      )}

      {revealImage && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className={`absolute top-1/2 transform -translate-y-1/2 z-30 max-w-[650px] px-4 flex flex-col text-[#333333] gap-4 ${textAlignmentClass}`}
        >
          <h1 className="text-3xl md:text-5xl mb-2 drop-shadow-lg">
            {heroData?.heroData?.page?.metafields[1]?.value ||
              "Discover Timeless Beauty in Every Stone"}
          </h1>
          <p className="text-lg md:text-xl mb-4 drop-shadow-md">
            {heroData?.heroData?.page?.metafields[2]?.value ||
              "Shop our curated selection of calibrated and free size gemstones, ethically sourced and precision cut for brilliance."}
          </p>
          <div className="flex gap-4 flex-wrap">
            <Button
              size="md"
              color="dark"
              rightSection={<IconArrowRight size={18} />}
              onClick={() => router.push("/loose-gemstones")}
            >
              Shop Calibrated Gemstones
            </Button>
            <Button
              size="md"
              variant="white"
              color="dark"
              rightSection={<IconArrowRight size={18} />}
              onClick={() => router.push("/free-size-gemstones")}
            >
              Shop Free Size Gemstones
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
