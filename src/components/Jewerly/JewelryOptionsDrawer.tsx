import { Divider, Image, NumberFormatter } from "@mantine/core";
import { useRouter } from "next/navigation";
import React from "react";

export const JewelryOptionsDrawer = ({
  selectedShape,
  productData,
  category,
  close,
  open,
}: any) => {
  const router = useRouter();

  return (
    <div className="">
      <h1 className="text-2xl px-6 pb-6 text-center">
        More Options For This Design
      </h1>

      <div
        onClick={() => {
          close();
          open();
        }}
        className="text-md underline cursor-pointer flex justify-center mt-10"
      >
        Want this style with your favorite gemstone? Start here.
      </div>
    </div>
  );
};
