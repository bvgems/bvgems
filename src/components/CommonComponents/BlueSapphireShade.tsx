import { shades } from "@/utils/constants";
import { Image } from "@mantine/core";
import React from "react";

export const BlueSapphireShade = ({
  product,
  sapphireShade,
  setSapphireShade,
  setDisplayImage,
}: any) => {
  const isRound = product?.shape?.toLowerCase() === "round";

  return (
    <div className="mt-6">
      <p className="font-medium mb-3 text-gray-700">Shade:</p>

      {isRound ? (
        <div className="grid grid-cols-3 gap-4">
          {shades.map((shade) => (
            <div
              key={shade.name}
              onClick={() => {
                setSapphireShade(shade.name);
                setDisplayImage(shade.image);
              }}
              className={`cursor-pointer flex flex-col items-center p-4 bg-white border transition-all text-center
              ${
                sapphireShade === shade.name
                  ? "border-blue-600 ring-2 ring-blue-600 shadow-md"
                  : "border-gray-200 hover:shadow-lg"
              }`}
            >
              <Image loading="lazy" src={shade.image} w={80} h={80} fit="contain" />

              <span className="mt-2 text-xs font-semibold text-gray-900">
                {shade.name}
              </span>
              <p className="mt-2 text-xs text-gray-600 leading-relaxed">
                {shade.description}
              </p>
            </div>
          ))}
        </div>
      ) : (
        /* OTHER SHAPES (square buttons, no image change) */
        <div className="flex gap-4">
          {shades.map((shade) => (
            <button
              key={shade.name}
              onClick={() => setSapphireShade(shade.name)}
              className={`px-5 py-3 border text-sm font-semibold transition-all cursor-pointer
              ${
                sapphireShade === shade.name
                  ? "bg-blue-600 text-white border-blue-600 shadow-md"
                  : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
            >
              {shade.name}
            </button>
          ))}
        </div>
      )}

      {/* SHADE EXPLANATION SECTION */}

      {!isRound && (
        <div className="mt-8">
          <h3 className="text-lg font-bold text-gray-800 mb-6 text-center">
            Natural Blue Sapphire Shade Variations
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {shades.map((shade) => (
              <div
                key={shade.name}
                className="flex flex-col items-center p-5 bg-white rounded-xl shadow-md text-center"
              >
                <Image loading="lazy" src={shade.image} w={90} h={90} fit="contain" />

                <span className="mt-3 text-sm font-semibold text-gray-900">
                  {shade.name}
                </span>

                <p className="mt-2 text-xs text-gray-600 leading-relaxed">
                  {shade.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
