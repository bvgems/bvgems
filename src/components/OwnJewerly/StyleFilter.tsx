import React, { useState } from "react";
import {
  Solitaire,
  ThreeStone,
  SideStone,
  Halo,
  Engagement,
  Antique,
  WeddingSets,
  TwoStone,
  MensRing,
  Celtic,
  Astrological,
} from "../../utils/customSVGs";
import { Button, ActionIcon, Tooltip } from "@mantine/core";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

export const StyleFilter = ({ selected, setSelected }: any) => {
  const settingsOptions = [
    { label: "Solitaire", Icon: Solitaire },
    { label: "Three Stone", Icon: ThreeStone },
    { label: "Side Stone", Icon: SideStone },
    { label: "Halo", Icon: Halo },
    { label: "Engagement", Icon: Engagement },
    { label: "Antique", Icon: Antique },
    { label: "Wedding Sets", Icon: WeddingSets },
    { label: "Two Stone", Icon: TwoStone },
    { label: "Mens Ring", Icon: MensRing },
    { label: "Celtic", Icon: Celtic },
    { label: "Astrological", Icon: Astrological },
  ];

  return (
    <div className="flex items-center gap-4 w-full">
      <div className="text-gray-700 font-medium text-base w-[70px]">Style</div>

      <ActionIcon
        variant="light"
        className="previous-button"
        radius="xl"
        size="lg"
      >
        <IconChevronLeft />
      </ActionIcon>

      <Swiper
        modules={[Navigation]}
        slidesPerView="auto"
        spaceBetween={12}
        navigation={{ prevEl: ".previous-button", nextEl: ".next-button" }}
        style={{ width: "100%" }}
      >
        {settingsOptions.map(({ label, Icon }) => {
          const isSelected = selected.includes(label);

          return (
            <SwiperSlide key={label} style={{ width: 115 }}>
              <Tooltip label={label} position="bottom" withArrow>
                <Button
                  onClick={() => {
                    setSelected((prev: string[]) =>
                      prev.includes(label)
                        ? prev.filter((item) => item !== label)
                        : [...prev, label]
                    );
                  }}
                  variant={selected.includes(label) ? "default" : "light"}
                  color="gray"
                  radius="md"
                  w={112}
                  h={66}
                  p={4}
                  className="hover:shadow-md transition-all bg-white"
                  styles={{
                    root: {
                      borderWidth: 1,
                      borderColor: isSelected ? "white" : "#e5e7eb",
                      backgroundColor: isSelected ? "#94a5b0" : "#ffffff",
                      boxShadow: isSelected
                        ? "0 2px 6px rgba(0,0,0,0.1)"
                        : "none",
                    },
                  }}
                >
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-10">
                      <Icon fill={isSelected ? "#ffffff" : "#000000"} />
                    </div>
                    <span
                      className={`text-sm font-medium ${
                        isSelected
                          ? "text-white"
                          : "text-gray-700 group-hover:text-gray-900"
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

      <ActionIcon variant="light" className="next-button" radius="xl" size="lg">
        <IconChevronRight />
      </ActionIcon>
    </div>
  );
};
