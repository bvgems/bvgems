"use client";
import { Button, Image, Text, Title } from "@mantine/core";
import { IconArrowRight } from "@tabler/icons-react";
import { Carousel, CarouselSlide } from "@mantine/carousel";
import { useRef } from "react";
import Autoplay from "embla-carousel-autoplay";

export function Hero() {
  const autoplay = useRef(Autoplay({ delay: 2200 }));
  const slidesData = [
    {
      image: "/assets/hero1.png",
      title: "Your Gemstone Destination Awaits",
      description:
        "Discover premium gems from every corner, beautifully brought together",
    },
    {
      image: "/assets/hero2.png",
      title: "Shop Gemstones the Easy Way",
      description:
        "Browse our curated gemstone collection — all beautifully in one place",
    },
  ];

  const slides = slidesData.map((slide, index) => (
    <CarouselSlide key={index}>
      <div className="relative w-full h-[400px]">
        <Image
          src={slide.image}
          alt={slide.title}
          className=" object-cover"
          fit="inherit"
        />

        <div className="absolute inset-0 text-black flex flex-col justify-center items-start px-32">
          <Title className="text-violet-800" order={2}>
            {slide.title}
          </Title>
          <Text size="md" mt="xl">
            {slide.description}
          </Text>
          <Button
            mt="lg"
            color="violet"
            rightSection={<IconArrowRight size={20} />}
          >
            Shop Now
          </Button>
        </div>
      </div>
    </CarouselSlide>
  ));

  return (
    <Carousel withIndicators height={450}>
      {slides}
    </Carousel>
  );
}
