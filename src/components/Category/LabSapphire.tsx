import { Image } from "@mantine/core";
import React from "react";

export const LabSapphire = ({
  isSapphire,
  selectedSapphireColor,
  typeFilter,
  getItemQuality,
  qualityImages,
  activeSlide,
}: any) => {
  return (
    <>
      {isSapphire &&
      selectedSapphireColor === "Blue" &&
      (typeFilter === "Lab Grown" ||
        getItemQuality(qualityImages[activeSlide]) === "Lab Grown") ? (
        <div className="mt-10">
          <h3 className="text-xl font-bold text-gray-800 mb-6 tracking-wide text-center">
            Lab Blue Sapphire
          </h3>

          <div className="flex flex-col items-center p-6 bg-white rounded-2xl shadow-md max-w-xl mx-auto">
            <div className="h-[160px] w-[160px] flex items-center justify-center">
              <Image loading="lazy"
                src="/assets/lab-blue.webp"
                fit="contain"
                radius="md"
                className="object-contain rounded-xl"
              />
            </div>

            <p className="mt-4 text-sm text-gray-600 leading-relaxed text-center">
              Blue sapphires are prized for their rich, velvety blue color and
              exceptional brilliance. Lab grown blue sapphires display vivid
              saturation, excellent clarity, and remarkable durability, making
              them ideal for fine jewelry with a luxurious yet modern appeal.
            </p>
          </div>
        </div>
      ) : null}

      {isSapphire &&
      selectedSapphireColor === "Pink" &&
      (typeFilter === "Lab Grown" ||
        getItemQuality(qualityImages[activeSlide]) === "Lab Grown") ? (
        <div className="mt-10">
          <h3 className="text-xl font-bold text-gray-800 mb-6 tracking-wide text-center">
            Lab Pink Sapphire
          </h3>

          <div className="flex flex-col items-center p-6 bg-white rounded-2xl shadow-md max-w-xl mx-auto">
            <div className="h-[160px] w-[160px] flex items-center justify-center">
              <Image loading="lazy"
                src="/assets/lab-pink.webp"
                fit="contain"
                radius="md"
                className="object-contain rounded-xl"
              />
            </div>

            <p className="mt-4 text-sm text-gray-600 leading-relaxed text-center">
              Pink sapphires are admired for their romantic blush tones and
              vibrant brilliance. Lab grown pink sapphires showcase vivid color,
              exceptional clarity, and remarkable durability, offering a refined
              and feminine alternative to traditional gemstones.
            </p>
          </div>
        </div>
      ) : null}
    </>
  );
};
