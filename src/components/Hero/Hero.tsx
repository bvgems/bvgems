"use client";
import { Button, Text, Title } from "@mantine/core";
import { IconArrowRight } from "@tabler/icons-react";
import { Carousel, CarouselSlide } from "@mantine/carousel";
import { useRef } from "react";
import Autoplay from "embla-carousel-autoplay";

export function Hero() {
  const autoplay = useRef(Autoplay({ delay: 2200 }));
  const slidesData = [
    {
      image: "/assets/background-two.png",
      title: "Your Gemstone Destination Awaits",
      description:
        "Discover premium gems from every corner, beautifully brought together",
    },
    {
      image: "/assets/background-three.png",
      title: "Shop Gemstones the Easy Way",
      description:
        "Browse our curated gemstone collection — all beautifully in one place",
    },

    {
      image: "/assets/background-one.png",
      title: "Find Your Perfect Gemstone Match",
      description:
        "Explore a handpicked selection of gemstones — sorted with care just for you",
    },
  ];

  const slides = slidesData.map((slide, index) => (
    <CarouselSlide key={index}>
      <div className="relative w-full h-[600px]">
        <img
          src={slide.image}
          alt={slide.title}
          className="w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 text-white flex flex-col justify-center items-start px-32">
          <Title order={2}>{slide.title}</Title>
          <Text size="lg" mt="sm">
            {slide.description}
          </Text>
          <Button
            mt="lg"
            color="gray"
            variant="white"
            rightSection={<IconArrowRight size={20} />}
          >
            Shop Now
          </Button>
        </div>
      </div>
    </CarouselSlide>
  ));

  return (
    <Carousel
      plugins={[autoplay.current]}
      onMouseEnter={autoplay.current.stop}
      onMouseLeave={() => autoplay.current.play()}
      withIndicators
      height={600}
    >
      {slides}
    </Carousel>
  );
}
