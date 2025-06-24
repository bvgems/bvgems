"use client";
import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";

interface AnimatedTextProps {
  text: string;
  delay?: number;
  duration?: number;
  y?: number;
  className?: string;
}

export const AnimatedText = ({
  text,
  delay = 0,
  duration = 0.8,
  y = 50,
  className = "",
}: AnimatedTextProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ y, opacity: 0 }}
      animate={isInView ? { y: 0, opacity: 1 } : {}}
      transition={{ duration, delay }}
      className={className}
    >
      {text}
    </motion.div>
  );
};
