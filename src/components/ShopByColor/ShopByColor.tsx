"use client";

import { Container } from "@mantine/core";
import { AnimatedText } from "../CommonComponents/AnimatedText";
import { shopByColorOptions } from "@/utils/constants";
import Link from "next/link";

export default function ShopByColor() {

  return (
    <Container size={1350} className="mt-20">
      <div className="text-center mb-10">
        <AnimatedText
          text="Shop Gemstone By Color"
          className="text-center text-3xl sm:text-4xl font-serif text-[#0b182d] tracking-tight"
        />
        <p className="text-xs sm:text-sm text-slate-500 uppercase tracking-widest mt-2">
          Curated natural and lab-grown stones across the spectrum
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6 max-w-6xl mx-auto">
        {shopByColorOptions?.map((item: any, index: number) => (
          <Link
            key={index}
            href={item?.href || `/calibrated-stones?color=${item?.name?.toLowerCase()}`}
            rel="nofollow"
            className="group relative flex flex-col items-center justify-between p-4 sm:p-5 rounded-2xl bg-white border border-slate-100 shadow-[0_2px_10px_rgba(0,0,0,0.03)] hover:shadow-[0_14px_30px_rgba(11,24,45,0.08)] hover:border-slate-300 transition-all duration-300 ease-out cursor-pointer no-underline active:scale-[0.97]"
          >
            <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-b from-slate-50 to-slate-100/50 flex items-center justify-center overflow-visible">
              <img
                src={item?.image}
                alt={`${item?.name} colored gemstones collection`}
                className="w-full h-full object-contain scale-[1.65] group-hover:scale-[1.82] transition-transform duration-300 ease-out drop-shadow-[0_6px_12px_rgba(0,0,0,0.12)]"
                loading="lazy"
              />
            </div>
            <div className="text-center mt-3">
              <p className="text-xs sm:text-sm font-semibold text-[#0b182d] group-hover:text-blue-900 tracking-wide transition-colors m-0">
                {item?.name}
              </p>
              <span className="text-[10px] text-slate-400 uppercase tracking-widest font-medium mt-1 inline-block group-hover:text-blue-600 transition-colors">
                Shop Color &rarr;
              </span>
            </div>
          </Link>
        ))}
      </div>
    </Container>
  );
}
