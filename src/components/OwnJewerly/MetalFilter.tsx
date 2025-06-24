import { Button } from "@mantine/core";
import React, { useState } from "react";

export const MetalFilter = ({ selected, setSelected }: any) => {
  const metals = [
    { label: "White", color: "#e5e7eb" },
    { label: "Yellow", color: "#facc15" },
    { label: "Rose", color: "#fda4af" },
    { label: "Platinum", color: "#cbd5e1" },
  ];

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="font-medium text-gray-700 mr-4">Metals</span>
      {metals.map(({ label, color }) => {
          const isSelected = selected.includes(label);


        return (
          <Button
            key={label}
            color="gray"
            onClick={() => {
              setSelected((prev: string[]) =>
                prev.includes(label)
                  ? prev.filter((item) => item !== label)
                  : [...prev, label]
              );
            }}
            variant={selected.includes(label) ? "default" : "light"}
            radius="md"
            className="hover:shadow-md transition-all bg-white"
            styles={{
              root: {
                borderWidth: 1,
                borderColor: isSelected ? "white" : "#e5e7eb",
                backgroundColor: isSelected ? "#94a5b0" : "#ffffff",
                boxShadow: isSelected ? "0 2px 6px rgba(0,0,0,0.1)" : "none",
              },
            }}
          >
            <span
              className={`text-sm font-medium ${
                isSelected ? "text-white" : "text-black"
              } text-center`}
            >
              {label}
            </span>
          </Button>
        );
      })}
    </div>
  );
};
