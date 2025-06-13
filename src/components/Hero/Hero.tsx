"use client";
import { Button, Image, Text, Title } from "@mantine/core";
import { IconArrowRight } from "@tabler/icons-react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

export function Hero() {
  const slide = {
    image: "/assets/hero.png",
    title: "YOUR GEMSTONE DESTINATION AWAITS",
    description:
      "Discover premium gems from every corner, beautifully brought together",
  };

  const [revealImage, setRevealImage] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setRevealImage(true);
    }, 600);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative w-full h-[750px] bg-white overflow-hidden">
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
          src={slide.image}
          alt={slide.title}
          fit="fill"
          className="w-full h-full object-cover object-[center_right]"
        />
        <div className="absolute top-0 left-0 w-full h-full bg-black opacity-30 z-10" />
      </motion.div>

      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={revealImage ? { y: 0, opacity: 1 } : {}}
        transition={{ duration: 1, delay: 0.5 }}
        className="absolute inset-0 text-white flex flex-col justify-center items-center text-center px-4 z-30 mt-36"
      >
        <h1
          style={{ fontFamily: "'Alice', sans-serif", fontWeight: "520" }}
          className="text-[2.5rem]"
        >
          {slide.title}
        </h1>

        <p className="max-w-xl mt-2.5 text-lg">{slide.description}</p>
        <Button
          mt="xl"
          px={"xl"}
          size="lg"
          color="white"
          variant="outline"
          fw={"normal"}
          rightSection={<IconArrowRight size={20} />}
        >
          Shop Now
        </Button>
      </motion.div>
    </div>
  );
}
