import React, { useState } from "react";
import { StyleFilter } from "./StyleFilter";
import { MetalFilter } from "./MetalFilter";
import { StoneFilter } from "./StoneFilter";
import { Grid, GridCol, Badge, CloseButton, Divider } from "@mantine/core";
import { PriceFilter } from "./PriceFilter";
import { WidthFilter } from "./WidthFilter";
import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.5, ease: "easeOut" },
  }),
};

export const SettingFilter = () => {
  const [selectedStyles, setSelectedStyles] = useState<any>([]);
  const [selectedMetals, setSelectedMetals] = useState<any>([]);
  const [centerStones, setCenterStones] = useState<any>([]);
  const [sideStones, setSideStones] = useState<any>([]);

  const defaultWidthRange: [number, number] = [1, 25];
  const [widthRange, setWidthRange] =
    useState<[number, number]>(defaultWidthRange);
  const defaultPriceRange: [number, number] = [100, 2000];
  const [priceRange, setPriceRange] =
    useState<[number, number]>(defaultPriceRange);

  const removeFilter = (type: string) => {
    switch (type) {
      case "Style":
        setSelectedStyles([]);
        break;
      case "Metal":
        setSelectedMetals([]);
        break;
      case "Center Stone":
        setCenterStones([]);
        break;
      case "Side Stone":
        setSideStones([]);
        break;
      case "Price":
        setPriceRange(defaultPriceRange);
        break;
      case "Width":
        setWidthRange(defaultWidthRange);
        break;
    }
  };
  const clearAllFilters = () => {
    setSelectedStyles([]);
    setSelectedMetals([]);
    setCenterStones([]);
    setSideStones([]);
    setPriceRange(defaultPriceRange);
    setWidthRange(defaultWidthRange);
  };

  const appliedFilters = [
    ...selectedStyles.map((style: any) => ({ label: style, type: "Style" })),
    ...selectedMetals.map((metal: any) => ({ label: metal, type: "Metal" })),
    ...centerStones.map((stone: any) => ({
      label: stone,
      type: "Center Stone",
    })),
    ...sideStones.map((stone: any) => ({ label: stone, type: "Side Stone" })),
    { label: `$${priceRange[0]} - $${priceRange[1]}`, type: "Price" },
    {
      label: `${widthRange[0].toFixed(2)} - ${widthRange[1].toFixed(2)} mm`,
      type: "Width",
    },
  ];

  return (
    <div className="flex flex-col gap-8 w-full mt-5">
      <motion.div
        custom={0}
        initial="hidden"
        animate="visible"
        variants={fadeUp}
      >
        <StyleFilter
          selected={selectedStyles}
          setSelected={setSelectedStyles}
        />
      </motion.div>

      <motion.div
        custom={1}
        initial="hidden"
        animate="visible"
        variants={fadeUp}
      >
        <Grid gutter="md">
          <GridCol span={{ base: 12, md: 6 }}>
            <MetalFilter
              selected={selectedMetals}
              setSelected={setSelectedMetals}
            />
          </GridCol>
          <GridCol span={{ base: 12, md: 6 }}>
            <StoneFilter
              stone="Center"
              selected={centerStones}
              setSelected={setCenterStones}
            />
          </GridCol>
        </Grid>
      </motion.div>

      <motion.div
        custom={2}
        initial="hidden"
        animate="visible"
        variants={fadeUp}
      >
        <StoneFilter
          stone="Side"
          selected={sideStones}
          setSelected={setSideStones}
        />
      </motion.div>

      <motion.div
        custom={3}
        initial="hidden"
        animate="visible"
        variants={fadeUp}
      >
        <Grid gutter="xl">
          <GridCol span={{ base: 12, md: 6 }}>
            <PriceFilter range={priceRange} setRange={setPriceRange} />
          </GridCol>
          <GridCol span={{ base: 12, md: 6 }}>
            <WidthFilter range={widthRange} setRange={setWidthRange} />
          </GridCol>
        </Grid>
      </motion.div>
      <Divider />

      {appliedFilters.length > 0 && (
        <div className="flex flex-wrap gap-3 items-center justify-between">
          <div className="flex flex-wrap gap-3">
            {appliedFilters.map((filter: any) => (
              <Badge
                key={`${filter.type}-${filter.label}`}
                variant="light"
                color="gray"
                size="lg"
                rightSection={
                  <CloseButton
                    onClick={() => removeFilter(filter.type)}
                    size="xs"
                    ml={8}
                  />
                }
              >
                {filter.type}: {filter.label}
              </Badge>
            ))}
          </div>

          <button
            onClick={clearAllFilters}
            className="ml-auto text-sm text-gray-500 underline hover:text-gray-700 transition"
          >
            Clear All
          </button>
        </div>
      )}
    </div>
  );
};
