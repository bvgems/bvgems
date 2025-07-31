"use client";
import { Card, Container, Grid, GridCol, Image } from "@mantine/core";
import React, { forwardRef, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useRouter } from "next/navigation";

const jewelryItems = [
  { handle: "rings", image: "/assets/ring.png", alt: "Ring", title: "RINGS" },
  {
    handle: "earrings",
    image: "/assets/earring.png",
    alt: "Earrings",
    title: "EAR RINGS",
  },
  {
    handle: "necklaces",
    image: "/assets/necklace.png",
    alt: "Necklace",
    title: "NECKLACE",
  },
  {
    handle: "bracelets",
    image: "/assets/bracelet.png",
    alt: "Bracelet",
    title: "BRACELETS",
  },
];

const AnimatedText = ({
  text,
  delay = 0,
  duration = 0.8,
  className = "",
}: {
  text: string;
  delay?: number;
  duration?: number;
  className?: string;
}) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.h1
      ref={ref}
      initial={{ y: 50, opacity: 0 }}
      animate={inView ? { y: 0, opacity: 1 } : {}}
      transition={{ duration, delay }}
      className={className}
    >
      {text}
    </motion.h1>
  );
};

const AnimatedGridCol = ({
  children,
  index,
}: {
  children: React.ReactNode;
  index: number;
}) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.1 });

  return (
    <GridCol span={{ base: 12, sm: 6, md: 3 }}>
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 60 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
        transition={{ duration: 0.8, delay: index * 0.2 }}
      >
        {children}
      </motion.div>
    </GridCol>
  );
};

export const JewelrySection = forwardRef<HTMLDivElement>((_, ref) => {
  const router = useRouter();

  const navigateToJewelry = (handle: any) => {
    router.push(`/jewelry/${handle}`);
  };
  return (
    <Container size={1250} ref={ref} className="mt-20">
      <AnimatedText
        text="Our Jewelry Collection"
        className="text-center text-4xl text-[#0b182d] mb-6"
      />
      <div className="p-4">
        <Grid gutter="lg">
          {jewelryItems.map((item, index) => (
            <AnimatedGridCol key={index} index={index}>
              <Card
                className="overflow-hidden relative rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300 group cursor-pointer"
                padding={0}
                radius="md"
                style={{ height: "350px" }}
                onClick={() => navigateToJewelry(item?.handle)}
              >
                <div className="relative w-full h-full overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.alt}
                    className="object-cover w-full h-full transform transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute bottom-0 left-0 w-full h-1/4 group-hover:h-full transition-all duration-500">
                    <div
                      className="w-full h-full"
                      style={{
                        background:
                          "linear-gradient(to top, rgba(0, 0, 0, 0.6), transparent)",
                      }}
                    />
                  </div>
                  <div className="absolute bottom-0 left-0 w-full transition-transform duration-700 group-hover:-translate-y-20">
                    <div className="text-center pb-11">
                      <span className="uppercase text-2xl text-white">
                        {item.title}
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            </AnimatedGridCol>
          ))}
        </Grid>
      </div>
    </Container>
  );
});
JewelrySection.displayName = "JewelrySection";
