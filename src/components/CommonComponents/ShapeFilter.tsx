import { ActionIcon, Button, Tooltip } from "@mantine/core";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

import {
  ShapeAsscher,
  ShapeBaguette,
  ShapeCushion,
  ShapeEmerald,
  ShapeHeart,
  ShapeMarquise,
  ShapeOval,
  ShapePear,
  ShapeRadiant,
  ShapeRound,
  ShapeTrillion,
} from "@/utils/customSVGs";

export const ShapeFilter = ({
  pillStyle,
  stone,
  selected,
  setSelected,
}: any) => {
  const settingsOptions = [
    { label: "Round", Icon: ShapeRound },
    { label: "Oval", Icon: ShapeOval },
    { label: "Cushion", Icon: ShapeCushion },
    { label: "Radiant", Icon: ShapeRadiant },
    { label: "Emerald", Icon: ShapeEmerald },
    { label: "Asscher", Icon: ShapeAsscher },
    { label: "Pear", Icon: ShapePear },
    { label: "Baguette", Icon: ShapeBaguette },
    { label: "Heart", Icon: ShapeHeart },
    { label: "Marquise", Icon: ShapeMarquise },
    { label: "Trillion", Icon: ShapeTrillion },
  ];

  return (
    <div className="w-full">
      <div className="flex items-center gap-4 w-full">
        {stone !== "Side" && (
          <ActionIcon
            variant="subtle"
            className="prev-btn flex-shrink-0"
            radius="xl"
            size="lg"
            color="gray"
          >
            <IconChevronLeft />
          </ActionIcon>
        )}

        <Swiper
          modules={[Navigation]}
          spaceBetween={12}
          slidesPerView="auto"
          navigation={
            stone === "Side"
              ? false
              : { prevEl: ".prev-btn", nextEl: ".next-btn" }
          }
          style={{ width: "100%" }}
        >
          {settingsOptions.map(({ label, Icon }) => {
            const isSelected = selected?.includes(label);
            return (
              <SwiperSlide key={label} style={{ width: 70 }}>
                <Tooltip label={label} position="bottom" withArrow>
                  <Button
                    onClick={() => setSelected([label])}
                    variant={isSelected ? "default" : "light"}
                    color="gray"
                    radius="md"
                    w={65}
                    h={48}
                    p={2}
                    className="bg-white hover:shadow transition-all"
                    styles={{
                      root: {
                        borderWidth: 1,
                        borderColor: pillStyle
                          ? isSelected
                            ? "e5e7eb"
                            : ""
                          : isSelected
                          ? "white"
                          : "#e5e7eb",
                        backgroundColor: pillStyle
                          ? ""
                          : isSelected
                          ? "#94a5b0"
                          : "#ffffff",
                        boxShadow: isSelected
                          ? "0 2px 6px rgba(0,0,0,0.06)"
                          : "none",
                      },
                    }}
                  >
                    <div className="w-8 h-8 flex items-center justify-center">
                      <Icon
                        fill={
                          pillStyle
                            ? isSelected
                              ? "#000000"
                              : "#4a5565"
                            : isSelected
                            ? "#ffffff"
                            : "#000000"
                        }
                      />
                    </div>
                  </Button>
                </Tooltip>
              </SwiperSlide>
            );
          })}
        </Swiper>

        {stone !== "Side" && (
          <ActionIcon
            variant="subtle"
            className="next-btn flex-shrink-0"
            radius="xl"
            size="lg"
            color="gray"
          >
            <IconChevronRight />
          </ActionIcon>
        )}
      </div>
    </div>
  );
};
