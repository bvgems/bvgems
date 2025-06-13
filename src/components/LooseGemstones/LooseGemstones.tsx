import { Grid, GridCol, Image } from "@mantine/core";
import React from "react";
import { RightSideLooseGemstones } from "./RightSideLooseGemstones";
import { LeftSideLooseGemstones } from "./LeftSideLooseGemstones";

export const LooseGemstones = () => {
  return (
    <div className="p-7 mt-12 h-[500px]">
      <Grid>
        <GridCol span={{ base: 12, md: 4 }}>
          <LeftSideLooseGemstones />
        </GridCol>
        <GridCol span={{ base: 12, md: 8 }}>
          <RightSideLooseGemstones />
        </GridCol>
      </Grid>
    </div>
  );
};
