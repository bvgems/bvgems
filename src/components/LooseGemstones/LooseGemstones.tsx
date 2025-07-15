import { Container, Grid, GridCol, Image } from "@mantine/core";
import React from "react";
import { RightSideLooseGemstones } from "./RightSideLooseGemstones";
import { LeftSideLooseGemstones } from "./LeftSideLooseGemstones";

export const LooseGemstones = () => {
  return (
    <Container size={1250}className="mt-12 h-[400px]">
      <Grid>
        <GridCol span={{ base: 12, md: 4 }}>
          <LeftSideLooseGemstones />
        </GridCol>
        <GridCol span={{ base: 12, md: 8 }}>
          <RightSideLooseGemstones />
        </GridCol>
      </Grid>
    </Container>
  );
};
