"use client";

import {
  ColorOptions,
  EarringTypes,
  JewelryGemstones,
  RingTypes,
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
  RangeSlider,
} from "@mantine/core";

const theme = createTheme({
  cursorType: "pointer",
});

export const JewelerySideBar = ({
  collectionSlug,
  selectedStones,
  setSelectedStones,
  selectedShapes,
  setSelectedShapes,
  selectedTypes,
  setSelectedTypes,
  priceRange,
  setPriceRange,
  selectedColors,
  setSelectedColors,
}: any) => {
  const handleStoneChange = (stoneLabel: string, checked: boolean) => {
    if (checked) {
      setSelectedStones([stoneLabel]); // replace existing with only this one
    } else {
      setSelectedStones([]); // uncheck removes all
    }
  };

  const handleTypeChange = (typeLabel: string, checked: boolean) => {
    if (checked) {
      setSelectedTypes((prev: any) => [...prev, typeLabel]);
    } else {
      setSelectedTypes((prev: any) =>
        prev.filter((type: any) => type !== typeLabel),
      );
    }
  };
  const handleColorChange = (color: string, checked: boolean) => {
    if (checked) {
      setSelectedColors((prev: any) => [...prev, color]);
    } else {
      setSelectedColors((prev: any) => prev.filter((c: any) => c !== color));
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
          {/* Price */}
          <AccordionItem className="mt-2" value="price">
            <AccordionControl>Price</AccordionControl>
            <AccordionPanel>
              <div className="py-5">
                <RangeSlider
                  color="#0b182d"
                  value={priceRange}
                  onChange={setPriceRange}
                  min={100}
                  max={15000}
                  label={(value) => `$ ${value}`}
                />
              </div>
            </AccordionPanel>
          </AccordionItem>

          {/* Color */}
          <AccordionItem className="mt-2" value="color">
            <AccordionControl>Color</AccordionControl>
            <AccordionPanel>
              {ColorOptions?.map((item: { label: string }, index: number) => (
                <div className="mt-2 ml-5 capitalize" key={index}>
                  <Checkbox
                    checked={selectedColors.includes(item.label)}
                    onChange={(event) =>
                      handleColorChange(item.label, event.currentTarget.checked)
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
              ))}
            </AccordionPanel>
          </AccordionItem>

          {/* Gemstone */}
          <AccordionItem className="mt-2" value="gemstone">
            <AccordionControl>Gemstone</AccordionControl>
            <AccordionPanel>
              {JewelryGemstones?.map(
                (item: { label: string }, index: number) => (
                  <div className="mt-2 ml-5" key={index}>
                    <Checkbox
                      checked={selectedStones.includes(item.label)}
                      onChange={(event) =>
                        handleStoneChange(
                          item.label,
                          event.currentTarget.checked,
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
                ),
              )}
            </AccordionPanel>
          </AccordionItem>

          {/* Ring Type (only for rings collection) */}
          {/* {collectionSlug === "rings" ? (
            <AccordionItem className="mt-2" value="ring-type">
              <AccordionControl>Ring Type</AccordionControl>
              <AccordionPanel>
                {RingTypes?.map((item: any, index: number) => (
                  <div className="mt-2 ml-5" key={index}>
                    <Checkbox
                      checked={selectedTypes.includes(item.label)}
                      onChange={(event) =>
                        handleTypeChange(
                          item.label,
                          event.currentTarget.checked
                        )
                      }
                      color="#0b182d"
                      size="16"
                      className="mt-4"
                      label={<span className="text-md">{item.label}</span>}
                      styles={{
                        label: { display: "flex", alignItems: "center" },
                      }}
                    />
                  </div>
                ))}
              </AccordionPanel>
            </AccordionItem>
          ) : null} */}

          {collectionSlug === "earrings" ? (
            <AccordionItem className="mt-2" value="ring-type">
              <AccordionControl>Metal Type</AccordionControl>
              <AccordionPanel>
                {EarringTypes?.map((item: any, index: number) => (
                  <div className="mt-2 ml-5" key={index}>
                    <Checkbox
                      checked={selectedTypes.includes(item.label)}
                      onChange={(event) =>
                        handleTypeChange(
                          item.label,
                          event.currentTarget.checked,
                        )
                      }
                      color="#0b182d"
                      size="16"
                      className="mt-4"
                      label={<span className="text-md">{item.label}</span>}
                      styles={{
                        label: { display: "flex", alignItems: "center" },
                      }}
                    />
                  </div>
                ))}
              </AccordionPanel>
            </AccordionItem>
          ) : null}

          {/* Shape */}
          <AccordionItem value="shape">
            <AccordionControl>Gemstone Shape</AccordionControl>
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
                            <Image loading="lazy"
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
                  ),
                )}
              </CheckboxGroup>
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
