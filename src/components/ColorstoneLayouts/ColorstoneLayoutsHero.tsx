import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button, Image } from "@mantine/core";
import { IconArrowRight, IconSparkles } from "@tabler/icons-react";
import { useRouter } from "next/navigation";

export const ColorstoneLayoutsHero = () => {
  const router = useRouter();
  const slide = {
    image: "/assets/colorstonelayouthero.png",
    title: "EXPLORE OR DESIGN GEMSTONE LAYOUTS",
    description:
      "Browse our curated layouts of ombré and straight color combinations—or create your own by selecting stone, shape, and size to craft a truly personalized piece.",
  };

  const [showContent, setShowContent] = useState(false);
  const [imageRevealed, setImageRevealed] = useState(false);

  useEffect(() => {
    const contentTimer = setTimeout(() => {
      setShowContent(true);
    }, 300);

    const imageTimer = setTimeout(() => {
      setImageRevealed(true);
    }, 400);

    return () => {
      clearTimeout(contentTimer);
      clearTimeout(imageTimer);
    };
  }, []);

  const redirectToBuildOwnLayout = () => {
    router?.push("/create-colorstone-layout");
  };
  return (
    <div className="relative w-full h-[450px] bg-white overflow-hidden">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
        className="absolute inset-0 bg-gray-100/20 z-5"
      />

      <div className="relative w-full h-full overflow-hidden">
        <Image
          src={slide.image}
          alt={slide.title}
          className="w-[100%]"
          style={{
            height: "100%",
            width: "100%",
            objectPosition: "right bottom",
          }}
        />

        <motion.div
          initial={{ x: 0 }}
          animate={imageRevealed ? { x: "100%" } : { x: 0 }}
          transition={{
            duration: 0.6,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
          className="absolute top-0 left-0 w-full h-full bg-[#f7f7f7] z-15"
        />

        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black/60 via-transparent to-black/30 z-20" />
      </div>

      <AnimatePresence>
        {showContent && (
          <>
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0, rotate: 0 }}
                animate={{
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0],
                  rotate: 360,
                  x: [0, Math.random() * 200 - 100],
                  y: [0, Math.random() * 200 - 100],
                }}
                transition={{
                  duration: 3,
                  delay: i * 0.3,
                  repeat: Infinity,
                  repeatDelay: 2,
                }}
                className="absolute z-25"
                style={{
                  left: `${20 + i * 15}%`,
                  top: `${30 + i * 10}%`,
                }}
              >
                <IconSparkles size={16} className="text-yellow-500" />
              </motion.div>
            ))}
          </>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={showContent ? { y: 0, opacity: 1 } : {}}
        transition={{
          duration: 0.8,
          delay: 0.6,
          ease: "easeOut",
        }}
        className="absolute inset-0 text-white flex flex-col justify-center items-center text-center px-4 z-30"
      >
        <motion.div
          initial={{ scale: 0.8 }}
          animate={showContent ? { scale: 1 } : {}}
          transition={{
            duration: 0.6,
            delay: 1,
            type: "spring",
            stiffness: 100,
          }}
        >
          <h1
            style={{ fontFamily: "'Alice', sans-serif", fontWeight: "520" }}
            className="text-[2.4rem] leading-tight mb-4 text-white"
          >
            {slide.title}
          </h1>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={showContent ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="max-w-2xl text-lg text-gray-100 mb-8"
        >
          {slide.description}
        </motion.p>

        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={showContent ? { y: 0, opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 1.4 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Button
            size="lg"
            px="xl"
            py="md"
            color="white"
            variant="outline"
            fw="normal"
            rightSection={<IconArrowRight size={20} />}
            className="shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            See Our Collection
          </Button>
          <Button
            size="lg"
            px="xl"
            color="white"
            variant="outline"
            fw="normal"
            rightSection={<IconArrowRight size={20} />}
            className="shadow-lg hover:shadow-xl transition-shadow duration-300"
            onClick={redirectToBuildOwnLayout}
          >
            Design Your Own
          </Button>
        </motion.div>
      </motion.div>

      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black/80 to-transparent z-25" />
    </div>
  );
};
