import { Image } from "@mantine/core";
import React from "react";

export const EmeraldDetails = ({
  isEmerald,
  shaedImages,
  typeFilter,
  getItemQuality,
  qualityImages,
  activeSlide,
}: any) => {
  return (
    <>
      {isEmerald &&
      shaedImages.length > 0 &&
      (typeFilter === "Lab Grown" ||
        getItemQuality(qualityImages[activeSlide]) === "Lab Grown") ? (
        <div className="mt-10">
          <h3 className="text-xl font-bold text-gray-800 mb-6 tracking-wide text-center">
            Lab Emerald Shade Variations
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {/* Zambian */}
            <div className="flex flex-col items-center p-5 bg-white rounded-2xl shadow-md hover:shadow-lg transition">
              <div className="h-[140px] w-[140px] flex items-center justify-center">
                <Image
                  src={shaedImages[0]}
                  fit="contain"
                  radius="md"
                  className="object-contain rounded-xl"
                />
              </div>
              <span className="mt-4 text-lg font-semibold text-gray-900">
                Zambian
              </span>
              <p className="mt-2 text-sm text-gray-600 leading-relaxed text-center">
                Darker, rich, and saturated forest green hue. Known for its
                depth and intensity.
              </p>
            </div>

            {shaedImages[1] && (
              <div className="flex flex-col items-center p-5 bg-white rounded-2xl shadow-md hover:shadow-lg transition">
                <div className="h-[140px] w-[140px] flex items-center justify-center">
                  <Image
                    src={shaedImages[1]}
                    fit="contain"
                    radius="md"
                    className="object-contain rounded-xl"
                  />
                </div>
                <span className="mt-4 text-lg font-semibold text-gray-900">
                  Colombian
                </span>
                <p className="mt-2 text-sm text-gray-600 leading-relaxed text-center">
                  Lighter and brighter green hue with vibrant brilliance and
                  sparkle.
                </p>
              </div>
            )}
          </div>
        </div>
      ) : null}
    </>
  );
};
