"use client";

import { Container } from "@mantine/core";
import { AnimatedText } from "../CommonComponents/AnimatedText";
import { gemstoneOptions } from "@/utils/constants";
import Link from "next/link";

export const ShopCalibrated = () => {

  return (
    <Container size={1350} className="mt-1">
      <div className="text-center mb-10">
        <AnimatedText
          text="Shop Calibrated Gemstones"
          className="text-center text-3xl sm:text-4xl font-serif text-[#0b182d] tracking-tight"
        />
        <p className="text-xs sm:text-sm text-slate-500 uppercase tracking-widest mt-2">
          Precision-cut faceted gems in standardized dimensions
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-4 sm:gap-6 max-w-6xl mx-auto">
        {gemstoneOptions?.map((item: any, idx: number) => (
          <Link
            key={idx}
            href={item?.link}
            className="group relative flex flex-col items-center justify-between w-[150px] sm:w-[168px] p-4 sm:p-5 rounded-2xl bg-white border border-slate-100 shadow-[0_2px_10px_rgba(0,0,0,0.03)] hover:shadow-[0_14px_30px_rgba(11,24,45,0.08)] hover:border-slate-300 transition-all duration-300 ease-out cursor-pointer no-underline active:scale-[0.97]"
          >
            <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-b from-slate-50 to-slate-100/50 flex items-center justify-center overflow-visible">
              <img
                src={item?.shopImage}
                alt={`Calibrated ${item?.label} gemstones`}
                className="w-full h-full object-contain scale-[1.65] group-hover:scale-[1.82] transition-transform duration-300 ease-out drop-shadow-[0_6px_12px_rgba(0,0,0,0.12)]"
                loading="lazy"
              />
            </div>
            <div className="text-center mt-3">
              <p className="text-xs sm:text-sm font-semibold text-[#0b182d] group-hover:text-blue-900 tracking-wide transition-colors m-0">
                {item?.label}
              </p>
              <span className="text-[10px] text-slate-400 uppercase tracking-widest font-medium mt-1 inline-block group-hover:text-blue-600 transition-colors">
                Explore &rarr;
              </span>
            </div>
          </Link>
        ))}
      </div>
    </Container>
  );
};
