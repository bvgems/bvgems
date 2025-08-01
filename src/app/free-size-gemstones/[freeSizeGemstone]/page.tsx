"use client";
import { FreeSizeFilterSideBar } from "@/components/FreeSizeGemtones/FreeSizeFilterSideBar";
import { GridView } from "@/components/GridView/GridView";
import { Divider, Drawer, Grid, GridCol } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { usePathname } from "next/navigation";
import React, { useState } from "react";

export default function FreeSizeGemstoneSelection() {
  const path = usePathname();

  const [drawerOpened, { open, close }] = useDisclosure(false);

  const segments = path.split("/").filter(Boolean);
  const gemstoneType = segments[1];
    const [selectedStones, setSelectedStones] = useState<string[]>([]);
  

  console.log("Gemstone Type:", gemstoneType);

  return (
    <div>
      <Grid gutter="lg">
        <GridCol span={{ base: 12, md: 3 }} className="hidden lg:flex">
          <FreeSizeFilterSideBar
            selectedStones={selectedStones}
            setSelectedStones={(value: any) => {
              setSelectedStones(value);
            //   setFiltersChanged(true);
            }}
            // selectedColors={selectedColors}
            // setSelectedColors={(value: any) => {
            //   setSelectedColors(value);
            //   setFiltersChanged(true);
            // }}
            // selectedShapes={selectedShapes}
            // setSelectedShapes={(value: any) => {
            //   setSelectedShapes(value);
            //   setFiltersChanged(true);
            // }}
            // length={length}
            // setLength={(value: any) => {
            //   setLength(value);
            //   setFiltersChanged(true);
            // }}
            // width={width}
            // setWidth={(value: any) => {
            //   setWidth(value);
            //   setFiltersChanged(true);
            // }}
            // priceRange={priceRange}
            // setPriceRange={(value: any) => {
            //   setPriceRange(value);
            //   setFiltersChanged(true);
            // }}
            // selectedRoundSizes={selectedRoundSizes}
            // setSelectedRoundSizes={(value: any) => {
            //   setSelectedRoundSizes(value);
            //   setFiltersChanged(true);
            // }}
            // color={color}
          />
          <Divider orientation="vertical" />
        </GridCol>

        <GridCol span={{ base: 12, md: 9 }}>
          {/* <GridView
            gemstones={filteredGemstones}
            loadingTrigger={filterTrigger}
          /> */}
        </GridCol>
      </Grid>

      <Drawer
        opened={drawerOpened}
        onClose={close}
        title="Filter Gemstones"
        padding="md"
        size={320}
        overlayProps={{ opacity: 0.3, blur: 3 }}
        hiddenFrom="lg"
        withinPortal={false}
      >
        <FreeSizeFilterSideBar
        //   selectedStones={selectedStones}
        //   setSelectedStones={(value: any) => {
        //     setSelectedStones(value);
        //     setFiltersChanged(true);
        //   }}
        //   selectedColors={selectedColors}
        //   setSelectedColors={(value: any) => {
        //     setSelectedColors(value);
        //     setFiltersChanged(true);
        //   }}
        //   selectedShapes={selectedShapes}
        //   setSelectedShapes={(value: any) => {
        //     setSelectedShapes(value);
        //     setFiltersChanged(true);
        //   }}
        //   length={length}
        //   setLength={(value: any) => {
        //     setLength(value);
        //     setFiltersChanged(true);
        //   }}
        //   width={width}
        //   setWidth={(value: any) => {
        //     setWidth(value);
        //     setFiltersChanged(true);
        //   }}
        //   priceRange={priceRange}
        //   setPriceRange={(value: any) => {
        //     setPriceRange(value);
        //     setFiltersChanged(true);
        //   }}
        //   selectedRoundSizes={selectedRoundSizes}
        //   setSelectedRoundSizes={(value: any) => {
        //     setSelectedRoundSizes(value);
        //     setFiltersChanged(true);
        //   }}
        //   color={color}
        />
      </Drawer>
    </div>
  );
}
