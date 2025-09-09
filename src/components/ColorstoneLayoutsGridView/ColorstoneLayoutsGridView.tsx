"use client";

import {
  Card, Skeleton,
  Container,
  Grid,
  GridCol
} from "@mantine/core";
import { ProductCard } from "./ProductCard";

export const ColorstoneLayoutsGridView = ({ products }: any) => {
  return (
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

          return <ProductCard key={node.id} node={node} index={index} />;
        })}
      </Grid>
    </Container>
  );
};
