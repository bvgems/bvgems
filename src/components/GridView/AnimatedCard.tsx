"use client";
import { motion, useAnimation } from "framer-motion";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { Button, Card, CardSection, Group, Text } from "@mantine/core";
import { IconArrowRight } from "@tabler/icons-react";
import Link from "next/link";

interface AnimatedCardProps {
  item: any;
  index: number;
  baseDelay?: number;
}

export const AnimatedCard = ({
  item,
  index,
  baseDelay = 0,
}: AnimatedCardProps) => {
  const controls = useAnimation();
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
    >
      <Card
        className="flex flex-col justify-start h-[350px] bg-white cursor-pointer"
        padding="lg"
        withBorder
      >
        <CardSection component="a" className="h-[190px] overflow-hidden">
          <motion.img
            src={item?.image?.src}
            alt={item?.title}
            className="object-cover w-full h-full"
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        </CardSection>

        <Group justify="space-between" mb="xs">
          <Text style={{ marginTop: "50px", fontSize: "1.2rem" }} fw={700}>
            {item?.title}
          </Text>
        </Group>

        <Text size="sm" c="dimmed">
          With Fjord Tours you can explore more of the magical fjord landscapes
        </Text>

        <Link href={`/${item.handle}`}>
          <Button
            color="violet"
            variant="outline"
            fullWidth
            mt={"lg"}
            size="compact-sm"
            rightSection={<IconArrowRight />}
            px={"xl"}
          >
            View More
          </Button>
        </Link>
      </Card>
    </motion.div>
  );
};
