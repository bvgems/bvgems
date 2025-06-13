import {
  Button,
  Divider,
  NumberInput,
  Select,
  Table,
  TableTbody,
  TableTd,
  TableTh,
  TableTr,
} from "@mantine/core";
import { IconDiamond, IconTruckDelivery } from "@tabler/icons-react";
import React from "react";

export const JewerlyProductDetails = ({ productData }: any) => {
  return (
    <div className="px-9 flex flex-col gap-4">
      <h1 className="uppercase text-[2rem] leading-relaxed tracking-wide">
        {productData?.title}
      </h1>
      <div className="text-[1.9rem] text-gray-700 font-bold">
        <div className="flex items-center gap-4">
          <span style={{ fontFamily: "system-ui, sans-serif" }}>
            $ {productData?.variants?.edges[0]?.node?.price?.amount}{" "}
            {productData?.variants?.edges[0]?.node?.price?.currencyCode}
          </span>
          <span
            style={{ fontFamily: "system-ui, sans-serif" }}
            className="line-through text-gray-400 font-sans"
          >
            ${" "}
            {Number(productData?.variants?.edges[0]?.node?.price?.amount) +
              2000}{" "}
            {productData?.variants?.edges[0]?.node?.price?.currencyCode}
          </span>
        </div>
      </div>
      <Divider />
      <p className="text-lg mt-2 pb-1.5">{productData?.description}</p>
      <div className="">
        <Table
          horizontalSpacing={"lg"}
          withRowBorders={false}
          variant="vertical"
          layout="fixed"
        >
          <TableTbody>
            <TableTr className="text-lg">
              <TableTh w={160}>Stone Color</TableTh>
              <TableTd>-</TableTd>
            </TableTr>

            <TableTr className="text-lg">
              <TableTh>Stone Size</TableTh>
              <TableTd>-</TableTd>
            </TableTr>

            <TableTr className="text-lg">
              <TableTh>Stone Wg.</TableTh>
              <TableTd>-</TableTd>
            </TableTr>

            <TableTr className="text-lg">
              <TableTh>Diamond Size</TableTh>
              <TableTd>-</TableTd>
            </TableTr>

            <TableTr className="text-lg">
              <TableTh>Total Wg.</TableTh>
              <TableTd>-</TableTd>
            </TableTr>
          </TableTbody>
        </Table>
      </div>
      <div className="flex gap-4 w-full">
        <Select
          className="flex-1"
          leftSection={<IconDiamond size={20} />}
          label="Select Gold Color"
          placeholder="Gold color"
          data={["Rose Gold", "White Gold", "Yellow Gold"]}
          styles={{
            input: {
              padding: "22px 35px",
              backgroundColor: "#dbdddf",
            },
          }}
        />
        <NumberInput
          className="flex-1"
          label="Quantity"
          min={1}
          defaultValue={1}
          allowNegative={false}
          radius={0}
          styles={{
            input: {
              padding: "22px 15px",
              backgroundColor: "#dbdddf",
            },
          }}
        />
      </div>

      <div className="mt-3 flex flex-col gap-2">
        <Button color="#99a1af">ADD TO CART</Button>
        <Button color="#99a1af">BUY NOW</Button>
      </div>
      <div className="flex items-center justify-end text-gray-500">
        <IconTruckDelivery size={20} />
        <span className="ml-1.5">Estimated delivery: 4 Days</span>
      </div>
    </div>
  );
};
