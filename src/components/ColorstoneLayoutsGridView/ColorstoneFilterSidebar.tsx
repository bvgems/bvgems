"use client";

import {
  ColorStoneGemstonesList,
  ColorStoneLayoutType,
  ColorStoneTypesList,
  LayoutQuality,
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
  Group,
  Image,
  MantineProvider,
  Radio,
} from "@mantine/core";
import { SizeFilter } from "../CommonComponents/SizeFilter";

const theme = createTheme({
  cursorType: "pointer",
});

export const ColorstoneFilterSidebar = ({
  selectedShapes,
  setSelectedShapes,
  selectedGemstones,
  setSelectedGemstones,
  selectedType,
  setSelectedType,
  selectedLayoutType,
  setSelectedLayoutType,
  priceRange,
  setPriceRange,
  length,
  width,
  setLength,
  setWidth,
  selectedRoundSizes,
  setSelectedRoundSizes,
  selectedQuality,
  setSelectedQuality,
}: any) => {
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
            "type",
            "layout-type",
            "color",
            "shape",
            "round-sizes",
            "other-sizes",
            "price",
            "quality",
          ]}
        >
          <AccordionItem value="quality">
            <AccordionControl>Quality</AccordionControl>
            <AccordionPanel>
              <Radio.Group
                name="quality"
                value={selectedQuality || "AA"}
                onChange={setSelectedQuality}
              >
                <Group mt="xs">
                  {LayoutQuality?.map(
                    (item: { label: string }, index: number) => (
                      <Radio
                        key={index}
                        value={item.label}
                        label={item.label}
                        color="#0b182d"
                      />
                    ),
                  )}
                </Group>
              </Radio.Group>
            </AccordionPanel>
          </AccordionItem>
          <AccordionItem value="gemstone">
            <AccordionControl>Gemstone</AccordionControl>
            <AccordionPanel>
              <CheckboxGroup
                value={selectedGemstones}
                onChange={setSelectedGemstones}
              >
                {ColorStoneGemstonesList?.map(
                  (item: { label: string }, index: number) => (
                    <div className="mt-2 ml-5" key={index}>
                      <Checkbox
                        value={item.label}
                        checked={selectedGemstones.includes(item.label)}
                        color="#0b182d"
                        size="16"
                        className="mt-4"
                        label={
                          <span className="text-md mb-2">{item.label}</span>
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
          <AccordionItem value="type">
            <AccordionControl>Type</AccordionControl>
            <AccordionPanel>
              <CheckboxGroup value={selectedType} onChange={setSelectedType}>
                {ColorStoneTypesList?.map(
                  (item: { label: string }, index: number) => (
                    <div className="mt-2 ml-5" key={index}>
                      <Checkbox
                        value={item.label}
                        checked={selectedType.includes(item.label)}
                        color="#0b182d"
                        size="16"
                        className="mt-4"
                        label={
                          <span className="text-md mb-2">{item.label}</span>
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

          <AccordionItem value="layout-type">
            <AccordionControl>Layout Type</AccordionControl>
            <AccordionPanel>
              <CheckboxGroup
                value={selectedLayoutType}
                onChange={setSelectedLayoutType}
              >
                {ColorStoneLayoutType?.map(
                  (item: { label: string }, index: number) => (
                    <div className="mt-2 ml-5" key={index}>
                      <Checkbox
                        value={item.label}
                        checked={selectedLayoutType.includes(item.label)}
                        color="#0b182d"
                        size="16"
                        className="mt-4"
                        label={
                          <span className="text-md mb-2">{item.label}</span>
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
                  ),
                )}
              </CheckboxGroup>
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
