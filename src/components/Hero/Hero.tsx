"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useMediaQuery } from "@mantine/hooks";

export function Hero({ jewelryRef, heroData }: any) {
  const router = useRouter();
  const isMobile = useMediaQuery("(max-width: 908px)");

  return (
    <div
      onClick={() => router.push("/jewelry/bracelets")}
      className="relative w-full h-[550px] bg-white overflow-hidden cursor-pointer"
    >
      {/* Hero Image */}
      <div className="w-full h-full absolute top-0 left-0 z-10">
        <Image
          src={
            isMobile
              ? heroData?.heroData?.page?.metafields[0]?.references?.edges[1]
                  ?.node?.image?.url || "/assets/hero-bg2.webp"
              : heroData?.heroData?.page?.metafields[0]?.references?.edges[0]
                  ?.node?.image?.url || "/assets/hero-bg2.webp"
          }
          alt="Hero Image"
          fill
          priority
          className="object-cover"
        />
      </div>

      {/* Optional dark overlay for mobile */}
      <div className="absolute top-0 left-0 w-full h-full bg-black opacity-10 md:opacity-0 z-20 pointer-events-none" />
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
