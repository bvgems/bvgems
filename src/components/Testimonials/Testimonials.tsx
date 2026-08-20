"use client";

import { Avatar, Container, Rating, Text } from "@mantine/core";
import Image from "next/image";
import { Carousel } from "@mantine/carousel";
import React, { useRef } from "react";
import { AnimatedText } from "../CommonComponents/AnimatedText";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import Autoplay from "embla-carousel-autoplay";

const reviews = [
  {
    platform: "/assets/google.webp",
    name: "Andrew Wasden",
    location: "NY, US",
    initials: "AW",
    rating: 5,
    review:
      "I had been looking for a place to make a custom engagement ring, and I decided to go with B.V Gems after hearing they specialize in sapphires. The ring turned out gorgeous and exceeded expectations.",
  },
  {
    platform: "/assets/google.webp",
    name: "Samantha Jones",
    location: "CA, US",
    initials: "SJ",
    rating: 5,
    review:
      "I was looking to create a unique sapphire pendant for my anniversary. Shrey helped me source the perfect stone and the final pendant is stunning!",
  },
  {
    platform: "/assets/google.webp",
    name: "Michael Lee",
    location: "IL, US",
    initials: "ML",
    rating: 5,
    review:
      "I wanted a ruby ring for my wife. Shrey and the design team delivered exactly what I had envisioned. Professional and smooth process throughout.",
  },
  {
    platform: "/assets/google.webp",
    name: "Priya Patel",
    location: "TX, US",
    initials: "PP",
    rating: 5,
    review:
      "For my mother's 60th, B.V Gems created a meaningful emerald ring. Incredible attention to detail and craftsmanship. Highly recommend!",
  },
  {
    platform: "/assets/google.webp",
    name: "David Kim",
    location: "NJ, US",
    initials: "DK",
    rating: 5,
    review:
      "Referred by a friend for a custom engagement ring. Shrey guided me through every step and the final piece was perfect. Excellent service!",
  },
];

export const Testimonials = () => {
  const autoplay = useRef(Autoplay({ delay: 3500, stopOnInteraction: true }));

  return (
    <Container size={1350} className="mt-20 pb-20">
      <AnimatedText
        text="What Our Customer Say About Us"
        className="text-center text-3xl sm:text-4xl text-[#0b182d]"
      />

      <Carousel
        slideSize={{ base: "100%", sm: "50%", md: "33.3333%" }}
        slideGap="lg"
        // align="start"
        withIndicators={false}
        plugins={[autoplay.current]}
        nextControlIcon={<IconChevronRight size={28} />}
        previousControlIcon={<IconChevronLeft size={28} />}
        nextControlProps={{ "aria-label": "Next slide" }}
        previousControlProps={{ "aria-label": "Previous slide" }}
        onMouseEnter={autoplay.current.stop}
        onMouseLeave={() => autoplay.current.play()}
        className="mt-10"
      >
        {reviews.map((review, index) => (
          <Carousel.Slide key={index}>
            <div className="flex flex-col h-full border border-gray-200 rounded-xl shadow-sm p-6 bg-white">
              {/* Rating */}
              <Rating
                size="md"
                fractions={5}
                defaultValue={review.rating}
                readOnly
                className="mb-3"
              />

              {/* Review text */}
              <Text size="sm" color="dimmed" className="flex-grow line-clamp-4">
                {review.review}
              </Text>

              {/* Reviewer info */}
              <div className="flex items-center mt-5">
                <Avatar radius="xl" color="blue" size={40}>
                  {review.initials}
                </Avatar>
                <div className="ml-3">
                  <p className="text-sm font-semibold text-gray-800">
                    {review.name}
                  </p>
                  <p className="text-xs text-gray-500">{review.location}</p>
                </div>
                <div className="relative ml-auto w-[20px] h-[20px]">
                  <Image loading="lazy"
                    src={review.platform}
                    fill
                    className="object-contain"
                    alt={`${review.platform} review platform logo`}
                  />
                </div>
              </div>
            </div>
          </Carousel.Slide>
        ))}
      </Carousel>
    </Container>
  );
};
