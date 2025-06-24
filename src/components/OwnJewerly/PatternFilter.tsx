"use client";
import React from "react";
import { Button } from "@mantine/core";

export const PatternFilter = ({
  selectedGemstone,
  selectedPattern,
  setSelectedPattern,
}: any) => {
  const patternOptions = [
    {
      label: "Ombre",
      description: "Gradual color transition",
      preview: "linear-gradient(135deg, #3B82F6 0%, #93C5FD 50%, #DBEAFE 100%)",
    },
    {
      label: "Straight",
      description: "Uniform color layout",
      preview: "linear-gradient(135deg, #3B82F6 0%, #3B82F6 100%)",
    },
  ];

  return (
    <div>
      <div className="flex gap-4">
        {patternOptions.map(({ label, description, preview }) => {
          const isSelected = selectedPattern === label;
          return (
            <Button
              key={label}
              onClick={() => setSelectedPattern(label)}
              variant={isSelected ? "default" : "light"}
              disabled={
                (selectedGemstone === "Ruby" ||
                  selectedGemstone === "Tsavorite") &&
                label === "Ombre"
              }
              color="gray"
              radius="md"
              w={112}
              h={66}
              p={4}
              className="hover:shadow-md transition-all bg-white"
              styles={{
                root: {
                  borderWidth: 1,
                  borderColor: isSelected ? "e5e7eb" : "",
                  //   backgroundColor: isSelected ? "#94a5b0" : "#ffffff",
                  boxShadow: isSelected ? "0 2px 6px rgba(0,0,0,0.1)" : "none",
                },
              }}
            >
              <div className="flex flex-col items-center gap-1">
                <div
                  className="w-8 h-4 rounded-full"
                  style={{ background: preview }}
                />
                <span
                  className={`text-sm font-medium ${
                    isSelected ? "text-black" : "text-gray-600"
                  }`}
                >
                  {label}
                </span>
              </div>
            </Button>
          );
        })}
      </div>
    </div>
  );
};
