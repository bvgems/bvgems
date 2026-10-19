"use client";

import React, { useRef, useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { Container, Tooltip } from "@mantine/core";
import { useRecentlyViewed } from "@/hooks/useRecentlyViewed";
import { useAuth } from "@/hooks/useAuth";
import {
  IconChevronLeft,
  IconChevronRight,
  IconClock,
  IconArrowRight,
  IconSparkles,
  IconTrash,
  IconX,
} from "@tabler/icons-react";
import { getTimeBasedGreeting, formatRelativeTime } from "@/utils/greetingHelpers";

interface RecentlyViewedSectionProps {
  currentItemId?: string;
  title?: string;
  subtitle?: string;
  limit?: number;
  className?: string;
}

export const RecentlyViewedSection: React.FC<RecentlyViewedSectionProps> = ({
  currentItemId,
  title,
  subtitle,
  limit = 20,
  className = "",
}) => {
  const { items, removeItem, clearAll } = useRecentlyViewed();
  const { user } = useAuth();

  const containerRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const startScrollLeftRef = useRef(0);
  const hasMovedRef = useRef(false);

  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [isPointerDown, setIsPointerDown] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Filter out the currently viewed product
  const displayItems = useMemo(() => {
    if (!items) return [];
    return items
      .filter((item) => !currentItemId || item.id !== currentItemId)
      .slice(0, limit);
  }, [items, currentItemId, limit]);

  const updateScrollButtons = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const { scrollLeft, scrollWidth, clientWidth } = container;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const timer = setTimeout(updateScrollButtons, 60);
    container.addEventListener("scroll", updateScrollButtons, { passive: true });
    window.addEventListener("resize", updateScrollButtons, { passive: true });

    return () => {
      clearTimeout(timer);
      container.removeEventListener("scroll", updateScrollButtons);
      window.removeEventListener("resize", updateScrollButtons);
    };
  }, [displayItems, updateScrollButtons, isMounted]);

  const greetingData = useMemo(() => {
    return getTimeBasedGreeting(user?.firstName);
  }, [user?.firstName]);

  const scrollByAmount = (direction: "left" | "right") => {
    const container = containerRef.current;
    if (!container) return;

    const scrollAmount = direction === "left" ? -340 : 340;
    container.scrollBy({
      left: scrollAmount,
      behavior: "smooth",
    });
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0) return;
    const container = containerRef.current;
    if (!container) return;

    isDraggingRef.current = true;
    hasMovedRef.current = false;
    startXRef.current = e.clientX;
    startScrollLeftRef.current = container.scrollLeft;
    setIsPointerDown(true);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    const container = containerRef.current;
    if (!container) return;

    const deltaX = e.clientX - startXRef.current;
    if (Math.abs(deltaX) > 6) {
      hasMovedRef.current = true;
    }

    container.scrollLeft = startScrollLeftRef.current - deltaX;
    updateScrollButtons();
  };

  const handlePointerUp = () => {
    isDraggingRef.current = false;
    setIsPointerDown(false);
  };

  const handleClickCapture = (e: React.MouseEvent) => {
    if (hasMovedRef.current) {
      e.preventDefault();
      e.stopPropagation();
      hasMovedRef.current = false;
    }
  };

  // If not mounted yet or no items to show, return null cleanly
  if (!isMounted || displayItems.length === 0) {
    return null;
  }

  // Heading text resolution
  const resolvedTitle = title || greetingData.salutation;
  const resolvedSubtitle = subtitle || greetingData.subtext;

  return (
    <section className={`w-full my-16 pt-10 border-t border-slate-200/80 select-none ${className}`}>
      <Container size={1350}>
        {/* Centered Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10 px-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium tracking-wide bg-slate-100/90 text-[#0b182d] border border-slate-200/80 mb-3 shadow-2xs">
            <IconSparkles size={13} className="text-amber-600" />
            <span className="font-semibold">{greetingData.badge}</span>
            <span className="w-1 h-1 rounded-full bg-slate-300 mx-0.5" />
            <span className="text-slate-500 font-normal">
              {displayItems.length} {displayItems.length === 1 ? "stone viewed" : "stones viewed"}
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif text-[#0b182d] tracking-tight">
            {resolvedTitle}
          </h2>

          <p className="text-xs sm:text-sm text-slate-500 mt-2.5 max-w-xl mx-auto font-normal leading-relaxed">
            {resolvedSubtitle}
          </p>

          {/* Action Row */}
          <div className="flex items-center justify-center gap-2.5 mt-3.5">
            {user && (
              <Link
                href="/profile"
                className="inline-flex items-center gap-1.5 text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-[#0b182d] hover:text-blue-900 transition-colors px-3 py-1 rounded-full bg-slate-100 hover:bg-slate-200/80 border border-slate-200/70"
              >
                <span>View All In Profile</span>
                <IconArrowRight size={13} />
              </Link>
            )}

            <Tooltip label="Clear viewed history" position="top" withArrow>
              <button
                type="button"
                onClick={clearAll}
                className="inline-flex items-center gap-1 text-[11px] sm:text-xs font-medium text-slate-400 hover:text-red-600 transition-colors px-2.5 py-1 rounded-full hover:bg-slate-100 border border-transparent hover:border-slate-200 active:scale-95 cursor-pointer"
              >
                <IconTrash size={13} />
                <span>Clear</span>
              </button>
            </Tooltip>
          </div>
        </div>

        {/* Horizontal Slider Rail with Floating Apple Navigation Arrows */}
        <div className="relative group/carousel">
          {/* Floating Left Arrow */}
          <button
            type="button"
            onClick={() => scrollByAmount("left")}
            disabled={!canScrollLeft}
            aria-label="Scroll left"
            className={`absolute -left-2 sm:-left-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-11 sm:h-11 rounded-full border border-slate-200/90 bg-white/95 backdrop-blur-md flex items-center justify-center text-[#0b182d] shadow-[0_4px_16px_rgba(0,0,0,0.12)] transition-all duration-200 cursor-pointer ${
              canScrollLeft
                ? "hover:bg-white hover:scale-105 active:scale-90 opacity-100"
                : "opacity-0 pointer-events-none scale-90"
            }`}
          >
            <IconChevronLeft size={20} stroke={2.2} />
          </button>

          {/* Floating Right Arrow */}
          <button
            type="button"
            onClick={() => scrollByAmount("right")}
            disabled={!canScrollRight}
            aria-label="Scroll right"
            className={`absolute -right-2 sm:-right-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-11 sm:h-11 rounded-full border border-slate-200/90 bg-white/95 backdrop-blur-md flex items-center justify-center text-[#0b182d] shadow-[0_4px_16px_rgba(0,0,0,0.12)] transition-all duration-200 cursor-pointer ${
              canScrollRight
                ? "hover:bg-white hover:scale-105 active:scale-90 opacity-100"
                : "opacity-0 pointer-events-none scale-90"
            }`}
          >
            <IconChevronRight size={20} stroke={2.2} />
          </button>

          {/* Scroll Container */}
          <div
            ref={containerRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
            onClickCapture={handleClickCapture}
            className={`flex gap-4 sm:gap-5 overflow-x-auto pb-4 pt-1 snap-x scroll-smooth no-scrollbar ${
              isPointerDown ? "cursor-grabbing" : "cursor-grab"
            }`}
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
              WebkitOverflowScrolling: "touch",
            }}
          >
            {displayItems.map((item) => {
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
                  className="w-[230px] sm:w-[255px] shrink-0 snap-start bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-[0_14px_30px_rgba(11,24,45,0.09)] hover:border-slate-300 transition-all duration-300 ease-out group flex flex-col justify-between"
                >
                  <Link
                    href={item.url}
                    draggable={false}
                    className="flex flex-col h-full text-inherit no-underline"
                  >
                    {/* Image Area */}
                    <div className="relative h-44 bg-gradient-to-b from-slate-50 to-slate-100/60 flex items-center justify-center p-3 overflow-hidden border-b border-slate-100">
                      <Image
                        src={item.image_url || "/assets/logo2.webp"}
                        alt={item.title}
                        fill
                        sizes="255px"
                        draggable={false}
                        className="object-contain p-2 group-hover:scale-108 transition-transform duration-300 ease-out drop-shadow-[0_4px_10px_rgba(0,0,0,0.08)] pointer-events-none"
                      />

                      {/* Quality / Gemstone Tag */}
                      {item.quality && (
                        <div className="absolute top-2.5 left-2.5 pointer-events-none">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-white/90 text-[#0b182d] shadow-2xs backdrop-blur-xs border border-slate-200/60">
                            {item.quality}
                          </span>
                        </div>
                      )}

                      {/* Visited Time Badge */}
                      <div className="absolute top-2.5 right-2.5 pointer-events-none">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-black/5 text-slate-500 backdrop-blur-xs">
                          {formatRelativeTime(item.viewedAt)}
                        </span>
                      </div>

                      {/* Remove Item Button on Hover */}
                      <Tooltip label="Remove from history" position="left" withArrow>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            removeItem(item.id);
                          }}
                          aria-label="Remove item"
                          className="absolute bottom-2 right-2 w-6 h-6 rounded-full bg-white/90 hover:bg-white text-slate-400 hover:text-red-600 shadow-2xs flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 active:scale-90 cursor-pointer"
                        >
                          <IconX size={12} stroke={2.2} />
                        </button>
                      </Tooltip>
                    </div>

                    {/* Content Area */}
                    <div className="p-4 flex flex-col flex-1 justify-between gap-3">
                      <div>
                        <h3
                          className="text-xs sm:text-sm font-semibold text-[#0b182d] group-hover:text-blue-900 transition-colors line-clamp-1 mb-2 tracking-wide"
                          title={item.title}
                        >
                          {item.title}
                        </h3>

                        {/* Specification Chips */}
                        <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-slate-600">
                          {item.shape && (
                            <span className="px-2 py-0.5 bg-slate-100 rounded-md text-slate-700 font-medium">
                              {item.shape}
                            </span>
                          )}
                          {(item.size || item.dimension) && (
                            <span className="px-2 py-0.5 bg-slate-100 rounded-md text-slate-700">
                              {item.size || item.dimension}
                            </span>
                          )}
                          {item.carat_weight && (
                            <span className="px-2 py-0.5 bg-slate-100 rounded-md text-slate-700">
                              {item.carat_weight} ct
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Price & Action Footer */}
                      <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between gap-2 mt-auto">
                        <div>
                          {user ? (
                            priceDisplay ? (
                              <div>
                                <span className="text-xs font-semibold text-[#0b182d]">
                                  {priceDisplay}
                                </span>
                                {item.price_per_carat && (
                                  <span className="text-[10px] text-slate-500 block">
                                    ${item.price_per_carat}/ct
                                  </span>
                                )}
                              </div>
                            ) : (
                              <span className="text-[11px] text-slate-500 italic">
                                Wholesale Price
                              </span>
                            )
                          ) : (
                            <span className="text-[10px] text-slate-500 font-medium">
                              Trade Wholesale
                            </span>
                          )}
                        </div>

                        <span className="px-3 py-1 rounded-full text-[11px] font-semibold text-[#0b182d] bg-slate-100 group-hover:bg-[#0b182d] group-hover:text-white transition-all duration-200 flex items-center gap-1 shrink-0">
                          <span>View</span>
                          <IconArrowRight size={12} />
                        </span>
                      </div>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </Container>
    </section>
  );
};
