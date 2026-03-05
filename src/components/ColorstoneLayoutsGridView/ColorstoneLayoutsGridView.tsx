"use client";

import {
  Card,
  Skeleton,
  Container,
  Grid,
  GridCol,
  Accordion,
} from "@mantine/core";
import { ProductCard } from "./ProductCard";

export const ColorstoneLayoutsGridView = ({
  products,
  selectedQuality,
}: any) => {
  return (
    <>
      <h1 className="text-2xl flex justify-center mt-12">
        Color Stone Layouts Collection
      </h1>
      <Container size={1350} className="py-6">
        <Accordion defaultValue="description" variant="separated" radius="md">
          <Accordion.Item value="description">
            <Accordion.Control>
              <span className="text-lg font-medium">About This Collection</span>
            </Accordion.Control>
            <Accordion.Panel>
              <p className="text-gray-600 leading-relaxed">
                Our colorstone layouts feature carefully calibrated natural
                gemstones arranged in ready-to-set sequences — ideal for tennis
                bracelets, bezel mountings, eternity bands, and fine jewelry
                designs. Each gemstone layout is meticulously matched for color,
                cut, clarity, and size consistency, ensuring a perfectly graded
                flow when set. The round gemstones are diamond-cut for maximum
                brilliance, fire, and sparkle. Every sapphire layout, ruby
                layout, and emerald layout is precision-calibrated and
                harmonized, making the setting process faster, easier, and more
                professional. A perfect choice for jewelers, designers, and
                manufacturers seeking premium calibrated gemstone layouts with
                exceptional uniformity and visual balance.
              </p>
            </Accordion.Panel>
          </Accordion.Item>
        </Accordion>
      </Container>
      <Container size={1350} className="py-12">
        <span>Showing {products?.length} results</span>
        <Grid gutter="xl">
          {products.map(({ node }: any, index: number) => {
            const isLoading = !node;
            if (isLoading) {
              return (
                <GridCol key={index} span={{ base: 12, sm: 12, md: 6, lg: 6 }}>
                  <Card radius="md" shadow="none" padding="md">
                    <Skeleton height={350} radius="md" mb="sm" />
                    <Skeleton height={20} width="80%" mb="xs" />
                    <Skeleton height={16} width="40%" />
                  </Card>
                </GridCol>
              );
            }

            return (
              <ProductCard
                key={node.id}
                node={node}
                index={index}
                selectedQuality={selectedQuality}
              />
            );
          })}
        </Grid>
      </Container>
    </>
  );
};
