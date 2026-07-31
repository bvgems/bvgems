"use client";

import { useEffect, useState, useRef } from "react";
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
  Container,
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
import { EmeraldDetails } from "./EmeraldDetails";
import { LabSapphire } from "./LabSapphire";

// Utility: pick one representative image per quality, prioritizing items with videos
const getRepresentativeImages = (items: any[]) => {
  const qualityMap: Record<string, any> = {};

  items.forEach((item) => {
    // Check if the current item has a valid video array
    const hasVideo =
      Array.isArray(item?.cloudinary_videos) &&
      item.cloudinary_videos.length > 0;

    // Save the item if we haven't found one for this quality yet,
    // OR replace the saved item if the current one has a video and the saved one doesn't!
    if (
      !qualityMap[item.quality] ||
      (hasVideo &&
        (!Array.isArray(qualityMap[item.quality]?.cloudinary_videos) ||
          qualityMap[item.quality].cloudinary_videos.length === 0))
    ) {
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
    (a, b) => shapeOrder.indexOf(a) - shapeOrder.indexOf(b),
  );
  const [selectedShape, setSelectedShape] = useState<string | null>(
    shapes?.length ? shapes[0] : null,
  );
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [typeFilter, setTypeFilter] = useState<string | null>(null);
  const [selectedSapphireColor, setSelectedSapphireColor] = useState(
    SapphireLooseGemstoneColorOptions[0]?.value,
  );
  const [emeraldShade, setEmeraldShade] = useState<string | null>("Zambian");
  const [fetchedResult, setFetchedResult] = useState<any[]>([]);
  const [allSizes, setAllSizes] = useState<{ [shape: string]: string[] }>({});
  const [opened, { open, close }] = useDisclosure(false);
  const router = useRouter();
  const [shaedImages, setShadeImages] = useState<any>([]);
  const [qualityImages, setQualityImages] = useState<any[]>([]);
  const [activeSlide, setActiveSlide] = useState(0);
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);

  const [isVideoZoomed, setIsVideoZoomed] = useState(false);
  const [videoZoomPos, setVideoZoomPos] = useState({ x: 0, y: 0 });
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const mainVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Keep standard logic here
  }, []);

  const handleVideoMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!videoContainerRef.current) return;

    // 1. Get container dimensions and offset
    const { left, top, width, height } =
      videoContainerRef.current.getBoundingClientRect();

    // 2. Calculate mouse position relative to container
    // Adjust for page scroll and offset
    const x = ((e.pageX - left - window.scrollX) / width) * 100;
    const y = ((e.pageY - top - window.scrollY) / height) * 100;

    // 3. Update position state
    setVideoZoomPos({ x, y });
  };

  const setEmeraldShaedImages = (data: any) => {
    if (!Array.isArray(data)) return;

    const matched = data.find(
      (item: any) =>
        item?.type === "Lab Grown" &&
        item?.collection_slug === "Emerald" &&
        Array.isArray(item?.extra_images) &&
        item.extra_images.length > 0,
    );

    if (matched) {
      // Ensure Z (Zambian) always comes first, C (Colombian) second
      const sortedImages = [...matched.extra_images].sort(
        (a: string, b: string) => {
          if (a.includes("_Z") && !b.includes("_Z")) return -1;
          if (b.includes("_Z") && !a.includes("_Z")) return 1;
          return 0;
        },
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
    sapphireColor: string,
  ) => {
    const result: any = await getShapesData(
      selectedShape,
      title,
      isSapphire,
      sapphireColor,
    );

    const shape = selectedShape || "default";
    const uniqueSizes = Array.from(
      new Set(result?.data?.map((item: any) => item.size)),
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
        selectedSapphireColor,
      );
      setSelectedSizes([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedShape, selectedSapphireColor]);

  const redirectToEducation = () => {
    router.push(
      `/customer-support/education?activeStone=${data?.title?.toLowerCase()}`,
    );
  };

  const uniqueTypes = Array.from(
    new Set(fetchedResult?.map((item: any) => item.type)),
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
  // Filter only available quality images once
  const availableQualityImages = qualityImages.filter(
    (item: any) => item?.is_available,
  );

  const selectedThumbnail = availableQualityImages[activeSlide]?.quality || "";

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
  // 1. Find the video specifically attached to the selected thumbnail grade
  const selectedGradeItem = availableQualityImages.find(
    (item: any) => item.quality === selectedThumbnail,
  );

  // Extract video array for selected grade
  const selectedGradeVideos = Array.isArray(selectedGradeItem?.cloudinary_videos)
    ? selectedGradeItem.cloudinary_videos
    : [];

  // Helper to ensure Cloudinary automatically formats videos for cross-browser support (e.g., converting .mov for Windows)
  const getOptimizedVideoUrl = (url: string | undefined) => {
    if (!url || !url.includes("cloudinary.com")) return url;
    if (url.includes("/upload/f_auto")) return url; // Already optimized
    return url.replace("/upload/", "/upload/f_auto,q_auto/");
  };

  const currentVideoUrl = getOptimizedVideoUrl(selectedGradeVideos[activeVideoIndex]?.video_url);

  useEffect(() => {
    if (mainVideoRef.current && currentVideoUrl) {
      mainVideoRef.current.play().catch(e => console.warn("Autoplay prevented by browser:", e));
    }
  }, [currentVideoUrl]);

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
                {availableQualityImages.length > 0 ? (
                  <div className="flex flex-col items-center">
                    {/* Main Carousel (Images Only) */}
                    <Carousel
                      withIndicators
                      height={400}
                      onSlideChange={(index) => {
                        setActiveSlide(index);
                        setActiveVideoIndex(0);
                      }}
                      className="w-full max-w-[420px]"
                      slideGap="md"
                      slideSize="100%"
                      initialSlide={activeSlide}
                    >
                      {availableQualityImages.map((item: any) => (
                        <Carousel.Slide key={item.id}>
                          <div className="flex flex-col items-center">
                            <div className="h-[500px] w-[300px] flex items-center justify-center bg-white">
                              <ImageZoom src={item.image_url} />
                            </div>
                          </div>
                        </Carousel.Slide>
                      ))}
                    </Carousel>

                    {/* Thumbnails (Images Only) */}
                    <div className="mt-4 flex gap-4 flex-wrap justify-center">
                      {availableQualityImages.map(
                        (item: any, index: number) => (
                          <div
                            key={item.id}
                            className={`flex flex-col items-center cursor-pointer border rounded-lg p-2 transition-all ${activeSlide === index
                                ? "border-black shadow-md"
                                : "border-gray-300 hover:border-gray-400"
                              }`}
                            onClick={() => {
                              setActiveSlide(index);
                              setActiveVideoIndex(0);
                            }}
                          >
                            <Image
                              src={item.image_url}
                              h={70}
                              w={70}
                              fit="contain"
                              className="rounded"
                            />
                            <span className="text-xs font-medium mt-1">
                              {item.quality}
                            </span>
                          </div>
                        ),
                      )}
                    </div>

                    {/* Conditional Video Block (Shows ONLY below thumbnails when a valid video exists for the selected grade) */}
                    {selectedGradeVideos.length > 0 && currentVideoUrl && (
                      <div className="mt-8 flex flex-col items-center w-full animate-fade-in">


                        <div
                          ref={videoContainerRef}
                          className="h-[500px] w-[300px] flex items-center justify-center bg-white border border-gray-200 rounded shadow-sm overflow-hidden cursor-zoom-in relative"
                          onMouseMove={handleVideoMouseMove}
                          onMouseEnter={() => setIsVideoZoomed(true)}
                          onMouseLeave={() => setIsVideoZoomed(false)}
                        >
                          <video
                            ref={mainVideoRef}
                            key={currentVideoUrl} // Remounts video when src changes
                            src={currentVideoUrl}
                            autoPlay
                            loop
                            muted
                            playsInline
                            className={`w-full h-full object-cover transition-transform duration-100 ease-linear ${isVideoZoomed ? "scale-[2]" : "scale-[1]"
                              }`}
                            style={{
                              transformOrigin: `${videoZoomPos.x}% ${videoZoomPos.y}%`,
                            }}
                          />

                          {isVideoZoomed && (
                            <div className="absolute inset-0 border-[3px] border-black/30 rounded pointer-events-none" />
                          )}
                        </div>

                        {/* Video Thumbnails Carousel (Only visible if > 1 video) */}
                        {selectedGradeVideos.length > 1 && (
                          <div className="mt-4 w-full max-w-[300px]">
                            <Carousel
                              slideSize="33.333333%"
                              slideGap="sm"
                              controlsOffset="xs"
                            >
                              {selectedGradeVideos.map((video: any, index: number) => (
                                <Carousel.Slide key={video.public_id || index}>
                                  <div
                                    className={`cursor-pointer border-2 rounded p-1 transition-all ${activeVideoIndex === index
                                        ? "border-black shadow-md"
                                        : "border-transparent hover:border-gray-300"
                                      }`}
                                    onClick={() => setActiveVideoIndex(index)}
                                  >
                                    <video
                                      src={getOptimizedVideoUrl(video.video_url)}
                                      className="w-full h-16 object-cover rounded pointer-events-none"
                                      muted
                                      playsInline
                                    />
                                  </div>
                                </Carousel.Slide>
                              ))}
                            </Carousel>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="h-[300px] w-[300px] bg-gray-100 rounded" />
                )}
              </div>
            </motion.div>
            <EmeraldDetails
              isEmerald={isEmerald}
              shaedImages={shaedImages}
              typeFilter={typeFilter}
              getItemQuality={getItemQuality}
              qualityImages={qualityImages}
              activeSlide={activeSlide}
            />
            {/* <LabSapphire
              isSapphire={isSapphire}
              selectedSapphireColor={selectedSapphireColor}
              typeFilter={typeFilter}
              getItemQuality={getItemQuality}
              qualityImages={qualityImages}
              activeSlide={activeSlide}
            /> */}

            {handle === "paraiba-tourmaline" && (
              <div className="mt-10">
                <h3 className="text-xl font-bold text-gray-800 mb-6 tracking-wide text-center">
                  Lab Pariba Tourmaline
                </h3>

                <div className="flex flex-col items-center p-6 bg-white rounded-2xl shadow-md max-w-xl mx-auto">
                  <div className="h-[160px] w-[160px] flex items-center justify-center">
                    <Image
                      src="/assets/pariba-desc.jpg"
                      fit="contain"
                      radius="md"
                      className="object-contain rounded-xl"
                    />
                  </div>

                  <p className="mt-4 text-sm text-gray-600 leading-relaxed text-center">
                    Paraiba tourmalines are celebrated for their electrifying,
                    neon-lit hues and luminous depth. Lab grown Paraiba
                    tourmalines capture that iconic Windex blue brilliance —
                    vivid, saturated, and almost otherworldly — offering a
                    striking and contemporary alternative to traditional
                    gemstones.
                  </p>
                </div>
              </div>
            )}

            {handle === "alexandrite" && (
              <div className="mt-10">
                <h3 className="text-xl font-bold text-gray-800 mb-6 tracking-wide text-center">
                  Lab Alexandrite
                </h3>

                <div className="flex flex-col items-center p-6 bg-white rounded-2xl shadow-md max-w-xl mx-auto">
                  <div className="h-[160px] w-[160px] flex items-center justify-center">
                    <Image
                      src="/assets/alex-desc.png"
                      fit="contain"
                      radius="md"
                      className="object-contain rounded-xl"
                    />
                  </div>

                  <p className="mt-4 text-sm text-gray-600 leading-relaxed text-center">
                    Alexandrite is a rare, color-changing gemstone that
                    typically shifts from a bluish-green in daylight (or
                    fluorescent light) to a purplish-red in incandescent (warm)
                    light. This phenomenon, caused by chromium impurities in its
                    crystal structure and high-intensity light absorption.
                  </p>
                </div>
              </div>
            )}

            {isSapphire && selectedSapphireColor === "Blue" ? (
              typeFilter === "Lab Grown" ||
                selectedThumbnail === "Lab Grown" ? (
                <div className="mt-10">
                  <h3 className="text-xl font-bold text-gray-800 mb-6 tracking-wide text-center">
                    Lab Blue Sapphire
                  </h3>

                  <div className="flex flex-col items-center p-6 bg-white rounded-2xl shadow-md max-w-xl mx-auto">
                    <div className="h-[160px] w-[160px] flex items-center justify-center">
                      <Image
                        src="/assets/lab-blue.png"
                        fit="contain"
                        radius="md"
                        className="object-contain rounded-xl"
                      />
                    </div>

                    <p className="mt-4 text-sm text-gray-600 leading-relaxed text-center">
                      Blue sapphires are prized for their rich, velvety blue
                      color and exceptional brilliance. Lab grown blue sapphires
                      display vivid saturation, excellent clarity, and
                      remarkable durability, making them ideal for fine jewelry
                      with a luxurious yet modern appeal.
                    </p>
                  </div>
                </div>
              ) : (selectedThumbnail === "A" || selectedThumbnail === "AA") &&
                typeFilter !== "Lab Grown" ? (
                <div className="mt-10">
                  <h3 className="text-xl font-bold text-gray-800 mb-6 tracking-wide text-center">
                    Natural Blue Sapphire Shade Variations
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                    {/* Card 1 */}
                    <div className="flex flex-col items-center p-6 bg-white rounded-2xl shadow-md hover:shadow-lg transition text-center">
                      <div className="w-[140px] h-[140px] flex items-center justify-center">
                        <Image
                          src="/assets/royal-blue.png"
                          w={140}
                          h={140}
                          fit="contain"
                          className="object-contain"
                        />
                      </div>

                      <span className="mt-4 text-lg font-semibold text-gray-900">
                        Vivid Royal Blue Sapphire
                      </span>

                      <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                        Darker, rich, and saturated royal blue hue. Known for
                        its depth and intensity.
                      </p>
                    </div>

                    {/* Card 2 */}
                    <div className="flex flex-col items-center p-6 bg-white rounded-2xl shadow-md hover:shadow-lg transition text-center">
                      <div className="w-[140px] h-[140px] flex items-center justify-center">
                        <Image
                          src="/assets/medium-cornflower.png"
                          w={140}
                          h={140}
                          fit="contain"
                          className="object-contain"
                        />
                      </div>

                      <span className="mt-4 text-lg font-semibold text-gray-900">
                        Medium Light Cornflower Blue Sapphire
                      </span>

                      <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                        Lighter and brighter blue hue with vibrant brilliance
                        and sparkle.
                      </p>
                    </div>

                    {/* Card 3 */}
                    <div className="flex flex-col items-center p-6 bg-white rounded-2xl shadow-md hover:shadow-lg transition text-center">
                      <div className="w-[140px] h-[140px] flex items-center justify-center">
                        <Image
                          src="/assets/navy-blue.png"
                          w={140}
                          h={140}
                          fit="contain"
                          className="object-contain"
                        />
                      </div>

                      <span className="mt-4 text-lg font-semibold text-gray-900">
                        Medium Navy Blue Sapphire
                      </span>

                      <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                        Deep navy tone with elegant brilliance and rich
                        saturation.
                      </p>
                    </div>
                  </div>
                </div>
              ) : null
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
                            className={`rounded border ${isSelected ? "border-black" : "border-gray-300"
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
                              className={`p-2 border rounded cursor-pointer ${selectedSapphireColor === item?.value
                                  ? "border-black"
                                  : "border-gray-300"
                                }`}
                            >
                              {/* <IconDiamond color={item?.color} size={30} /> */}
                              <Image src={item?.image} h={40} w={40} />
                            </span>
                          </Tooltip>
                        ),
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

      {/* FILTER BAR */}
      <Container size="lg" className="mt-10 mx-auto">
        <div className="bg-white p-6">
          {/* SHAPE (Centered Icons) */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-600 mb-3 text-center">
              Shape
            </h3>

            <div className="flex flex-wrap justify-center gap-6">
              {sortedShapes.map((shape: string, index: number) => {
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

                return (
                  <div
                    key={index}
                    onClick={() => setSelectedShape(shape)}
                    className="flex flex-col items-center cursor-pointer group"
                  >
                    <div
                      className={`p-3 rounded-xl border transition-all duration-200 ${isSelected
                          ? "border-black shadow-md scale-105"
                          : "border-gray-300 hover:border-black"
                        }`}
                    >
                      <Image
                        src={shapeImageMap[shape]}
                        h={40}
                        w={40}
                        fit="contain"
                      />
                    </div>

                    <span
                      className={`text-xs mt-2 ${isSelected ? "text-black font-medium" : "text-gray-500"
                        }`}
                    >
                      {shape}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* OTHER FILTERS */}
          <div className="flex flex-wrap gap-4 justify-center">
            {/* Size */}
            <div className="flex flex-col min-w-[180px]">
              <span className="text-sm font-medium text-gray-600 mb-1">
                Size
              </span>
              <Select
                placeholder="Select Size"
                data={allSizes[selectedShape || ""]?.map((size: string) => ({
                  label: size,
                  value: size,
                }))}
                value={selectedSizes[0] || null}
                onChange={(val) => setSelectedSizes(val ? [val] : [])}
                searchable
                clearable
              />
            </div>

            {/* Type */}
            <div className="flex flex-col min-w-[180px]">
              <span className="text-sm font-medium text-gray-600 mb-1">
                Natural / Lab
              </span>
              <Select
                placeholder="Select Type"
                data={[
                  { label: "All", value: "" },
                  { label: "Natural", value: "Natural" },
                  { label: "Lab Grown", value: "Lab Grown" },
                ]}
                value={typeFilter || ""}
                onChange={(val) => setTypeFilter(val)}
                clearable
              />
            </div>

            {/* Sapphire Color */}
            {isSapphire && (
              <div className="flex flex-col min-w-[200px]">
                <span className="text-sm font-medium text-gray-600 mb-1">
                  Color
                </span>
                <Select
                  data={SapphireLooseGemstoneColorOptions.map((c: any) => ({
                    label: c.value,
                    value: c.value,
                  }))}
                  value={selectedSapphireColor}
                  onChange={(val) => setSelectedSapphireColor(val!)}
                />
              </div>
            )}
          </div>
        </div>
      </Container>

      {/* TABLE */}
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
