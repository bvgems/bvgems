"use client";
import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";

export const AnimatedText = ({
  text,
  delay = 0,
  duration = 0.8,
  className = "",
}:any) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ y: 50, opacity: 0 }}
      animate={isInView ? { y: 0, opacity: 1 } : {}}
      transition={{ duration, delay }}
      className={className}
    >
      {text}
    </motion.div>
  );
};
