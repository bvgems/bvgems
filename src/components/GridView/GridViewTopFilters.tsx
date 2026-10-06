"use client";

import React, { useState, useEffect, useRef } from "react";
import { NumberInput, Select, MultiSelect, Button, ActionIcon, Collapse, Switch } from "@mantine/core";
import Image from "next/image";
import { IconX, IconChevronUp, IconChevronDown, IconFilter } from "@tabler/icons-react";
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


import { getCategoryData } from "@/apis/api";


const GemVideo = ({ gem, shape, selectedTypes, selectedGrades, selectedSapphireColors }: any) => {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [label, setLabel] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    let active = true;
    setIsLoaded(false);
    
    if (!gem) {
      setVideoUrl(null);
      return;
    }

    getCategoryData(gem.toLowerCase()).then((data) => {
      if (!active) return;
      
      const images = data?.availableQualityImages;
      if (!images || images.length === 0) {
        setVideoUrl(null);
        return;
      }
      
      const shapeToUse = shape || "Round";
      const isSapphire = gem.toLowerCase() === "sapphire";
      const colorMatch = (isSapphire && selectedSapphireColors && selectedSapphireColors.length > 0) ? selectedSapphireColors[0] : null;
      
      // Determine grade priorities based on selected types
      let gradePriorities = ["AA", "A", "B", "Lab Grown"];
      if (selectedTypes.includes("Lab Grown") && !selectedTypes.includes("Natural")) {
         gradePriorities = ["Lab Grown"];
      } else if (selectedTypes.includes("Natural") && !selectedTypes.includes("Lab Grown")) {
         gradePriorities = ["AA", "A", "B"];
      }

      let foundVideo = null;
      let foundLabel = null;

      for (const grade of gradePriorities) {
          const gradeItem = images.find((item: any) => item.quality === grade);
          if (gradeItem?.cloudinary_videos && Array.isArray(gradeItem.cloudinary_videos) && gradeItem.cloudinary_videos.length > 0) {
               
               // First try to find shape AND color match
               const bestMatch = gradeItem.cloudinary_videos.find((v: any) => {
                  const lbl = (v.label || v.emerald_type || "").toLowerCase();
                  const matchesShape = lbl.includes(shapeToUse.toLowerCase());
                  const matchesColor = colorMatch ? lbl.includes(colorMatch.toLowerCase()) : true;
                  return matchesShape && matchesColor;
               });
               
               // Fallback to shape only
               const shapeMatch = bestMatch || gradeItem.cloudinary_videos.find((v: any) => 
                  (v.label || v.emerald_type || "").toLowerCase().includes(shapeToUse.toLowerCase())
               );
               
               const videoItem = shapeMatch || gradeItem.cloudinary_videos[0]; // fallback
               
               if (videoItem?.video_url) {
                   foundVideo = videoItem.video_url;
                   foundLabel = videoItem.label || videoItem.emerald_type || grade;
                   break;
               }
          }
      }
      
      setVideoUrl(foundVideo);
      setLabel(foundLabel);
    }).catch(() => {
       if (active) setVideoUrl(null);
    });

    return () => { active = false; };
  }, [gem, shape, selectedTypes, selectedGrades, selectedSapphireColors]);

  if (!videoUrl) return null;

  return (
    <div 
      className={`w-full lg:w-[280px] shrink-0 mt-8 lg:mt-0 flex justify-center items-start lg:ml-auto transition-opacity duration-500 ease-out ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
      style={{ display: isLoaded ? 'flex' : 'none' }}
    >
       <div className="relative w-[200px] h-[200px] lg:w-[240px] lg:h-[240px] rounded-[2rem] overflow-hidden bg-white shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100 ring-1 ring-black/5">
          <video 
             key={videoUrl}
             src={videoUrl} 
             autoPlay 
             loop 
             muted 
             playsInline 
             className="w-full h-full object-cover scale-[1.02]"
             onCanPlay={() => setIsLoaded(true)}
             onError={() => setIsLoaded(false)}
          />
          {label && (
             <div className="absolute bottom-3 left-3 bg-black/20 backdrop-blur-[6px] border border-white/20 text-white text-[9px] px-2.5 py-1 rounded-full shadow-sm font-semibold uppercase tracking-widest pointer-events-none z-10">
                {label}
             </div>
          )}
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
    if (selectedSapphireColors.includes(val)) setSelectedSapphireColors(selectedSapphireColors.filter(c => c !== val));
    else setSelectedSapphireColors([...selectedSapphireColors, val]);
  };

  const toggleShape = (val: string) => {
    if (selectedShapes.includes(val)) setSelectedShapes([]);
    else setSelectedShapes([val]);
  };

  const [isFiltersVisible, setIsFiltersVisible] = useState(true);

  const hasActiveFilters = selectedGems.length > 0 || selectedShapes.length > 0 || weight !== "" || Object.keys(selectedDimensions).some(k => selectedDimensions[k].length > 0) || selectedSapphireColors.length > 0 || selectedTypes.length > 0 || selectedGrades.length > 0;

  return (
    <div className="w-full bg-white shadow-sm border border-gray-100 rounded-lg mb-10 relative z-10">
      {/* SMOOTH GRID COLLAPSE */}
      <div className={`grid transition-all duration-300 ease-in-out ${isFiltersVisible ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
        <div className="overflow-hidden">
          <div className="p-6">

            {/* MOBILE FILTERS (Selects) */}
            <div className="flex lg:hidden flex-wrap gap-4 justify-center w-full mb-6">
              {/* Gem Type Dropdown */}
              <div className="flex flex-col flex-1 min-w-[150px] max-w-[250px]">
                <span className="text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">
                  Gem Type
                </span>
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
                  className="w-full"
                  renderOption={({ option }) => {
                    const gemOption = gemstoneOptions.find(g => g.value === option.value);
                    return (
                      <div className="flex items-center gap-3">
                        {gemOption && <img src={gemOption.image} alt={option.label} className="w-6 h-6 object-cover rounded-full" />}
                        <span>{option.label}</span>
                      </div>
                    );
                  }}
                />
              </div>

              {/* Sapphire Colors */}
              {selectedGems.includes("Sapphire") && sapphireColors.length > 0 && (
                <div className="flex flex-col flex-1 min-w-[150px] max-w-[250px]">
                  <span className="text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">
                    Color
                  </span>
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
                            <img src={colorOption.image} alt={option.label} className="w-6 h-6 object-contain mix-blend-multiply" />
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

              <div className="flex flex-col flex-1 min-w-[150px] max-w-[250px]">
                <span className="text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">
                  Shape
                </span>
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

            </div>

            {/* DESKTOP FILTERS (Icons) */}
            <div className="hidden lg:flex flex-col lg:flex-row gap-10">


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
                        <div className={`w-14 h-14 shrink-0 rounded-full overflow-hidden shadow-sm flex items-center justify-center`}>
                          <img src={gem.image} alt={gem.label} className="w-full h-full object-cover object-top scale-[1.5]" />
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
                              <div className={`w-12 h-12 shrink-0 rounded-full overflow-hidden shadow-sm flex items-center justify-center`}>
                                <img src={imgUrl} alt={color} className={`w-full h-full object-cover object-center ${color.toLowerCase() === 'white' ? 'scale-[0.95]' : color.toLowerCase() === 'peach' ? 'scale-[1.15]' : color.toLowerCase() === 'brown' ? 'scale-[1.2]' : color.toLowerCase() === 'black' ? 'scale-[1.05]' : 'scale-[1.5]'}`} />
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
            <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 w-full mt-6">
              
              {/* Left Side: Filters */}
              <div className="flex-1 flex flex-wrap gap-8 items-start w-full">
              <SingleNumberFilter label="Weight (CT)" value={weight} onChange={setWeight} bounds={weightBounds} />

              <div className="flex flex-col gap-4 w-full lg:w-auto mx-auto lg:mx-0">
                {(() => {
                  const allDims = new Set<string>();
                  Object.values(availableDimensionsGrouped).forEach(dims => dims.forEach(d => allDims.add(d)));
                  const combinedDims = Array.from(allDims).sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
                  const gemStr = selectedGems.length > 0 ? ` ${selectedGems[0]}` : " ANY GEM";
                  const shapeStr = selectedShapes.length > 0 ? ` ${selectedShapes[0]}` : "";
                  const label = `${gemStr}${shapeStr} DIMENSIONS`.trim().toUpperCase();
                  
                  return (
                    <MultiDropdownFilter 
                      label={label} 
                      value={selectedDimensions["Any"] || []} 
                      onChange={(val) => {
                        setSelectedDimensions(prev => ({ ...prev, "Any": val }));
                      }} 
                      optionsList={combinedDims} 
                    />
                  );
                })()}


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

              {/* Right Side: Smart Video Block */}
              <GemVideo 
                gem={selectedGems.length > 0 ? selectedGems[0] : null} 
                shape={selectedShapes.length > 0 ? selectedShapes[0] : null} 
                selectedTypes={selectedTypes}
                selectedGrades={selectedGrades}
                selectedSapphireColors={selectedSapphireColors}
              />
            </div>

            {/* Unified Custom Size Note */}
            <div className="mt-6 flex justify-center lg:justify-start w-full">
              <div className="text-[10px] text-gray-500 text-center lg:text-left italic w-full max-w-3xl">
                If your desired size isn’t listed, add the closest option to your cart and mention your required size in the order note. We’ll be happy to provide your exact size.
              </div>
            </div>

            {hasActiveFilters && (
              <div className="mt-8 flex items-center gap-4 flex-wrap">
                <span className="text-sm font-bold text-gray-500">Selected</span>

                {selectedGems.map(gem => (
                  <div key={gem} className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full text-xs font-semibold text-gray-800">
                    {gem}
                    <IconX size={14} className="cursor-pointer" onClick={() => removeGem(gem)} />
                  </div>
                ))}

                {selectedSapphireColors.map(color => (
                  <div key={`color-${color}`} className="flex items-center gap-2 bg-blue-50 text-blue-800 px-3 py-1 rounded-full text-xs font-semibold">
                    {color}
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
