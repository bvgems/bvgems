import { Avatar, Container, Image, Rating } from "@mantine/core";
import { Carousel } from "@mantine/carousel";
import React, { useRef } from "react";
import { AnimatedText } from "../CommonComponents/AnimatedText";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import Autoplay from "embla-carousel-autoplay";

const reviews = [
  {
    platform: "/assets/google.png",
    name: "Andrew Wasden",
    initials: "AW",
    rating: 5,
    review: `I had been looking for a place to make a custom engagement ring, and I decided to go with B.V Gems after hearing they specialize in sapphires.
  
  I worked with Shrey, and he gave me an excellent deal on a lab diamond of excellent quality and then put me in contact with his designer. Together they created a gorgeous ring I can't wait to give to my soon to be fiance. I gave Shrey a rough idea of what I was looking for in sapphires and left the rest to him and he fully delivered.
  
  I am very pleased with their service and their craftsmanship and would recommend them to anyone looking for a custom engagement ring or the best sapphires.`,
  },
  {
    platform: "/assets/google.png",
    name: "Samantha Jones",
    initials: "SJ",
    rating: 5,
    review: `I was looking to create a unique sapphire pendant for my anniversary and chose B.V Gems because of their reputation in colored gemstones.
  
  Shrey worked closely with me to find the perfect sapphire, and then introduced me to a designer who helped craft a beautiful and elegant piece. I explained what I had in mind, and they handled everything with precision and care.
  
  The pendant turned out to be more stunning than I imagined. I’m extremely satisfied with their service and highly recommend them for any custom jewelry needs.`,
  },
  {
    platform: "/assets/google.png",
    name: "Michael Lee",
    initials: "ML",
    rating: 5,
    review: `I had a custom ruby ring in mind for my wife and decided to trust B.V Gems after reading their excellent reviews on gemstone craftsmanship.
  
  Shrey was a fantastic guide—he sourced a high-quality ruby and worked with the design team to build a ring that matched my vision. I only gave a few notes and they turned them into something brilliant and unique.
  
  The entire process was smooth and professional. I'm beyond happy with the final product and would absolutely recommend them to anyone looking for custom gemstone jewelry.`,
  },
  {
    platform: "/assets/google.png",
    name: "Priya Patel",
    initials: "PP",
    rating: 5,
    review: `For my mother's 60th birthday, I wanted a meaningful emerald ring and came across B.V Gems during my search for trustworthy jewelers.
  
  Shrey helped me find a beautiful emerald and connected me with their designer, who took my basic concept and refined it into a stunning design. Everything from the stone to the setting was executed with incredible attention to detail.
  
  I was impressed by their responsiveness and professionalism throughout the process. I highly recommend B.V Gems for anyone wanting to create something heartfelt and beautiful.`,
  },
  {
    platform: "/assets/google.png",
    name: "David Kim",
    initials: "DK",
    rating: 5,
    review: `I was referred to B.V Gems by a friend when I was exploring custom engagement rings. Their strong reputation for colored stones made me feel confident.
  
  Shrey guided me from the start—he helped me pick a unique spinel and introduced me to their design expert. I gave them a rough idea and they managed everything from there, keeping me updated at each step.
  
  The ring turned out perfect. Their customer service and craftsmanship are top-notch. I'd recommend them to anyone who wants a truly personalized and smooth jewelry design experience.`,
  },
];

export const Testimonials = () => {
  const autoplay = useRef(Autoplay({ delay: 3000, stopOnInteraction: true }));

  return (
    <Container size={1250} className="mt-20 pb-20">
      <AnimatedText
        text="See What Our Customers Say About Us"
        className="text-center text-3xl sm:text-4xl text-[#0b182d]"
      />

      <Carousel
        withIndicators
        slideSize="100%"
        slideGap="md"
        plugins={[autoplay.current]}
        nextControlIcon={<IconChevronRight size={30} />}
        previousControlIcon={<IconChevronLeft size={30} />}
        onMouseEnter={autoplay.current.stop}
        onMouseLeave={() => autoplay.current.play()}
        styles={{
          control: {
            backgroundColor: "transparent",
            border: "none",
            color: "#99a1af",
          },
        }}
        className="mt-10"
      >
        {reviews.map((review, index) => (
          <Carousel.Slide key={index}>
            <div className="relative w-full max-w-[700px] mx-auto rounded-4xl bg-[#f1f1f1] flex flex-col items-center justify-center px-4 sm:px-6 py-10 sm:py-14 text-center">
              <Image src={review.platform} h={50} w={50} />

              <Rating
                size="xl"
                fractions={5}
                defaultValue={review.rating}
                readOnly
                className="mb-4"
              />

              <p className="text-sm sm:text-base leading-6 sm:leading-7 text-gray-800 italic">
                "{review.review}"
              </p>
              <span className="mt-4 text-base sm:text-lg font-semibold">
                - {review.name}
              </span>
            </div>
          </Carousel.Slide>
        ))}
      </Carousel>
    </Container>
  );
};
