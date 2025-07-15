"use client";
import { Carousel, CarouselSlide } from "@mantine/carousel";
import { Button, Grid, GridCol, Image } from "@mantine/core";
import { IconArrowRight } from "@tabler/icons-react";
import { useRef } from "react";
import Autoplay from "embla-carousel-autoplay";
import { motion, useInView } from "framer-motion";
import React from "react";
import { useRouter } from "next/navigation";

export const RightSideLooseGemstones = () => {
  const autoplay = useRef(Autoplay({ delay: 2500 }));
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const router = useRouter();

  const redirectToLooseGemstones = () => {
    router?.push("/loose-gemstones");
  };

  return (
    <motion.div
      ref={ref}
      className="bg-[#0b182d] h-[400px] px-10 flex items-center"
      initial={{ y: 100, x: 100, rotate: 15, opacity: 0 }}
      animate={inView ? { y: 0, x: 0, rotate: 0, opacity: 1 } : {}}
      transition={{ duration: 1, ease: "easeOut" }}
    >
      <Grid align="center" gutter="xl">
        <GridCol span={{ base: 12, md: 6 }}>
          <Carousel
            slideSize="100%"
            height={400}
            slideGap={0}
            controlsOffset="sm"
            controlSize={26}
            withControls
            withIndicators={false}
            plugins={[autoplay.current]}
            onMouseEnter={() => autoplay.current?.stop?.()}
            onMouseLeave={() => autoplay.current?.reset?.()}
          >
            <CarouselSlide>
              <Image className="mt-6" h={350} src="/assets/pink.png" />
            </CarouselSlide>
            <CarouselSlide>
              <Image className="mt-6" h={350} src="/assets/blue.png" />
            </CarouselSlide>
            <CarouselSlide>
              <Image className="mt-6" h={350} src="/assets/green.png" />
            </CarouselSlide>
            <CarouselSlide>
              <Image className="mt-6" h={350} src="/assets/purple.png" />
            </CarouselSlide>
          </Carousel>
        </GridCol>

        <GridCol span={{ base: 12, md: 6 }} className="text-white">
          <h1 className="text-2xl">Shop Our Top Loose Gemstones</h1>
          <p className="mt-3 italic">
            Discover a curated selection of precious and semi-precious color
            gemstones, available in both treated and untreated varieties—perfect
            for collectors, jewelers, and enthusiasts alike.
          </p>
          <Button
            mt="xl"
            px="xl"
            size="sm"
            color="dark"
            style={{ backgroundColor: "white", color: "black" }}
            fw="normal"
            rightSection={<IconArrowRight size={20} />}
            onClick={redirectToLooseGemstones}
          >
            View All
          </Button>
        </GridCol>
      </Grid>
    </motion.div>
  );
};
