"use client";

import {
  SapphireLooseGemstoneColorOptions,
  ShapeFilterList,
  FreeSizeGemstonesList,
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
  Switch,
  Text,
  Group,
  Autocomplete,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { useRouter } from "next/navigation";
import React from "react";

const theme = createTheme({
  cursorType: "pointer",
});

export const FreeSizeFilterSideBar = ({
  isFancySapphire,
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
  const isMobile = useMediaQuery("(max-width: 1024px)");
  const router = useRouter();

  const [selectedGem, setSelectedGem] = React.useState<string | null>(null);


  const minVal = weightRange?.[0] ?? null;
  const maxVal = weightRange?.[1] ?? null;

  return (
    <div>
      <MantineProvider theme={theme}>
        {isMobile ? (
          <div className="px-4 py-3 space-y-5">
            <div>
              <p className="font-medium mb-2">Choose Gemstone</p>
              <Autocomplete
                placeholder="Choose Gemstone"
                data={FreeSizeGemstonesList.map((item) => item.label)}
                size="md"
                w="100%"
                value={selectedGem || ""}
                onChange={setSelectedGem}
                renderOption={({ option }) => {
                  const gem = FreeSizeGemstonesList.find(
                    (g) => g.label === option.value
                  );
                  return (
                    <Group gap="sm">
                      <img
                        src={gem?.image}
                        alt={gem?.label}
                        width={35}
                        height={35}
                        style={{ objectFit: "contain", borderRadius: "8px" }}
                      />
                      <Text size="sm" fw={500}>
                        {gem?.label}
                      </Text>
                    </Group>
                  );
                }}
                onOptionSubmit={(value) => {
                  const gem = FreeSizeGemstonesList.find(
                    (g) => g.label === value
                  );
                  if (gem) {
                    setSelectedGem(gem.label);
                    router.push(
                      `/free-size-gemstones/${gem.label.toLowerCase()}`
                    );
                  }
                }}
              />
            </div>

            {/* === Shape === */}
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

            {/* === Color (Fancy Sapphire only) === */}
            {isFancySapphire && (
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
            )}

            {/* === Weight Range (EMPTY by default) === */}
            <div>
              <p className="font-medium mb-2">Weight Range (cts.)</p>
              <div className="flex gap-4">
                <NumberInput
                  label="Min"
                  placeholder="Min"
                  value={minVal ?? undefined}
                  onChange={(val) =>
                    setWeightRange([
                      typeof val === "number" && !Number.isNaN(val)
                        ? val
                        : null,
                      maxVal,
                    ])
                  }
                  step={0.01}
                  // no min/max bounds → user controls it; we only filter if provided
                />
                <NumberInput
                  label="Max"
                  placeholder="Max"
                  value={maxVal ?? undefined}
                  onChange={(val) =>
                    setWeightRange([
                      minVal,
                      typeof val === "number" && !Number.isNaN(val)
                        ? val
                        : null,
                    ])
                  }
                  step={0.01}
                />
              </div>
            </div>

            {/* === Certified === */}
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
          </div>
        ) : (
          // ---------- DESKTOP VIEW ----------
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

            {/* Color */}
            {isFancySapphire && (
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
            )}

            {/* Weight Range (EMPTY by default) */}
            <div>
              <h3 className="font-semibold text-lg mb-2">
                Weight Range (cts.)
              </h3>
              <div className="flex gap-4 mt-2 ml-2">
                <NumberInput
                  label="Min"
                  placeholder="Min"
                  value={minVal ?? undefined}
                  onChange={(val) =>
                    setWeightRange([
                      typeof val === "number" && !Number.isNaN(val)
                        ? val
                        : null,
                      maxVal,
                    ])
                  }
                  step={0.01}
                />
                <NumberInput
                  label="Max"
                  placeholder="Max"
                  value={maxVal ?? undefined}
                  onChange={(val) =>
                    setWeightRange([
                      minVal,
                      typeof val === "number" && !Number.isNaN(val)
                        ? val
                        : null,
                    ])
                  }
                  step={0.01}
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
