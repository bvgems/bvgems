"use client";

import { useEffect } from "react";
import { Group, Text } from "@mantine/core";
import { IconInfoCircle } from "@tabler/icons-react";

interface GoldColorInputProps {
  selectedGoldColor: string;
  setSelectedGoldColor: (color: string) => void;
}

const GOLD_COLORS = [
  { label: "Yellow Gold", value: "yellow", hex: "#FFD700" },
  { label: "White Gold", value: "white", hex: "#E5E4E2" },
  { label: "Rose Gold", value: "rose", hex: "#B76E79" },
];

export const GoldColorInput = ({
  selectedGoldColor,
  setSelectedGoldColor,
}: GoldColorInputProps) => {
  // ✅ Set first color as default if none is selected
  useEffect(() => {
    if (!selectedGoldColor && GOLD_COLORS.length > 0) {
      setSelectedGoldColor(GOLD_COLORS[0].value);
    }
  }, [selectedGoldColor, setSelectedGoldColor]);

  return (
    <div>
      <div className="flex flex-col gap-1 mb-3">
        <p className="font-medium">Select Gold Color</p>
        <Group gap="xs">
          <IconInfoCircle size={14} color="#666" />
          <Text size="xs" c="dimmed">
            All gold options are 14K
          </Text>
        </Group>
      </div>

      <Group gap="xl">
        {GOLD_COLORS.map((c) => (
          <div
            key={c.value}
            className="flex flex-col items-center gap-1 cursor-pointer"
            onClick={() => setSelectedGoldColor(c.value)}
          >
            <div
              style={{
                width: 26,
                height: 26,
                borderRadius: "50%",
                backgroundColor: c.hex,
                border:
                  selectedGoldColor === c.value
                    ? "3px solid #0b182d"
                    : "2px solid #ccc",
              }}
            />
            <Text
              size="xs"
              c={selectedGoldColor === c.value ? "#0b182d" : "dimmed"}
            >
              {c.label}
            </Text>
          </div>
        ))}
      </Group>
    </div>
  );
};
