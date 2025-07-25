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
import { IconDiamond, IconDiamondFilled } from "@tabler/icons-react";
import { colorOptions } from "@/utils/constants";

export function CategoryContent({
  isSapphire,
  data,
  shapes,
  allSizes,
}: {
  isSapphire: boolean;
  data: any;
  shapes: string[];
  allSizes: { [key: string]: string[] };
}) {
  const [selectedShape, setSelectedShape] = useState<string | null>(
    shapes?.length ? shapes[0] : null
  );
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [fetchedResult, setFetchedResult] = useState<any>([]);
  const [opened, { open, close }] = useDisclosure(false);

  const router = useRouter();

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

  const [mainImage, setMainImage] = useState("");

  const fetchShapesData = async (
    selectedShape: string | null,
    title: string
  ) => {
    const result: any = await getShapesData(selectedShape, title);
    setMainImage(result?.data[0]?.image_url);
    imagesArray?.push(mainImage);
    data?.images?.edges?.map((item: any) =>
      imagesArray?.push(item?.node_url)
    ) || [];
    setFetchedResult(result?.data);
  };

  useEffect(() => {
    fetchShapesData(selectedShape, data?.title);
    setSelectedSizes([]);
  }, [selectedShape]);

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
                        <Tooltip label={shape} offset={0}>
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
                {isSapphire ? (
                  <div className="mt-3 py-4">
                    <div className="flex flex-row flex-wrap gap-10 mt-3 items-center">
                      <span className="text-lg">Color:</span>
                      {colorOptions["Sapphire"]?.map(
                        (item: any, index: number) => (
                          <Tooltip
                            label={item?.value}
                            className="cursor-pointer"
                            key={index}
                          >
                            <span className="border border-gray-300 p-2 cursor-pointer">
                              <IconDiamond color={item?.color} size={30} />
                            </span>
                          </Tooltip>
                        )
                      )}
                    </div>
                  </div>
                ) : null}

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
                      data={allSizes[selectedShape]?.map((size) => ({
                        label: size,
                        value: size,
                      }))}
                      value={selectedSizes[0] || null}
                      onChange={(value) =>
                        setSelectedSizes(value ? [value] : [])
                      }
                    />
                  </div>
                )}
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
                        <TableTh>
                          <span className="font-semibold">Hardness</span>
                        </TableTh>
                        <TableTd>
                          <span className=" font-medium">
                            {data?.hardness?.value}
                          </span>
                        </TableTd>
                      </TableTr>

                      <TableTr>
                        <TableTh>
                          {" "}
                          <span className="font-semibold">Toughness</span>
                        </TableTh>
                        <TableTd>{data?.toughness?.value}</TableTd>
                      </TableTr>
                      <TableTr>
                        <TableTh>
                          {" "}
                          <span className="font-semibold">Birthstone</span>
                        </TableTh>
                        <TableTd>
                          <span className="font-medium">
                            {data?.birthstone?.value}
                          </span>
                        </TableTd>
                      </TableTr>
                      <TableTr>
                        <TableTh>
                          {" "}
                          <span className="font-semibold">Zodiac</span>
                        </TableTh>
                        <TableTd>
                          <span className="font-medium">
                            {data?.zodiac?.value ?? "-"}
                          </span>
                        </TableTd>
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
      />
      <SizeToleranceGuide opened={opened} close={close} />
    </>
  );
}
