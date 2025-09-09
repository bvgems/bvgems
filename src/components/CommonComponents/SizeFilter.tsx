import { SizeFilterList } from "@/utils/constants";
import {
  AccordionControl,
  AccordionItem,
  AccordionPanel,
  Checkbox,
  NumberInput,
} from "@mantine/core";
import React from "react";

export const SizeFilter = ({
  length,
  width,
  setLength,
  setWidth,
  selectedRoundSizes,
  handleRoundSizeChange,
}: any) => {
  return (
    <>
      <AccordionItem value="round-sizes">
        <AccordionControl>Size (For Round Shape)</AccordionControl>
        <AccordionPanel>
          {SizeFilterList?.Round?.map((item: any, index: number) => (
            <div className="mt-2 ml-5" key={index}>
              <Checkbox
                checked={selectedRoundSizes.includes(item)}
                onChange={(event) =>
                  handleRoundSizeChange(item, event.currentTarget.checked)
                }
                color="#0b182d"
                size="16"
                className="mt-4"
                label={item + " mm"}
                styles={{
                  label: { display: "flex", alignItems: "center" },
                }}
              />
            </div>
          ))}
        </AccordionPanel>
      </AccordionItem>

      <AccordionItem value="other-sizes">
        <AccordionControl>Size (For All Other Shapes)</AccordionControl>
        <AccordionPanel>
          <div className="flex flex-col gap-4 mt-2">
            <div className="flex flex-col md:flex-row gap-4">
              <NumberInput
                value={length?.min || ""}
                onChange={(val) =>
                  setLength((prev: any) => ({ ...prev, min: val }))
                }
                min={0}
                step={0.25}
                label="Min Length (mm)"
                placeholder="e.g., 4"
                className="w-full"
              />
              <NumberInput
                value={length?.max || ""}
                onChange={(val) =>
                  setLength((prev: any) => ({ ...prev, max: val }))
                }
                min={0}
                step={0.25}
                label="Max Length (mm)"
                placeholder="e.g., 10"
                className="w-full"
              />
            </div>
            <div className="flex flex-col md:flex-row gap-4">
              <NumberInput
                value={width?.min || ""}
                onChange={(val) =>
                  setWidth((prev: any) => ({ ...prev, min: val }))
                }
                min={0}
                step={0.25}
                label="Min Width (mm)"
                placeholder="e.g., 3"
                className="w-full"
              />
              <NumberInput
                value={width?.max || ""}
                onChange={(val) =>
                  setWidth((prev: any) => ({ ...prev, max: val }))
                }
                min={0}
                step={0.25}
                label="Max Width (mm)"
                placeholder="e.g., 8"
                className="w-full"
              />
            </div>
          </div>
        </AccordionPanel>
      </AccordionItem>
    </>
  );
};
