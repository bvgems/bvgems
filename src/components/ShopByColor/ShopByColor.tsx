"use client";

import { Container, Grid, Card, Text, Image } from "@mantine/core";
import { motion } from "framer-motion";
import { AnimatedText } from "../CommonComponents/AnimatedText";
import { shopByColorOptions } from "@/utils/constants";
import { useRouter } from "next/navigation";
import { forwardRef, useMemo } from "react";
import { IconArrowRight } from "@tabler/icons-react";
import { CardProps } from "@mui/material/Card";

const MotionCard = motion(
  forwardRef<HTMLDivElement, CardProps>((props: any, ref: any) => (
    <Card ref={ref} {...props} />
  ))
);

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.45, ease: "easeOut" },
  }),
};

export default function ShopByColor() {
  const router = useRouter();

  const items = useMemo(
    () =>
      (shopByColorOptions || []).map((x: any) => ({
        ...x,
      })),
    []
  );

  const handleClick = (item: any) => {
    router.push(`/loose-gemstones?color=${item?.name?.toLowerCase()}`);
  };

  return (
    <Container size={1250} className="mt-20">
      <AnimatedText
        text="Shop Calibrated Gemstones By Color"
        className="text-center text-4xl text-[#0b182d] mb-12"
      />

      <Grid gutter="xl" justify="center">
        {items.map((item: any, index: number) => (
          <Grid.Col
            key={item?.name ?? index}
            span={{ base: 12, sm: 6, md: 4, lg: 3, xl: 2 }}
          >
            <MotionCard
              component="a"
              onClick={() => handleClick(item)}
              className="cursor-pointer transition-all hover:-translate-y-1"
              style={{
                height: 280,
                borderRadius: "12px",
                boxShadow:
                  "0 4px 6px rgba(0, 0, 0, 0.08), 0 2px 4px rgba(0, 0, 0, 0.06)",
              }}
              custom={index}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={itemVariants}
            >
              <Card.Section inheritPadding py="md">
                <div className="flex justify-center items-center w-full">
                  <Image
                    src={item?.image}
                    alt={item?.name}
                    h={140}
                    w={140}
                    fit="contain"
                    className="mx-auto"
                  />
                </div>
              </Card.Section>
              <Text
                fw={700}
                size="lg"
                mt="md"
                className="text-[#0b182d] text-center sm:text-left"
              >
                {item?.name}
              </Text>
              <div className="text-[#0b182d] mt-2 flex flex-row items-center gap-1 justify-center sm:justify-start">
                <span>Shop now</span>
                <IconArrowRight size={15} />
              </div>{" "}
            </MotionCard>
          </Grid.Col>
        ))}
      </Grid>
    </Container>
  );
}
