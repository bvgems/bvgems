"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useMediaQuery } from "@mantine/hooks";
import Link from "next/link";

export function Hero({ jewelryRef, heroData }: any) {
  const router = useRouter();

  return (
    <div className="w-full flex flex-col">
      {/* OLD TWO DOORS SECTION - COMMENTED OUT AS REQUESTED */}
      {/* 
      <div className="flex flex-col md:flex-row w-full h-[600px] md:h-[550px]">
        <Link
          href="/special-page"
          className="relative flex-1 group overflow-hidden border-b-2 md:border-b-0 md:border-r-2 border-white"
        >
          <Image loading="lazy"
            src="/assets/shopify/raw_5b0afe2d-24fd-4837-9272-a3649b33c9f8.png" 
            alt="Calibrated & Free Size Stones"
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/40 transition-opacity duration-300 group-hover:bg-black/20" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 text-white">
            <h2 className="text-4xl md:text-5xl font-light tracking-wider mb-4 uppercase drop-shadow-lg">
              Calibrated & Free Size
            </h2>
            <p className="text-lg md:text-xl font-light mb-6 tracking-wide drop-shadow-md">
              Experts in precision-cut stones and unique free size gems
            </p>
            <button className="px-8 py-3 bg-white text-black text-sm uppercase tracking-widest font-semibold hover:bg-gray-100 transition-colors">
              Shop Stones
            </button>
          </div>
        </Link>

        <Link
          href="/trade/layouts"
          className="relative flex-1 group overflow-hidden"
        >
          <Image loading="lazy"
            src="/assets/hero-bg2.webp"
            alt="Matching Pairs and Layouts"
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/40 transition-opacity duration-300 group-hover:bg-black/20" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 text-white">
            <h2 className="text-4xl md:text-5xl font-light tracking-wider mb-4 uppercase drop-shadow-lg">
              Pairs & Layouts
            </h2>
            <p className="text-lg md:text-xl font-light mb-6 tracking-wide drop-shadow-md">
              Expertly matched stone pairs and curated layouts
            </p>
            <button className="px-8 py-3 bg-white text-black text-sm uppercase tracking-widest font-semibold hover:bg-gray-100 transition-colors">
              Explore Layouts
            </button>
          </div>
        </Link>
      </div> 
      */}

      {/* NEW 2x2 GRID SECTION */}
      <div className="grid grid-cols-1 md:grid-cols-2 w-full min-h-[600px] bg-white gap-1 p-1">
        {/* Tile 1: Calibrated Stones */}
        <Link
          href="/loose-gemstones"
          className="relative flex flex-col items-center justify-center text-center p-12 bg-[#F9F6F0] overflow-hidden transition-all duration-700 group-hover:duration-300 hover:shadow-[0_20px_40px_rgb(0,0,0,0.12)] hover:-translate-y-2 group"
        >
          {/* Expanding Radial Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#F0EBE1]/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 group-hover:duration-300 ease-out z-0" />
          {/* Sweeping Shine Effect */}
          <div className="absolute inset-0 z-0 bg-gradient-to-r from-transparent via-white to-transparent -translate-x-[150%] skew-x-[-25deg] group-hover:translate-x-[150%] transition-transform duration-1000 group-hover:duration-700 ease-in-out" />
          
          <h2 className="text-4xl md:text-5xl font-light tracking-widest mb-4 uppercase text-stone-800 z-10 transition-transform duration-700 group-hover:duration-300 group-hover:-translate-y-1">
            Calibrated Stones
          </h2>
          <p className="text-stone-500 text-lg font-light mb-8 tracking-wide z-10 max-w-sm transition-transform duration-700 group-hover:duration-300 group-hover:-translate-y-1">
            Precision-cut perfection for your jewelry designs
          </p>
          <div className="flex items-center gap-2 text-base uppercase tracking-widest font-medium text-stone-900 group-hover:text-blue-600 transition-colors z-10">
            <span>Shop Calibrated</span>
            <span className="transform transition-transform duration-500 group-hover:duration-200 group-hover:translate-x-2">→</span>
          </div>
        </Link>

        {/* Tile 2: Free Size Gemstones */}
        <Link
          href="/free-size-gemstones"
          className="relative flex flex-col items-center justify-center text-center p-12 bg-[#F9F6F0] overflow-hidden transition-all duration-700 group-hover:duration-300 hover:shadow-[0_20px_40px_rgb(0,0,0,0.12)] hover:-translate-y-2 group"
        >
          {/* Expanding Radial Background */}
          <div className="absolute inset-0 bg-gradient-to-bl from-[#F0EBE1]/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 group-hover:duration-300 ease-out z-0" />
          {/* Sweeping Shine Effect */}
          <div className="absolute inset-0 z-0 bg-gradient-to-r from-transparent via-white to-transparent -translate-x-[150%] skew-x-[-25deg] group-hover:translate-x-[150%] transition-transform duration-1000 group-hover:duration-700 ease-in-out delay-75" />
          
          <h2 className="text-4xl md:text-5xl font-light tracking-widest mb-4 uppercase text-stone-800 z-10 transition-transform duration-700 group-hover:duration-300 group-hover:-translate-y-1">
            Free Size Gems
          </h2>
          <p className="text-stone-500 text-lg font-light mb-8 tracking-wide z-10 max-w-sm transition-transform duration-700 group-hover:duration-300 group-hover:-translate-y-1">
            Unique, one-of-a-kind stones for custom creations
          </p>
          <div className="flex items-center gap-2 text-base uppercase tracking-widest font-medium text-stone-900 group-hover:text-blue-600 transition-colors z-10">
            <span>Shop Free Size</span>
            <span className="transform transition-transform duration-500 group-hover:duration-200 group-hover:translate-x-2">→</span>
          </div>
        </Link>

        {/* Tile 3: Layouts */}
        <Link
          href="/trade/layouts"
          className="relative flex flex-col items-center justify-center text-center p-12 bg-[#F9F6F0] overflow-hidden transition-all duration-700 group-hover:duration-300 hover:shadow-[0_20px_40px_rgb(0,0,0,0.12)] hover:-translate-y-2 group"
        >
          {/* Expanding Radial Background */}
          <div className="absolute inset-0 bg-gradient-to-tr from-[#F0EBE1]/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 group-hover:duration-300 ease-out z-0" />
          {/* Sweeping Shine Effect */}
          <div className="absolute inset-0 z-0 bg-gradient-to-r from-transparent via-white to-transparent -translate-x-[150%] skew-x-[-25deg] group-hover:translate-x-[150%] transition-transform duration-1000 group-hover:duration-700 ease-in-out delay-150" />
          
          <h2 className="text-4xl md:text-5xl font-light tracking-widest mb-4 uppercase text-stone-800 z-10 transition-transform duration-700 group-hover:duration-300 group-hover:-translate-y-1">
            Layouts
          </h2>
          <p className="text-stone-500 text-lg font-light mb-8 tracking-wide z-10 max-w-sm transition-transform duration-700 group-hover:duration-300 group-hover:-translate-y-1">
            Curated assortments matched to perfection
          </p>
          <div className="flex items-center gap-2 text-base uppercase tracking-widest font-medium text-stone-900 group-hover:text-blue-600 transition-colors z-10">
            <span>Explore Layouts</span>
            <span className="transform transition-transform duration-500 group-hover:duration-200 group-hover:translate-x-2">→</span>
          </div>
        </Link>

        {/* Tile 4: Pairs */}
        <Link
          href="/free-size-gemstones?shape=pair"
          className="relative flex flex-col items-center justify-center text-center p-12 bg-[#F9F6F0] overflow-hidden transition-all duration-700 group-hover:duration-300 hover:shadow-[0_20px_40px_rgb(0,0,0,0.12)] hover:-translate-y-2 group"
        >
          {/* Expanding Radial Background */}
          <div className="absolute inset-0 bg-gradient-to-tl from-[#F0EBE1]/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 group-hover:duration-300 ease-out z-0" />
          {/* Sweeping Shine Effect */}
          <div className="absolute inset-0 z-0 bg-gradient-to-r from-transparent via-white to-transparent -translate-x-[150%] skew-x-[-25deg] group-hover:translate-x-[150%] transition-transform duration-1000 group-hover:duration-700 ease-in-out delay-[225ms]" />
          
          <h2 className="text-4xl md:text-5xl font-light tracking-widest mb-4 uppercase text-stone-800 z-10 transition-transform duration-700 group-hover:duration-300 group-hover:-translate-y-1">
            Matching Pairs
          </h2>
          <p className="text-stone-500 text-lg font-light mb-8 tracking-wide z-10 max-w-sm transition-transform duration-700 group-hover:duration-300 group-hover:-translate-y-1">
            Expertly paired stones for flawless symmetry
          </p>
          <div className="flex items-center gap-2 text-base uppercase tracking-widest font-medium text-stone-900 group-hover:text-blue-600 transition-colors z-10">
            <span>Explore Pairs</span>
            <span className="transform transition-transform duration-500 group-hover:duration-200 group-hover:translate-x-2">→</span>
          </div>
        </Link>
      </div>

      {/* Trust Strip */}
      <div className="w-full bg-[#0b182d] text-white py-8 px-4 flex justify-center">
        <div className="max-w-6xl w-full flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12 text-center md:text-left text-sm md:text-base font-light tracking-wide">
          <div className="flex flex-1 flex-col md:flex-row items-center md:items-start gap-3 md:gap-4">
            <span className="text-2xl md:text-xl flex-shrink-0 md:mt-0.5">📍</span>
            <span>Working with a wide range of wholesalers in the heart of NYC’s Diamond District</span>
          </div>
          <div className="hidden md:block w-px h-12 bg-white/30" />
          <div className="flex flex-1 flex-col md:flex-row items-center md:items-start gap-3 md:gap-4">
            <span className="text-2xl md:text-xl flex-shrink-0 md:mt-0.5">💎</span>
            <span>Ethically sourced, precision-calibrated gemstones</span>
          </div>
          <div className="hidden md:block w-px h-12 bg-white/30" />
          <div className="flex flex-1 flex-col md:flex-row items-center md:items-start gap-3 md:gap-4">
            <span className="text-2xl md:text-xl flex-shrink-0 md:mt-0.5">🤝</span>
            <span>Trusted by jewelers nationwide for generations</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// "use client";

// import { Button, Image } from "@mantine/core";
// import { IconArrowRight } from "@tabler/icons-react";
// import { motion, AnimatePresence } from "framer-motion";
// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import { useMediaQuery } from "@mantine/hooks";

// export function Hero({ jewelryRef, heroData }: any) {
//   const [revealImage, setRevealImage] = useState(false);
//   const router = useRouter();
//   const isMobile = useMediaQuery("(max-width: 908px)");

//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setRevealImage(true);
//     }, 600);
//     return () => clearTimeout(timer);
//   }, []);

//   return (
//     <div
//       onClick={() => router.push("/jewelry/bracelets")}
//       className="relative w-full h-[550px] bg-white overflow-hidde cursor-pointer"
//     >
//       <AnimatePresence>
//         {!revealImage && (
//           <>
//             <motion.div
//               initial={{ x: 0 }}
//               animate={{ x: "-100%" }}
//               exit={{ x: "-100%" }}
//               transition={{ duration: 0.8 }}
//               className="absolute top-0 left-0 w-1/2 h-full bg-[#f7f7f7] z-20"
//             />
//             <motion.div
//               initial={{ x: 0 }}
//               animate={{ x: "100%" }}
//               exit={{ x: "100%" }}
//               transition={{ duration: 0.8 }}
//               className="absolute top-0 right-0 w-1/2 h-full bg-[#f7f7f7] z-20"
//             />
//           </>
//         )}
//       </AnimatePresence>

//       {/* Hero Image */}
//       <motion.div
//         initial={{ opacity: 0, scale: 1.1 }}
//         animate={revealImage ? { opacity: 1, scale: 1 } : {}}
//         transition={{ duration: 0.5, delay: 0.4 }}
//         className="w-full h-full absolute top-0 left-0 z-10"
//       >
//         {/* DESKTOP IMAGE */}
//         <Image
//           src={
//             isMobile
//               ? heroData?.heroData?.page?.metafields[0]?.references?.edges[1]
//                   ?.node?.image?.url || "/assets/hero-bg2.webp"
//               : heroData?.heroData?.page?.metafields[0]?.references?.edges[0]
//                   ?.node?.image?.url || "/assets/hero-bg2.webp"
//           }
//           alt="Hero Desktop"
//           fit="cover"
//           className="w-full h-full hidden md:block"
//         />
//       </motion.div>

//       {revealImage && (
//         <div className="absolute top-0 left-0 w-full h-full bg-black opacity-10 md:opacity-0 z-20 pointer-events-none" />
//       )}

//       {revealImage && (
//         <motion.div
//           initial={{ opacity: 0, y: 30 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.8, delay: 0.9 }}
//           className={`absolute top-1/2 transform -translate-y-1/2 px-6 flex flex-col z-30 ml-12`}
//         >
//           <div className="">
//             {/* <h2 className="text-2xl tracking-[0.2em] uppercase mb-2 text-white sm:text-black">
//               Fall Fashion,
//             </h2>
//             <h1 className="uppercase text-6xl font-light tracking-wide  mb-3 drop-shadow-sm leading-tight text-white sm:text-black">
//               redefined
//             </h1>
//             <p className="text-lg  mb-8 max-w-xl leading-relaxed text-white sm:text-black">
//               Refine Your Fall Look with Timeless Luxury and Radiant Gemstones.
//             </p> */}

//             {/* <Button
//               size="md"
//               radius="0"
//               color="dark"
//               className="bg-white text-black hover:bg-gray-100 transition-all duration-300"
//               rightSection={<IconArrowRight size={18} />}
//               onClick={() => router.push("/jewelry/rings")}
//             >
//               Shop Jewelry
//             </Button> */}
//           </div>
//         </motion.div>
//       )}
//     </div>
//   );
// }
