"use client";
import { PageHeader } from "@/components/CommonComponents/PageHeader";
import Link from "next/link";

import { useEffect, useState, useRef, useMemo } from "react";
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
  Loader,
} from "@mantine/core";
import { getShapesData } from "@/apis/api";
import { CategoryTable } from "./CategoryTable";
import { useDisclosure } from "@mantine/hooks";
import { SizeToleranceGuide } from "../Tolerance/SizeToleranceGuide";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { ImageZoom } from "../CommonComponents/ImageZoom";
import { IconDiamond, IconShare } from "@tabler/icons-react";
import { SapphireLooseGemstoneColorOptions } from "@/utils/constants";
import { Carousel } from "@mantine/carousel";
import Script from "next/script";
import { EmeraldDetails } from "./EmeraldDetails";
import { LabSapphire } from "./LabSapphire";
import { sortBySizeAsc } from "@/utils/sortUtils";

// Utility: pick one representative image per quality, prioritizing items with videos
const getRepresentativeImages = (items: any[]) => {
  const qualityMap: Record<string, any> = {};

  items.forEach((item) => {
    const hasVideo =
      Array.isArray(item?.cloudinary_videos) &&
      item.cloudinary_videos.length > 0;
    const hasImage = !!item?.image_url;

    const current = qualityMap[item.quality];

    if (!current) {
      qualityMap[item.quality] = item;
    } else {
      const currentHasVideo =
        Array.isArray(current?.cloudinary_videos) &&
        current.cloudinary_videos.length > 0;
      const currentHasImage = !!current?.image_url;

      // Prioritize items with both image and video, then image, then video
      if (!currentHasImage && hasImage) {
        qualityMap[item.quality] = item;
      } else if (currentHasImage === hasImage && !currentHasVideo && hasVideo) {
        qualityMap[item.quality] = item;
      }
    }
  });

  const order = ["B", "A", "AA", "Lab Grown"];
  return order.map((q) => qualityMap[q]).filter((item) => item !== undefined);
};

export function CategoryContent({
  isSapphire,
  isEmerald,
  data,
  shapes,
  handle,
  routeStone,
  routeShape,
  routeSize,
}: {
  isSapphire: boolean;
  isEmerald: boolean;
  data: any;
  shapes: string[];
  handle: any;
  routeStone?: string;
  routeShape?: string;
  routeSize?: string;
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
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const generateSeoUrl = (newShape: string | null, newColor: string | null, newSize: string | null = null) => {
    const shapeToUse = newShape || selectedShape || (shapes?.length ? shapes[0] : "round");
    const shapeSlug = shapeToUse.toLowerCase().replace(/\s+/g, "-");
    const params = new URLSearchParams();
    
    const colorToUse = newColor || (isSapphire ? selectedSapphireColor : null);
    if (colorToUse && isSapphire) {
      params.set("color", colorToUse);
    }
    if (typeFilter) {
      params.set("type", typeFilter);
    }
    if (emeraldShade && isEmerald) {
      params.set("shade", emeraldShade);
    }
    
    const queryStr = params.toString();
    
    let sizeSlug = "";
    if (newSize) {
      sizeSlug = "/" + newSize.replace(/\s+/g, "");
    }
    
    return `/calibrated-stones/${handle}/${shapeSlug}${sizeSlug}${queryStr ? '?' + queryStr : ''}`;
  };


  const formattedHandle = handle ? (typeof handle === 'string' ? handle.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()) : String(handle)) : "Gemstones";
  const urlShape = searchParams.get("shape");
  const urlSizes = searchParams.getAll("size");
  const urlType = searchParams.get("type");
  const urlColor = searchParams.get("color");
  const urlShade = searchParams.get("shade");

  const [selectedShape, setSelectedShape] = useState<string | null>(
    routeShape || urlShape || (shapes?.length ? shapes[0] : null)
  );
  const [selectedSizes, setSelectedSizes] = useState<string[]>(routeSize ? [routeSize] : (urlSizes || []));
  const [typeFilter, setTypeFilter] = useState<string | null>(urlType || null);
  const [selectedSapphireColor, setSelectedSapphireColor] = useState(
    urlColor || SapphireLooseGemstoneColorOptions[0]?.value
  );
  const [emeraldShade, setEmeraldShade] = useState<string | null>(urlShade || "Colombian");
  const [fetchedResult, setFetchedResult] = useState<any[]>([]);
  // Identifies which shape/color the current `fetchedResult` belongs to, so we
  // never reconcile filters against stale data while a new fetch is in flight.
  const [fetchedKey, setFetchedKey] = useState<string | null>(null);
  const [allSizes, setAllSizes] = useState<{ [shape: string]: string[] }>({});
  const [opened, { open, close }] = useDisclosure(false);
  const [shaedImages, setShadeImages] = useState<any>([]);
  const [qualityImages, setQualityImages] = useState<any[]>([]);
  const [activeSlide, setActiveSlide] = useState(0);
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);

  const [isVideoZoomed, setIsVideoZoomed] = useState(false);
  const [isSharingVideo, setIsSharingVideo] = useState(false);
  const [videoZoomPos, setVideoZoomPos] = useState({ x: 0, y: 0 });
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const mainVideoRef = useRef<HTMLVideoElement>(null);

  // Last URL values we have already applied to state. The effect below also
  // re-runs on unrelated deps (allSizes, selectedShape...), and must NOT keep
  // overwriting state with a stale URL value (that caused a color/type ping-pong
  // with the state -> URL effect).
  const lastUrlRef = useRef({
    shape: urlShape,
    color: urlColor,
    type: urlType,
    shade: urlShade,
  });

  // Sync state with URL parameters on soft navigation
  useEffect(() => {
    const urlShape = searchParams.get("shape");
    const urlColor = searchParams.get("color");
    const urlType = searchParams.get("type");
    const urlShade = searchParams.get("shade");
    const last = lastUrlRef.current;

    if (urlShape !== last.shape) {
      last.shape = urlShape;
      if (urlShape && urlShape !== selectedShape) setSelectedShape(urlShape);
    }
    if (urlColor !== last.color) {
      last.color = urlColor;
      if (urlColor && urlColor !== selectedSapphireColor) setSelectedSapphireColor(urlColor);
    }
    if (urlType !== last.type) {
      last.type = urlType;
      if (urlType && urlType !== typeFilter) setTypeFilter(urlType);
    }
    if (urlShade !== last.shade) {
      last.shade = urlShade;
      if (urlShade && urlShade !== emeraldShade) setEmeraldShade(urlShade);
    }
    if (routeSize) {
      const normalizedRoute = routeSize.replace(/\s+/g, "");
      const currentSelected = selectedSizes[0]?.replace(/\s+/g, "");
      
      if (normalizedRoute !== currentSelected) {
        // Find the properly formatted size from allSizes if available
        let trueSize = routeSize;
        if (selectedShape && allSizes[selectedShape]) {
          const match = allSizes[selectedShape].find((s: string) => s.replace(/\s+/g, "") === normalizedRoute);
          if (match) trueSize = match;
        }
        setSelectedSizes([trueSize]);
      } else if (selectedShape && allSizes[selectedShape]) {
        // Even if they match normalized, ensure we use the properly formatted one from the DB
        const match = allSizes[selectedShape].find((s: string) => s.replace(/\s+/g, "") === normalizedRoute);
        if (match && selectedSizes[0] !== match) {
          setSelectedSizes([match]);
        }
      }
    } else if (!routeSize && selectedSizes.length > 0) {
      const urlSizesParam = searchParams.getAll("size");
      if (!urlSizesParam || urlSizesParam.length === 0) {
        setSelectedSizes([]);
      }
    }
  }, [searchParams, routeSize, allSizes, selectedShape]);

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    let hasChanges = false;

    const setOrDelete = (key: string, value: string | null, defaultValue: string | null) => {
      if (value && value !== defaultValue) {
        if (params.get(key) !== value) {
          params.set(key, value);
          hasChanges = true;
        }
      } else {
        if (params.has(key)) {
          params.delete(key);
          hasChanges = true;
        }
      }
    };

    // Shape is managed via path segments, so ensure it is not in query params
    if (params.has("shape")) {
      params.delete("shape");
      hasChanges = true;
    }

    if (isSapphire) {
      setOrDelete("color", selectedSapphireColor, SapphireLooseGemstoneColorOptions[0]?.value);
    } else if (params.has("color")) {
      params.delete("color");
      hasChanges = true;
    }

    setOrDelete("type", typeFilter, null);

    if (isEmerald) {
      setOrDelete("shade", emeraldShade, "Colombian");
    } else if (params.has("shade")) {
      params.delete("shade");
      hasChanges = true;
    }

    // Size is managed via path segments, so ensure it is not in query params
    if (params.has("size")) {
      params.delete("size");
      hasChanges = true;
    }

    if (hasChanges) {
      params.sort();
      const currentParams = new URLSearchParams(searchParams.toString());
      currentParams.sort();
      
      if (params.toString() !== currentParams.toString()) {
        const queryString = params.toString();
        const newUrl = queryString ? `${pathname}?${queryString}` : pathname;
        router.replace(newUrl, { scroll: false });
      }
    }
  }, [selectedSapphireColor, typeFilter, emeraldShade, pathname, router, searchParams, isSapphire, isEmerald]);

  const handleShareVideo = async (e: React.MouseEvent, url: string) => {
    e.preventDefault();
    e.stopPropagation();
    setIsVideoZoomed(false); // Cleanly stop the zoom if it was active

    setIsSharingVideo(true);
    try {
      let shareUrl = url;
      if (url.startsWith('/')) {
        shareUrl = window.location.origin + url;
      }

      // Fetch the video file to share directly
      const response = await fetch(shareUrl);
      const blob = await response.blob();
      const file = new File([blob], 'bvgems-video.mp4', { type: blob.type || 'video/mp4' });

      const formattedHandle = handle ? (typeof handle === 'string' ? handle.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()) : String(handle)) : "Gemstones";
      const shareTitle = `B.V. Gems - ${formattedHandle}`;

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file]
        });
      } else {
        // Fallback to sharing URL if files aren't supported on this browser/OS
        if (navigator.share) {
          await navigator.share({
            url: shareUrl,
          });
        } else {
          await navigator.clipboard.writeText(shareUrl);
          alert("Video link copied to clipboard!");
        }
      }
    } catch (err) {
      console.error("Error sharing video:", err);
      if (err instanceof Error && err.name !== 'AbortError') {
        alert("Sharing failed. You may need to use a different browser.");
      }
    } finally {
      setIsSharingVideo(false);
    }
  };

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
      // Ensure C (Colombian) always comes first, Z (Zambian) second
      const sortedImages = [...matched.extra_images].sort(
        (a: string, b: string) => {
          if (a.includes("_Z") && !b.includes("_Z")) return 1;
          if (b.includes("_Z") && !a.includes("_Z")) return -1;
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
    ).sort(sortBySizeAsc);

    setAllSizes((prev: any) => ({
      ...prev,
      [shape]: uniqueSizes,
    }));

    setFetchedResult(result?.data || []);
    setFetchedKey(`${shape}|${isSapphire ? sapphireColor : ""}`);
    setEmeraldShaedImages(result?.data);

    // Get one image per quality in fixed order
    const reps = getRepresentativeImages(result?.data || []);
    setQualityImages(reps);
    
    const prevAvailable = qualityImages.filter((item: any) => item?.is_available);
    const prevQuality = prevAvailable[activeSlide]?.quality || "";
    const newAvailable = reps.filter((item: any) => item?.is_available);
    
    let targetType = searchParams.get("type") || typeFilter;
    if (!targetType && typeof window !== 'undefined') {
       targetType = sessionStorage.getItem('preferredBvgemsType') || typeFilter;
    }

    let newIndex = -1;

    // First priority: Try to match exact prevQuality, BUT ONLY if its type aligns with targetType
    const isPrevLab = prevQuality.toLowerCase().includes("lab");
    const prevType = isPrevLab ? "Lab Grown" : "Natural";

    if (prevQuality && prevType === targetType) {
        newIndex = newAvailable.findIndex((item: any) => item.quality === prevQuality);
    }

    // Second priority: Try to match targetType
    if (newIndex === -1 && targetType) {
      if (targetType === "Lab Grown") {
        newIndex = newAvailable.findIndex((item: any) => item.quality?.toLowerCase().includes("lab"));
      } else if (targetType === "Natural") {
        newIndex = newAvailable.findIndex((item: any) => !item.quality?.toLowerCase().includes("lab"));
      }
    }
    
    const finalIndex = newIndex !== -1 ? newIndex : 0;
    setActiveSlide(finalIndex);
    setActiveVideoIndex(0);

    // Auto-sync the type filter only if user has not explicitly requested a type in the URL
    const landedQuality = newAvailable[finalIndex]?.quality || "";
    if (landedQuality && !searchParams.get("type")) {
       setTypeFilter(landedQuality.toLowerCase().includes("lab") ? "Lab Grown" : "Natural");
    }
  };

  useEffect(() => {
    if (selectedShape) {
      fetchShapesData(
        selectedShape,
        data?.title,
        isSapphire,
        selectedSapphireColor,
      );
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

  // ---- Availability-driven Size / Type filters ----
  // The table only ever shows rows with is_available === true, so sizes and
  // types are derived from those rows only. A size/type with 0 results is hidden.
  const normalizeSize = (s: any) => String(s ?? "").replace(/\s+/g, "");
  const currentKey = `${selectedShape || "default"}|${isSapphire ? selectedSapphireColor : ""}`;
  const dataIsCurrent = fetchedKey === currentKey;

  const availableRows = useMemo(
    () => (fetchedResult || []).filter((item: any) => item?.is_available === true),
    [fetchedResult],
  );

  // Types that actually exist for this stone/shape/color (a color may have only
  // Natural, only Lab Grown, or both).
  const availableTypes = useMemo(() => {
    const present = new Set(availableRows.map((item: any) => item.type));
    return ["Natural", "Lab Grown"].filter((t) => present.has(t));
  }, [availableRows]);

  // When only one type exists it is the effective type regardless of state.
  const effectiveType =
    availableTypes.length === 1 ? availableTypes[0] : typeFilter || "";

  // Sizes that have at least one available row for the active type.
  const visibleSizes = useMemo(() => {
    const rows = effectiveType
      ? availableRows.filter((item: any) => item.type === effectiveType)
      : availableRows;
    return Array.from(
      new Set(rows.map((item: any) => item.size).filter(Boolean)),
    ).sort(sortBySizeAsc) as string[];
  }, [availableRows, effectiveType]);

  // Keep showing the previous lists while a new shape/color is loading, so the
  // filter panel does not flash or jump.
  const lastSizesRef = useRef<string[]>([]);
  const lastTypesRef = useRef<string[]>([]);
  if (dataIsCurrent) {
    lastSizesRef.current = visibleSizes;
    lastTypesRef.current = availableTypes;
  }
  const sizesToShow = dataIsCurrent ? visibleSizes : lastSizesRef.current;
  const typesToShow = dataIsCurrent ? availableTypes : lastTypesRef.current;
  const typeOptions =
    typesToShow.length >= 2
      ? [
          { label: "All", value: "" },
          { label: "Natural", value: "Natural" },
          { label: "Lab Grown", value: "Lab Grown" },
        ]
      : typesToShow.map((t) => ({ label: t, value: t }));

  // Reconcile selections with what is actually available.
  const reconciledKeyRef = useRef<string | null>(null);
  useEffect(() => {
    if (!dataIsCurrent) return;

    // Only one type exists -> lock the type filter to it.
    if (availableTypes.length === 1 && typeFilter !== availableTypes[0]) {
      setTypeFilter(availableTypes[0]);
    }

    const size = selectedSizes[0];
    if (!size) {
      reconciledKeyRef.current = currentKey;
      return;
    }

    const normalized = normalizeSize(size);
    const sizeInType = (t: string) =>
      availableRows.some(
        (item: any) =>
          normalizeSize(item.size) === normalized && (!t || item.type === t),
      );

    if (sizeInType(effectiveType)) {
      reconciledKeyRef.current = currentKey;
      return;
    }

    const isFirstLoad = reconciledKeyRef.current !== currentKey;
    reconciledKeyRef.current = currentKey;

    // Deep link to a size that only exists in the other type -> switch type.
    if (isFirstLoad) {
      const otherType = availableTypes.find((t) => sizeInType(t));
      if (otherType) {
        setTypeFilter(otherType);
        return;
      }
    }

    // Size has no results for the current type -> drop it from the selection/URL.
    setSelectedSizes([]);
    const targetUrl = generateSeoUrl(null, null, null);
    if (typeof window !== "undefined" && window.location.pathname + window.location.search !== targetUrl) {
      router.replace(targetUrl, { scroll: false });
    }
  }, [dataIsCurrent, availableRows, availableTypes, typeFilter, selectedSizes, currentKey]);

  const selectedThumbnail = availableQualityImages[activeSlide]?.quality || "";

  const getItemQuality = (item: any) => {
    return item?.quality || "";
  };

  const breadcrumbItems = [
    { title: "Home", href: "/" },
    { title: "Calibrated Faceted Gemstones", href: "/calibrated-stones" },
    { title: data?.title || handle, href: `/calibrated-stones/${handle}` },
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
    ? [...selectedGradeItem.cloudinary_videos].sort((a: any, b: any) => {
        const labelA = (a.emerald_type || a.label || "").toLowerCase();
        const labelB = (b.emerald_type || b.label || "").toLowerCase();
        if (labelA === "colombian" && labelB !== "colombian") return -1;
        if (labelB === "colombian" && labelA !== "colombian") return 1;
        if (labelA === "zambian" && labelB !== "zambian") return -1;
        if (labelB === "zambian" && labelA !== "zambian") return 1;
        return 0;
      })
    : [];

  const currentVideoUrl = selectedGradeVideos[activeVideoIndex]?.video_url;

  useEffect(() => {
    if (mainVideoRef.current && currentVideoUrl) {
      mainVideoRef.current.play().catch(e => console.warn("Autoplay prevented by browser:", e));
    }
  }, [currentVideoUrl]);

  return (
    <>
      <PageHeader 
        title={`${formattedHandle} Collection`}
        subtitle={`Discover our exquisite collection of ${formattedHandle} gemstones.`}
      />
      <div className="mt-9 px-6">
        <Breadcrumbs separator="›" className="mb-6">
          {breadcrumbItems}
        </Breadcrumbs>






        <Grid className="mt-6">
          {/* Left: Image Carousel */}
          <GridCol span={{ base: 12, md: 6 }} order={{ base: 2, md: 1 }}>
            <div className="flex gap-4 items-start px-4 md:px-12">
              <div className="w-full">
                {availableQualityImages.length > 0 ? (
                  <div className="flex flex-col items-center">
                    {/* Main Carousel (Images Only) */}
                    <Carousel
                      withIndicators
                      height={350}
                      onSlideChange={(index) => {
                        setActiveSlide(index);
                        setActiveVideoIndex(0);
                        const quality = availableQualityImages[index]?.quality || "";
                        const newType = quality.toLowerCase().includes("lab") ? "Lab Grown" : "Natural";
                        setTypeFilter(newType);
                        if (typeof window !== 'undefined') {
                          sessionStorage.setItem('preferredBvgemsType', newType);
                        }
                      }}
                      className="w-full max-w-[420px]"
                      slideGap="md"
                      slideSize="100%"
                      initialSlide={activeSlide}
                      nextControlProps={{ "aria-label": "Next slide" }}
                      previousControlProps={{ "aria-label": "Previous slide" }}
                    >
                      {availableQualityImages.map((item: any) => (
                        <Carousel.Slide key={item.id}>
                          <div className="flex flex-col items-center">
                            <div className="h-[350px] w-full max-w-[350px] flex items-start justify-center bg-white pt-2">
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
                              const quality = availableQualityImages[index]?.quality || "";
                              const newType = quality.toLowerCase().includes("lab") ? "Lab Grown" : "Natural";
                              setTypeFilter(newType);
                              if (typeof window !== 'undefined') {
                                sessionStorage.setItem('preferredBvgemsType', newType);
                              }
                            }}
                          >
                            {item.image_url ? (
                              <Image loading="lazy"
                                src={item.image_url}
                                h={70}
                                w={70}
                                fit="contain"
                                className="rounded"
                              />
                            ) : (
                              <div className="h-[70px] w-[70px] flex items-center justify-center bg-gray-50 border border-gray-100 rounded">
                                <span className="text-[10px] text-gray-400 text-center leading-tight">No<br />Image</span>
                              </div>
                            )}
                            <span className="text-xs font-medium mt-1">
                              {item.quality}
                            </span>
                          </div>
                        ),
                      )}
                    </div>

                    {/* Conditional Video Block (Shows ONLY below thumbnails when a valid video exists for the selected grade) */}
                    {selectedGradeVideos.length > 0 && currentVideoUrl && (
                      <div className="mt-8 flex flex-col items-center w-full">


                        <div
                          ref={videoContainerRef}
                          className="h-[350px] w-[300px] flex items-center justify-center bg-white border border-gray-200 rounded shadow-sm overflow-hidden cursor-zoom-in relative"
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

                          {(selectedGradeVideos[activeVideoIndex]?.emerald_type || selectedGradeVideos[activeVideoIndex]?.label) && (
                            <div className="absolute bottom-3 left-3 bg-black/30 backdrop-blur-md border border-white/20 text-white text-xs px-3 py-1 rounded-full shadow-lg font-semibold uppercase tracking-widest pointer-events-none z-10">
                              {selectedGradeVideos[activeVideoIndex]?.emerald_type || selectedGradeVideos[activeVideoIndex]?.label}
                            </div>
                          )}

                          <button
                            onClick={(e) => handleShareVideo(e, currentVideoUrl)}
                            disabled={isSharingVideo}
                            className="absolute top-2 right-2 z-10 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full backdrop-blur-sm transition-all disabled:opacity-50"
                            title="Share Video"
                            aria-label="Share Video"
                          >
                            {isSharingVideo ? <Loader size={20} color="white" /> : <IconShare size={20} stroke={1.5} />}
                          </button>
                          
                          {(selectedGradeVideos[activeVideoIndex]?.emerald_type || selectedGradeVideos[activeVideoIndex]?.label) && (
                            <div className="absolute bottom-3 left-3 z-10 bg-black/20 backdrop-blur-[8px] border border-white/20 text-white shadow-[0_4px_12px_rgba(0,0,0,0.1)] px-3.5 py-1.5 rounded-full text-[11px] font-semibold uppercase tracking-[0.15em] pointer-events-none">
                              {selectedGradeVideos[activeVideoIndex]?.emerald_type || selectedGradeVideos[activeVideoIndex]?.label}
                            </div>
                          )}
                        </div>

                        {/* Video Thumbnails Carousel (Only visible if > 1 video) */}
                        {selectedGradeVideos.length > 1 && (
                          <div className="mt-4 w-full max-w-[300px]">
                            <Carousel
                              slideSize="33.333333%"
                              slideGap="sm"
                              controlsOffset="xs"
                              nextControlProps={{ "aria-label": "Next slide" }}
                              previousControlProps={{ "aria-label": "Previous slide" }}
                            >
                              {selectedGradeVideos.map((video: any, index: number) => (
                                <Carousel.Slide key={video.public_id || index}>
                                  <div
                                    className={`relative cursor-pointer border-2 rounded p-1 transition-all ${activeVideoIndex === index
                                      ? "border-black shadow-md"
                                      : "border-transparent hover:border-gray-300"
                                      }`}
                                    onClick={() => setActiveVideoIndex(index)}
                                  >
                                    <video
                                      src={video.video_url}
                                      className="w-full h-16 object-cover rounded pointer-events-none"
                                      muted
                                      playsInline
                                    />
                                    {(video.emerald_type || video.label) && (
                                      <div className="absolute bottom-1 left-1 bg-black/20 backdrop-blur-[6px] border border-white/20 text-white text-[8px] px-2 py-0.5 rounded-full shadow-sm font-semibold uppercase tracking-widest pointer-events-none">
                                        {video.emerald_type || video.label}
                                      </div>
                                    )}
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
                  <div className="h-[300px] md:h-[450px] w-full flex items-center justify-center bg-gray-50 border border-gray-100 rounded-lg">
                    <span className="text-gray-400 font-medium tracking-wide text-sm">Image Not Available</span>
                  </div>
                )}
              </div>
            </div>
          </GridCol>

          {/* Right: Heading + Badges + Inline Filters + Video */}
          <GridCol span={{ base: 12, md: 6 }} order={{ base: 1, md: 2 }}>
            <div className="px-4 flex flex-col gap-4 sticky top-24 z-10">


              
              <div className="w-full">
                
                {/* Shape Filter */}
                <div>
                  <p className="font-semibold mb-3 text-gray-800 text-sm tracking-wide">SHAPE</p>
                  <div className="flex flex-wrap gap-3">
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
                        <Tooltip label={shape} key={index}>
                          <Link
                            href={generateSeoUrl(shape, null)}
                            scroll={false}
                            onClick={() => setSelectedShape(shape)}
                            className={`w-[60px] h-[60px] p-2.5 rounded-2xl border flex items-center justify-center transition-all cursor-pointer ${isSelected ? 'border-black ring-1 ring-black bg-gray-50 shadow-sm scale-[1.02]' : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50 hover:scale-[1.02]'}`}
                          >
                            <img loading="lazy" src={imageSrc} alt={shape} className="w-full h-full object-contain opacity-80" />
                          </Link>
                        </Tooltip>
                      );
                    })}
                  </div>
                </div>

                {/* Sapphire color filter */}
                {isSapphire && (
                  <div className="mt-8">
                    <p className="font-semibold mb-3 text-gray-800 text-sm tracking-wide">COLOR</p>
                    <div className="flex flex-wrap gap-3 items-center">
                      {SapphireLooseGemstoneColorOptions?.map(
                        (item: any, index: number) => {
                          const isSelected = selectedSapphireColor === item?.value;
                          return (
                            <Tooltip label={item?.value} key={index}>
                              <Link
                                href={generateSeoUrl(null, item?.value)}
                                scroll={false}
                                onClick={() => setSelectedSapphireColor(item?.value)}
                                className={`w-12 h-12 rounded-full border bg-white flex items-center justify-center transition-all cursor-pointer overflow-hidden ${isSelected ? 'border-black ring-1 ring-black shadow-sm scale-[1.04]' : 'border-gray-200 hover:border-gray-300 hover:scale-[1.02]'}`}
                              >
                                <img loading="lazy" src={item?.image} alt={item?.value} className="w-full h-full object-cover" />
                              </Link>
                            </Tooltip>
                          );
                        }
                      )}
                    </div>
                  </div>
                )}

                {/* Size Filter */}
                {selectedShape && sizesToShow.length > 0 && (
                  <div className="mt-8">
                    <p className="font-semibold mb-3 text-gray-800 text-sm tracking-wide">SIZE (MM)</p>
                    <div className="flex flex-wrap gap-2 max-h-[220px] overflow-y-auto pr-2 pb-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                      {sizesToShow.map((size: string) => {
                        const label = size.includes("x")
                          ? size.replace(/x/g, " x ").replace(/\s+/g, " ").trim()
                          : parseFloat(size).toFixed(2);
                        const isSelected = selectedSizes[0] === size;
                        return (
                          <Link
                            key={size}
                            href={generateSeoUrl(null, null, isSelected ? null : size)}
                            scroll={false}
                            className={`px-4 py-2 rounded-full border text-sm font-medium transition-all duration-200 active:scale-95 text-center ${isSelected ? 'bg-gray-900 text-white border-gray-900 shadow-md' : 'bg-white text-gray-700 border-gray-200 hover:border-gray-400 hover:bg-gray-50 hover:shadow-sm'}`}
                          >
                            {label}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Type Filter */}
                {typeOptions.length > 0 && (
                <div className="mt-8">
                  <p className="font-semibold mb-3 text-gray-800 text-sm tracking-wide">TYPE</p>
                  <div className="flex flex-wrap gap-2">
                    {typeOptions.map(t => {
                      const isSelected = typeOptions.length === 1 || (typeFilter || "") === t.value;
                      return (
                        <button
                          key={t.value}
                          onClick={() => {
                            setTypeFilter(t.value);
                            if (typeof window !== 'undefined' && t.value) {
                              sessionStorage.setItem('preferredBvgemsType', t.value);
                            }
                            if (t.value !== "Lab Grown") {
                              setEmeraldShade(null);
                            }
                            
                            // Auto-select corresponding thumbnail
                            if (t.value === "Lab Grown") {
                              const labIndex = availableQualityImages.findIndex((item: any) => item.quality?.toLowerCase().includes("lab"));
                              if (labIndex !== -1) {
                                setActiveSlide(labIndex);
                                setActiveVideoIndex(0);
                              }
                            } else if (t.value === "Natural") {
                              const natIndex = availableQualityImages.findIndex((item: any) => !item.quality?.toLowerCase().includes("lab"));
                              if (natIndex !== -1) {
                                setActiveSlide(natIndex);
                                setActiveVideoIndex(0);
                              }
                            }
                          }}
                          className={`px-5 py-2 rounded-full border text-sm font-medium transition-all duration-200 active:scale-95 ${isSelected ? 'bg-gray-900 text-white border-gray-900 shadow-md' : 'bg-white text-gray-700 border-gray-200 hover:border-gray-400 hover:bg-gray-50 hover:shadow-sm'}`}
                        >
                          {t.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
                )}

              </div>
            </div>


          </GridCol>
        </Grid>
      </div>

      {/* TABLE */}
      <CategoryTable
        fetchedResult={fetchedResult}
        selectedSizes={selectedSizes}
        data={data}
        typeFilter={typeFilter}
      />


      {/* BELOW PRODUCT LISTING */}
      <div className="px-6 md:px-12 pb-10 max-w-[1200px] mx-auto w-full mt-10 flex flex-col items-center">
                <p className="text-gray-700 leading-relaxed mt-4 text-center max-w-[800px]">
                  {data?.title} gemstones are prized for their rarity,
                  brilliance, and versatility. At B.V. Gems in New York’s
                  Diamond District, we offer {getQuality()}
                  {data?.title.toLowerCase()} gemstones in calibrated sizes for
                  rings, necklaces, earrings, and custom jewelry. Each stone is
                  ethically sourced and inspected for quality, ensuring
                  brilliance and durability.
                </p>

                {/* Static Info Table */}
                <div className="mt-8 max-w-[600px] w-full flex flex-col items-center">
                  <h2 className="text-xl font-semibold mb-3 text-center">
                    Additional Information
                  </h2>
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

                  <div className="mt-10 w-full flex flex-col items-center">
                    <h2 className="text-xl font-semibold text-gray-800 mb-3 text-center">
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

                <div className="mt-6 flex flex-wrap justify-center gap-4">
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

        
        <div className="mt-8">
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
                    <Image loading="lazy"
                      src="/assets/pariba-desc.webp"
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
                    <Image loading="lazy"
                      src="/assets/alex-desc.webp"
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
                      <Image loading="lazy"
                        src="/assets/lab-blue.webp"
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
                        <Image loading="lazy"
                          src="/assets/royal-blue.webp"
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
                        <Image loading="lazy"
                          src="/assets/medium-cornflower.webp"
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
                        <Image loading="lazy"
                          src="/assets/navy-blue.webp"
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

        </div>
      </div>
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
            brand: { "@type": "Brand", name: "B.V. Gems" }
          }),
        }}
      />
    </>
  );
}
