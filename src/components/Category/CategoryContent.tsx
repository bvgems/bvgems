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
  Breadcrumbs,
  Anchor,
  Badge,
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
import Script from "next/script";

// Utility: pick one representative image per quality
const getRepresentativeImages = (items: any[]) => {
  const qualityMap: Record<string, any> = {};
  items.forEach((item) => {
    if (!qualityMap[item.quality]) {
      qualityMap[item.quality] = item;
    }
  });

  // Enforce order B -> A -> AA -> Lab Grown
  const order = ["B", "A", "AA", "Lab Grown"];
  return order.map((q) => qualityMap[q]).filter((item) => item !== undefined);
};

export function CategoryContent({
  isSapphire,
  isEmerald,
  data,
  shapes,
  handle,
}: {
  isSapphire: boolean;
  isEmerald: boolean;
  data: any;
  shapes: string[];
  handle: any;
}) {
  const shapeOrder = [
    "Round",
    "Oval",
    "Emerald Cut",
    "Pear",
    "Princess Cut",
    "Marquise",
    "Heart",
    "Straight Baguette",
    "Cushion",
    "Trillion",
  ];
  const sortedShapes = [...(shapes || [])].sort(
    (a, b) => shapeOrder.indexOf(a) - shapeOrder.indexOf(b)
  );
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
  const [shaedImages, setShadeImages] = useState<any>([]);
  const [qualityImages, setQualityImages] = useState<any[]>([]);
  const [activeSlide, setActiveSlide] = useState(0);
  const setEmeraldShaedImages = (data: any) => {
    if (!Array.isArray(data)) return;

    const matched = data.find(
      (item: any) =>
        item?.type === "Lab Grown" &&
        item?.collection_slug === "Emerald" &&
        Array.isArray(item?.extra_images) &&
        item.extra_images.length > 0
    );

    if (matched) {
      // Ensure Z (Zambian) always comes first, C (Colombian) second
      const sortedImages = [...matched.extra_images].sort(
        (a: string, b: string) => {
          if (a.includes("_Z") && !b.includes("_Z")) return -1;
          if (b.includes("_Z") && !a.includes("_Z")) return 1;
          return 0;
        }
      );

      setShadeImages(sortedImages);
    } else {
      setShadeImages([]);
    }
  };

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
    console.log("resss", result);

    const shape = selectedShape || "default";
    const uniqueSizes = Array.from(
      new Set(result?.data?.map((item: any) => item.size))
    ).sort((a: any, b: any) => parseFloat(a) - parseFloat(b));

    setAllSizes((prev: any) => ({
      ...prev,
      [shape]: uniqueSizes,
    }));

    setFetchedResult(result?.data || []);
    setEmeraldShaedImages(result?.data);

    // Get one image per quality in fixed order
    const reps = getRepresentativeImages(result?.data || []);
    setQualityImages(reps);
    setActiveSlide(0);
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

  const uniqueTypes = Array.from(
    new Set(fetchedResult?.map((item: any) => item.type))
  );

  const getQuality = () => {
    switch (data?.title) {
      case "Alexandrite":
        return "Lab Grown Quality ";

      case "Amethyst":
        return "A Quality ";

      case "Aquamarine":
        return "AA And AAA Quality ";

      case "Citrine":
        return "AA Quality ";

      case "Emerald":
        return "All Natural and Lab Grown Quality ";

      case "Morganite":
        return "A Quality ";

      case "Amethyst":
        return "A Quality ";

      case "Peridot":
        return "A Quality ";

      case "Ruby":
        return "All Natural and Lab Grown Quality ";

      case "Sapphire":
        return "All Natural and Lab Grown Quality ";
      case "Tanzanite":
        return "AA Quality ";

      default:
        break;
    }
  };

  const getItemQuality = (item: any) => {
    return item?.quality || "";
  };

  const breadcrumbItems = [
    { title: "Home", href: "/" },
    { title: "Calibrated Faceted Gemstones", href: "/loose-gemstones" },
    { title: data?.title || handle, href: `/loose-gemstones/${handle}` },
  ].map((item, index) => (
    <Anchor
      size="sm"
      href={item.href}
      key={index}
      className="text-gray-600 hover:text-black"
    >
      {item.title}
    </Anchor>
  ));
  return (
    <>
      <div className="mt-9 px-6">
        <Breadcrumbs separator="›" className="mb-6">
          {breadcrumbItems}
        </Breadcrumbs>
        <Grid>
          {/* Left: Image + Carousel */}
          <GridCol span={{ base: 12, md: 6 }}>
            <motion.div
              initial={{ opacity: 0, y: 80 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
              className="flex gap-4 items-start px-12"
            >
              <div className="w-full">
                {qualityImages.length > 0 ? (
                  <div className="flex flex-col items-center">
                    {/* Main Carousel */}
                    <Carousel
                      withIndicators
                      height={400}
                      onSlideChange={(index) => setActiveSlide(index)}
                      className="w-full max-w-[420px]"
                      slideGap="md"
                      // align="center"
                      slideSize="100%"
                      initialSlide={activeSlide}
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

                    {/* Thumbnails */}
                    <div className="mt-4 flex gap-4 flex-wrap justify-center">
                      {qualityImages
                        .filter((item: any) => item?.is_available === true)
                        .map((item: any, index: number) => (
                          <div
                            key={index}
                            className={`flex flex-col items-center cursor-pointer border rounded-lg p-2 transition-all ${
                              activeSlide === index
                                ? "border-black shadow-md"
                                : "border-gray-300"
                            }`}
                            onClick={() => setActiveSlide(index)}
                          >
                            <Image
                              src={item.image_url}
                              h={70}
                              w={70}
                              fit="contain"
                              className="rounded"
                            />
                            <span className="text-xs font-medium mt-1">
                              {getItemQuality(item)}
                            </span>
                          </div>
                        ))}
                    </div>
                  </div>
                ) : (
                  <div className="h-[300px] w-[300px] bg-gray-100 rounded" />
                )}
              </div>
            </motion.div>
            {isEmerald &&
            shaedImages.length > 0 &&
            (typeFilter === "Lab Grown" ||
              getItemQuality(qualityImages[activeSlide]) === "Lab Grown") ? (
              <div className="mt-10">
                <h3 className="text-xl font-bold text-gray-800 mb-6 tracking-wide text-center">
                  Lab Emerald Shade Variations
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-3xl mx-auto">
                  {/* Zambian */}
                  <div className="flex flex-col items-center p-5 bg-white rounded-2xl shadow-md hover:shadow-lg transition">
                    <div className="h-[140px] w-[140px] flex items-center justify-center">
                      <Image
                        src={shaedImages[0]}
                        fit="contain"
                        radius="md"
                        className="object-contain rounded-xl"
                      />
                    </div>
                    <span className="mt-4 text-lg font-semibold text-gray-900">
                      Zambian
                    </span>
                    <p className="mt-2 text-sm text-gray-600 leading-relaxed text-center">
                      Darker, rich, and saturated forest green hue. Known for
                      its depth and intensity.
                    </p>
                  </div>

                  {/* Colombian */}
                  {shaedImages[1] && (
                    <div className="flex flex-col items-center p-5 bg-white rounded-2xl shadow-md hover:shadow-lg transition">
                      <div className="h-[140px] w-[140px] flex items-center justify-center">
                        <Image
                          src={shaedImages[1]}
                          fit="contain"
                          radius="md"
                          className="object-contain rounded-xl"
                        />
                      </div>
                      <span className="mt-4 text-lg font-semibold text-gray-900">
                        Colombian
                      </span>
                      <p className="mt-2 text-sm text-gray-600 leading-relaxed text-center">
                        Lighter and brighter green hue with vibrant brilliance
                        and sparkle.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ) : null}
          </GridCol>

          <GridCol span={{ base: 12, md: 6 }}>
            <motion.div
              initial={{ opacity: 0, y: 80 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
            >
              <div className="px-4 flex flex-col gap-4">
                <h1 className="text-[1.5rem] font-bold tracking-wide">
                  Calibrated Faceted Loose {data?.title} Gemstones – Natural &
                  Lab Grown Calibrated Stones
                </h1>
                <div className="flex justify-end gap-2 mt-2">
                  {uniqueTypes.map((t: string, index: number) => (
                    <Badge
                      key={index}
                      color={t === "Natural" ? "green" : "blue"}
                      radius="xs"
                    >
                      {t}
                    </Badge>
                  ))}
                </div>

                <div className="flex flex-wrap gap-3 mt-4">
                  {sortedShapes?.map((shape: string, index: number) => {
                    const isSelected = shape === selectedShape;
                    const shapeImageMap: Record<string, string> = {
                      Round: "/assets/round.svg",
                      Oval: "/assets/oval.svg",
                      "Emerald Cut": "/assets/emerald.svg",
                      Pear: "/assets/pear.svg",
                      "Princess Cut": "/assets/princesscut.svg",
                      Marquise: "/assets/marquise.svg",
                      Heart: "/assets/heart.svg",
                      "Straight Baguette": "/assets/baguette.svg",
                      Cushion: "/assets/cushion.svg",
                      Trillion: "/assets/trillion.svg",
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
                              {/* <IconDiamond color={item?.color} size={30} /> */}
                              <Image src={item?.image} h={40} w={40} />
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
                <p className="text-gray-700 leading-relaxed mt-4">
                  {data?.title} gemstones are prized for their rarity,
                  brilliance, and versatility. At B.V. Gems in New York’s
                  Diamond District, we offer {getQuality()}
                  {data?.title.toLowerCase()} gemstones in calibrated sizes for
                  rings, necklaces, earrings, and custom jewelry. Each stone is
                  ethically sourced and inspected for quality, ensuring
                  brilliance and durability.
                </p>

                {/* Static Info Table */}
                <div className="mt-3 max-w-[500px]">
                  <h1 className="text-lg font-semibold mb-3">
                    Additional Information
                  </h1>
                  <Table
                    className="mt-2.5 border rounded-lg shadow-sm"
                    verticalSpacing="sm"
                    striped
                    highlightOnHover
                  >
                    <TableTbody>
                      <TableTr>
                        <TableTh className="w-[120px]">Treatment</TableTh>
                        <TableTd>{data?.toughness?.value}</TableTd>
                      </TableTr>
                      <TableTr>
                        <TableTh className="w-[120px]">Hardness</TableTh>
                        <TableTd>{data?.hardness?.value}</TableTd>
                      </TableTr>
                      <TableTr>
                        <TableTh className="w-[120px]">Chemical</TableTh>
                        <TableTd>
                          {handle === "alexandrite"
                            ? "Chrysoberyl"
                            : handle === "sapphire"
                            ? "Corundum"
                            : handle === "emerald"
                            ? "Beryl"
                            : handle === "ruby"
                            ? "Corundum"
                            : "-"}
                        </TableTd>
                      </TableTr>
                    </TableTbody>
                  </Table>

                  <div className="mt-6">
                    <h2 className="text-base font-semibold text-gray-800 mb-3">
                      Quality Grades
                    </h2>
                    <Table
                      className="border rounded-lg shadow-sm"
                      verticalSpacing="sm"
                      striped
                    >
                      <TableTbody>
                        <TableTr>
                          <TableTh className="w-[100px]">B</TableTh>
                          <TableTd>
                            Minimal to moderate color zoning, moderate
                            inclusions, decent cutting, typically opaque;
                            commercial quality
                          </TableTd>
                        </TableTr>
                        <TableTr>
                          <TableTh>A</TableTh>
                          <TableTd>
                            Good color, good cut, minimal zoning, good
                            brilliance, minimal inclusion, more transparent
                          </TableTd>
                        </TableTr>
                        <TableTr>
                          <TableTh>AA</TableTh>
                          <TableTd>
                            Eye clean, open color, great cutting, zero to
                            minimal zoning, good polish, transparent
                          </TableTd>
                        </TableTr>
                        <TableTr>
                          <TableTh>Lab Grown</TableTh>
                          <TableTd>
                            Zero inclusions, excellent color, excellent cutting,
                            excellent polish, optically perfect.
                          </TableTd>
                        </TableTr>
                      </TableTbody>
                    </Table>
                  </div>
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
      <Script
        id="product-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org/",
            "@type": "Product",
            name: `${data?.title} Gemstones`,
            image: qualityImages.map((item: any) => item.image_url),
            description: `Natural & lab-grown ${data?.title} gemstones in calibrated sizes from B.V. Gems, NYC Diamond District.`,
            brand: { "@type": "Brand", name: "B.V. Gems" },
            offers: {
              "@type": "AggregateOffer",
              url: `https://bvgems.com/loose-gemstones/${handle}`,
              priceCurrency: "USD",
              lowPrice: fetchedResult?.[0]?.price || "100",
              highPrice:
                fetchedResult?.[fetchedResult.length - 1]?.price || "5000",
              offerCount: fetchedResult?.length || 0,
            },
          }),
        }}
      />
    </>
  );
}
