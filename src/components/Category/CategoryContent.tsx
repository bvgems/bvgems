"use client";

import { useEffect, useState } from "react";
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
import { Carousel } from "@mantine/carousel";

// Utility: pick one representative image per quality
const getRepresentativeImages = (items: any[]) => {
  const qualityMap: Record<string, any> = {};
  items.forEach((item) => {
    if (!qualityMap[item.quality]) {
      qualityMap[item.quality] = item; // take the first one found
    }
  });
  return Object.values(qualityMap);
};

export function CategoryContent({
  isSapphire,
  isEmerald,
  data,
  shapes,
}: {
  isSapphire: boolean;
  isEmerald: boolean;
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
  const [emeraldShade, setEmeraldShade] = useState<string | null>("Zambian");
  const [fetchedResult, setFetchedResult] = useState<any[]>([]);
  const [allSizes, setAllSizes] = useState<{ [shape: string]: string[] }>({});
  const [opened, { open, close }] = useDisclosure(false);
  const router = useRouter();

  const [qualityImages, setQualityImages] = useState<any[]>([]);
  const [activeSlide, setActiveSlide] = useState(0);

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

    setFetchedResult(result?.data || []);

    // Get one image per quality
    const reps = getRepresentativeImages(result?.data || []);
    setQualityImages(reps);
    setActiveSlide(0); // reset when new data loads
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedShape, selectedSapphireColor]);

  const redirectToEducation = () => {
    router.push(
      `/customer-support/education?activeStone=${data?.title?.toLowerCase()}`
    );
  };

  const currentQuality =
    qualityImages?.[activeSlide]?.quality ??
    (qualityImages?.[0]?.quality || "-");

  return (
    <>
      <div className="mt-9 px-6">
        <Grid>
          {/* Left: Image + Carousel */}
          <GridCol span={{ base: 12, md: 5 }}>
            <motion.div
              initial={{ opacity: 0, y: 80 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
              className="flex gap-4 items-start px-12"
            >
              <div className="w-full">
                {qualityImages.length > 0 ? (
                  <div className="flex flex-col items-center">
                    <Carousel
                      withIndicators
                      height={500}
                      onSlideChange={(index) => setActiveSlide(index)}
                      className="w-full max-w-[420px]"
                    >
                      {qualityImages.map((item: any, index: number) => (
                        <Carousel.Slide key={index}>
                          <div className="flex flex-col items-center">
                            <div className="h-[500px] w-[300px]">
                              <ImageZoom src={item.image_url} />
                            </div>
                          </div>
                        </Carousel.Slide>
                      ))}
                    </Carousel>

                    {/* Constant caption BELOW the image */}
                    <div className="mt-4 flex flex-col items-center">
                      <span className="text-[12px] uppercase tracking-[0.18em] text-gray-500">
                        Quality
                      </span>
                      <span className="mt-1 inline-flex items-center rounded-full border border-gray-200 px-3 py-1 text-sm font-semibold shadow-sm bg-white">
                        {currentQuality}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="h-[300px] w-[300px] bg-gray-100 rounded" />
                )}
              </div>
            </motion.div>
          </GridCol>

          {/* Right: Filters + Info */}
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
                          : parseFloat(size).toFixed(2);
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
                    onChange={(val) => {
                      setTypeFilter(val);
                      if (val !== "Lab Grown") {
                        setEmeraldShade(null);
                      }
                    }}
                    className="w-[50%]"
                    clearable
                  />
                </div>

                {/* Emerald Shade filter */}
                {isEmerald && typeFilter === "Lab Grown" && (
                  <div className="mt-4">
                    <p className="font-medium mb-2 text-gray-700">Shade:</p>
                    <div className="flex gap-4">
                      {["Zambian", "Colombian"].map((shade) => (
                        <button
                          key={shade}
                          onClick={() => setEmeraldShade(shade)}
                          className={`px-5 py-2 rounded-full border text-sm font-semibold transition-all duration-200 cursor-pointer ${
                            emeraldShade === shade
                              ? "bg-green-600 text-white shadow-md scale-105"
                              : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                          }`}
                        >
                          {shade}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

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
        emeraldShade={emeraldShade}
      />
      <SizeToleranceGuide opened={opened} close={close} />
    </>
  );
}
