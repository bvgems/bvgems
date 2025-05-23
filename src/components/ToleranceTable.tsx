import { Table, TableTd, TableTh, TableThead, TableTr } from "@mantine/core";
import React from "react";

export const ToleranceTable = ({ toleranceContent }: any) => {
  let rows: any;

  if (toleranceContent?.length) {
    rows = toleranceContent.map((value: any, index: number) => (
      <TableTr key={index}>
        <TableTd>{value.size}</TableTd>
        <TableTd>{value.mm_range}</TableTd>
        <TableTd>{value.tolerance}</TableTd>
      </TableTr>
    ));
  }

  return (
    <div className="p-8">
      <Table
        striped
        highlightOnHover
        highlightOnHoverColor="#E5DBFF"
        horizontalSpacing={"xl"}
        verticalSpacing={"sm"}
      >
        <TableThead className="uppercase text-violet-800">
          <TableTr>
            <TableTh>Size</TableTh>
            <TableTh>MM Range</TableTh>
            <TableTh>Tolerance</TableTh>
          </TableTr>
        </TableThead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
    </div>
  );
};
