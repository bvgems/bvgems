"use client";

import React, { useState, useEffect, useRef } from "react";
import { NumberInput, Select, MultiSelect, Button, ActionIcon, Collapse, Switch, Loader } from "@mantine/core";
import Image from "next/image";
import { IconX, IconChevronUp, IconChevronDown, IconFilter, IconShare } from "@tabler/icons-react";
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
}: {
  label: string;
  value: string[];
  onChange: (val: string[]) => void;
  optionsList: string[];
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
          placeholder="Select"
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
          placeholder="Select"
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



const GemVideo = ({ gem, shape, selectedTypes, selectedGrades, selectedSapphireColors }: any) => {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [label, setLabel] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isSharingVideo, setIsSharingVideo] = useState(false);

  const handleShareVideo = async (e: React.MouseEvent, url: string) => {
    e.preventDefault();
    e.stopPropagation();

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

    if (!gem) {
      setVideoUrl(null);
      return;
    }

    const isSapphire = gem.toLowerCase() === "sapphire";
    const colorMatch = (isSapphire && selectedSapphireColors && selectedSapphireColors.length > 0) ? selectedSapphireColors[0] : null;

    const fetchVideoForShape = async (shapeToTest: string) => {
      try {
        const res: any = await getShapesData(shapeToTest, gem, isSapphire, colorMatch || undefined);
        const items = res?.data || [];
        if (!items || items.length === 0) return null;

        // Group by quality to get representative items (like CategoryContent does)
        const qualityMap: Record<string, any> = {};
        items.forEach((item: any) => {
          const hasVideo = Array.isArray(item?.cloudinary_videos) && item.cloudinary_videos.length > 0;
          const current = qualityMap[item.quality];
          if (!current) {
            qualityMap[item.quality] = item;
          } else {
            const currentHasVideo = Array.isArray(current?.cloudinary_videos) && current.cloudinary_videos.length > 0;
            if (!currentHasVideo && hasVideo) {
              qualityMap[item.quality] = item;
            }
          }
        });
        const images = Object.values(qualityMap);

        let gradePriorities = ["AAA", "AA", "A", "Lab Grown"];
        if (selectedTypes.includes("Lab Grown") && !selectedTypes.includes("Natural")) {
          gradePriorities = ["Lab Grown"];
        } else if (selectedTypes.includes("Natural") && !selectedTypes.includes("Lab Grown")) {
          gradePriorities = ["AAA", "AA", "A"];
        }

        let foundVideo = null;
        let foundLabel = null;

        for (const grade of gradePriorities) {
          const gradeItem = images.find((item: any) => item.quality === grade);
          if (gradeItem?.cloudinary_videos && Array.isArray(gradeItem.cloudinary_videos) && gradeItem.cloudinary_videos.length > 0) {

            const sortedVideos = [...gradeItem.cloudinary_videos].sort((a: any, b: any) => {
              const labelA = (a.emerald_type || a.label || "").toLowerCase();
              const labelB = (b.emerald_type || b.label || "").toLowerCase();
              if (labelA === "colombian" && labelB !== "colombian") return -1;
              if (labelB === "colombian" && labelA !== "colombian") return 1;
              if (labelA === "zambian" && labelB !== "zambian") return -1;
              if (labelB === "zambian" && labelA !== "zambian") return 1;
              return 0;
            });

            const bestMatch = sortedVideos.find((v: any) => {
              const lbl = (v.label || v.emerald_type || "").toLowerCase();
              const matchesColor = colorMatch ? lbl.includes(colorMatch.toLowerCase()) : true;
              return matchesColor;
            });

            const videoItem = bestMatch || sortedVideos[0];

            if (videoItem?.video_url) {
              foundVideo = videoItem.video_url;
              foundLabel = videoItem.label || videoItem.emerald_type || grade;
              
              // If no shape was selected but we found a fallback shape, append the shape name to the label
              if (!shape && foundLabel) {
                 foundLabel = `${shapeToTest} - ${foundLabel}`;
              } else if (!shape && !foundLabel) {
                 foundLabel = shapeToTest;
              }
              break;
            }
          }
        }
        
        if (foundVideo) {
          return { videoUrl: foundVideo, label: foundLabel };
        }
        return null;
      } catch (err) {
        return null;
      }
    };

    const run = async () => {
      if (shape) {
        // Only try the selected shape
        const result = await fetchVideoForShape(shape);
        if (active) {
          setVideoUrl(result?.videoUrl || null);
          setLabel(result?.label || null);
        }
      } else {
        // Try shapes in fallback order
        const fallbackShapes = ["Round", "Oval", "Princess Cut", "Emerald Cut", "Pear", "Marquise", "Heart", "Straight Baguette", "Cushion", "Trillion"];
        let found = false;
        for (const testShape of fallbackShapes) {
          if (!active) return;
          const result = await fetchVideoForShape(testShape);
          if (result && result.videoUrl) {
            if (active) {
              setVideoUrl(result.videoUrl);
              setLabel(result.label);
            }
            found = true;
            break;
          }
        }
        if (!found && active) {
          setVideoUrl(null);
          setLabel(null);
        }
      }
    };

    run();

    return () => { active = false; };
  }, [gem, shape, selectedTypes, selectedGrades, selectedSapphireColors]);

  if (!videoUrl) return null;

  return (
    <div className={`flex justify-center items-center transition-all duration-700 ease-out ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
      <div className="relative group overflow-hidden bg-white/50 backdrop-blur-3xl rounded-[2.5rem] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.08)] border border-black/[0.03] p-2 ring-1 ring-black/[0.02]">
        <div className="relative aspect-square w-[280px] md:w-[320px] lg:w-[280px] xl:w-[320px] rounded-[2rem] overflow-hidden bg-[#fbfbfd]">
          <video
            ref={(el) => {
              if (el && el.readyState >= 3) {
                setIsLoaded(true);
              }
            }}
            key={videoUrl}
            src={videoUrl}
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
            onCanPlay={() => setIsLoaded(true)}
            onLoadedData={() => setIsLoaded(true)}
            onError={() => setIsLoaded(false)}
          />
          {/* Subtle elegant gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-60 pointer-events-none" />

          {/* Share Video Button */}
          <button
            onClick={(e) => handleShareVideo(e, videoUrl)}
            disabled={isSharingVideo}
            className="absolute top-3 right-3 z-20 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full backdrop-blur-md transition-all disabled:opacity-50 cursor-pointer active:scale-95 shadow-md flex items-center justify-center"
            title="Share Video"
            aria-label="Share Video"
          >
            {isSharingVideo ? <Loader size={18} color="white" /> : <IconShare size={18} stroke={1.5} />}
          </button>

          {/* Elegant frosted label */}
          {label && (
            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex flex-col items-center">
              <div className="bg-white/30 backdrop-blur-xl border border-white/40 text-gray-900 px-4 py-1.5 rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.05)] whitespace-nowrap">
                <span className="text-[11px] font-medium tracking-[0.15em] uppercase drop-shadow-sm mix-blend-color-burn whitespace-nowrap">
                  {label}
                </span>
              </div>
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
      if (val === "Sapphire") {
        setSelectedSapphireColors([]);
      }
    } else {
      if (selectedGems.includes("Sapphire") && val !== "Sapphire") {
        setSelectedSapphireColors([]);
      }
      setSelectedGems([val]);
    }
  };

  const removeGem = (val: string) => {
    const newGems = selectedGems.filter(g => g !== val);
    setSelectedGems(newGems);
    if (val === "Sapphire") {
      setSelectedSapphireColors([]);
    }
  };

  const toggleSapphireColor = (val: string) => {
    if (selectedSapphireColors.includes(val)) setSelectedSapphireColors([]);
    else setSelectedSapphireColors([val]);
  };

  const toggleShape = (val: string) => {
    if (selectedShapes.includes(val)) setSelectedShapes([]);
    else setSelectedShapes([val]);
  };

  const [isFiltersVisible, setIsFiltersVisible] = useState(true);

  const hasActiveFilters = selectedGems.length > 0 || selectedShapes.length > 0 || weight !== "" || Object.keys(selectedDimensions).some(k => selectedDimensions[k].length > 0) || selectedSapphireColors.length > 0 || selectedTypes.length > 0 || selectedGrades.length > 0;

  const allDims = new Set<string>();
  Object.values(availableDimensionsGrouped).forEach(dims => dims.forEach(d => allDims.add(d)));
  const combinedDims = Array.from(allDims).sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
  const gemStr = selectedGems.length > 0 ? ` ${selectedGems[0]}` : " ANY GEM";
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
                  placeholder="Any Gem Type"
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
                        {gemOption && <img src={gemOption.image} alt={option.label} className="w-6 h-6 object-contain" />}
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
                            <img src={colorOption.image} alt={option.label} className="w-6 h-6 object-contain" />
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

              {/* 2. Shape */}
              <div className="flex flex-col w-full max-w-[280px]">
                <label className="text-[11px] font-semibold text-gray-500 mb-1.5 uppercase tracking-wider text-left">
                  Shape
                </label>
                <Select
                  placeholder="Any Shape"
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
                  placeholder="Select"
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
              {selectedGems.length > 0 && (
                <div className="w-full flex justify-center mt-2">
                  <GemVideo
                    gem={selectedGems[0]}
                    shape={selectedShapes.length > 0 ? selectedShapes[0] : null}
                    selectedTypes={selectedTypes}
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
                        return (
                          <div
                            key={i}
                            onClick={() => toggleGem(gem.value)}
                            className={`w-20 flex flex-col items-center gap-2 cursor-pointer ${isSelected ? 'opacity-100' : 'opacity-40 hover:opacity-70'}`}
                          >
                            <div className="w-14 h-14 shrink-0 flex items-center justify-center">
                              <img src={gem.image} alt={gem.label} className="w-full h-full object-contain" />
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

                            return (
                              <div
                                key={idx}
                                onClick={() => toggleSapphireColor(color)}
                                className={`w-14 flex flex-col items-center gap-2 cursor-pointer ${isSelected ? 'opacity-100' : 'opacity-40 hover:opacity-70'}`}
                              >
                                {imgUrl ? (
                                  <div className="w-12 h-12 shrink-0 flex items-center justify-center">
                                    <img src={imgUrl} alt={color} className={`w-full h-full object-contain ${color.toLowerCase() === 'brown' ? 'scale-[0.85]' : ''}`} />
                                  </div>
                                ) : (
                                  <div className={`w-12 h-12 shrink-0 rounded-full shadow-sm flex items-center justify-center bg-gray-100`}>
                                    <span className="text-[10px] font-bold text-gray-400">{color.substring(0, 3).toUpperCase()}</span>
                                  </div>
                                )}
                                <span className={`text-[10px] text-center leading-tight ${isSelected ? 'font-bold text-[#0b182d]' : 'font-medium text-gray-600'}`}>{color}</span>
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
                {selectedGems.length > 0 && (
                  <div className="sticky top-24 pt-4">
                    <GemVideo
                      gem={selectedGems[0]}
                      shape={selectedShapes.length > 0 ? selectedShapes[0] : null}
                      selectedTypes={selectedTypes}
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

                {selectedSapphireColors.map(color => (
                  <div key={`color-${color}`} className="flex items-center gap-2 bg-blue-50 text-blue-800 px-3 py-1 rounded-full text-xs font-semibold">
                    {color} Sapphire
                    <IconX size={14} className="cursor-pointer" onClick={() => toggleSapphireColor(color)} />
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
