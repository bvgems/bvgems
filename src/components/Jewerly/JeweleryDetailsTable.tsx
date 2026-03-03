// JeweleryDetailsTable.tsx
"use client";

import { Table, Text, Divider } from "@mantine/core";
import React, { useMemo } from "react";

type Props = {
  productData: any;
  gemstone?: string | null;
  jf: any;
  earringMetafields: any;
  value: any;
};

export const JeweleryDetailsTable = ({
  productData,
  gemstone,
  jf,
  earringMetafields,
  value,
}: Props) => {
  const selectedVariant = productData?.variants?.edges?.filter(
    (v: any) => v?.node?.title === gemstone,
  );

  const gemstoneName = jf?.isRingCategory
    ? productData?.variants?.edges?.length > 1 &&
      selectedVariant &&
      selectedVariant[0]?.node?.metafield?.value
    : productData?.gemstone?.value;

  const stoneWeight = Number(productData?.ct_weight?.value);
  const diamondWeight = Number(productData?.DiamondWeight?.value);

  const totalWeight = useMemo(() => {
    const sum =
      (isNaN(stoneWeight) ? 0 : stoneWeight) +
      (isNaN(diamondWeight) ? 0 : diamondWeight);
    return sum > 0 ? sum.toFixed(2) : "-";
  }, [stoneWeight, diamondWeight]);

  const renderRow = (label: string, val: any) => (
    <Table.Tr>
      <Table.Td width="35%">
        <Text fw={600}>{label}</Text>
      </Table.Td>
      <Table.Td>
        <Text>{val ?? "-"}</Text>
      </Table.Td>
    </Table.Tr>
  );

  return (
    <div className="space-y-3">
      <Table
        // striped
        highlightOnHover
        withRowBorders={false}
        withColumnBorders={false}
      >
        <Table.Tbody>
          {renderRow(
            "Gemstone:",
            gemstoneName ? gemstoneName : productData?.gemstone?.value || "-",
          )}
          {renderRow("Stone Type:", productData?.stoneType?.value || "Natural")}
          {renderRow("Shape:", productData?.shape?.value || "-")}

          {productData?.dimension?.value &&
            renderRow(
              "Dimension:",
              value ? value : `${productData?.dimension?.value} mm`,
            )}

          {/* Divider */}
          <Table.Tr>
            <Table.Td colSpan={2}>
              <Divider />
            </Table.Td>
          </Table.Tr>

          {/* Earrings details */}
          {jf.isEarringCategory && earringMetafields ? (
            <>
              {renderRow("Gemstone Size:", earringMetafields.gemstone_size)}
              {renderRow(
                "Stone Weight:",
                earringMetafields.gemstone_weight
                  ? `${earringMetafields.gemstone_weight} ct.`
                  : "-",
              )}
              {renderRow("Total Carat:", earringMetafields.carat || "-")}
            </>
          ) : (
            <>
              {renderRow(
                "Stone Weight:",
                isNaN(stoneWeight) ? "-" : `${stoneWeight} ct.`,
              )}
              {renderRow(
                "Diamond Weight:",
                isNaN(diamondWeight) ? "-" : `${diamondWeight} ct.`,
              )}
              {renderRow(
                "Total Weight:",
                totalWeight === "-" ? "-" : `${totalWeight} ct.`,
              )}
            </>
          )}
          {productData?.careNotes?.value &&
            renderRow(
              "Other Details:",
              productData?.careNotes?.value && (
                <p className="text-md text-[#0b182d] leading-relaxed mb-2">
                  {(() => {
                    const val = productData.careNotes.value;
                    try {
                      const parsed = JSON.parse(val);
                      return Array.isArray(parsed) ? parsed[0] : parsed;
                    } catch {
                      return val;
                    }
                  })()}
                </p>
              ),
            )}
        </Table.Tbody>
      </Table>
    </div>
  );
};
