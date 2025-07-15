"use client";
import { Image } from "@mantine/core";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

export const LeftSideLooseGemstones = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      className="h-[400px] flex items-center"
      initial={{ y: 100, opacity: 0 }}
      animate={inView ? { y: 0, opacity: 1 } : {}}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <Image h={400} src="/assets/loose-gemstone.png" alt="Gemstone" />
    </motion.div>
  );
};
