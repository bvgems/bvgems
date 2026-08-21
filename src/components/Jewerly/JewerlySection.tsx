"use client";
import { Card, Container, Grid, GridCol } from "@mantine/core";
import Image from "next/image";
import React, { forwardRef, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";

const jewelryItems = [
  { handle: "rings", image: "/assets/jcring.webp", alt: "Ring", title: "RINGS" },
  {
    handle: "earrings",
    image: "/assets/jcearrings.webp",
    alt: "Earrings",
    title: "EARRINGS",
  },
  {
    handle: "necklaces",
    image: "/assets/jcnecklace.webp",
    alt: "Necklace",
    title: "NECKLACE",
  },
  {
    handle: "bracelets",
    image: "/assets/jcbracelet.webp",
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
  return (
    <Container size={1350} ref={ref} className="mt-20">
      <AnimatedText
        text="Bespoke Fine Jewelry Collection"
        className="text-center text-4xl text-[#0b182d] mb-4"
      />
      <p className="text-center text-sm text-gray-500 max-w-2xl mx-auto mb-8">
        B.V. Gems is your trusted source for wholesale gemstones and fine jewelry in NYC. Explore our curated collections below.
      </p>
      <div className="p-4">
        <Grid gutter="lg">
          {jewelryItems.map((item, index) => (
            <AnimatedGridCol key={index} index={index}>
              <Card
                component={Link}
                href={`/jewelry/${item?.handle}`}
                className="overflow-hidden relative rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300 group cursor-pointer block"
                padding={0}
                radius="md"
                style={{ height: "350px" }}
              >
                <div className="relative w-full h-full overflow-hidden">
                  <Image loading="lazy"
                    src={item.image}
                    alt={item.alt}
                    fill
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
