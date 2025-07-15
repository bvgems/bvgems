"use client";
import { Button, Image } from "@mantine/core";
import { IconArrowRight } from "@tabler/icons-react";
import { motion, AnimatePresence } from "framer-motion";
import { RefObject, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const textSlides = [
  {
    title: "RARE BEAUTY, LOOSE GEMSTONES",
    description:
      "Discover premium loose gemstones from around the world—curated for brilliance, ready for your designs.",
    link: "/loose-gemstones",
  },
  {
    title: "JEWELRY THAT TELLS YOUR STORY",
    description:
      "Explore handcrafted gemstone bracelets, necklaces, and rings—crafted to elevate every moment.",
    link: "#jewelry-section",
  },
];

type HeroProps = {
  jewelryRef: RefObject<HTMLDivElement | null>;
};

export function Hero({ jewelryRef }: HeroProps) {
  const heroImage = "/assets/hero-bg.png";
  const [revealImage, setRevealImage] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      setRevealImage(true);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % textSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const currentText = textSlides[currentSlide];

  const handleShopNow = () => {
    if (currentSlide === 1 && jewelryRef.current) {
      jewelryRef.current.scrollIntoView({ behavior: "smooth" });
    } else {
      router.push(currentText.link);
    }
  };

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

      <motion.div
        initial={{ opacity: 0, scale: 1.1 }}
        animate={revealImage ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="w-full h-full absolute top-0 left-0 z-10"
      >
        <Image
          src={heroImage}
          alt="Hero Image"

          className="w-full h-full"
        />

      </motion.div>
    </div>
  );
}
