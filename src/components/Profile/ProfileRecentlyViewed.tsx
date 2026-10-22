"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRecentlyViewed } from "@/hooks/useRecentlyViewed";
import { unwrapString } from "@/store/useRecentlyViewedStore";
import { useAuth } from "@/hooks/useAuth";
import {
  IconSearch,
  IconTrash,
  IconEye,
  IconX,
  IconClock,
  IconDiamond,
  IconArrowUpRight,
} from "@tabler/icons-react";
import { Button, TextInput, Tooltip } from "@mantine/core";

export const ProfileRecentlyViewed: React.FC = () => {
  const { items, removeItem, clearAll } = useRecentlyViewed();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      // Type filter
      if (selectedType !== "all" && item.productType !== selectedType) {
        return false;
      }
      // Search term filter
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const matchTitle = unwrapString(item.title).toLowerCase().includes(query);
        const matchGemstone = unwrapString(item.gemstone).toLowerCase().includes(query);
        const matchShape = unwrapString(item.shape).toLowerCase().includes(query);
        const matchSize = (unwrapString(item.size) || unwrapString(item.dimension)).toLowerCase().includes(query);
        const matchColor = unwrapString(item.color).toLowerCase().includes(query);
        const matchLot = unwrapString(item.lot_number).toLowerCase().includes(query);
        return matchTitle || matchGemstone || matchShape || matchSize || matchColor || matchLot;
      }
      return true;
    });
  }, [items, selectedType, searchTerm]);

  const typeCounts = useMemo(() => {
    const counts: Record<string, number> = { all: items.length };
    for (const item of items) {
      counts[item.productType] = (counts[item.productType] || 0) + 1;
    }
    return counts;
  }, [items]);

  if (items.length === 0) {
    return (
      <div className="py-16 px-4 text-center max-w-md mx-auto">
        <div className="w-16 h-16 rounded-full bg-gray-100 text-[#0b182d] flex items-center justify-center mx-auto mb-4">
          <IconClock size={28} stroke={1.5} />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          No Recently Viewed Stones
        </h3>
        <p className="text-sm text-gray-500 mb-6">
          Whenever you inspect calibrated stones, free-size gems, or layouts across our collection, they will automatically be preserved here for your trade records.
        </p>
        <Link href="/calibrated-stones">
          <Button color="#0b182d" radius="xl">
            Explore Calibrated Stones
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-gray-200">
        <div className="flex flex-wrap items-center gap-2">
          {[
            { id: "all", label: "All Items" },
            { id: "calibrated", label: "Calibrated" },
            { id: "free-size", label: "Free Size" },
            { id: "layout", label: "Layouts" },
            { id: "jewelry", label: "Jewelry" },
          ].map((tab) => {
            const count = typeCounts[tab.id] || 0;
            if (tab.id !== "all" && count === 0) return null;

            const isActive = selectedType === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSelectedType(tab.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold tracking-wider transition-all cursor-pointer flex items-center gap-1.5 ${
                  isActive
                    ? "bg-[#0b182d] text-white shadow-xs"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isActive ? "bg-white/20 text-white" : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-3">
          <TextInput
            placeholder="Search viewed stones..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.currentTarget.value)}
            leftSection={<IconSearch size={15} className="text-gray-400" />}
            size="xs"
            radius="md"
            className="w-full sm:w-56"
          />

          <Tooltip label="Clear all recently viewed items" position="top" withArrow>
            <button
              type="button"
              onClick={clearAll}
              className="text-xs text-gray-400 hover:text-red-600 p-2 rounded-md hover:bg-gray-100 transition-colors flex items-center gap-1 cursor-pointer shrink-0"
            >
              <IconTrash size={15} />
              <span className="hidden sm:inline">Clear</span>
            </button>
          </Tooltip>
        </div>
      </div>

      {/* Grid of Recently Viewed Items */}
      {filteredItems.length === 0 ? (
        <div className="py-12 text-center text-gray-500 text-sm italic">
          No items match your search.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredItems.map((item) => {
            const titleText = unwrapString(item.title) || "Gemstone";
            const qualityText = unwrapString(item.quality);
            const shapeText = unwrapString(item.shape);
            const sizeText = unwrapString(item.size) || unwrapString(item.dimension);
            const caratText = unwrapString(item.carat_weight);
            const itemUrl = unwrapString(item.url) || "/";
            const hasPrice = item.price && Number(item.price) > 0;
            const priceDisplay = hasPrice
              ? `$${Number(item.price).toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}`
              : null;

            return (
              <div
                key={item.id}
                className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:border-gray-400 hover:shadow-md transition-all duration-300 group flex flex-col justify-between"
              >
                {/* Image Section */}
                <div className="relative h-44 bg-gray-50 flex items-center justify-center p-3 overflow-hidden border-b border-gray-100">
                  <Link href={itemUrl} className="w-full h-full relative block">
                    <Image
                      src={unwrapString(item.image_url) || "/assets/logo2.webp"}
                      alt={titleText}
                      fill
                      sizes="250px"
                      className="object-contain p-2 group-hover:scale-108 transition-transform duration-300 ease-out"
                    />
                  </Link>

                  {/* Quality Badge */}
                  {qualityText && (
                    <div className="absolute top-2.5 left-2.5 pointer-events-none">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-white/90 text-gray-800 shadow-2xs backdrop-blur-xs border border-gray-200/60">
                        {qualityText}
                      </span>
                    </div>
                  )}

                  {/* Delete Button */}
                  <Tooltip label="Remove from history" position="left" withArrow>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        removeItem(item.id);
                      }}
                      className="absolute top-2.5 right-2.5 w-6 h-6 rounded-full bg-white/80 hover:bg-white text-gray-400 hover:text-red-600 shadow-2xs flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 active:scale-90 cursor-pointer"
                    >
                      <IconX size={12} stroke={2.2} />
                    </button>
                  </Tooltip>
                </div>

                {/* Details Section */}
                <div className="p-3.5 flex flex-col flex-1 justify-between gap-3">
                  <div>
                    <Link
                      href={itemUrl}
                      className="text-xs font-semibold text-[#0b182d] hover:text-blue-700 transition-colors line-clamp-1 block mb-2"
                      title={titleText}
                    >
                      {titleText}
                    </Link>

                    <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-gray-600">
                      {shapeText && (
                        <span className="px-1.5 py-0.5 bg-gray-100 rounded text-gray-700 font-medium">
                          {shapeText}
                        </span>
                      )}
                      {sizeText && (
                        <span className="px-1.5 py-0.5 bg-gray-100 rounded text-gray-700">
                          {sizeText}
                        </span>
                      )}
                      {caratText && (
                        <span className="px-1.5 py-0.5 bg-gray-100 rounded text-gray-700">
                          {caratText} ct
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Price & Direct Navigation */}
                  <div className="pt-2 border-t border-gray-100 flex items-center justify-between gap-2 mt-auto">
                    <div>
                      {priceDisplay ? (
                        <div>
                          <span className="text-xs font-semibold text-[#0b182d]">
                            {priceDisplay}
                          </span>
                          {item.price_per_carat && (
                            <span className="text-[10px] text-gray-500 block">
                              ${item.price_per_carat}/ct
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-[11px] text-gray-500 italic">
                          Trade Wholesale
                        </span>
                      )}
                    </div>

                    <Link
                      href={itemUrl}
                      className="px-3 py-1 rounded-full text-[11px] font-semibold text-[#0b182d] bg-gray-100 hover:bg-[#0b182d] hover:text-white transition-all duration-150 active:scale-95 flex items-center gap-1 shrink-0"
                    >
                      <span>View</span>
                      <IconArrowUpRight size={13} />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
