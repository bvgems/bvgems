"use client";

import { Grid, GridCol, Tooltip, Button, ActionIcon } from "@mantine/core";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { ShapeFilter } from "../CommonComponents/ShapeFilter";

export const StoneFilter = ({
  stone,
  selected,
  setSelected,
  pillStyle = false,
}: any) => {
  return (
    <>
      {pillStyle ? (
        <div>
          <ShapeFilter
            pillStyle={pillStyle}
            stone={stone}
            selected={selected}
            setSelected={setSelected}
          />
        </div>
      ) : (
        <Grid align="center">
          <GridCol span={{ base: 12, md: stone === "Side" ? 1 : 2 }}>
            <div className="text-gray-700 font-medium text-base">
              {stone} Stone
            </div>
          </GridCol>

          <GridCol span={{ base: 12, md: stone === "Side" ? 11 : 10 }}>
            <ShapeFilter
              stone={stone}
              selected={selected}
              setSelected={setSelected}
            />
          </GridCol>
        </Grid>
      )}
    </>
  );
};
