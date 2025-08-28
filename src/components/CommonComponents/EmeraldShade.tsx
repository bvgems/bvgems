import { Image } from "@mantine/core";
import React from "react";

export const EmeraldShade = ({
  product,
  emeraldShade,
  setEmeraldShade,
}: any) => {
  console.log('prodd',product)
  return (
    <div className="mt-4">
      <p className="font-medium mb-2 text-gray-700">Shade:</p>

      <div className="flex gap-4">
        {product?.extra_images?.length > 0 ? (
          product?.extra_images
            ?.map((url: string, index: number) => ({
              name: index === 0 ? "Zambian" : "Colombian",
              url,
            }))
            .map((shade: any, index: any) => (
              <div
                key={index}
                className={`cursor-pointer rounded-md p-[2px] border ${
                  emeraldShade === shade.name
                    ? "border-green-600 ring-2 ring-green-600"
                    : "border-gray-300 hover:border-gray-400"
                }`}
                onClick={() => setEmeraldShade(shade.name)}
              >
                <Image
                  src={shade.url}
                  alt={shade.name}
                  h={100}
                  w={100}
                  fit="contain"
                  className="rounded-md"
                />
                <p className="text-center text-xs mt-1">{shade.name}</p>
              </div>
            ))
        ) : (
          <div>
            <div className="flex gap-4">
              {["Zambian", "Colombian"].map((shade) => (
                <button
                  key={shade}
                  onClick={() => setEmeraldShade(shade)}
                  className={`px-5 py-2 rounded-full border text-sm font-semibold transition-all duration-200 cursor-pointer ${
                    emeraldShade === shade
                      ? "bg-green-600 text-white shadow-md scale-105"
                      : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {shade}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Commentary box */}
      <div className="mt-4 p-3 rounded-md border border-gray-300 bg-gray-50 text-sm text-gray-700">
        <p className="font-medium mb-1">Shade Commentary:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>
            <strong>Zambian:</strong> Darker and saturated forest green hue
          </li>
          <li>
            <strong>Colombian:</strong> Lighter and brighter green hue
          </li>
        </ul>
      </div>
    </div>
  );
};
