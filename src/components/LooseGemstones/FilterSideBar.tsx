"use client";

import {
  gemstoneOptions,
  ShapeFilterList,
  shopByColorOptions,
  SizeFilterList,
} from "@/utils/constants";
import {
  Accordion,
  AccordionControl,
  AccordionItem,
  AccordionPanel,
  Checkbox,
  CheckboxGroup,
  createTheme,
  Divider,
  Image,
  MantineProvider,
  NumberInput,
  RangeSlider,
} from "@mantine/core";
import React, { useState } from "react";

const theme = createTheme({
  cursorType: "pointer",
});

export const FilterSideBar = ({
  selectedStones,
  setSelectedStones,
  selectedColors,
  setSelectedColors,
  selectedShapes,
  setSelectedShapes,
  length,
  setLength,
  width,
  setWidth,
  priceRange,
  setPriceRange,
  selectedRoundSizes,
  setSelectedRoundSizes,
  color,
}: any) => {
  const handleStoneChange = (stoneLabel: string, checked: boolean) => {
    if (checked) {
      setSelectedStones((prev: any) => [...prev, stoneLabel]);
    } else {
      setSelectedStones((prev: any) =>
        prev.filter((stone: any) => stone !== stoneLabel)
      );
    }
  };

  const handleColorChange = (colorName: string, checked: boolean) => {
    if (checked) {
      setSelectedColors((prev: any) => [...prev, colorName]);
    } else {
      setSelectedColors((prev: any) =>
        prev.filter((color: any) => color !== colorName)
      );
    }
  };

  const handleRoundSizeChange = (size: string, checked: boolean) => {
    if (checked) {
      setSelectedRoundSizes((prev: any) => [...prev, size]);
    } else {
      setSelectedRoundSizes((prev: any) => prev.filter((s: any) => s !== size));
    }
  };

  return (
    <div>
      <MantineProvider theme={theme}>
        <Accordion
          className="px-8  mt-4"
          multiple
          defaultValue={[
            "gemstone",
            "color",
            "shape",
            "round-sizes",
            "other-sizes",
            "price",
          ]}
        >
          <AccordionItem className="mt-2" value="gemstone">
            <AccordionControl>Gemstone Type</AccordionControl>
            <AccordionPanel>
              {gemstoneOptions?.map(
                (item: { label: string }, index: number) => (
                  <div className="mt-2 ml-5" key={index}>
                    <Checkbox
                      checked={selectedStones.includes(item.label)}
                      onChange={(event) =>
                        handleStoneChange(
                          item.label,
                          event.currentTarget.checked
                        )
                      }
                      color="#0b182d"
                      size="16"
                      className="mt-4"
                      label={item.label}
                      style={{
                        cursor: "pointer",
                      }}
                    />
                  </div>
                )
              )}
            </AccordionPanel>
          </AccordionItem>

          <AccordionItem value="shape">
            <AccordionControl>Shape</AccordionControl>
            <AccordionPanel>
              <CheckboxGroup
                value={selectedShapes}
                onChange={setSelectedShapes}
              >
                {ShapeFilterList?.map(
                  (item: { label: string; image: string }, index: number) => (
                    <div className="mt-2 ml-5" key={index}>
                      <Checkbox
                        value={item.label}
                        color="#0b182d"
                        size="16"
                        className="mt-4"
                        label={
                          <div className="flex items-center gap-2">
                            <Image
                              src={item.image}
                              h={35}
                              w={35}
                              fit="contain"
                            />
                            <span className="text-md mb-2">{item.label}</span>
                          </div>
                        }
                        styles={{
                          label: { display: "flex", alignItems: "center" },
                        }}
                      />
                    </div>
                  )
                )}
              </CheckboxGroup>
            </AccordionPanel>
          </AccordionItem>
          <AccordionItem value="color">
            <AccordionControl>Color</AccordionControl>
            <AccordionPanel>
              {shopByColorOptions?.map(
                (item: { name: string }, index: number) => (
                  <div className="mt-2 ml-5" key={index}>
                    <Checkbox
                      checked={selectedColors.includes(item.name)}
                      onChange={(event) =>
                        handleColorChange(
                          item.name,
                          event.currentTarget.checked
                        )
                      }
                      color="#0b182d"
                      size="16"
                      className="mt-4"
                      label={item.name}
                    />
                  </div>
                )
              )}
            </AccordionPanel>
          </AccordionItem>

          <AccordionItem value="round-sizes">
            <AccordionControl>Size (For Round Shape)</AccordionControl>
            <AccordionPanel>
              {SizeFilterList?.Round?.map((item: any, index: number) => (
                <div className="mt-2 ml-5" key={index}>
                  <Checkbox
                    checked={selectedRoundSizes.includes(item)}
                    onChange={(event) =>
                      handleRoundSizeChange(item, event.currentTarget.checked)
                    }
                    color="#0b182d"
                    size="16"
                    className="mt-4"
                    label={item + " mm"}
                    styles={{
                      label: { display: "flex", alignItems: "center" },
                    }}
                  />
                </div>
              ))}
            </AccordionPanel>
          </AccordionItem>

          <AccordionItem value="other-sizes">
            <AccordionControl>Size (For All Other Shapes)</AccordionControl>
            <AccordionPanel>
              <div className="flex flex-col md:flex-row gap-4 mt-2 ml-5">
                <NumberInput
                  value={length}
                  onChange={setLength}
                  min={0}
                  step={0.25}
                  label="Length (mm)"
                  placeholder="e.g., 8"
                  className="w-full"
                />
                <NumberInput
                  value={width}
                  onChange={setWidth}
                  min={0}
                  step={0.25}
                  label="Width (mm)"
                  placeholder="e.g., 6"
                  className="w-full"
                />
              </div>
            </AccordionPanel>
          </AccordionItem>

          <AccordionItem value="price">
            <AccordionControl>Price Range ($)</AccordionControl>
            <AccordionPanel>
              <div className="flex flex-col gap-3 mt-2 ml-5">
                <div className="flex flex-col md:flex-row gap-4">
                  <NumberInput
                    value={priceRange[0]}
                    onChange={(val) =>
                      setPriceRange((prev: any) => [
                        typeof val === "number" ? val : prev[0],
                        prev[1],
                      ])
                    }
                    min={0}
                    max={priceRange[1]}
                    step={100}
                    label="From"
                    className="w-full"
                    prefix="$"
                  />
                  <NumberInput
                    value={priceRange[1]}
                    onChange={(val) =>
                      setPriceRange((prev: any) => [
                        prev[0],
                        typeof val === "number" ? val : prev[1],
                      ])
                    }
                    min={priceRange[0]}
                    step={100}
                    label="To"
                    className="w-full"
                    prefix="$"
                  />
                </div>

                <RangeSlider
                  value={priceRange}
                  onChange={setPriceRange}
                  min={0}
                  max={10000}
                  step={100}
                  color="#0b182d"
                  label={(val) => `$${val}`}
                  labelTransitionProps={{
                    transition: "skew-down",
                    duration: 150,
                    timingFunction: "linear",
                  }}
                />
              </div>
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
      </MantineProvider>
      <Divider
        orientation="vertical"
        className="mx-4"
        style={{ height: "auto" }}
      />
    </div>
  );
};
