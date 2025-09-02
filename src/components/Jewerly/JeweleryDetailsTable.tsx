import { STONE_COLORS } from "@/utils/constants";
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

export const JeweleryDetailsAccordion = ({ productData, gemstone }: any) => {
  return (
    <Accordion variant="separated" radius="md" defaultValue={"jewelry-details"}>
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
                <TableTd>{gemstone || "-"}</TableTd>
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
                <TableTd>{STONE_COLORS[gemstone] || "-"}</TableTd>
              </TableTr>

              <TableTr className="text-lg">
                <TableTh>Stone Weight</TableTh>
                <TableTd>{productData?.ct_weight?.value || "-"} ct.</TableTd>
              </TableTr>
              <TableTr className="text-lg">
                <TableTh>Diamond Weight</TableTh>
                <TableTd>
                  {productData?.DiamondWeight?.value || "-"} ct.
                </TableTd>
              </TableTr>
              <TableTr className="text-lg">
                <TableTh>Total Weight</TableTh>
                <TableTd>
                  {" "}
                  {(
                    Number(productData?.ct_weight?.value) +
                    Number(productData?.DiamondWeight?.value)
                  ).toFixed(2) || "-"}{" "}
                  ct.
                </TableTd>
              </TableTr>
              <TableTr className="text-lg">
                <TableTh w={160}>Customization</TableTh>
                <TableTd>
                  <Badge radius={0} size="lg" color={"green"}>
                    YES
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
