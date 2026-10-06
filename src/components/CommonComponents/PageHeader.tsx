"use client";

import React from "react";
import { motion } from "framer-motion";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
}

export function PageHeader({ title, subtitle }: PageHeaderProps) {
  return (
    <div className="bg-[#0b182d] text-white py-12 px-6 text-center shadow-sm">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }} // Apple-like smooth ease-out
      >
        <h1 className="text-3xl md:text-4xl uppercase tracking-[0.15em] font-light mb-4">
          {title}
        </h1>
        {subtitle && (
          <p className="text-gray-300 font-light max-w-2xl mx-auto leading-relaxed text-sm md:text-base">
            {subtitle}
          </p>
        )}
      </motion.div>
    </div>
  );
}
