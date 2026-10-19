"use client";

import React, { useState, useMemo } from "react";
import {
  Accordion,
  AccordionControl,
  AccordionItem,
  AccordionPanel,
  TextInput,
  Badge,
} from "@mantine/core";
import {
  IconSearch,
  IconChevronDown,
  IconDiamond,
  IconFileCertificate,
  IconBuildingStore,
  IconHelpCircle,
  IconSparkles,
  IconX,
  IconCheck,
} from "@tabler/icons-react";
import { FAQItem, FAQ_CATEGORIES } from "@/data/faqData";
import Link from "next/link";

interface FAQComponentProps {
  faqContent: FAQItem[];
}

export const FAQComponent: React.FC<FAQComponentProps> = ({ faqContent }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: faqContent.length };
    for (const item of faqContent) {
      counts[item.category] = (counts[item.category] || 0) + 1;
    }
    return counts;
  }, [faqContent]);

  // Filtered items based on category and search query
  const filteredFAQs = useMemo(() => {
    return faqContent.filter((item) => {
      // Category match
      if (selectedCategory !== "all" && item.category !== selectedCategory) {
        return false;
      }

      // Search match
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchQ = item.question.toLowerCase().includes(q);
        const matchA = item.answer.toLowerCase().includes(q);
        const matchPoints = item.keyPoints?.some((pt) =>
          pt.toLowerCase().includes(q)
        );
        return matchQ || matchA || matchPoints;
      }

      return true;
    });
  }, [faqContent, selectedCategory, searchQuery]);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "gemstones":
        return <IconDiamond size={15} />;
      case "memo":
        return <IconFileCertificate size={15} />;
      case "grading":
        return <IconSparkles size={15} />;
      case "orders":
        return <IconBuildingStore size={15} />;
      default:
        return <IconHelpCircle size={15} />;
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Search Input Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-xs">
        <TextInput
          size="md"
          radius="xl"
          placeholder="Search gemstone sizing, memo rules, tolerances, shipping..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.currentTarget.value)}
          leftSection={<IconSearch size={18} className="text-gray-400" />}
          rightSection={
            searchQuery ? (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                aria-label="Clear search"
                className="text-gray-400 hover:text-gray-700 p-1 cursor-pointer"
              >
                <IconX size={15} />
              </button>
            ) : null
          }
          styles={{
            input: {
              fontSize: "14px",
              borderColor: "#e5e7eb",
              "&:focus": {
                borderColor: "#0b182d",
              },
            },
          }}
        />

        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2 mt-4 pt-3 border-t border-gray-100">
          {FAQ_CATEGORIES.map((cat) => {
            const count = categoryCounts[cat.id] || 0;
            const isActive = selectedCategory === cat.id;

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold tracking-wider transition-all cursor-pointer flex items-center gap-1.5 active:scale-95 ${
                  isActive
                    ? "bg-[#0b182d] text-white shadow-xs"
                    : "bg-gray-100/80 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {cat.id !== "all" && getCategoryIcon(cat.id)}
                <span>{cat.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isActive
                      ? "bg-white/20 text-white"
                      : "bg-gray-200/90 text-gray-600"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Results Count / Clear State */}
      <div className="flex items-center justify-between px-1 text-xs text-gray-500">
        <span>
          Showing {filteredFAQs.length} of {faqContent.length} questions
        </span>
        {(searchQuery || selectedCategory !== "all") && (
          <button
            type="button"
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("all");
            }}
            className="text-[#0b182d] hover:underline font-medium cursor-pointer"
          >
            Reset filters
          </button>
        )}
      </div>

      {/* Accordion Questions */}
      {filteredFAQs.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-2xl border border-gray-200">
          <div className="w-12 h-12 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center mx-auto mb-3">
            <IconSearch size={22} />
          </div>
          <h3 className="text-base font-semibold text-gray-800 mb-1">
            No matching questions found
          </h3>
          <p className="text-xs text-gray-500 max-w-sm mx-auto mb-4">
            Try adjusting your search terms or contact our NYC showroom gemologists directly.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("all");
            }}
            className="px-4 py-2 rounded-full bg-[#0b182d] text-white text-xs font-semibold tracking-wider uppercase active:scale-95 transition-transform cursor-pointer"
          >
            View All Questions
          </button>
        </div>
      ) : (
        <Accordion
          variant="separated"
          radius="lg"
          chevron={<IconChevronDown size={18} className="text-[#0b182d]" />}
          styles={{
            item: {
              backgroundColor: "#ffffff",
              border: "1px solid #e5e7eb",
              transition: "all 200ms ease",
              "&[data-active]": {
                borderColor: "#0b182d",
                boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.05)",
              },
            },
            control: {
              padding: "16px 20px",
              "&:hover": {
                backgroundColor: "#f9fafb",
              },
            },
            content: {
              padding: "0 20px 20px 20px",
            },
          }}
        >
          {filteredFAQs.map((item) => (
            <AccordionItem key={item.id} value={item.id}>
              <AccordionControl>
                <div className="flex items-start gap-3 text-left">
                  <div className="mt-0.5">
                    <span className="text-xs px-2 py-0.5 rounded-md font-semibold tracking-wide bg-gray-100 text-[#0b182d] uppercase">
                      {item.categoryLabel}
                    </span>
                  </div>
                  <h3 className="text-[15px] sm:text-base font-semibold text-[#0b182d] leading-snug">
                    {item.question}
                  </h3>
                </div>
              </AccordionControl>
              <AccordionPanel>
                <div className="text-sm text-gray-700 leading-relaxed font-light pl-0 sm:pl-2 space-y-3">
                  <p className="whitespace-pre-line text-[14px] sm:text-[15px]">{item.answer}</p>

                  {/* Highlights / Key Points */}
                  {item.keyPoints && item.keyPoints.length > 0 && (
                    <div className="mt-3 p-3.5 rounded-xl bg-gray-50 border border-gray-100">
                      <div className="text-xs font-semibold text-[#0b182d] uppercase tracking-wider mb-2">
                        Key Points:
                      </div>
                      <ul className="space-y-1.5 text-xs text-gray-600">
                        {item.keyPoints.map((pt, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-emerald-700 mt-0.5 shrink-0">
                              <IconCheck size={14} stroke={2.5} />
                            </span>
                            <span>{pt}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </AccordionPanel>
            </AccordionItem>
          ))}
        </Accordion>
      )}

      {/* Trade Customer Assistance Callout */}
      <div className="mt-12 p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-[#0b182d] to-[#162744] text-white shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <span className="text-xs font-semibold uppercase tracking-widest text-emerald-400">
              NYC Diamond District Showroom
            </span>
            <h3 className="text-xl sm:text-2xl font-light tracking-wide">
              Have specific stone sourcing or memo questions?
            </h3>
            <p className="text-xs sm:text-sm text-gray-300 font-light leading-relaxed">
              Our master gemologists and wholesale account managers are available Monday through Friday at our Manhattan headquarters to assist with custom parcel matching, memo reservations, and stone consultations.
            </p>
            <div className="text-xs text-gray-300 pt-1 flex flex-wrap gap-4">
              <span>📍 66 W 47th St, Booth #9 & 10, NYC</span>
              <span>📞 (212) 302-0447</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <Link
              href="/trade/memo-program"
              className="px-5 py-2.5 rounded-full bg-white text-[#0b182d] hover:bg-gray-100 text-xs font-semibold tracking-wider uppercase text-center transition-all active:scale-95"
            >
              Request Memo
            </Link>
            <Link
              href="/trade/apply"
              className="px-5 py-2.5 rounded-full border border-white/30 hover:border-white text-white text-xs font-semibold tracking-wider uppercase text-center transition-all active:scale-95"
            >
              Apply for Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
