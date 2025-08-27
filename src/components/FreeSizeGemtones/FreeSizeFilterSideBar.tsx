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
  Input,
  MantineProvider,
  NumberInput,
  RangeSlider,
  Switch,
} from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
import React, { useMemo } from "react";

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
  const handleStoneChange = (stoneLabel: string, checked: boolean) => {
    if (checked) {
      setSelectedStones((prev: any) => [...prev, stoneLabel]);
    } else {
      setSelectedStones((prev: any) =>
        prev.filter((stone: any) => stone !== stoneLabel)
      );
    }
  };

  const handleOriginChange = (originName: string, checked: boolean) => {
    if (checked) {
      setSelectedOrigins((prev: any) => [...prev, originName]);
    } else {
      setSelectedOrigins((prev: any) =>
        prev.filter((origin: any) => origin !== originName)
      );
    }
  };

  const dynamicOrigins = useMemo(() => {
    const allOrigins = selectedStones.flatMap(
      (stone: string) => FreeSizeOrigins[stone] || []
    );
    return Array.from(new Set(allOrigins));
  }, [selectedStones]);

  return (
    <div>
      <MantineProvider theme={theme}>
        <Accordion defaultValue={["shape"]} className="px-8 mt-4" multiple>
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

          {/* Weight */}
          <AccordionItem value="weight">
            <AccordionControl>Weight Range (cts.)</AccordionControl>
            <AccordionPanel>
              <div className="mt-2 ml-5">
                <RangeSlider
                  color="#0b182d"
                  value={weightRange}
                  onChange={setWeightRange}
                  min={0.51}
                  max={25}
                  step={0.01}
                />
              </div>
            </AccordionPanel>
          </AccordionItem>

          {/* Origin */}
          {dynamicOrigins.length > 0 && (
            <AccordionItem value="origin">
              <AccordionControl>Origin</AccordionControl>
              <AccordionPanel>
                {dynamicOrigins.map((origin: any, index: any) => (
                  <div className="mt-2 ml-5" key={index}>
                    <Checkbox
                      checked={selectedOrigins?.includes(origin)}
                      onChange={(event) =>
                        handleOriginChange(origin, event.currentTarget.checked)
                      }
                      color="#0b182d"
                      size="16"
                      className="mt-4"
                      label={origin}
                    />
                  </div>
                ))}
              </AccordionPanel>
            </AccordionItem>
          )}

          {/* Single / Matched */}
          <AccordionItem value="singleormatched">
            <AccordionControl>Single / Matched</AccordionControl>
            <AccordionPanel>
              <CheckboxGroup
                value={singleOrMatched}
                onChange={setSingleOrMatched}
              >
                <Checkbox value="single" label="Single" />
                <Checkbox value="matched" label="Matched Pair" />
              </CheckboxGroup>
            </AccordionPanel>
          </AccordionItem>

          {/* Enhancement */}
          <AccordionItem value="enhancement">
            <AccordionControl>Enhancement</AccordionControl>
            <AccordionPanel>
              <CheckboxGroup value={enhancement} onChange={setEnhancement}>
                <Checkbox value="oiled" label="Oiled" />
                <Checkbox value="heated" label="Heated" />
                <Checkbox value="unheated" label="Unheated" />
              </CheckboxGroup>
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
      </MantineProvider>
      <Divider orientation="vertical" className="mx-4" />
    </div>
  );
};
