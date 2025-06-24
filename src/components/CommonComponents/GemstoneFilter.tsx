"use client";
import React, { useState } from "react";
import { Button, ActionIcon, Tooltip } from "@mantine/core";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

export const GemstoneFilter = ({ options, selected, setSelected }: any) => {
  const getGemstoneGradient = (label: string) => {
    const gradients: Record<string, string> = {
      Sapphire: "from-blue-600 to-blue-400",
      Ruby: "from-red-600 to-red-400",
      Emerald: "from-green-600 to-green-400",
      Tsavorite: "from-emerald-600 to-emerald-400",
    };
    return gradients[label] || "from-gray-600 to-gray-400";
  };

  const getDescription = (label: string) => {
    const descriptions: Record<string, string> = {
      Sapphire: "Royal & Elegant",
      Ruby: "Passionate & Bold",
      Emerald: "Nature & Harmony",
      Tsavorite: "Rare & Precious",
    };
    return descriptions[label] || "Beautiful & Unique";
  };

  return (
    <div className="w-full">
      <div className="flex items-center gap-4 w-full">
        <ActionIcon
          variant="subtle"
          className="previous-button flex-shrink-0"
          radius="xl"
          size="lg"
          color="gray"
        >
          <IconChevronLeft />
        </ActionIcon>

        <Swiper
          modules={[Navigation]}
          slidesPerView="auto"
          spaceBetween={16}
          navigation={{ prevEl: ".previous-button", nextEl: ".next-button" }}
          style={{ width: "100%" }}
        >
          {options.map(({ label, image }: any) => {
            const isSelected = selected === label;
            return (
              <SwiperSlide key={label} style={{ width: 115 }}>
                <Tooltip label={label} position="bottom" withArrow>
                  <Button
                    onClick={() => setSelected(label)}
                    variant={isSelected ? "default" : "light"}
                    color="gray"
                    radius="md"
                    w={112}
                    h={66}
                    p={4}
                    className="hover:shadow-md transition-all bg-white"
                    styles={{
                      root: {
                        borderWidth: 1,
                        borderColor: isSelected ? "e5e7eb" : "",
                        boxShadow: isSelected
                          ? "0 2px 6px rgba(0,0,0,0.1)"
                          : "none",
                      },
                    }}
                  >
                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10">
                        <img
                          src={image}
                          alt={label}
                          className="object-contain w-full h-full"
                        />
                      </div>
                      <span
                        className={`text-sm font-medium ${
                          isSelected ? "text-black" : "text-gray-600"
                        }`}
                      >
                        {label}
                      </span>
                    </div>
                  </Button>
                </Tooltip>
              </SwiperSlide>
            );
          })}
        </Swiper>

        <ActionIcon
          variant="subtle"
          className="next-button flex-shrink-0"
          radius="xl"
          size="lg"
          color="gray"
        >
          <IconChevronRight />
        </ActionIcon>
      </div>
    </div>
  );
};
