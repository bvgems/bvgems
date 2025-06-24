"use client";

import { Grid } from "@mantine/core";
import { motion, AnimatePresence } from "framer-motion";
import React from "react";

interface AnimatedGridProps {
  items: any[];
  keyProp: string;
  renderItem: (item: any, index: number) => React.ReactNode;
}

export const ViewAllProductComponent: React.FC<AnimatedGridProps> = ({
  items,
  keyProp,
  renderItem,
}) => {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={keyProp}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
      >
        <Grid gutter="xl" className="mt-6">
          {items.map((item, index) => (
            <Grid.Col key={index} span={{ base: 12, sm: 6, md: 3 }}>
              {renderItem(item, index)}
            </Grid.Col>
          ))}
        </Grid>
      </motion.div>
    </AnimatePresence>
  );
};
