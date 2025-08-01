"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Button,
  Grid,
  GridCol,
  Image,
  Tooltip,
  Select,
  Table,
  TableTbody,
  TableTr,
  TableTh,
  TableTd,
} from "@mantine/core";
import { motion } from "framer-motion";
import { getShapesData } from "@/apis/api";
import { CategoryTable } from "./CategoryTable";
import { useDisclosure } from "@mantine/hooks";
import { SizeToleranceGuide } from "../Tolerance/SizeToleranceGuide";
import { useRouter } from "next/navigation";
import { ImageZoom } from "../CommonComponents/ImageZoom";
import { IconDiamond } from "@tabler/icons-react";
import { SapphireLooseGemstoneColorOptions } from "@/utils/constants";

export function CategoryContent({
  isSapphire,
  data,
  shapes,
}: {
  isSapphire: boolean;
  data: any;
  shapes: string[];
}) {
  const [selectedShape, setSelectedShape] = useState<string | null>(
    shapes?.length ? shapes[0] : null
  );
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [typeFilter, setTypeFilter] = useState<string | null>(null);
  const [selectedSapphireColor, setSelectedSapphireColor] = useState(
    SapphireLooseGemstoneColorOptions[0]?.value
  );
  const [fetchedResult, setFetchedResult] = useState<any[]>([]);
  const [allSizes, setAllSizes] = useState<{ [shape: string]: string[] }>({});
  const [opened, { open, close }] = useDisclosure(false);
  const router = useRouter();
  const [mainImage, setMainImage] = useState("");

  const fetchShapesData = async (
    selectedShape: string | null,
    title: string,
    isSapphire: boolean,
    sapphireColor: string
  ) => {
    const result: any = await getShapesData(
      selectedShape,
      title,
      isSapphire,
      sapphireColor
    );

    const shape = selectedShape || "default";
    const uniqueSizes = Array.from(
      new Set(result?.data?.map((item: any) => item.size))
    ).sort((a: any, b: any) => parseFloat(a) - parseFloat(b));

    setAllSizes((prev: any) => ({
      ...prev,
      [shape]: uniqueSizes,
    }));

    setMainImage(result?.data?.[0]?.image_url);
    setFetchedResult(result?.data);
  };

  useEffect(() => {
    if (selectedShape) {
      fetchShapesData(
        selectedShape,
        data?.title,
        isSapphire,
        selectedSapphireColor
      );
      setSelectedSizes([]);
    }
  }, [selectedShape, selectedSapphireColor]);

  const imagesArray = useMemo(() => {
    const array: string[] = [];
    if (fetchedResult?.[0]?.image_url) {
      array.push(fetchedResult[0].image_url);
    }
    data?.images?.edges?.forEach((item: any) => {
      if (item?.node?.url) array.push(item.node.url);
    });
    return array;
  }, [fetchedResult, data]);

  const redirectToEducation = () => {
    router.push(
      `/customer-support/education?activeStone=${data?.title?.toLowerCase()}`
    );
  };

  return (
    <>
      <div className="mt-9 px-6">
        <Grid>
          <GridCol span={{ base: 12, md: 5 }}>
            <motion.div
              initial={{ opacity: 0, y: 80 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
              className="flex gap-4 items-start px-12"
            >
              <div>
                {mainImage ? (
                  <ImageZoom src={mainImage} />
                ) : (
                  <div className="h-[300px] w-[300px] bg-gray-100 rounded" />
                )}
              </div>
            </motion.div>
          </GridCol>

          <GridCol span={{ base: 12, md: 7 }}>
            <motion.div
              initial={{ opacity: 0, y: 80 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
            >
              <div className="px-4 flex flex-col gap-4">
                <h1 className="uppercase text-[2rem] font-bold tracking-wide">
                  {data?.title}
                </h1>

                {/* Shape options */}
                <div className="flex flex-wrap gap-3 mt-4">
                  {shapes?.map((shape: string, index: number) => {
                    const isSelected = shape === selectedShape;
                    const shapeImageMap: Record<string, string> = {
                      Round: "/assets/round.svg",
                      Oval: "/assets/oval.svg",
                      "Princess Cut": "/assets/princesscut.svg",
                      Emerald: "/assets/emerald.svg",
                      Pear: "/assets/pear.svg",
                      Marquise: "/assets/marquise.svg",
                      Cushion: "/assets/cushion.svg",
                      Trillion: "/assets/trillion.svg",
                      Heart: "/assets/heart.svg",
                      "Straight Baguette": "/assets/baguette.svg",
                    };

                    const imageSrc = shapeImageMap[shape];

                    return (
                      <div
                        key={index}
                        className="flex flex-col items-center cursor-pointer"
                        onClick={() => setSelectedShape(shape)}
                      >
                        <Tooltip label={shape}>
                          <Image
                            src={imageSrc}
                            h={50}
                            w={50}
                            fit="fill"
                            className={`rounded border ${
                              isSelected ? "border-black" : "border-gray-300"
                            }`}
                          />
                        </Tooltip>
                      </div>
                    );
                  })}
                </div>

                {/* Sapphire color filter */}
                {isSapphire && (
                  <div className="mt-3 py-4">
                    <div className="flex flex-row flex-wrap gap-8 mt-3 items-center">
                      <span className="text-lg">Color:</span>
                      {SapphireLooseGemstoneColorOptions?.map(
                        (item: any, index: number) => (
                          <Tooltip label={item?.value} key={index}>
                            <span
                              onClick={() =>
                                setSelectedSapphireColor(item?.value)
                              }
                              className={`p-2 border rounded cursor-pointer ${
                                selectedSapphireColor === item?.value
                                  ? "border-black"
                                  : "border-gray-300"
                              }`}
                            >
                              <IconDiamond color={item?.color} size={30} />
                            </span>
                          </Tooltip>
                        )
                      )}
                    </div>
                  </div>
                )}

                {selectedShape && (
                  <div className="mt-3">
                    <p className="font-medium mb-2 text-gray-700">
                      Select Size for {selectedShape}:
                    </p>
                    <Select
                      className="w-[50%]"
                      searchable
                      clearable
                      placeholder="Choose size"
                      data={allSizes[selectedShape]?.map((size: string) => {
                        const label = size.includes("x")
                          ? size
                              .replace(/x/g, " x ")
                              .replace(/\s+/g, " ")
                              .trim()
                          : parseFloat(size).toFixed(2); // format single number to 2 decimals
                        return {
                          label,
                          value: size,
                        };
                      })}
                      value={selectedSizes[0] || null}
                      onChange={(value) =>
                        setSelectedSizes(value ? [value] : [])
                      }
                    />
                  </div>
                )}

                {/* Type filter */}
                <div className="mt-4">
                  <p className="font-medium mb-2 text-gray-700">
                    Natural / Lab:
                  </p>
                  <Select
                    placeholder="Select Type"
                    data={[
                      { label: "All", value: "" },
                      { label: "Natural", value: "Natural" },
                      { label: "Lab Grown", value: "Lab Grown" },
                    ]}
                    value={typeFilter || ""}
                    onChange={(val) => setTypeFilter(val)}
                    className="w-[50%]"
                    clearable
                  />
                </div>

                {/* Static Info Table */}
                <div className="mt-3 max-w-[350px]">
                  <h1>Additional Information</h1>
                  <Table
                    className="mt-2.5"
                    variant="vertical"
                    layout="fixed"
                    striped
                  >
                    <TableTbody>
                      <TableTr>
                        <TableTh>Hardness</TableTh>
                        <TableTd>{data?.hardness?.value}</TableTd>
                      </TableTr>
                      <TableTr>
                        <TableTh>Toughness</TableTh>
                        <TableTd>{data?.toughness?.value}</TableTd>
                      </TableTr>
                      <TableTr>
                        <TableTh>Birthstone</TableTh>
                        <TableTd>{data?.birthstone?.value}</TableTd>
                      </TableTr>
                      <TableTr>
                        <TableTh>Zodiac</TableTh>
                        <TableTd>{data?.zodiac?.value ?? "-"}</TableTd>
                      </TableTr>
                    </TableTbody>
                  </Table>
                </div>

                <div>
                  <Button
                    onClick={open}
                    variant="transparent"
                    size="sm"
                    color="gray"
                    mt={10}
                  >
                    <span className="underline">See Size Tolerance Guide</span>
                  </Button>
                  <Button
                    onClick={redirectToEducation}
                    variant="transparent"
                    size="sm"
                    color="gray"
                    mt={10}
                  >
                    <span className="underline">
                      Learn More About {data?.title}
                    </span>
                  </Button>
                </div>
              </div>
            </motion.div>
          </GridCol>
        </Grid>
      </div>

      <CategoryTable
        fetchedResult={fetchedResult}
        selectedSizes={selectedSizes}
        data={data}
        typeFilter={typeFilter}
      />
      <SizeToleranceGuide opened={opened} close={close} />
    </>
  );
}
