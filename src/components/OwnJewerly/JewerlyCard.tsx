"use client";
import { Image } from "@mantine/core";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export const JewelryCard = ({
  title,
  image,
  subtitle,
}: {
  title: string;
  image: string;
  subtitle: string;
}) => {
  const controls = useAnimation();
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.3 });
  const router = useRouter();

  useEffect(() => {
    if (inView) {
      controls.start({
        opacity: 1,
        scale: 1,
        transition: { duration: 0.8, ease: "easeOut" },
      });
    }
  }, [inView, controls]);
  const handleRedirect = () => {
    router.push(`/create-colorstone-layout`);
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 1.1 }}
      animate={controls}
      className="relative h-[300px] overflow-hidden"
    >
      <Image src={image} h={300} w={400} className="object-cover" />

      <motion.div
        variants={{ rest: { x: 0 }, hover: { x: -40 } }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
        className="absolute top-1/2 right-1 transform -translate-y-1/2 bg-white p-4 shadow-md h-[200px] w-[380px] py-12 px-10"
        whileHover="hover"
        initial="rest"
        animate="rest"
      >
        <h1 className="text-2xl uppercase font-semibold">{title}</h1>
        <p className="text-gray-600 text-sm">{subtitle}</p>
        <div className="mt-5 flex gap-4 justify-between">
          <motion.button
            className="relative text-gray-500 text-sm px-0 py-1 border-none bg-transparent focus:outline-none cursor-pointer"
            variants={{ rest: { opacity: 1 }, hover: { opacity: 1 } }}
            onClick={() => handleRedirect()}
          >
            Create Now
            <motion.span
              variants={{ rest: { width: "0%" }, hover: { width: "100%" } }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="absolute left-0 bottom-0 h-[1.5px] bg-gray-500"
            />
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};
