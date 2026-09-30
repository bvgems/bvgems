"use client";

import React, { useState } from "react";
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
        value={value === "" ? "" : Number(value)}
        onChange={(val) => onChange(val === "" ? "" : val.toString())}
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
  resetAll
}: TopFiltersProps) => {

  const toggleGem = (val: string) => {
    let newSelected = [...selectedGems];
    if (selectedGems.includes(val)) {
      newSelected = newSelected.filter(g => g !== val);
      // If unselecting Sapphire, clear sapphire colors
      if (val === "Sapphire") {
        setSelectedSapphireColors([]);
      }
    } else {
      newSelected.push(val);
    }
    setSelectedGems(newSelected);
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

  const hasActiveFilters = selectedGems.length > 0 || selectedShapes.length > 0 || weight !== "" || Object.keys(selectedDimensions).some(k => selectedDimensions[k].length > 0) || selectedSapphireColors.length > 0 || selectedTypes.length > 0;

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
                <MultiSelect
                  placeholder="Any Gem Type"
                  size="md"
                  radius="md"
                  data={gemstoneOptions.map((gem: any) => ({
                    label: gem.label,
                    value: gem.value,
                  }))}
                  value={selectedGems}
                  onChange={(val) => {
                    setSelectedGems(val);
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
                    const isSelected = selectedGems.includes(gem.value);
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
                {selectedGems.includes("Sapphire") && sapphireColors.length > 0 && (
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

            <div className="w-full h-[1px] bg-gray-200 my-8" />

            <div className="flex flex-col lg:flex-row gap-8 lg:gap-10 items-center lg:items-start w-full">
              <SingleNumberFilter label="Weight (CT)" value={weight} onChange={setWeight} bounds={weightBounds} />

              <div className="flex flex-col gap-4 w-full lg:w-auto mx-auto lg:mx-0">
                {(() => {
                if (selectedGems.length === 0) {
                  // No specific gem selected, combine all dimensions into one dropdown
                  const allDims = new Set<string>();
                  Object.values(availableDimensionsGrouped).forEach(dims => dims.forEach(d => allDims.add(d)));
                  const combinedDims = Array.from(allDims).sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
                  const shapeStr = selectedShapes.length > 0 ? ` ${selectedShapes[0]}` : "";
                  const label = `ANY GEM${shapeStr} DIMENSIONS`.toUpperCase();
                  
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
                }

                // If specific gems are selected, render their dropdowns
                const entries = Object.entries(availableDimensionsGrouped).sort((a, b) => {
                  const aGem = a[0].toLowerCase().startsWith("sapphire") ? "sapphire" : a[0].toLowerCase();
                  const bGem = b[0].toLowerCase().startsWith("sapphire") ? "sapphire" : b[0].toLowerCase();
                  
                  const aGemIndex = selectedGems.findIndex(g => g.toLowerCase() === aGem);
                  const bGemIndex = selectedGems.findIndex(g => g.toLowerCase() === bGem);
                  
                  if (aGemIndex !== bGemIndex && aGemIndex !== -1 && bGemIndex !== -1) {
                    return aGemIndex - bGemIndex;
                  }
                  
                  if (aGem === "sapphire" && bGem === "sapphire") {
                    const aColor = a[0].split(" ").slice(1).join(" ").toLowerCase();
                    const bColor = b[0].split(" ").slice(1).join(" ").toLowerCase();
                    const aColIndex = selectedSapphireColors.findIndex(c => c.toLowerCase() === aColor);
                    const bColIndex = selectedSapphireColors.findIndex(c => c.toLowerCase() === bColor);
                    if (aColIndex !== -1 && bColIndex !== -1) return aColIndex - bColIndex;
                  }
                  
                  return a[0].localeCompare(b[0]);
                });
                
                return entries.map(([groupKey, dims]) => {
                  const isSapphire = groupKey.toLowerCase().startsWith("sapphire");
                  const baseGem = isSapphire ? "Sapphire" : groupKey;
                  // Only render if the base gem is in selectedGems
                  if (!selectedGems.some(g => baseGem.toLowerCase() === g.toLowerCase())) return null;

                  // Additionally filter by selected sapphire colors if applicable
                  if (baseGem.toLowerCase() === "sapphire") {
                     if (selectedSapphireColors.length === 0) return null;
                     const color = groupKey.split(" ").slice(1).join(" ");
                     if (!selectedSapphireColors.some(c => c.toLowerCase() === color.toLowerCase())) return null;
                  }

                  const shapeStr = selectedShapes.length > 0 ? ` ${selectedShapes[0]}` : "";
                  const label = `${groupKey}${shapeStr} DIMENSIONS`.toUpperCase();
                  return (
                    <MultiDropdownFilter 
                      key={groupKey}
                      label={label} 
                      value={selectedDimensions[groupKey] || []} 
                      onChange={(val) => {
                        setSelectedDimensions(prev => ({ ...prev, [groupKey]: val }));
                      }} 
                      optionsList={dims} 
                    />
                  );
                });
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
                    <IconX size={14} className="cursor-pointer" onClick={() => toggleGem(gem)} />
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
