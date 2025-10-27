"use client";

import {
  FreeSizeGemstonesList,
  FreeSizeOrigins,
  SapphireLooseGemstoneColorOptions,
  ShapeFilterList,
} from "@/utils/constants";
import {
  Checkbox,
  CheckboxGroup,
  createTheme,
  Divider,
  Image,
  MantineProvider,
  NumberInput,
  MultiSelect,
  Select,
  Switch,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
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
  const isMobile = useMediaQuery("(max-width: 768px)");

  return (
    <div>
      <MantineProvider theme={theme}>
        {isMobile ? (
          // ---------- MOBILE VIEW (Multi-Select Dropdown Style) ----------
          <div className="px-4 py-3 space-y-5">
            {/* Certified */}
            <div>
              <p className="font-medium mb-2">Certified</p>
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
            </div>

            {/* Color (Multi-select) */}
            <MultiSelect
              label="Color"
              placeholder="Select colors"
              data={SapphireLooseGemstoneColorOptions.map((item) => ({
                value: item.value,
                label: item.value,
              }))}
              value={selectedColors}
              onChange={(val) => setSelectedColors(val)}
              searchable
              clearable
              nothingFoundMessage="No colors"
              className="w-full"
            />

            {/* Shape (Multi-select) */}
            <MultiSelect
              label="Shape"
              placeholder="Select shapes"
              data={ShapeFilterList.map((item) => ({
                value: item.label,
                label: item.label,
              }))}
              value={selectedShapes}
              onChange={(val) => setSelectedShapes(val)}
              searchable
              clearable
              nothingFoundMessage="No shapes"
              className="w-full"
            />

            {/* Weight Range */}
            <div>
              <p className="font-medium mb-2">Weight Range (cts.)</p>
              <div className="flex gap-4">
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
            </div>
          </div>
        ) : (
          // ---------- DESKTOP VIEW (Accordion-style Sidebar) ----------
          <div className="px-8 mt-4">
            {/* Certified */}
            <div className="mb-6">
              <h3 className="font-semibold text-lg mb-2">Certified</h3>
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
            </div>

            {/* Color */}
            <div className="mb-6">
              <h3 className="font-semibold text-lg mb-2">Color</h3>
              {SapphireLooseGemstoneColorOptions.map((item, index) => (
                <div className="mt-2 ml-2" key={index}>
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
                    label={item.value}
                  />
                </div>
              ))}
            </div>

            {/* Shape */}
            <div className="mb-6">
              <h3 className="font-semibold text-lg mb-2">Shape</h3>
              <CheckboxGroup
                value={selectedShapes}
                onChange={setSelectedShapes}
              >
                {ShapeFilterList.map((item, index) => (
                  <div className="mt-2 ml-2" key={index}>
                    <Checkbox
                      value={item.label}
                      color="#0b182d"
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
            </div>

            {/* Weight Range */}
            <div>
              <h3 className="font-semibold text-lg mb-2">Weight Range (cts.)</h3>
              <div className="flex gap-4 mt-2 ml-2">
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
            </div>
          </div>
        )}
      </MantineProvider>
      <Divider orientation="vertical" className="mx-4" />
    </div>
  );
};
