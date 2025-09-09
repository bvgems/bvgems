"use client";

import {
  gemstoneOptions,
  GemstoneType,
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
} from "@mantine/core";
import { SizeFilter } from "../CommonComponents/SizeFilter";

const theme = createTheme({
  cursorType: "pointer",
});

export const FilterSideBar = ({
  selectedTypes,
  setSelectedTypes,
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
            <AccordionControl>Type</AccordionControl>
            <AccordionPanel>
              <CheckboxGroup value={selectedTypes} onChange={setSelectedTypes}>
                {GemstoneType?.map((item: { label: string }, index: number) => (
                  <div className="mt-2 ml-5" key={index}>
                    <Checkbox
                      value={item.label}
                      color="#0b182d"
                      size="16"
                      className="mt-4"
                      label={item.label}
                      style={{ cursor: "pointer" }}
                    />
                  </div>
                ))}
              </CheckboxGroup>
            </AccordionPanel>
          </AccordionItem>

          <AccordionItem className="mt-2" value="gemstone">
            <AccordionControl>Gemstone</AccordionControl>
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
                        checked={selectedShapes.includes(item.label)}
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

          <SizeFilter
            length={length}
            width={width}
            setLength={setLength}
            setWidth={setWidth}
            selectedRoundSizes={selectedRoundSizes}
            handleRoundSizeChange={handleRoundSizeChange}
          />
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
