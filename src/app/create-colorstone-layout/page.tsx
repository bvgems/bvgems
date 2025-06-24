"use client";

import { useEffect, useState } from "react";
import {
  MantineProvider,
  Divider,
  Grid,
  GridCol,
  Textarea,
  Button,
  Text,
} from "@mantine/core";
import { IconDiamond } from "@tabler/icons-react";
import { motion } from "framer-motion";
import { JeweleryFilter } from "@/components/CommonComponents/JeweleryFilter";
import {
  braceletLengthOptions,
  categoryOptions,
  colorOptions,
  gemstoneOptions,
  necklaceLengthOptions,
  patternOptions,
  shapeOptions,
  stoneSizeOptions,
} from "@/utils/constants";

export default function CreateCustomLayout() {
  const goldColorOptions = [
    { label: "Rose", icon: <IconDiamond size={20} color="#ff007f" /> },
    { label: "White", icon: <IconDiamond size={20} color="gray" /> },
    { label: "Yellow", icon: <IconDiamond size={20} color="orange" /> },
  ];

  const [selectedJewelery, setSelectedJewelery] = useState("Bracelets");
  const [selectedGoldColor, setSelectedGoldColor] = useState("Rose");
  const [selectedLength, setSelectedLength] = useState("6.5 Inch");
  const [selectedShape, setSelectedShape] = useState("Round");
  const [selectedStoneSize, setSelectedStoneSize] = useState("");
  const [selectedGemstone, setSelectedGemstone] = useState("");
  const [selectedPattern, setSelectedPattern] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedColorList, setSelectedColorList] = useState<any[]>([]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    setSelectedLength(
      selectedJewelery === "Bracelets"
        ? braceletLengthOptions[0]?.label
        : necklaceLengthOptions[0]?.label
    );
  }, [selectedJewelery]);

  useEffect(() => {
    const colorList = colorOptions[selectedGemstone] || [];
    setSelectedColorList(colorList);
    if (!colorList.some((c: any) => c.color === selectedColor)) {
      setSelectedColor("");
    }
  }, [selectedGemstone]);

  const validateFields = () => {
    const newErrors: { [key: string]: string } = {};
    if (!selectedStoneSize)
      newErrors["MM Size"] = "Please select a stone size.";
    if (!selectedGemstone) newErrors["Gemstone"] = "Please select a gemstone.";
    if (!selectedColor) newErrors["Color"] = "Please select a color.";
    if (!selectedPattern) newErrors["Pattern"] = "Please select a pattern.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const clearError = (field: string) => {
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const filterConfigs = [
    {
      title: "Jewelery",
      options: categoryOptions,
      selected: selectedJewelery,
      setter: setSelectedJewelery,
    },
    {
      title: "Gold Color",
      options: goldColorOptions,
      selected: selectedGoldColor,
      setter: setSelectedGoldColor,
    },
    {
      title: "Length",
      options:
        selectedJewelery === "Bracelets"
          ? braceletLengthOptions
          : necklaceLengthOptions,
      selected: selectedLength,
      setter: setSelectedLength,
    },
    {
      title: "Shape",
      options: shapeOptions,
      selected: selectedShape,
      setter: setSelectedShape,
    },
    {
      title: "MM Size",
      options: stoneSizeOptions,
      selected: selectedStoneSize,
      setter: setSelectedStoneSize,
      isSelect: true,
      error: errors["MM Size"],
    },
    {
      title: "Gemstone",
      options: gemstoneOptions,
      selected: selectedGemstone,
      setter: setSelectedGemstone,
      isSelect: true,
      error: errors["Gemstone"],
    },
    {
      title: "Color",
      options: selectedColorList,
      selected: selectedColor,
      setter: setSelectedColor,
      isSelect: true,
      error: errors["Color"],
    },
    {
      title: "Pattern",
      options: patternOptions,
      selected: selectedPattern,
      setter: setSelectedPattern,
      isSelect: true,
      error: errors["Pattern"],
    },
  ];

  return (
    <MantineProvider>
      <div className="mx-12 py-4">
        <div className="py-4 flex flex-col gap-6">
          <span className="text-2xl text-[#6B7280]">
            Craft Your Own Signature Layouts — From Necklaces To Bracelets
          </span>
          <Divider size="sm" className="mb-5" />
        </div>

        <Grid gutter="xl">
          <GridCol span={{ base: 12, md: 8 }}>
            <div className="flex flex-col gap-6">
              {filterConfigs.map((config, idx) => (
                <div key={idx}>
                  <JeweleryFilter
                    title={config.title}
                    categoryOptions={config.options}
                    selected={config.selected}
                    setSelected={config.setter}
                    isSelect={config.isSelect}
                    error={config.error}
                    clearError={clearError}
                  />

                  {config.title === "Pattern" &&
                    selectedPattern === "Give Your Pattern" && (
                      <div className="ml-38">
                        <Textarea
                          placeholder="Describe how you want to arrange the stones and diamonds"
                          label="Give your own pattern"
                          autosize
                          minRows={2}
                          className="mt-5"
                        />
                      </div>
                    )}
                </div>
              ))}
              <Button
                color="gray"
                onClick={() => {
                  if (validateFields()) {
                    console.log("Generating preview");
                  }
                }}
              >
                <span className="text-lg">Generate Preview</span>
              </Button>
            </div>
          </GridCol>

          <GridCol span={{ base: 12, md: 4 }}>
            <motion.div
              key="ai-preview-placeholder"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col items-center justify-center h-full border border-dashed border-gray-300 rounded-lg px-6 bg-gray-50 text-center"
            >
              <IconDiamond size={48} color="#A1A1AA" className="mb-3" />
              <p className="text-gray-500 text-lg font-medium">
                Your preview will appear here
              </p>
              <p className="text-sm text-gray-400 mt-2">
                Click "Generate Preview" to visualize your unique design.
              </p>
            </motion.div>
          </GridCol>
        </Grid>
      </div>
    </MantineProvider>
  );
}
