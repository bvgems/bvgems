import { NumberInput, RangeSlider } from "@mantine/core";
import { IconRulerMeasure } from "@tabler/icons-react";

export const WidthFilter = ({ range, setRange }: any) => {
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
      <h1>Width</h1>
      <div className="flex flex-col md:flex-row items-center gap-4 w-full">
        <NumberInput
          className="w-full md:w-1/6"
          leftSection={<IconRulerMeasure />}
          value={range[0]}
          onChange={handleMinChange}
          min={1}
          max={range[1]}
          step={0.01}
        />

        <RangeSlider
          className="w-full md:w-2/3"
          value={range}
          onChange={setRange}
          min={1}
          max={25}
          step={0.01}
          precision={2}
          color="gray"
          label={(val) => `${val.toFixed(2)} mm`}
          labelTransitionProps={{
            transition: "skew-down",
            duration: 150,
            timingFunction: "linear",
          }}
        />

        <NumberInput
          className="w-full md:w-1/6"
          leftSection={<IconRulerMeasure />}
          value={range[1]}
          onChange={handleMaxChange}
          min={range[0]}
          max={25}
          step={0.01}
        />
      </div>
    </div>
  );
};
