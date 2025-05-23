import { Drawer, Grid, GridCol, Image, Text } from "@mantine/core";
import React, { useEffect, useState } from "react";
import { GemStonesShapes } from "./GemStonesShapes";
import { ToleranceTable } from "./ToleranceTable";
import { getTolerance } from "@/apis/api";

export const SizeToleranceGuide = ({ opened, close }: any) => {
  const [toleranceContent, setToleranceContent] = useState<any>();
  const [activeSegment, setActiveSegment] = useState("round-princess-cushion");

  useEffect(() => {
    fetchSizeTolerance(activeSegment);
  }, [activeSegment]);

  const fetchSizeTolerance = async (activeSegment: any) => {
    const response = await getTolerance(activeSegment);

    const data = JSON.parse(response.collection.toleranceTable.value);
    setToleranceContent(data);
  };

  return (
    <Drawer
      opened={opened}
      onClose={close}
      title={
        <div className="font-semibold text-xl ml-3 text-violet-800">
          Gemstone Tolerances
        </div>
      }
      overlayProps={{
        style: {
          backdropFilter: "blur(3px)",
        },
      }}
      size={"60rem"}
      position="right"
    >
      <Grid gutter={{ md: 80 }}>
        <GridCol span={{ base: 12, md: 4 }}>
          <GemStonesShapes
            activeSegment={activeSegment}
            setActiveSegment={setActiveSegment}
          />
        </GridCol>
        <GridCol span={{ base: 12, md: 8 }}>
          <ToleranceTable
            activeSegment={activeSegment}
            setActiveSegment={setActiveSegment}
            toleranceContent={toleranceContent}
          />
        </GridCol>
      </Grid>
    </Drawer>
  );
};
