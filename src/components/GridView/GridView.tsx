"use client";
import {
  Button,
  Card,
  Container,
  Group,
  Image,
  SimpleGrid,
  Text,
} from "@mantine/core";
import { useEffect, useState } from "react";
import { getAllGemstones } from "@/apis/api";
import { IconArrowRight } from "@tabler/icons-react";
import Link from "next/link";

export function GridView() {
  const [gemstonesCategories, setGemstonesCategories] = useState<any>([]);
  useEffect(() => {
    fetchGemstones();
  }, []);

  const fetchGemstones = async () => {
    const response = await getAllGemstones();
    setGemstonesCategories(response);
  };
  const cards = gemstonesCategories
    .filter((item: any) => item.title !== "Home page")
    .map((item: any) => {
      return (
        <Card shadow="sm" padding="lg" radius="md" key={item?.id} withBorder>
          <Card.Section component="a" className="h-[190px]">
            <Image
              src={item?.image?.src}
              className="object-fill"
              alt={item?.title}
            />
          </Card.Section>

          <Group justify="space-between" mt="md" mb="xs">
            <Text fw={700}>{item?.title}</Text>
            {/* <Badge color="pink">On Sale</Badge> */}
          </Group>

          <Text size="sm" c="dimmed">
            With Fjord Tours you can explore more of the magical fjord
            landscapes with tours and activities on and around the fjords of
            Norway
          </Text>
          <Link href={`/${item.handle}`}>
            <Button
              color="#bc4c2a"
              fullWidth
              mt="md"
              rightSection={<IconArrowRight size={14} />}
              radius="md"
            >
              View More
            </Button>
          </Link>
        </Card>
      );
    });

  return (
    <div className="mt-16">
      <div className="flex justify-center">
        <h1 className="text-3xl font-semibold">
          Calibrated Faceted Gemstones
        </h1>
      </div>
      <Container size={"lg"} py="xl">
        <SimpleGrid cols={{ base: 1, sm: 3 }} spacing={{ base: 0, sm: "md" }}>
          {cards}
        </SimpleGrid>
      </Container>
    </div>
  );
}
