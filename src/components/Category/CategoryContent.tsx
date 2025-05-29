"use client";

import { useEffect, useState } from "react";
import {
  Button,
  Container,
  Grid,
  GridCol,
  Image,
  Tooltip,
} from "@mantine/core";
import { getShapesData } from "@/apis/api";
import { CategoryTable } from "./CategoryTable";
import { useDisclosure } from "@mantine/hooks";
import { SizeToleranceGuide } from "../Tolerance/SizeToleranceGuide";

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

  const handleSizeToggle = (size: string) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

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

  return (
    <>
      <Container className="mt-24 bg-white">
        <Grid gutter={{ md: 50 }}>
          <GridCol span={{ base: 12, md: 5 }}>
            <Image
              className="shadow-sm rounded-b-3xl"
              src={data?.image?.src}
              fit="contain"
              h={"400"}
              w={"400"}
            />
          </GridCol>
          <GridCol span={{ base: 12, md: 7 }}>
            <span className="text-3xl font-bold text-violet-800">
              {data?.title}
            </span>
            <div className="w-[600px]">
              <div className="flex flex-row flex-wrap gap-2 mt-9">
                {shapes?.map((shape: string, index: number) => {
                  const isSelected = shape === selectedShape;

                  const shapeImageMap: Record<string, string> = {
                    Round: "/assets/round.png",
                    Oval: "/assets/oval.jpeg",
                    "Princess Cut": "/assets/princess-cut.jpeg",
                    Emerald: "/assets/emerald.jpeg",
                    Pear: "/assets/pear.jpeg",
                    Marquise: "/assets/marquise.jpeg",
                    Cushion: "/assets/cushion.png",
                    Trillion: "/assets/trillion.jpeg",
                    Heart: "/assets/heart.png",
                    "Straight Baguette": "/assets/straight-bugget.jpeg",
                  };

                  const imageSrc = shapeImageMap[shape];

                  if (!imageSrc) {
                    return (
                      <div key={index} className="p-2 bg-gray-200 rounded">
                        {shape}
                      </div>
                    );
                  }

                  return (
                    <div
                      key={index}
                      className="flex flex-col items-center cursor-pointer w-[80px]"
                      onClick={() => setSelectedShape(shape)}
                    >
                      <div className="h-[20px] mb-1 text-sm text-violet-800 font-semibold text-center">
                        {isSelected ? shape : "\u00A0"}
                      </div>

                      <Tooltip label={shape} offset={0}>
                        <Image
                          src={imageSrc}
                          h={80}
                          w={80}
                          className={`transition hover:scale-105
                          }`}
                        />
                      </Tooltip>
                    </div>
                  );
                })}
              </div>
            </div>

            {selectedShape && (
              <div className="mt-6">
                <p className="font-semibold mb-2 text-violet-800">
                  Available Sizes for {selectedShape}:
                </p>
                <div className="flex flex-wrap gap-2">
                  {allSizes[selectedShape]?.map((size: string, i: number) => (
                    <Button
                      key={i}
                      onClick={() => handleSizeToggle(size)}
                      color="violet"
                      variant={
                        selectedSizes.includes(size) ? "filled" : "outline"
                      }
                      size="sm"
                    >
                      {size}
                    </Button>
                  ))}
                </div>
              </div>
            )}
            <div className="mt-3 flex items-center justify-start">
              <Button
                onClick={open}
                variant="transparent"
                size="compact-xs"
                color="violet"
              >
                <span className="underline">See Size Tolerance Guide</span>
              </Button>
            </div>
          </GridCol>
        </Grid>
      </Container>

      <CategoryTable
        fetchedResult={fetchedResult}
        selectedSizes={selectedSizes}
      />
      <SizeToleranceGuide opened={opened} close={close} />
    </>
  );
}
