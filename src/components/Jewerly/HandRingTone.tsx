import { Slider } from "@mantine/core";
import React, { useState } from "react";

export const HandRingTone = ({ ringImage }: any) => {
  const [skinTone, setSkinTone] = useState(30);

  return (
    <div className="relative w-full flex flex-col items-center mb-5">
      <div className="relative w-[450px] h-[450px]">
        <img
          src="/assets/hand-base2.png"
          alt="Hand"
          className="w-full h-full object-contain transition-all duration-300"
          style={{
            filter: `brightness(${1.2 - skinTone / 100}) sepia(${
              skinTone / 200
            }) saturate(1.2)`,
          }}
        />

        {/* Ring overlay */}
        {ringImage && (
          <img
            src={"/assets/removed-ring-preview.png"}
            alt="Ring Preview"
            className="absolute object-contain"
            style={{
              width: "54px",
              top: "152px",
              left: "157px",
            }}
          />
        )}
      </div>

      {/* Skin tone slider */}
      <div className="w-64 mt-4">
        <Slider
          value={skinTone}
          onChange={setSkinTone}
          min={0}
          max={100}
          step={1}
          label={null}
          color="brown"
        />
        <p className="text-center text-sm mt-1">Adjust Skin Tone</p>
      </div>
    </div>
  );
};
