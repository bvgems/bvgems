import { NumberInput, RangeSlider } from "@mantine/core";
import { IconCurrencyDollar } from "@tabler/icons-react";
import React, { useState } from "react";

export const PriceFilter = ({ range, setRange }: any) => {
  const handleMinChange = (val: string | number) => {
    if (typeof val === "number") {
      setRange(([_, max]: [number, number]) => [Math.min(val, max), max]);
    }
  };

  const handleMaxChange = (val: string | number) => {
    if (typeof val === "number") {
      setRange(([min, _]: [number, number]) => [min, Math.max(val, min)]);
    }
  };

  return (
    <div className="flex gap-4 items-center">
      <h1>Price</h1>
      <div className="flex flex-col md:flex-row items-center gap-4 w-full">
        <NumberInput
          className="w-full md:w-1/6"
          leftSection={<IconCurrencyDollar />}
          thousandSeparator=","
          value={range[0]}
          onChange={handleMinChange}
          min={0}
          max={range[1]}
        />

        <RangeSlider
          className="w-full md:w-2/3"
          value={range}
          onChange={setRange}
          min={0}
          max={10000}
          step={50}
          labelTransitionProps={{
            transition: "skew-down",
            duration: 150,
            timingFunction: "linear",
          }}
          color="gray"
        />

        <NumberInput
          className="w-full md:w-1/4"
          leftSection={<IconCurrencyDollar />}
          thousandSeparator=","
          value={range[1]}
          onChange={handleMaxChange}
          min={range[0]}
          max={10000}
        />
      </div>
    </div>
  );
};
