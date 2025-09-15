// JeweleryDetailsAccordion.tsx
import { STONE_COLORS } from "@/utils/constants";
import { Accordion, Group, Text, Divider } from "@mantine/core";
import React, { useMemo } from "react";

type Props = {
  productData: any;
  gemstone?: string | null;
  jf: any;
  earringMetafields: any; // single selected option
};

export const JeweleryDetailsAccordion = ({
  productData,
  gemstone,
  jf,
  earringMetafields,
}: Props) => {
  const stoneWeight = Number(productData?.ct_weight?.value);
  const diamondWeight = Number(productData?.DiamondWeight?.value);

  const totalWeight = useMemo(() => {
    const sum =
      (isNaN(stoneWeight) ? 0 : stoneWeight) +
      (isNaN(diamondWeight) ? 0 : diamondWeight);
    return sum > 0 ? sum.toFixed(2) : "-";
  }, [stoneWeight, diamondWeight]);

  const Row = ({ label, value }: { label: string; value: React.ReactNode }) => (
    <Group justify="flex-start" gap="md" wrap="nowrap">
      <Text fw={600} w={180}>
        {label}
      </Text>
      <Text>{value}</Text>
    </Group>
  );

  return (
    <Accordion variant="separated" radius="md" defaultValue={"jewelry-details"}>
      <Accordion.Item value="jewelry-details">
        <Accordion.Control>More Details</Accordion.Control>
        <Accordion.Panel>
          <div className="space-y-3">
            <Row
              label="Gemstone:"
              value={gemstone ? gemstone : productData?.gemstone?.value || "-"}
            />
            <Row
              label="Stone Type:"
              value={productData?.stoneType?.value || "Natural"}
            />
            <Row label="Shape:" value={productData?.shape?.value || "-"} />
            {productData?.dimension?.value && (
              <Row
                label="Dimension:"
                value={productData?.dimension?.value + "mm" || "-"}
              />
            )}
            {/* <Row
              label="Stone Color:"
              value={gemstone ? STONE_COLORS[gemstone] || "-" : "-"}
            /> */}

            <Divider my="xs" />

            {/* Earrings custom details */}
            {jf.isEarringCategory && earringMetafields ? (
              <>
                <Row
                  label="Gemstone Size:"
                  value={earringMetafields.gemstone_size || "-"}
                />
                <Row
                  label="Stone Weight:"
                  value={
                    earringMetafields.gemstone_weight
                      ? `${earringMetafields.gemstone_weight} ct.`
                      : "-"
                  }
                />
                <Row
                  label="Total Carat:"
                  value={earringMetafields.carat || "-"}
                />
              </>
            ) : (
              <>
                <Row
                  label="Stone Weight:"
                  value={
                    isNaN(stoneWeight) ? (
                      "-"
                    ) : (
                      <>
                        {stoneWeight} <span className="ml-1">ct.</span>
                      </>
                    )
                  }
                />
                <Row
                  label="Diamond Weight:"
                  value={
                    isNaN(diamondWeight) ? (
                      "-"
                    ) : (
                      <>
                        {diamondWeight} <span className="ml-1">ct.</span>
                      </>
                    )
                  }
                />
                <Row
                  label="Total Weight:"
                  value={
                    totalWeight === "-" ? (
                      "-"
                    ) : (
                      <>
                        {totalWeight} <span className="ml-1">ct.</span>
                      </>
                    )
                  }
                />
              </>
            )}

            <Divider my="xs" />

            <Row label="Customization:" value="Yes" />
          </div>
        </Accordion.Panel>
      </Accordion.Item>
    </Accordion>
  );
};
