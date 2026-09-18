"use client";

import React, { useState, useEffect } from "react";
import { RangeSlider, NumberInput, Select, Button, ActionIcon, Collapse } from "@mantine/core";
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

  weightRange: RangeValue;
  setWeightRange: (val: RangeValue) => void;
  weightBounds: { min: number; max: number };

  lengthRange: RangeValue;
  setLengthRange: (val: RangeValue) => void;
  lengthBounds: { min: number; max: number };

  widthRange: RangeValue;
  setWidthRange: (val: RangeValue) => void;
  widthBounds: { min: number; max: number };

  sapphireColors: string[];
  selectedSapphireColors: string[];
  setSelectedSapphireColors: (val: string[]) => void;

  resetAll: () => void;
};

const RangeFilter = ({
  label,
  value,
  onChange,
  bounds,
}: {
  label: string;
  value: RangeValue;
  onChange: (val: RangeValue) => void;
  bounds: { min: number; max: number };
}) => {
  // We use local state for the slider so dragging doesn't feel laggy
  const [sliderValue, setSliderValue] = useState<[number, number]>([
    value.min === "" ? bounds.min : value.min,
    value.max === "" ? bounds.max : value.max,
  ]);

  useEffect(() => {
    setSliderValue([
      value.min === "" ? bounds.min : value.min,
      value.max === "" ? bounds.max : value.max,
    ]);
  }, [value, bounds]);

  return (
    <div className="flex flex-col gap-2 w-full max-w-[250px]">
      <label className="text-sm font-bold text-[#0b182d] uppercase tracking-wide">
        {label}
      </label>
      <div className="px-2">
        <RangeSlider
          min={bounds.min}
          max={bounds.max}
          step={0.01}
          minRange={0.01}
          value={sliderValue}
          onChange={setSliderValue}
          onChangeEnd={(val) =>
            onChange({
              min: val[0] <= bounds.min ? "" : val[0],
              max: val[1] >= bounds.max ? "" : val[1],
            })
          }
          color="#0b182d"
          size="sm"
        />
      </div>
      <div className="flex gap-2 mt-2">
        <NumberInput
          value={value.min}
          onChange={(val) => onChange({ ...value, min: val === "" ? "" : Number(val) })}
          placeholder="Min"
          min={0}
          max={value.max === "" ? undefined : Number(value.max)}
          leftSection={<span className="text-xs text-gray-500 ml-2">Min</span>}
          styles={{ input: { paddingLeft: 40, fontSize: '13px' } }}
          hideControls
        />
        <NumberInput
          value={value.max}
          onChange={(val) => onChange({ ...value, max: val === "" ? "" : Number(val) })}
          placeholder="Max"
          min={value.min === "" ? 0 : Number(value.min)}
          leftSection={<span className="text-xs text-gray-500 ml-2">Max</span>}
          styles={{ input: { paddingLeft: 40, fontSize: '13px' } }}
          hideControls
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
  weightRange,
  setWeightRange,
  weightBounds,
  lengthRange,
  setLengthRange,
  lengthBounds,
  widthRange,
  setWidthRange,
  widthBounds,
  sapphireColors,
  selectedSapphireColors,
  setSelectedSapphireColors,
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
    if (selectedShapes.includes(val)) setSelectedShapes(selectedShapes.filter(s => s !== val));
    else setSelectedShapes([...selectedShapes, val]);
  };

  const [isFiltersVisible, setIsFiltersVisible] = useState(true);

  const hasActiveFilters = selectedGems.length > 0 || selectedShapes.length > 0 || weightRange.min !== "" || weightRange.max !== "" || lengthRange.min !== "" || lengthRange.max !== "" || widthRange.min !== "" || widthRange.max !== "" || selectedSapphireColors.length > 0;

  return (
    <div className="w-full bg-white shadow-sm border border-gray-100 rounded-lg mb-10 relative z-10">
      {/* SMOOTH GRID COLLAPSE */}
      <div className={`grid transition-all duration-300 ease-in-out ${isFiltersVisible ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
        <div className="overflow-hidden">
          <div className="p-6">
            <div className="flex flex-col lg:flex-row gap-10">
        
        {/* GEM TYPE */}
        <div className="flex flex-col gap-4">
          <label className="text-sm font-bold text-[#0b182d] uppercase tracking-wide">Gem Type</label>
          <div className="flex flex-wrap gap-4">
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
            <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-100">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wide mb-3 block">Sapphire Colors</label>
              <div className="flex flex-wrap gap-4">
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
                           <img src={imgUrl} alt={color} className={`w-full h-full object-cover object-center ${color.toLowerCase() === 'white' ? 'scale-[1.05]' : color.toLowerCase() === 'peach' ? 'scale-[1.15]' : color.toLowerCase() === 'brown' ? 'scale-[1.2]' : 'scale-[1.5]'}`} />
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
        <div className="flex flex-col gap-4">
          <label className="text-sm font-bold text-[#0b182d] uppercase tracking-wide">Shape</label>
          <div className="flex flex-wrap gap-4">
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

      <div className="flex flex-col lg:flex-row gap-10 items-start">
        <RangeFilter label="Weight (CT)" value={weightRange} onChange={setWeightRange} bounds={weightBounds} />
        <RangeFilter label="Length (MM)" value={lengthRange} onChange={setLengthRange} bounds={lengthBounds} />
        <RangeFilter label="Width (MM)" value={widthRange} onChange={setWidthRange} bounds={widthBounds} />
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

          {(weightRange.min !== "" || weightRange.max !== "") && (
             <div className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full text-xs font-semibold text-gray-800">
               Weight: {weightRange.min || "0"} - {weightRange.max || "Any"} ct
               <IconX size={14} className="cursor-pointer" onClick={() => setWeightRange({min: "", max: ""})} />
             </div>
          )}

          {(lengthRange.min !== "" || lengthRange.max !== "") && (
             <div className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full text-xs font-semibold text-gray-800">
               Length: {lengthRange.min || "0"} - {lengthRange.max || "Any"} mm
               <IconX size={14} className="cursor-pointer" onClick={() => setLengthRange({min: "", max: ""})} />
             </div>
          )}

          {(widthRange.min !== "" || widthRange.max !== "") && (
             <div className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full text-xs font-semibold text-gray-800">
               Width: {widthRange.min || "0"} - {widthRange.max || "Any"} mm
               <IconX size={14} className="cursor-pointer" onClick={() => setWidthRange({min: "", max: ""})} />
             </div>
          )}



          <button onClick={resetAll} className="text-red-600 text-sm font-bold hover:underline ml-4">
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
