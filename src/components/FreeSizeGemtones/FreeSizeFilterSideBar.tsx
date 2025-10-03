"use client";

import {
  FreeSizeGemstonesList,
  FreeSizeOrigins,
  SapphireLooseGemstoneColorOptions,
  ShapeFilterList,
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
  Switch,
} from "@mantine/core";
import React from "react";

const theme = createTheme({
  cursorType: "pointer",
});

export const FreeSizeFilterSideBar = ({
  lotSearch,
  setLotSearch,
  selectedStones,
  setSelectedStones,
  selectedColors,
  setSelectedColors,
  selectedShapes,
  setSelectedShapes,
  selectedOrigins,
  setSelectedOrigins,
  weightRange,
  setWeightRange,
  singleOrMatched,
  setSingleOrMatched,
  enhancement,
  setEnhancement,
  certified,
  setCertified,
  length,
  setLength,
  width,
  setWidth,
}: any) => {
  return (
    <div>
      <MantineProvider theme={theme}>
        <Accordion defaultValue={["shape"]} className="px-8 mt-4" multiple>
          {/* Certified */}
          <AccordionItem value="certified">
            <AccordionControl>Certified</AccordionControl>
            <AccordionPanel>
              <Switch
                color="#0b182d"
                size="md"
                label="Certified Stones"
                checked={certified === true}
                onChange={(e) => {
                  if (e.currentTarget.checked) {
                    setCertified(true);
                  } else {
                    setCertified(null); 
                  }
                }}
              />
            </AccordionPanel>
          </AccordionItem>

          {/* Color (only for Sapphire) */}
          {selectedStones?.includes("Sapphire") && (
            <AccordionItem value="color">
              <AccordionControl>Color</AccordionControl>
              <AccordionPanel>
                {SapphireLooseGemstoneColorOptions.map((item, index) => (
                  <div className="mt-2 ml-5" key={index}>
                    <Checkbox
                      checked={selectedColors?.includes(item.value)}
                      onChange={(event) => {
                        const checked = event.currentTarget.checked;
                        setSelectedColors((prev: any) =>
                          checked
                            ? [...prev, item.value]
                            : prev.filter((c: any) => c !== item.value)
                        );
                      }}
                      color="#0b182d"
                      size="16"
                      className="mt-4"
                      label={item.value}
                    />
                  </div>
                ))}
              </AccordionPanel>
            </AccordionItem>
          )}

          {/* Shape */}
          <AccordionItem value="shape">
            <AccordionControl>Shape</AccordionControl>
            <AccordionPanel>
              <CheckboxGroup
                value={selectedShapes}
                onChange={setSelectedShapes}
              >
                {ShapeFilterList.map((item, index) => (
                  <div className="mt-2 ml-5" key={index}>
                    <Checkbox
                      value={item.label}
                      color="#0b182d"
                      size="16"
                      className="mt-4"
                      label={
                        <div className="flex items-center gap-2">
                          <Image src={item.image} h={35} w={35} fit="contain" />
                          <span className="text-md mb-2">{item.label}</span>
                        </div>
                      }
                    />
                  </div>
                ))}
              </CheckboxGroup>
            </AccordionPanel>
          </AccordionItem>

          {/* Weight Range */}
          <AccordionItem value="weight">
            <AccordionControl>Weight Range (cts.)</AccordionControl>
            <AccordionPanel>
              <div className="flex gap-4 mt-2 ml-5">
                <NumberInput
                  label="Min"
                  value={weightRange[0]}
                  onChange={(val) =>
                    setWeightRange([val || 0.51, weightRange[1]])
                  }
                  min={0.51}
                  max={25}
                  step={0.01}
                  maw={100}
                />
                <NumberInput
                  label="Max"
                  value={weightRange[1]}
                  onChange={(val) =>
                    setWeightRange([weightRange[0], val || 25])
                  }
                  min={0.51}
                  max={25}
                  step={0.01}
                  maw={100}
                />
              </div>
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
      </MantineProvider>
      <Divider orientation="vertical" className="mx-4" />
    </div>
  );
};
