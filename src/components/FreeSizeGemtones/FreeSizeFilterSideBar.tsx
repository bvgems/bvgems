"use client";

import {
  FreeSizeGemstonesList,
  FreeSizeOrigins,
  ShapeFilterList,
  shopByColorOptions,
} from "@/utils/constants";
import {
  Accordion,
  AccordionControl,
  AccordionItem,
  AccordionPanel,
  Button,
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
  selectedStones,
  setSelectedStones,
  selectedColors,
  setSelectedColors,
  selectedShapes,
  setSelectedShapes,
  selectedOrigins,
  setSelectedOrigins,
  length,
  setLength,
  width,
  setWidth,
  checked,
  setChecked,
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
          <AccordionItem className="mt-2" value="lotnumber">
            <AccordionControl>Lot Number / Subitem</AccordionControl>
            <AccordionPanel>
              <div className="flex items-center gap-3">
                <Input
                  placeholder="Lot Number"
                  leftSection={<IconSearch size={16} />}
                />
                <Button color="#0b182d" variant="outline" size="compact-sm">
                  <IconSearch size={15} />
                </Button>
              </div>
            </AccordionPanel>
          </AccordionItem>
          <AccordionItem className="mt-2" value="gemstone">
            <AccordionControl>Gemstone Type</AccordionControl>
            <AccordionPanel>
              {FreeSizeGemstonesList.map((item, index) => (
                <div className="mt-2 ml-5" key={index}>
                  <Checkbox
                    checked={selectedStones?.includes(item.label)}
                    onChange={(event) =>
                      handleStoneChange(item.label, event.currentTarget.checked)
                    }
                    color="#0b182d"
                    size="16"
                    className="mt-4"
                    label={item.label}
                    style={{ cursor: "pointer" }}
                  />
                </div>
              ))}
            </AccordionPanel>
          </AccordionItem>

          {selectedStones?.includes("Sapphire") && (
            <AccordionItem value="color">
              <AccordionControl>Color</AccordionControl>
              <AccordionPanel>
                {shopByColorOptions.map((item, index) => (
                  <div className="mt-2 ml-5" key={index}>
                    <Checkbox
                      checked={selectedColors?.includes(item.name)}
                      onChange={(event) =>
                        setSelectedColors((prev: any) =>
                          event.currentTarget.checked
                            ? [...prev, item.name]
                            : prev.filter((c: any) => c !== item.name)
                        )
                      }
                      color="#0b182d"
                      size="16"
                      className="mt-4"
                      label={item.name}
                    />
                  </div>
                ))}
              </AccordionPanel>
            </AccordionItem>
          )}

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
                      styles={{
                        label: { display: "flex", alignItems: "center" },
                      }}
                    />
                  </div>
                ))}
              </CheckboxGroup>
            </AccordionPanel>
          </AccordionItem>

          <AccordionItem value="weight">
            <AccordionControl>Weight Range (cts.)</AccordionControl>
            <AccordionPanel>
              <div className="mt-2 ml-5">
                <RangeSlider
                  color="#0b182d"
                  defaultValue={[1, 50]}
                  min={0}
                  max={100}
                  labelTransitionProps={{
                    transition: "skew-down",
                    duration: 150,
                    timingFunction: "linear",
                  }}
                />
              </div>
            </AccordionPanel>
          </AccordionItem>

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
          <AccordionItem value="singleormatched">
            <AccordionControl>Single / Matched</AccordionControl>
            <AccordionPanel>
              <CheckboxGroup
                value={selectedShapes}
                onChange={setSelectedShapes}
              >
                <Checkbox
                  value={"single"}
                  color="#0b182d"
                  size="16"
                  className="mt-4"
                  label={
                    <div className="flex items-center gap-2">
                      <span className="text-md mb-2">Single</span>
                    </div>
                  }
                />

                <Checkbox
                  value={"matched"}
                  color="#0b182d"
                  size="16"
                  className="mt-4"
                  label={
                    <div className="flex items-center gap-2">
                      <span className="text-md mb-2">Matched Pair</span>
                    </div>
                  }
                />
              </CheckboxGroup>
            </AccordionPanel>
          </AccordionItem>
          <AccordionItem value="enhancement">
            <AccordionControl>Enhancement</AccordionControl>
            <AccordionPanel>
              <CheckboxGroup
                value={selectedShapes}
                onChange={setSelectedShapes}
              >
                <Checkbox
                  value={"heated"}
                  color="#0b182d"
                  size="16"
                  className="mt-4"
                  label={
                    <div className="flex items-center gap-2">
                      <span className="text-md mb-2">Heated</span>
                    </div>
                  }
                />

                <Checkbox
                  value={"unheated"}
                  color="#0b182d"
                  size="16"
                  className="mt-4"
                  label={
                    <div className="flex items-center gap-2">
                      <span className="text-md mb-2">Unheated</span>
                    </div>
                  }
                />
              </CheckboxGroup>
            </AccordionPanel>
          </AccordionItem>
          <AccordionItem value="certified">
            <AccordionControl>Certified</AccordionControl>
            <AccordionPanel>
              <Switch
                checked
                color="#0b182d"
                label="Yes / No"
                onChange={(event) => setChecked(event.currentTarget.checked)}
              />
            </AccordionPanel>
          </AccordionItem>
          <AccordionItem value="sizes">
            <AccordionControl>Dimensions</AccordionControl>
            <AccordionPanel>
              <div className="mt-2">
                <span>Length (mm)</span>
                <div className="flex flex-col md:flex-row gap-4">
                  <NumberInput
                    value={length}
                    onChange={setLength}
                    min={0}
                    step={0.25}
                    label="From"
                    placeholder="e.g., 8"
                    className="w-full"
                  />
                  <NumberInput
                    value={width}
                    onChange={setWidth}
                    min={0}
                    step={0.25}
                    label="To"
                    placeholder="e.g., 6"
                    className="w-full"
                  />
                </div>
              </div>
              <div className="mt-5">
                <span>Width (mm)</span>
                <div className="flex flex-col md:flex-row gap-4">
                  <NumberInput
                    value={length}
                    onChange={setLength}
                    min={0}
                    step={0.25}
                    label="From"
                    placeholder="e.g., 8"
                    className="w-full"
                  />
                  <NumberInput
                    value={width}
                    onChange={setWidth}
                    min={0}
                    step={0.25}
                    label="To"
                    placeholder="e.g., 6"
                    className="w-full"
                  />
                </div>
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
