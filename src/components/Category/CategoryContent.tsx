"use client";

import { useEffect, useState } from "react";
import {
  Button,
  Container,
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

export function CategoryContent({
  data,
  shapes,
  allSizes,
}: {
  data: any;
  shapes: string[];
  allSizes: { [key: string]: string[] };
}) {
  const [selectedShape, setSelectedShape] = useState<string | null>(
    shapes?.length ? shapes[0] : null
  );
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [fetchedResult, setFetchedResult] = useState([]);
  const [opened, { open, close }] = useDisclosure(false);

  const router = useRouter();
  const images = data?.images?.edges?.map((item: any) => item.node.url) || [];
  const [mainImage, setMainImage] = useState(images[1] || "");

  const fetchShapesData = async (
    selectedShape: string | null,
    title: string
  ) => {
    const result: any = await getShapesData(selectedShape, title);
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
              <div className="flex flex-col gap-2">
                {images.slice(1, 4).map((img: string, index: number) => (
                  <Image
                    key={index}
                    src={img}
                    h={80}
                    w={80}
                    radius="md"
                    fit="cover"
                    className={`cursor-pointer border transition hover:scale-105 ${
                      mainImage === img ? "border-black" : "border-gray-300"
                    }`}
                    onClick={() => setMainImage(img)}
                  />
                ))}
              </div>

              <div>
                <Image
                  src={mainImage}
                  h={450}
                  w={450}
                  radius="md"
                  fit="contain"
                  className="border border-gray-300"
                />
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

                {selectedShape && (
                  <div className="mt-6">
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
