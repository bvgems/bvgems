"use client";
import { Container, Grid, GridCol, Image } from "@mantine/core";
import { AnimatedText } from "../CommonComponents/AnimatedText";
import { JewelryCard } from "./JewerlyCard";

const jewelryItems = [
  // {
  //   title: "Rings",
  //   image: "/assets/ownring3.png",
  //   subtitle: "Design a ring that reflects your story.",
  // },
  // {
  //   title: "Ear Rings",
  //   image: "/assets/ownearrings.png",
  //   subtitle: "Delicate earrings crafted for every moment.",
  // },
  {
    title: "Necklaces",
    image: "/assets/ownnecklace.png",
    subtitle: "Make a statement with a personalized necklace.",
  },
  {
    title: "Bracelets",
    image: "/assets/ownbracelet.png",
    subtitle: "Grace your wrist with unique charm.",
  },
];



export const OwnJewerly = () => {
  return (
    <Container size={1250} className="mt-20">
      <AnimatedText
        text="Build Your Own Jewerly"
        className="text-center text-4xl text-[#0b182d] mb-12"
      />
      <Grid gutter="xl" mt="xl" align="center">
        {jewelryItems.map((item, index) => (
          <GridCol key={index} span={{ base: 12, md: 6 }}>
            <JewelryCard
              title={item.title}
              image={item.image}
              subtitle={item.subtitle}
            />
          </GridCol>
        ))}
      </Grid>
    </Container>
  );
};
