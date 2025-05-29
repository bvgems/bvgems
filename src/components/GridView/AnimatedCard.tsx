"use client";
import { motion, useAnimation } from "framer-motion";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { Button, Card, CardSection, Group, Image, Text } from "@mantine/core";
import { IconArrowRight } from "@tabler/icons-react";
import Link from "next/link";

interface AnimatedCardProps {
  item: any;
  index: number;
}

export const AnimatedCard = ({ item, index }: AnimatedCardProps) => {
  const controls = useAnimation();
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={{
        hidden: { opacity: 0, y: 60 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.5, delay: index * 0.1 },
        },
      }}
    >
      <Card shadow="sm" padding="lg" withBorder>
        <CardSection component="a" className="h-[190px]">
          <Image src={item?.image?.src} fit="fill" alt={item?.title} />
        </CardSection>

        <Group justify="space-between" mb="xs">
          <Text style={{ marginTop: "50px" }} c={"violet"} fw={700}>
            {item?.title}
          </Text>
        </Group>

        <Text size="sm" c="dimmed">
          With Fjord Tours you can explore more of the magical fjord landscapes
        </Text>

        <Link href={`/${item.handle}`}>
          <Button
            color="violet"
            fullWidth
            mt="md"
            rightSection={<IconArrowRight size={14} />}
            radius="md"
          >
            View More
          </Button>
        </Link>
      </Card>
    </motion.div>
  );
};
