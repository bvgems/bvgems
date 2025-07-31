import {
  Accordion,
  Badge,
  Table,
  TableTbody,
  TableTd,
  TableTh,
  TableTr,
} from "@mantine/core";
import React from "react";

export const JeweleryDetailsAccordion = ({ productData }: any) => {
  return (
    <Accordion variant="separated" radius="md">
      <Accordion.Item value="jewelry-details">
        <Accordion.Control>Jewelry Details</Accordion.Control>
        <Accordion.Panel>
          <Table
            horizontalSpacing="lg"
            withRowBorders={false}
            variant="vertical"
            layout="fixed"
          >
            <TableTbody>
              <TableTr className="text-lg">
                <TableTh w={160}>Gemstone</TableTh>
                <TableTd>{productData?.gemstone?.value || "-"}</TableTd>
              </TableTr>
              <TableTr className="text-lg">
                <TableTh w={160}>Type</TableTh>
                <TableTd>{productData?.stoneType?.value || "-"}</TableTd>
              </TableTr>
              <TableTr className="text-lg">
                <TableTh w={160}>Shape</TableTh>
                <TableTd>{productData?.shape?.value || "-"}</TableTd>
              </TableTr>
              <TableTr className="text-lg">
                <TableTh w={160}>Stone Color</TableTh>
                <TableTd>{productData?.color?.value || "-"}</TableTd>
              </TableTr>
              <TableTr className="text-lg">
                <TableTh>Stone Size</TableTh>
                <TableTd>All Sizes Available</TableTd>
              </TableTr>
              <TableTr className="text-lg">
                <TableTh>Stone Wg.</TableTh>
                <TableTd>{productData?.ct_weight?.value || "-"}</TableTd>
              </TableTr>
              <TableTr className="text-lg">
                <TableTh>Diamond Size</TableTh>
                <TableTd>-</TableTd>
              </TableTr>
              <TableTr className="text-lg">
                <TableTh>Total Wg.</TableTh>
                <TableTd>-</TableTd>
              </TableTr>
              <TableTr className="text-lg">
                <TableTh w={160}>Customization</TableTh>
                <TableTd>
                  <Badge
                    radius={0}
                    size="lg"
                    color={productData?.customization?.value ? "green" : "red"}
                  >
                    {productData?.customization?.value ? "YES" : "NO"}
                  </Badge>
                </TableTd>
              </TableTr>
            </TableTbody>
          </Table>
        </Accordion.Panel>
      </Accordion.Item>
    </Accordion>
  );
};
