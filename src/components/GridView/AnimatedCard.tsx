"use client";
import { motion, useAnimation } from "framer-motion";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { Card, CardSection, Modal, Button, ActionIcon } from "@mantine/core";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useDisclosure } from "@mantine/hooks";
import { AuthForm } from "../Auth/AuthForm";
import { IconShoppingCart, IconLock } from "@tabler/icons-react";
import { getPerCaratPrice, getPerStonePrice } from "@/utils/priceHelpers";

import { generateCalibratedStoneUrl, generateFreeSizeStoneUrl } from "@/utils/seoUrlHelpers";

interface AnimatedCardProps {
  item: any;
  index: number;
  baseDelay?: number;
  isFreeSize?: boolean;
  onAddToCart?: () => void;
}

export const AnimatedCard = ({
  item,
  index,
  baseDelay = 0,
  isFreeSize = false,
  onAddToCart,
}: AnimatedCardProps) => {
  const controls = useAnimation();
  const { user } = useAuth();
  const [modalOpened, { open, close }] = useDisclosure(false);
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const router = useRouter();

  const getProductName = (item: any) => {
    const ctWeightPart = item?.ct_weight ? `${item.ct_weight} cttw. ` : "";
    return `${ctWeightPart}${item?.color} ${item?.shape} ${item?.collection_slug}, ${item?.quality} Quality - ${item?.size}`;
  };

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

  const redirectToStonePage = () => {
    const stoneHandle = item?.collection_slug?.toLowerCase() || "unknown";
    if (!isFreeSize) {
      router.push(generateCalibratedStoneUrl(item, stoneHandle));
    } else {
      router.push(generateFreeSizeStoneUrl(item, stoneHandle));
    }
  };

  const getTitleSizeClass = (title: string) => {
    const len = (title || "").length;
    const isSingleWord = !title?.includes(" ");
    
    // For single long words on mobile, shrink just enough to keep on one line
    if (isSingleWord && len > 9) {
      return "text-sm md:text-lg leading-tight whitespace-nowrap";
    }
    
    // For everything else (multiple words or short words), normal size and allow natural wrap
    return "text-base md:text-lg leading-tight";
  };

  return (
    <>
      <Modal
        opened={modalOpened}
        onClose={close}
        overlayProps={{ style: { backdropFilter: "blur(4px)" } }}
        transitionProps={{ transition: "slide-right" }}
        centered
      >
        <AuthForm onClose={close} />
      </Modal>

      <motion.div
        ref={ref}
        className="h-full w-full"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ type: "spring", damping: 20, stiffness: 150 }}
        whileTap={{ scale: 0.97 }}
      >
        <Card
          padding={0}
          className="flex flex-col justify-start bg-white cursor-pointer h-full border border-gray-200/80 shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-400 ease-out rounded-2xl overflow-hidden p-0"
          onClick={redirectToStonePage}
        >
          <div className="flex items-center justify-center bg-white h-[140px] sm:h-[160px] md:h-[200px] lg:h-[240px]">
            <motion.img
              src={item?.image_url}
              alt={item?.title}
              className="object-contain h-[70%]"
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", damping: 20, stiffness: 100 }}
            />
          </div>

          <div className="p-3.5 md:p-5 flex flex-col flex-grow bg-white relative">
            {!isFreeSize ? (
              <div className="flex flex-col h-full">
                 <div className="flex justify-between items-start gap-2 mb-1">
                   <h3 className={`font-bold text-[#0b182d] ${getTitleSizeClass(item?.collection_slug)} tracking-tight leading-tight`}>
                     {item?.collection_slug}
                   </h3>
                   <div className="bg-gray-50 text-gray-600 px-2 py-0.5 rounded text-[10px] sm:text-xs font-semibold whitespace-nowrap border border-gray-100 shadow-sm">
                     {item?.ct_weight} ct
                   </div>
                 </div>
                 
                 <p className="text-gray-500 text-[11px] sm:text-xs tracking-wide font-medium mt-0.5 flex flex-wrap items-center gap-1.5">
                   <span>{item?.shape}</span>
                   <span className="text-gray-300 text-[10px]">•</span>
                   <span>{item?.quality || "Natural"}</span>
                   <span className="text-gray-300 text-[10px]">•</span>
                   <span className="text-gray-400">{item?.size?.replace(/mm/gi, '').trim()} mm</span>
                 </p>

                 <div className="mt-auto flex flex-col pt-4 border-t border-gray-50 mt-4">
                   {user ? (
                     <div className="flex items-end justify-between gap-2">
                       <div className="flex flex-col">
                         <span className="text-[9px] sm:text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-0.5">Total Price</span>
                         <div className="flex items-baseline gap-1.5">
                           <span className="font-bold text-[#0b182d] text-lg sm:text-xl tracking-tight leading-none">
                             {item?.price ? `$${getPerStonePrice(item)}` : "Req"}
                           </span>
                           {item?.price && (
                             <span className="font-medium text-gray-400 text-[10px] sm:text-xs">
                               / ${(getPerCaratPrice(item) || 0).toFixed(2)} ct
                             </span>
                           )}
                         </div>
                       </div>
                       
                       {!isFreeSize && onAddToCart && (
                         <ActionIcon 
                           variant="filled" 
                           color="#0b182d" 
                           size="lg" 
                           radius="xl"
                           className="shadow-md hover:scale-105 transition-transform"
                           onClick={(e) => {
                             e.stopPropagation();
                             onAddToCart();
                           }}
                         >
                           <IconShoppingCart size={18} stroke={2} />
                         </ActionIcon>
                       )}
                     </div>
                   ) : (
                     <div className="flex items-center justify-between gap-2">
                       <div 
                         onClick={(e) => { e.stopPropagation(); open(); }}
                         className="flex flex-col group cursor-pointer w-full"
                       >
                         <span className="text-[9px] sm:text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-1">Pricing</span>
                         <div className="flex items-center justify-between bg-blue-50/50 hover:bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100/60 transition-colors">
                           <div className="flex items-center gap-1.5 text-blue-600">
                             <IconLock size={14} stroke={2.5} />
                             <span className="text-xs font-bold tracking-wide">Sign in to view prices</span>
                           </div>
                         </div>
                       </div>
                     </div>
                   )}
                 </div>
              </div>
            ) : (
              <div>
                <p>Dimension: {item?.dimension}</p>
                <p>Carat Weight: {item?.ct_weight}</p>

                {!user ? (
                  <p className="text-gray-700 text-sm font-medium mt-2">
                    Please{" "}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        open();
                      }}
                      className="underline text-blue-600 hover:text-blue-800"
                    >
                      sign in
                    </button>{" "}
                    to view gemstone prices.
                  </p>
                ) : (
                  <p>
                    Per Carat Price:{" "}
                    {item?.price ? `$${item.price}` : "Price upon request"}
                  </p>
                )}
              </div>
            )}
          </div>
        </Card>
      </motion.div>
    </>
  );
};
