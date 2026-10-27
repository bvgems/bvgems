"use client";

import React, { useState, useEffect, useRef } from "react";
import { NumberInput, Select, MultiSelect, Button, ActionIcon, Collapse, Switch, Loader } from "@mantine/core";
import Image from "next/image";
import { IconX, IconChevronUp, IconChevronDown, IconFilter, IconShare, IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import { shopByColorOptions } from "@/utils/constants";

type RangeValue = { min: number | ""; max: number | "" };

type TopFiltersProps = {
  gemstoneOptions: { label: string; image: string; value: string }[];
  shapeOptions: { label: string; image: string; value: string }[];

  selectedGems: string[];
  setSelectedGems: (val: string[]) => void;

  selectedShapes: string[];
  setSelectedShapes: (val: string[]) => void;

  weight: string;
  setWeight: (val: string) => void;
  weightBounds: { min: number; max: number };

  selectedDimensions: Record<string, string[]>;
  setSelectedDimensions: React.Dispatch<React.SetStateAction<Record<string, string[]>>>;
  availableDimensionsGrouped: Record<string, string[]>;

  toleranceEnabled: boolean;
  setToleranceEnabled: (val: boolean) => void;

  sapphireColors: string[];
  selectedSapphireColors: string[];
  setSelectedSapphireColors: (val: string[]) => void;

  topazVariants?: string[];
  selectedTopazVariants?: string[];
  setSelectedTopazVariants?: (val: string[]) => void;

  selectedTypes: string[];
  setSelectedTypes: (val: string[]) => void;
  availableTypes: string[];

  selectedGrades: string[];
  setSelectedGrades: (val: string[]) => void;
  availableGrades: string[];

  resetAll: () => void;

};

const SingleNumberFilter = ({
  label,
  value,
  onChange,
  bounds,
}: {
  label: string;
  value: string;
  onChange: (val: string) => void;
  bounds: { min: number; max: number };
}) => {
  return (
    <div className="flex flex-col gap-1 w-full max-w-[250px] items-center lg:items-start mx-auto lg:mx-0">
      <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
        {label}
      </label>
      <NumberInput
        value={value}
        onChange={(val) => onChange(val.toString())}
        placeholder="Enter weight"
        min={0}
        max={bounds.max}
        styles={{ input: { fontSize: '13px' } }}
        hideControls
        className="w-full"
      />
    </div>
  );
};


const SingleDropdownFilter = ({
  label,
  value,
  onChange,
  optionsList,
}: {
  label: string;
  value: string;
  onChange: (val: string) => void;
  optionsList: string[];
}) => {
  const options = optionsList.map(opt => ({ value: opt, label: opt }));

  return (
    <div className="flex flex-col gap-1 w-full max-w-[250px] items-center lg:items-start mx-auto lg:mx-0">
      <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider text-center lg:text-left w-full">
        {label}
      </label>

      {/* Mobile view: Dropdowns */}
      <div className="flex lg:hidden flex-col gap-1 w-full">
        <Select
          placeholder="Select"
          data={options}
          value={value === "" ? null : value}
          onChange={(val) => onChange(val === null ? "" : val)}
          searchable
          clearable={false}
          className="w-full"
        />
      </div>

      {/* Desktop view: Dropdowns */}
      <div className="hidden lg:flex gap-2 w-full">
        <Select
          placeholder="Select"
          data={options}
          value={value === "" ? null : value}
          onChange={(val) => onChange(val === null ? "" : val)}
          searchable
          clearable={false}
          className="w-full"
        />
      </div>
    </div>
  );
};

const MultiDropdownFilter = ({
  label,
  value,
  onChange,
  optionsList,
  placeholder = "Select Size",
}: {
  label: string;
  value: string[];
  onChange: (val: string[]) => void;
  optionsList: string[];
  placeholder?: string;
}) => {
  const options = optionsList.map(opt => ({ value: opt, label: opt }));

  return (
    <div className="flex flex-col gap-1 w-full max-w-[250px] items-center lg:items-start mx-auto lg:mx-0">
      <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider text-center lg:text-left w-full">
        {label}
      </label>

      {/* Mobile view */}
      <div className="flex lg:hidden flex-col gap-1 w-full">
        <MultiSelect
          placeholder={placeholder}
          data={options}
          value={value}
          onChange={onChange}
          searchable
          clearable={false}
          className="w-full"
        />
      </div>

      {/* Desktop view */}
      <div className="hidden lg:flex gap-2 w-full">
        <MultiSelect
          placeholder={placeholder}
          data={options}
          value={value}
          onChange={onChange}
          searchable
          clearable={false}
          className="w-full"
        />
      </div>
    </div>
  );
};


import { getShapesData } from "@/apis/api";



const GemVideo = ({ gem, shape, selectedTypes, availableTypes = [], selectedGrades, selectedSapphireColors }: any) => {
  const [videoList, setVideoList] = useState<{ videoUrl: string; label: string | null }[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isSharingVideo, setIsSharingVideo] = useState(false);
  const [isVideoZoomed, setIsVideoZoomed] = useState(false);
  const [videoZoomPos, setVideoZoomPos] = useState({ x: 50, y: 50 });
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number | null>(null);

  const currentVideo = videoList[currentIndex] || videoList[0] || null;
  const currentVideoUrl = currentVideo?.videoUrl || null;
  const currentLabel = currentVideo?.label || null;

  const handleVideoMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!videoContainerRef.current) return;
    const { left, top, width, height } = videoContainerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, ((e.clientX - left) / width) * 100));
    const y = Math.max(0, Math.min(100, ((e.clientY - top) / height) * 100));
    setVideoZoomPos({ x, y });
  };

  const handlePrevVideo = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (videoList.length <= 1) return;
    setIsVideoZoomed(false);
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : videoList.length - 1));
  };

  const handleNextVideo = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (videoList.length <= 1) return;
    setIsVideoZoomed(false);
    setCurrentIndex((prev) => (prev < videoList.length - 1 ? prev + 1 : 0));
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diffX = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(diffX) > 40) {
      if (diffX < 0) {
        handleNextVideo();
      } else {
        handlePrevVideo();
      }
    }
    touchStartX.current = null;
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (videoList.length <= 1) return;
    if (e.key === "ArrowLeft") {
      handlePrevVideo();
    } else if (e.key === "ArrowRight") {
      handleNextVideo();
    }
  };

  const handleShareVideo = async (e: React.MouseEvent, url: string | null) => {
    e.preventDefault();
    e.stopPropagation();
    if (!url) return;

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

      const gemLabel = gem ? `${gem}` : "Gemstone";
      const shapeLabel = shape ? ` ${shape}` : "";
      const shareTitle = `B.V. Gems - ${gemLabel}${shapeLabel}`;

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: shareTitle,
        });
      } else {
        // Fallback to sharing URL if files aren't supported on this browser/OS
        if (navigator.share) {
          await navigator.share({
            title: shareTitle,
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

  useEffect(() => {
    let active = true;
    setIsLoaded(false);

    if (!gem || !shape) {
      setVideoList([]);
      setCurrentIndex(0);
      return;
    }

    // If gem has both Natural and Lab Grown available, and user hasn't selected any type yet: DO NOT SHOW VIDEO
    if (availableTypes && availableTypes.length > 1 && (!selectedTypes || selectedTypes.length === 0)) {
      setVideoList([]);
      setCurrentIndex(0);
      return;
    }

    const isSapphire = gem.toLowerCase() === "sapphire";
    const colorMatch = (isSapphire && selectedSapphireColors && selectedSapphireColors.length > 0) ? selectedSapphireColors[0] : null;

    const fetchVideoForShape = async (shapeToTest: string): Promise<{ videoUrl: string; label: string | null }[] | null> => {
      try {
        const res: any = await getShapesData(shapeToTest, gem, isSapphire, colorMatch || undefined);
        const items = res?.data || [];
        if (!items || items.length === 0) return null;

        // Group by quality to check distinct types
        const distinctTypesInItems = new Set<string>();
        items.forEach((item: any) => {
          const isLab = String(item.quality || "").toLowerCase().includes("lab") || 
                        String(item.type || "").toLowerCase().includes("lab");
          distinctTypesInItems.add(isLab ? "Lab Grown" : "Natural");
        });

        const gemHasMultipleTypes = (availableTypes && availableTypes.length > 1) || distinctTypesInItems.size > 1;
        const userHasSelectedType = selectedTypes && selectedTypes.length > 0;

        // If the gem has both Natural and Lab Grown, but user hasn't selected a type, DO NOT SHOW VIDEO
        if (gemHasMultipleTypes && !userHasSelectedType) {
          return null;
        }

        let gradePriorities: string[] = [];
        if (userHasSelectedType) {
          if (selectedTypes.includes("Lab Grown")) {
            gradePriorities = ["Lab Grown"];
          } else if (selectedTypes.includes("Natural")) {
            if (selectedGrades && selectedGrades.length > 0) {
              gradePriorities = [selectedGrades[0], "AAA", "AA", "A"].filter(Boolean);
            } else {
              gradePriorities = ["AAA", "AA", "A"];
            }
          }
        } else {
          // Only for single-type gem (e.g. only Lab Grown like Paraiba, or only Natural like Morganite)
          const singleType = (availableTypes && availableTypes.length === 1)
            ? availableTypes[0]
            : Array.from(distinctTypesInItems)[0];

          if (singleType === "Lab Grown") {
            gradePriorities = ["Lab Grown"];
          } else {
            if (selectedGrades && selectedGrades.length > 0) {
              gradePriorities = [selectedGrades[0], "AAA", "AA", "A"].filter(Boolean);
            } else {
              gradePriorities = ["AAA", "AA", "A"];
            }
          }
        }

        if (gradePriorities.length === 0) return null;

        for (const grade of gradePriorities) {
          const matchingItems = items.filter((item: any) => item.quality === grade);
          const seenUrls = new Set<string>();
          const gradeVideos: any[] = [];

          for (const itm of matchingItems) {
            if (Array.isArray(itm?.cloudinary_videos)) {
              for (const v of itm.cloudinary_videos) {
                if (v?.video_url && !seenUrls.has(v.video_url)) {
                  seenUrls.add(v.video_url);
                  gradeVideos.push(v);
                }
              }
            }
          }

          if (gradeVideos.length > 0) {
            // Sort videos: Colombian first, Zambian second (for emeralds)
            const sortedVideos = [...gradeVideos].sort((a: any, b: any) => {
              const labelA = (a.emerald_type || a.label || "").toLowerCase();
              const labelB = (b.emerald_type || b.label || "").toLowerCase();
              if (labelA === "colombian" && labelB !== "colombian") return -1;
              if (labelB === "colombian" && labelA !== "colombian") return 1;
              if (labelA === "zambian" && labelB !== "zambian") return -1;
              if (labelB === "zambian" && labelA !== "zambian") return 1;
              return 0;
            });

            let candidateVideos = sortedVideos;
            if (colorMatch) {
              const colorMatching = sortedVideos.filter((v: any) => {
                const lbl = (v.label || v.emerald_type || "").toLowerCase();
                return lbl.includes(colorMatch.toLowerCase());
              });
              if (colorMatching.length > 0) {
                candidateVideos = colorMatching;
              }
            }

            const videoObjects = candidateVideos.map((videoItem: any) => {
              const itemLabel = videoItem.label || videoItem.emerald_type || grade;
              return {
                videoUrl: videoItem.video_url as string,
                label: itemLabel as string | null,
              };
            });

            if (videoObjects.length > 0) {
              return videoObjects;
            }
          }
        }

        return null;
      } catch (err) {
        return null;
      }
    };

    const run = async () => {
      if (!shape) {
        if (active) {
          setVideoList([]);
          setCurrentIndex(0);
        }
        return;
      }

      // Only fetch video for the selected shape
      const result = await fetchVideoForShape(shape);
      if (active) {
        setVideoList(result || []);
        setCurrentIndex(0);
      }
    };

    run();

    return () => { active = false; };
  }, [gem, shape, selectedTypes, availableTypes, selectedGrades, selectedSapphireColors]);

  if (videoList.length === 0 || !currentVideoUrl) return null;

  return (
    <div className={`flex justify-center items-center transition-all duration-700 ease-out ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
      <div 
        tabIndex={0}
        onKeyDown={handleKeyDown}
        className="relative group overflow-hidden bg-white/50 backdrop-blur-3xl rounded-[2.5rem] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.08)] border border-black/[0.03] p-2 ring-1 ring-black/[0.02] outline-none focus-visible:ring-2 focus-visible:ring-black/20"
      >
        <div
          ref={videoContainerRef}
          className="relative aspect-square w-[280px] md:w-[320px] lg:w-[280px] xl:w-[320px] rounded-[2rem] overflow-hidden bg-[#fbfbfd] cursor-zoom-in select-none"
          onMouseMove={handleVideoMouseMove}
          onMouseEnter={() => setIsVideoZoomed(true)}
          onMouseLeave={() => setIsVideoZoomed(false)}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <video
            ref={(el) => {
              if (el) {
                if (el.readyState >= 3) {
                  setIsLoaded(true);
                }
                el.play().catch(() => {});
              }
            }}
            key={currentVideoUrl}
            src={currentVideoUrl}
            autoPlay
            loop
            muted
            playsInline
            className={`w-full h-full object-cover transition-transform duration-100 ease-linear ${
              isVideoZoomed ? "scale-[2]" : "scale-[1]"
            }`}
            style={{
              transformOrigin: `${videoZoomPos.x}% ${videoZoomPos.y}%`,
            }}
            onCanPlay={() => setIsLoaded(true)}
            onLoadedData={() => setIsLoaded(true)}
            onError={() => setIsLoaded(false)}
          />

          {isVideoZoomed && (
            <div className="absolute inset-0 border-[3px] border-black/30 rounded-[2rem] pointer-events-none z-10" />
          )}

          {/* Subtle elegant gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-black/15 pointer-events-none" />

          {/* Counter Badge (Apple style pill, top-left) */}
          {videoList.length > 1 && (
            <div className="absolute top-3 left-3 z-20 bg-black/40 text-white/95 px-2.5 py-1 rounded-full backdrop-blur-md border border-white/20 shadow-sm text-[11px] font-medium tracking-wider flex items-center justify-center pointer-events-none select-none">
              <span>{currentIndex + 1}</span>
              <span className="mx-1 text-white/50">/</span>
              <span className="text-white/70">{videoList.length}</span>
            </div>
          )}

          {/* Share Video Button (top-right) */}
          <button
            onClick={(e) => handleShareVideo(e, currentVideoUrl)}
            disabled={isSharingVideo}
            className="absolute top-3 right-3 z-20 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full backdrop-blur-md transition-all disabled:opacity-50 cursor-pointer active:scale-95 shadow-md flex items-center justify-center border border-white/20"
            title="Share Video"
            aria-label="Share Video"
          >
            {isSharingVideo ? <Loader size={18} color="white" /> : <IconShare size={18} stroke={1.5} />}
          </button>

          {/* Apple-style Concise Left & Right Arrow Buttons */}
          {videoList.length > 1 && (
            <>
              <button
                type="button"
                onClick={handlePrevVideo}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-black/40 hover:bg-black/65 active:scale-90 text-white backdrop-blur-md border border-white/25 shadow-[0_4px_12px_rgba(0,0,0,0.25)] flex items-center justify-center transition-all cursor-pointer opacity-90 hover:opacity-100 group/btn"
                aria-label="Previous video"
                title="Previous video"
              >
                <IconChevronLeft size={18} stroke={2.5} className="transition-transform group-hover/btn:-translate-x-0.5" />
              </button>

              <button
                type="button"
                onClick={handleNextVideo}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-black/40 hover:bg-black/65 active:scale-90 text-white backdrop-blur-md border border-white/25 shadow-[0_4px_12px_rgba(0,0,0,0.25)] flex items-center justify-center transition-all cursor-pointer opacity-90 hover:opacity-100 group/btn"
                aria-label="Next video"
                title="Next video"
              >
                <IconChevronRight size={18} stroke={2.5} className="transition-transform group-hover/btn:translate-x-0.5" />
              </button>
            </>
          )}

          {/* Elegant frosted label */}
          {currentLabel && (
            <div className={`absolute ${videoList.length > 1 ? 'bottom-6' : 'bottom-5'} left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none z-10 transition-all duration-300`}>
              <div className="bg-white/30 backdrop-blur-xl border border-white/40 text-gray-900 px-4 py-1.5 rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.05)] whitespace-nowrap">
                <span className="text-[11px] font-medium tracking-[0.15em] uppercase drop-shadow-sm mix-blend-color-burn whitespace-nowrap">
                  {currentLabel}
                </span>
              </div>
            </div>
          )}

          {/* Bottom Pagination Dots (Apple style pill/dots) */}
          {videoList.length > 1 && (
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-20 pointer-events-auto">
              {videoList.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setCurrentIndex(idx);
                    setIsVideoZoomed(false);
                  }}
                  className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                    idx === currentIndex
                      ? "w-4 bg-white shadow-[0_1px_4px_rgba(0,0,0,0.4)]"
                      : "w-1.5 bg-white/45 hover:bg-white/80"
                  }`}
                  aria-label={`Go to video ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export const GridViewTopFilters = ({


  gemstoneOptions,
  shapeOptions,
  selectedGems,
  setSelectedGems,
  selectedShapes,
  setSelectedShapes,
  weight,
  setWeight,
  weightBounds,
  selectedDimensions,
  setSelectedDimensions,
  availableDimensionsGrouped,
  toleranceEnabled,
  setToleranceEnabled,
  sapphireColors,
  selectedSapphireColors,
  setSelectedSapphireColors,
  topazVariants = [],
  selectedTopazVariants = [],
  setSelectedTopazVariants,
  selectedTypes,
  setSelectedTypes,
  availableTypes,
  selectedGrades,
  setSelectedGrades,
  availableGrades,
  resetAll
}: TopFiltersProps) => {

  const toggleGem = (val: string) => {
    if (selectedGems.length === 1 && selectedGems[0] === val) {
      setSelectedGems([]);
      setSelectedSapphireColors([]);
      if (setSelectedTopazVariants) {
        setSelectedTopazVariants([]);
      }
    } else {
      if (val !== "Sapphire") {
        setSelectedSapphireColors([]);
      }
      if (val !== "Topaz" && setSelectedTopazVariants) {
        setSelectedTopazVariants([]);
      }
      setSelectedGems([val]);
    }
  };

  const removeGem = (val: string) => {
    const newGems = selectedGems.filter(g => g !== val);
    setSelectedGems(newGems);
    if (!newGems.includes("Sapphire")) {
      setSelectedSapphireColors([]);
    }
    if (!newGems.includes("Topaz") && setSelectedTopazVariants) {
      setSelectedTopazVariants([]);
    }
  };

  const toggleSapphireColor = (val: string) => {
    if (selectedSapphireColors.includes(val)) setSelectedSapphireColors([]);
    else setSelectedSapphireColors([val]);
  };

  const toggleTopazVariant = (val: string) => {
    if (!setSelectedTopazVariants) return;
    if (selectedTopazVariants.includes(val)) setSelectedTopazVariants([]);
    else setSelectedTopazVariants([val]);
  };

  const toggleShape = (val: string) => {
    if (selectedShapes.includes(val)) setSelectedShapes([]);
    else setSelectedShapes([val]);
  };

  const [isFiltersVisible, setIsFiltersVisible] = useState(true);

  const hasActiveFilters = selectedGems.length > 0 || selectedShapes.length > 0 || weight !== "" || Object.keys(selectedDimensions).some(k => selectedDimensions[k].length > 0) || (selectedGems.includes("Sapphire") && selectedSapphireColors.length > 0) || (selectedGems.includes("Topaz") && selectedTopazVariants.length > 0) || selectedTypes.length > 0 || selectedGrades.length > 0;

  const allDims = new Set<string>();
  Object.values(availableDimensionsGrouped).forEach(dims => dims.forEach(d => allDims.add(d)));
  const combinedDims = Array.from(allDims).sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
  const gemStr = selectedGems.length > 0 ? ` ${selectedGems[0]}` : "";
  const shapeStr = selectedShapes.length > 0 ? ` ${selectedShapes[0]}` : "";
  const dimensionLabel = `${gemStr}${shapeStr} DIMENSIONS`.trim().toUpperCase();

  return (
    <div className="w-full bg-white shadow-sm border border-gray-100 rounded-lg mb-10 relative z-10">
      {/* SMOOTH GRID COLLAPSE */}
      <div className={`grid transition-all duration-300 ease-in-out ${isFiltersVisible ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
        <div className="overflow-hidden">
          <div className="p-6">

            {/* MOBILE FILTERS (Selects - Single Rows) */}
            <div className="flex lg:hidden flex-col items-center w-full gap-4 mb-6">
              {/* 1. Gem Type */}
              <div className="flex flex-col w-full max-w-[280px]">
                <label className="text-[11px] font-semibold text-gray-500 mb-1.5 uppercase tracking-wider text-left">
                  Gem Type
                </label>
                <Select
                  placeholder="Select Gem Type"
                  size="md"
                  radius="md"
                  data={gemstoneOptions.map((gem: any) => ({
                    label: gem.label,
                    value: gem.value,
                  }))}
                  value={selectedGems.length > 0 ? selectedGems[0] : null}
                  onChange={(val) => {
                    setSelectedGems(val ? [val] : []);
                    if (selectedGems.includes("Sapphire") && val !== "Sapphire") {
                      setSelectedSapphireColors([]);
                    }
                    if (document.activeElement instanceof HTMLElement) {
                      document.activeElement.blur();
                    }
                  }}
                  clearable={false}
                  searchable
                  className="w-full"
                  renderOption={({ option }) => {
                    const gemOption = gemstoneOptions.find(g => g.value === option.value);
                    return (
                      <div className="flex items-center gap-3">
                        {gemOption && (
                          <div className="w-6 h-6 shrink-0 flex items-center justify-center overflow-hidden">
                            <img src={gemOption.image} alt={option.label} className="w-full h-full object-contain scale-[2.2]" />
                          </div>
                        )}
                        <span>{option.label}</span>
                      </div>
                    );
                  }}
                />
              </div>

              {/* Sapphire Colors (if Sapphire selected) */}
              {selectedGems.includes("Sapphire") && sapphireColors.length > 0 && (
                <div className="flex flex-col w-full max-w-[280px]">
                  <label className="text-[11px] font-semibold text-gray-500 mb-1.5 uppercase tracking-wider text-left">
                    Color
                  </label>
                  <MultiSelect
                    placeholder="Any Color"
                    size="md"
                    radius="md"
                    data={sapphireColors.map((c: any) => ({
                      label: c,
                      value: c,
                    }))}
                    value={selectedSapphireColors}
                    onChange={(val) => {
                      setSelectedSapphireColors(val);
                      if (document.activeElement instanceof HTMLElement) {
                        document.activeElement.blur();
                      }
                    }}
                    clearable={false}
                    className="w-full"
                    renderOption={({ option }) => {
                      const colorOption = shopByColorOptions.find(o => o.name.toLowerCase() === option.value.toLowerCase());
                      return (
                        <div className="flex items-center gap-3">
                          {colorOption?.image ? (
                            <div className="w-6 h-6 shrink-0 flex items-center justify-center overflow-hidden">
                              <img src={colorOption.image} alt={option.label} className="w-full h-full object-contain scale-[2.2]" />
                            </div>
                          ) : (
                            <div className="w-5 h-5 rounded-full border border-gray-200" style={{ backgroundColor: (colorOption as any)?.color || '#ccc' }} />
                          )}
                          <span>{option.label}</span>
                        </div>
                      );
                    }}
                  />
                </div>
              )}

              {/* Topaz Colors (if Topaz selected) */}
              {selectedGems.includes("Topaz") && (
                <div className="flex flex-col w-full max-w-[280px]">
                  <label className="text-[11px] font-semibold text-gray-500 mb-1.5 uppercase tracking-wider text-left">
                    Color
                  </label>
                  <MultiSelect
                    placeholder="Any Color"
                    size="md"
                    radius="md"
                    data={(topazVariants.length > 0 ? topazVariants : ["Sky Blue", "Swiss Blue", "London Blue"]).map((v: any) => ({
                      label: v,
                      value: v,
                    }))}
                    value={selectedTopazVariants}
                    onChange={(val) => {
                      if (setSelectedTopazVariants) setSelectedTopazVariants(val);
                      if (document.activeElement instanceof HTMLElement) {
                        document.activeElement.blur();
                      }
                    }}
                    clearable={false}
                    className="w-full"
                    renderOption={({ option }) => {
                      const variantImages: Record<string, string> = {
                        "Swiss Blue": "https://res.cloudinary.com/oko8ywzn/image/upload/v1793038839/Gemstone%20Shapes/Topaz/Swiss_Blue/AA/topaz-swiss-blue-natural-aa-round.png",
                        "London Blue": "https://res.cloudinary.com/oko8ywzn/image/upload/v1793038910/Gemstone%20Shapes/Topaz/London_Blue/AA/topaz-london-blue-natural-aa-round.png",
                        "Sky Blue": "https://res.cloudinary.com/oko8ywzn/image/upload/v1793038894/Gemstone%20Shapes/Topaz/Sky_Blue/AA/topaz-sky-blue-natural-aa-round.png",
                      };
                      const img = variantImages[option.value];
                      return (
                        <div className="flex items-center gap-3">
                          {img && (
                            <div className="w-6 h-6 shrink-0 flex items-center justify-center overflow-hidden">
                              <img src={img} alt={option.label} className="w-full h-full object-contain scale-[2.2]" />
                            </div>
                          )}
                          <span>{option.label}</span>
                        </div>
                      );
                    }}
                  />
                </div>
              )}

              {/* 2. Shape */}
              <div className="flex flex-col w-full max-w-[280px]">
                <label className="text-[11px] font-semibold text-gray-500 mb-1.5 uppercase tracking-wider text-left">
                  Shape
                </label>
                <Select
                  placeholder="Select Gem Shape"
                  size="md"
                  radius="md"
                  data={shapeOptions.map((s: any) => ({
                    label: s.label,
                    value: s.value,
                  }))}
                  value={selectedShapes.length > 0 ? selectedShapes[0] : null}
                  onChange={(val) => {
                    setSelectedShapes(val ? [val] : []);
                    if (document.activeElement instanceof HTMLElement) {
                      document.activeElement.blur();
                    }
                  }}
                  clearable={false}
                  searchable
                  className="w-full"
                  renderOption={({ option }) => {
                    const shapeOption = shapeOptions.find(s => s.value === option.value);
                    return (
                      <div className="flex items-center gap-3">
                        {shapeOption && <img src={shapeOption.image} alt={option.label} className="w-5 h-5 object-contain opacity-70" />}
                        <span>{option.label}</span>
                      </div>
                    );
                  }}
                />
              </div>

              {/* 3. Dimension */}
              <div className="flex flex-col w-full max-w-[280px]">
                <label className="text-[11px] font-semibold text-gray-500 mb-1.5 uppercase tracking-wider text-left">
                  {dimensionLabel}
                </label>
                <MultiSelect
                  placeholder="Select Size"
                  size="md"
                  radius="md"
                  data={combinedDims.map(d => ({ value: d, label: d }))}
                  value={selectedDimensions["Any"] || []}
                  onChange={(val) => {
                    setSelectedDimensions(prev => ({ ...prev, "Any": val }));
                    if (document.activeElement instanceof HTMLElement) {
                      document.activeElement.blur();
                    }
                  }}
                  searchable
                  clearable={false}
                  className="w-full"
                />
              </div>

              {/* 4. Type */}
              {availableTypes.length > 0 && (
                <div className="flex flex-col w-full max-w-[280px]">
                  <label className="text-[11px] font-semibold text-gray-500 mb-1.5 uppercase tracking-wider text-left">
                    Type
                  </label>
                  <Select
                    placeholder="Select"
                    size="md"
                    radius="md"
                    data={availableTypes.map(t => ({ value: t, label: t }))}
                    value={selectedTypes.length > 0 ? selectedTypes[0] : null}
                    onChange={(val) => {
                      setSelectedTypes(val ? [val] : []);
                      if (document.activeElement instanceof HTMLElement) {
                        document.activeElement.blur();
                      }
                    }}
                    searchable
                    clearable={false}
                    className="w-full"
                  />
                </div>
              )}

              {/* Grade (if Natural selected and availableGrades exists) */}
              {selectedTypes.includes("Natural") && availableGrades.length > 0 && (
                <div className="flex flex-col w-full max-w-[280px]">
                  <label className="text-[11px] font-semibold text-gray-500 mb-1.5 uppercase tracking-wider text-left">
                    Grade
                  </label>
                  <Select
                    placeholder="Select"
                    size="md"
                    radius="md"
                    data={availableGrades.map(g => ({ value: g, label: g }))}
                    value={selectedGrades.length > 0 ? selectedGrades[0] : null}
                    onChange={(val) => {
                      setSelectedGrades(val ? [val] : []);
                      if (document.activeElement instanceof HTMLElement) {
                        document.activeElement.blur();
                      }
                    }}
                    searchable
                    clearable={false}
                    className="w-full"
                  />
                </div>
              )}

              {/* 5. Weight (CT) */}
              <div className="flex flex-col w-full max-w-[280px]">
                <label className="text-[11px] font-semibold text-gray-500 mb-1.5 uppercase tracking-wider text-left">
                  Weight (CT)
                </label>
                <NumberInput
                  value={weight}
                  onChange={(val) => setWeight(val.toString())}
                  placeholder="Enter weight"
                  size="md"
                  radius="md"
                  min={0}
                  max={weightBounds.max}
                  styles={{ input: { fontSize: '14px' } }}
                  hideControls
                  className="w-full"
                />
              </div>

              {/* 6. Video (if any) */}
              {selectedGems.length > 0 && selectedShapes.length > 0 && (
                <div className="w-full flex justify-center mt-2">
                  <GemVideo
                    gem={selectedGems[0]}
                    shape={selectedShapes[0]}
                    selectedTypes={selectedTypes}
                    availableTypes={availableTypes}
                    selectedGrades={selectedGrades}
                    selectedSapphireColors={selectedSapphireColors}
                  />
                </div>
              )}
            </div>

            {/* WRAPPER FOR SIDE-BY-SIDE VIDEO (DESKTOP) */}
            <div className="hidden lg:flex flex-col lg:flex-row w-full gap-8 lg:gap-12">
              
              {/* Left Side: All Desktop & Bottom Filters */}
              <div className="flex-1 flex flex-col w-full min-w-0">

                {/* DESKTOP FILTERS (Icons) */}
                <div className="flex flex-col lg:flex-row gap-10">


                  {/* GEM TYPE */}
                  <div className="flex flex-col items-center lg:items-start gap-4">
                    <label className="text-sm font-bold text-[#0b182d] uppercase tracking-wide text-center lg:text-left">Gem Type</label>
                    <div className="flex flex-wrap justify-center lg:justify-start gap-4">
                      {gemstoneOptions.map((gem, i) => {
                        const isSelected = selectedGems.length === 1 && selectedGems.includes(gem.value);
                        const gemScale =
                          gem.value === "Alexandrite"
                            ? "scale-[2.4]"
                            : gem.value === "Paraiba Tourmaline"
                            ? "scale-[2.05]"
                            : gem.value === "Morganite" || gem.value === "Peridot"
                            ? "scale-[2.12]"
                            : "scale-[2.2]";
                        return (
                          <div
                            key={i}
                            onClick={() => toggleGem(gem.value)}
                            className={`w-20 flex flex-col items-center gap-2 cursor-pointer ${isSelected ? 'opacity-100' : 'opacity-40 hover:opacity-70'}`}
                          >
                            <div className="w-16 h-16 shrink-0 flex items-center justify-center overflow-hidden">
                              <img src={gem.image} alt={gem.label} className={`w-full h-full object-contain ${gemScale}`} />
                            </div>
                            <span className={`text-xs text-center leading-tight ${isSelected ? 'font-bold text-[#0b182d]' : 'font-medium text-gray-600'}`}>{gem.label}</span>
                          </div>
                        );
                      })}
                    </div>

                    {/* SAPPHIRE COLORS SUB-FILTER */}
                    {selectedGems.length === 1 && selectedGems.includes("Sapphire") && sapphireColors.length > 0 && (
                      <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-100 flex flex-col items-center lg:items-start">
                        <label className="text-xs font-bold text-gray-700 uppercase tracking-wide mb-3 block text-center lg:text-left">Sapphire Colors</label>
                        <div className="flex flex-wrap justify-center lg:justify-start gap-4">
                          {sapphireColors.map((color, idx) => {
                            const isSelected = selectedSapphireColors.includes(color);
                            const colorOption = shopByColorOptions.find(o => o.name.toLowerCase() === color.toLowerCase());
                            const imgUrl = colorOption ? colorOption.image : null;
                            const cLower = color.toLowerCase();
                            const colorScale =
                              cLower === "white"
                                ? "scale-[2.3]"
                                : cLower === "pink"
                                ? "scale-[2.25]"
                                : cLower === "black"
                                ? "scale-[2.07]"
                                : cLower === "peach"
                                ? "scale-[2.14]"
                                : cLower === "brown"
                                ? "scale-[1.85]"
                                : "scale-[2.2]";

                            return (
                              <div
                                key={idx}
                                onClick={() => toggleSapphireColor(color)}
                                className={`w-20 flex flex-col items-center gap-2 cursor-pointer ${isSelected ? 'opacity-100' : 'opacity-40 hover:opacity-70'}`}
                              >
                                {imgUrl ? (
                                  <div className="w-16 h-16 shrink-0 flex items-center justify-center overflow-hidden">
                                    <img src={imgUrl} alt={color} className={`w-full h-full object-contain ${colorScale}`} />
                                  </div>
                                ) : (
                                  <div className={`w-16 h-16 shrink-0 rounded-full shadow-sm flex items-center justify-center bg-gray-100`}>
                                    <span className="text-xs font-bold text-gray-400">{color.substring(0, 3).toUpperCase()}</span>
                                  </div>
                                )}
                                <span className={`text-xs text-center leading-tight ${isSelected ? 'font-bold text-[#0b182d]' : 'font-medium text-gray-600'}`}>{color}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* TOPAZ COLORS SUB-FILTER */}
                    {selectedGems.length === 1 && selectedGems.includes("Topaz") && (
                      <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-100 flex flex-col items-center lg:items-start">
                        <label className="text-xs font-bold text-gray-700 uppercase tracking-wide mb-3 block text-center lg:text-left">Topaz Colors</label>
                        <div className="flex flex-wrap justify-center lg:justify-start gap-4">
                          {(topazVariants.length > 0 ? topazVariants : ["Sky Blue", "Swiss Blue", "London Blue"]).map((variant, idx) => {
                            const isSelected = selectedTopazVariants.includes(variant);
                            const variantImages: Record<string, string> = {
                              "Swiss Blue": "https://res.cloudinary.com/oko8ywzn/image/upload/v1793038839/Gemstone%20Shapes/Topaz/Swiss_Blue/AA/topaz-swiss-blue-natural-aa-round.png",
                              "London Blue": "https://res.cloudinary.com/oko8ywzn/image/upload/v1793038910/Gemstone%20Shapes/Topaz/London_Blue/AA/topaz-london-blue-natural-aa-round.png",
                              "Sky Blue": "https://res.cloudinary.com/oko8ywzn/image/upload/v1793038894/Gemstone%20Shapes/Topaz/Sky_Blue/AA/topaz-sky-blue-natural-aa-round.png",
                            };
                            const imgUrl = variantImages[variant];

                            return (
                              <div
                                key={idx}
                                onClick={() => toggleTopazVariant(variant)}
                                className={`w-20 flex flex-col items-center gap-2 cursor-pointer ${isSelected ? 'opacity-100' : 'opacity-40 hover:opacity-70'}`}
                              >
                                {imgUrl ? (
                                  <div className="w-16 h-16 shrink-0 flex items-center justify-center overflow-hidden">
                                    <img src={imgUrl} alt={variant} className="w-full h-full object-contain scale-[2.2]" />
                                  </div>
                                ) : (
                                  <div className={`w-16 h-16 shrink-0 rounded-full shadow-sm flex items-center justify-center bg-gray-100`}>
                                    <span className="text-xs font-bold text-gray-400">{variant.substring(0, 3).toUpperCase()}</span>
                                  </div>
                                )}
                                <span className={`text-xs text-center leading-tight ${isSelected ? 'font-bold text-[#0b182d]' : 'font-medium text-gray-600'}`}>{variant}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* SHAPE */}
                  <div className="flex flex-col items-center lg:items-start gap-4">
                    <label className="text-sm font-bold text-[#0b182d] uppercase tracking-wide text-center lg:text-left">Shape</label>
                    <div className="flex flex-wrap justify-center lg:justify-start gap-4">
                      {shapeOptions.map((shape, i) => {
                        const isSelected = selectedShapes.includes(shape.value);
                        return (
                          <div
                            key={i}
                            onClick={() => toggleShape(shape.value)}
                            className={`flex flex-col items-center gap-2 cursor-pointer ${isSelected ? 'opacity-100 text-[#0b182d]' : 'opacity-30 hover:opacity-60 text-gray-500'}`}
                          >
                            <div className={`w-16 h-16 flex items-center justify-center`}>
                              <img src={shape.image} alt={shape.label} className="w-full h-full object-contain" style={{ filter: isSelected ? 'brightness(0) drop-shadow(0px 2px 2px rgba(0,0,0,0.3))' : 'grayscale(100%)' }} />
                            </div>
                            <span className={`text-xs ${isSelected ? 'font-bold' : 'font-medium'}`}>{shape.label}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                </div>

                {/* Remapped bottom container */}
                <div className="flex flex-row gap-8 lg:gap-12 w-full mt-6">

                  {/* Left Side: Filters */}
                  <div className="flex-1 flex flex-wrap gap-8 items-start w-full">
                    <SingleNumberFilter label="Weight (CT)" value={weight} onChange={setWeight} bounds={weightBounds} />

                    <div className="flex flex-col gap-4 w-full lg:w-auto mx-auto lg:mx-0">
                      <MultiDropdownFilter
                        label={dimensionLabel}
                        value={selectedDimensions["Any"] || []}
                        onChange={(val) => {
                          setSelectedDimensions(prev => ({ ...prev, "Any": val }));
                        }}
                        optionsList={combinedDims}
                      />
                    </div>

                    {availableTypes.length > 0 && (
                      <SingleDropdownFilter
                        label="Type"
                        value={selectedTypes.length > 0 ? selectedTypes[0] : ""}
                        onChange={(val) => setSelectedTypes(val ? [val] : [])}
                        optionsList={availableTypes}
                      />
                    )}

                    {selectedTypes.includes("Natural") && availableGrades.length > 0 && (
                      <SingleDropdownFilter
                        label="Grade"
                        value={selectedGrades.length > 0 ? selectedGrades[0] : ""}
                        onChange={(val) => setSelectedGrades(val ? [val] : [])}
                        optionsList={availableGrades}
                      />
                    )}
                  </div>

                </div>
              </div>

              {/* Desktop Video (Sticky Right Side) */}
              <div className="w-[280px] xl:w-[320px] shrink-0 items-start justify-end">
                {selectedGems.length > 0 && selectedShapes.length > 0 && (
                  <div className="sticky top-24 pt-4">
                    <GemVideo
                      gem={selectedGems[0]}
                      shape={selectedShapes[0]}
                      selectedTypes={selectedTypes}
                      availableTypes={availableTypes}
                      selectedGrades={selectedGrades}
                      selectedSapphireColors={selectedSapphireColors}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Unified Custom Size Note */}
            <div className="mt-6 flex justify-center lg:justify-start w-full">
              <div className="text-[10px] text-gray-500 text-center lg:text-left italic w-full max-w-3xl">
                If your desired size isn’t listed, add the closest option to your cart and mention your required size in the order note. We’ll be happy to provide your exact size.
              </div>
            </div>

            {hasActiveFilters && (
              <div className="mt-8 flex items-center justify-center lg:justify-start gap-3 flex-wrap">
                <span className="text-sm font-bold text-gray-500">Selected</span>

                {selectedGems.map(gem => (
                  <div key={gem} className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full text-xs font-semibold text-gray-800">
                    {gem}
                    <IconX size={14} className="cursor-pointer" onClick={() => removeGem(gem)} />
                  </div>
                ))}

                {selectedGems.includes("Sapphire") && selectedSapphireColors.map(color => (
                  <div key={`color-${color}`} className="flex items-center gap-2 bg-blue-50 text-blue-800 px-3 py-1 rounded-full text-xs font-semibold">
                    {color}
                    <IconX size={14} className="cursor-pointer" onClick={() => toggleSapphireColor(color)} />
                  </div>
                ))}

                {selectedGems.includes("Topaz") && selectedTopazVariants.map(variant => (
                  <div key={`topaz-${variant}`} className="flex items-center gap-2 bg-blue-50 text-blue-800 px-3 py-1 rounded-full text-xs font-semibold">
                    {variant}
                    <IconX size={14} className="cursor-pointer" onClick={() => toggleTopazVariant(variant)} />
                  </div>
                ))}

                {selectedShapes.map(shape => (
                  <div key={shape} className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full text-xs font-semibold text-gray-800">
                    {shape}
                    <IconX size={14} className="cursor-pointer" onClick={() => toggleShape(shape)} />
                  </div>
                ))}

                {selectedTypes.map(type => (
                  <div key={type} className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full text-xs font-semibold text-gray-800">
                    {type}
                    <IconX size={14} className="cursor-pointer" onClick={() => setSelectedTypes(selectedTypes.filter(t => t !== type))} />
                  </div>
                ))}

                {selectedGrades.map(grade => (
                  <div key={grade} className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full text-xs font-semibold text-gray-800">
                    Grade {grade}
                    <IconX size={14} className="cursor-pointer" onClick={() => setSelectedGrades(selectedGrades.filter(g => g !== grade))} />
                  </div>
                ))}

                {weight !== "" && (
                  <div className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full text-xs font-semibold text-gray-800">
                    Weight: {weight} ct
                    <IconX size={14} className="cursor-pointer" onClick={() => setWeight("")} />
                  </div>
                )}

                {Object.entries(selectedDimensions).map(([groupKey, dims]) =>
                  dims.map((d, i) => (
                    <div key={`${groupKey}-${i}`} className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full text-xs font-semibold text-gray-800">
                      {groupKey}: {d}
                      <IconX size={14} className="cursor-pointer" onClick={() => setSelectedDimensions(prev => ({ ...prev, [groupKey]: prev[groupKey].filter(v => v !== d) }))} />
                    </div>
                  ))
                )}



                <button onClick={resetAll} className="text-red-600 text-sm font-bold hover:underline">
                  Reset Filters x
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* TOGGLE TAB */}
      <div
        className="absolute left-1/2 -translate-x-1/2 top-full bg-white border border-gray-100 border-t-0 rounded-b-xl w-12 h-6 flex items-center justify-center cursor-pointer hover:bg-gray-50 text-gray-500 hover:text-[#0b182d] transition-colors z-20"
        style={{ marginTop: '-1px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}
        onClick={() => setIsFiltersVisible(!isFiltersVisible)}
      >
        {isFiltersVisible ? <IconChevronUp size={18} /> : <IconChevronDown size={18} />}
      </div>
    </div>
  );
};
