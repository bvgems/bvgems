// ColorOptions.tsx
"use client";
import { ActionIcon, Button, Group } from "@mantine/core";
import {
  IconChevronLeft,
  IconChevronRight,
  IconDiamond,
} from "@tabler/icons-react";
import React from "react";
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";

export const ColorOptions = ({
  selectedGemstone,
  selectedColor,
  setSelectedColor,
  colorOptionsMap,
}: any) => {
  return (
    <div className="w-full">
      <Group mb="md">
        <IconDiamond color="#6B7280" />
        <div className="text-[#6B7280] text-xl">Choose Your Color</div>
      </Group>

      <div className="flex items-center gap-4 w-full">
        <ActionIcon
          variant="subtle"
          className="color-prev-btn flex-shrink-0"
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
          navigation={{
            prevEl: ".color-prev-btn",
            nextEl: ".color-next-btn",
          }}
          style={{ width: "100%" }}
        >
          {(colorOptionsMap[selectedGemstone] || []).map(
            ({ label, color }: any) => {
              const isSelected = selectedColor === label;
              return (
                <SwiperSlide key={label} style={{ width: 120 }}>
                  <Button
                    onClick={() => setSelectedColor(label)}
                    variant={isSelected ? "default" : "light"}
                    color="gray"
                    radius="md"
                    w={112}
                    h={60}
                    p={4}
                    className="hover:shadow-md transition-all bg-white"
                    styles={{
                      root: {
                        borderWidth: 1,
                        borderColor: "#e5e7eb",
                        boxShadow: isSelected
                          ? "0 2px 6px rgba(0,0,0,0.1)"
                          : "none",
                      },
                    }}
                  >
                    <div className="flex flex-col items-center gap-1">
                      <IconDiamond color={color} size={22} />
                      <span
                        className={`text-sm font-medium ${
                          isSelected ? "text-black" : "text-gray-600"
                        }`}
                      >
                        {label}
                      </span>
                    </div>
                  </Button>
                </SwiperSlide>
              );
            }
          )}
        </Swiper>

        <ActionIcon
          variant="subtle"
          className="color-next-btn flex-shrink-0"
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
