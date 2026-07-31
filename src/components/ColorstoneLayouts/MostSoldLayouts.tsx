import { Grid, GridCol, Image } from "@mantine/core";
import React, { useEffect } from "react";

export const MostSoldLayouts = () => {
  useEffect(() => {
    
  }, []);
  return (
    <div className="p-10">
      <Grid>
        <GridCol span={{ base: 12, md: 9 }}></GridCol>
        <GridCol span={{ base: 12, md: 3 }}>
          <Image loading="lazy" fit="fill" h={"500px"} src="/assets/monthoffer.webp" />
        </GridCol>
      </Grid>
    </div>
  );
};
