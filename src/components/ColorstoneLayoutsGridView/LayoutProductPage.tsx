"use client";

import React, { useState } from "react";
import {
  Container,
  Grid,
  GridCol,
  Card,
  Image,
  Text,
  Button,
  Group,
  Badge,
  NumberInput,
  Flex,
} from "@mantine/core";
import {
  IconCheck,
  IconShoppingCart,
  IconStarFilled,
  IconX,
} from "@tabler/icons-react";
import { ImageZoom } from "../CommonComponents/ImageZoom";
import { QuestionAndDeliveryAccordian } from "../CommonComponents/QuestionAndDeliveryAccordian";
import { useAuth } from "@/hooks/useAuth";
import { getCartStore } from "@/store/useCartStore";
import { notifications } from "@mantine/notifications";

interface ProductPageProps {
  product: any; // Shopify product JSON response
}

export default function LayoutProductPage({ product }: ProductPageProps) {
  const images = product?.images?.edges?.map((img: any) => img.node.url) || [];
  const [mainImage, setMainImage] = useState(images?.[2] || images?.[0]); // default main image
  const { user } = useAuth();

  const price = product?.variants?.edges?.[0]?.node?.price?.amount || "0.00";
  const currency =
    product?.variants?.edges?.[0]?.node?.price?.currencyCode || "USD";

  const [quantity, setQuantity] = useState(1);

  const userKey = user?.id?.toString() || "guest";
  const cartStore = getCartStore(userKey);
  const addToCart = cartStore((state: any) => state.addToCart);
  const addProductInCart = () => {
    try {
      addToCart({
        product: {
          id: product?.id,
          title: product?.title,
          handle: product?.handle,
          productType: "layouts",
          productId: product.id,
          ct_weight: product.ct_weight?.value,
          image_url: product.images?.edges[0]?.node?.url,
          price: product?.variants?.edges?.[0]?.node?.price?.amount || "0.00",
          shape: product.shape?.value,
          size: product.size?.value,
        },
        quantity: quantity,
      });
      notifications.show({
        icon: <IconCheck />,
        color: "teal",
        message: "Product added to the cart!",
        position: "top-right",
        autoClose: 3500,
      });
    } catch (err) {
      notifications.show({
        icon: <IconX />,
        color: "red",
        message: "Something went wrong while adding product to cart!",
        position: "top-right",
        autoClose: 3500,
      });
    }
  };

  return (
    <Container size={1350} className="py-12">
      <Grid gutter="xl" align="flex-start">
        {/* LEFT - Product Image */}
        <GridCol span={{ base: 12, md: 6 }}>
          <Card radius="md" shadow="sm" padding="md" withBorder>
            <ImageZoom
              src={mainImage}
              alt={product.title}
              radius="md"
              fit="contain"
              height={400}
              style={{ objectFit: "contain" }}
            />
          </Card>

          {/* Thumbnails */}
          <Flex justify="center" gap="md" mt="md">
            {images.map((img: string, idx: number) => (
              <Card
                key={idx}
                radius="md"
                shadow="sm"
                padding={4}
                withBorder
                style={{
                  cursor: "pointer",
                  border:
                    mainImage === img ? "2px solid #0b182d" : "1px solid #ddd",
                  width: 80, // ✅ fixed width
                  height: 80, // ✅ fixed height
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                onClick={() => setMainImage(img)}
              >
                <Image
                  src={img}
                  alt={`thumbnail-${idx}`}
                  fit="contain"
                  width={70}
                  height={70}
                  style={{ objectFit: "contain" }}
                />
              </Card>
            ))}
          </Flex>
        </GridCol>

        {/* RIGHT - Product Info */}
        <GridCol span={{ base: 12, md: 6 }}>
          {/* Title */}

          <div className="px-12 mt-5 md:px-32 md:mt-10 lg:px-0 lg:mt-0">
            <h1 className="text-2xl mb-3">{product.title}</h1>

            {/* Reviews */}
            <Group gap="xs" mb="md">
              {Array.from({ length: 5 }).map((_, i) => (
                <IconStarFilled
                  key={i}
                  size={20}
                  color={i < 5 ? "gold" : "lightgray"}
                />
              ))}
              <Text fz="sm" c="dimmed">
                137 Reviews
              </Text>
            </Group>

            {/* Pricing */}
            <Group mb="lg">
              <Text fw={700} fz="xl">
                {currency} {parseFloat(price).toFixed(2)}
              </Text>
              <Text c="dimmed" td="line-through">
                {currency} {(parseFloat(price) * 1.1).toFixed(2)}
              </Text>
              <Badge color="green" radius="sm">
                10% OFF
              </Badge>
            </Group>

            {/* Product Specs */}
            <div className="space-y-3 mb-6">
              <Group>
                <Text fw={600} w={150}>
                  Total Carat Weight:
                </Text>
                <Text>{product?.ct_weight?.value || "-"}</Text>
              </Group>
              <Group>
                <Text fw={600} w={150}>
                  Shape:
                </Text>
                <Text>{product?.shape?.value || "-"}</Text>
              </Group>
              <Group>
                <Text fw={600} w={150}>
                  Size:
                </Text>
                <Text>{product?.size?.value || "-"}</Text>
              </Group>
              <Group>
                <Text fw={600} w={150}>
                  Stone Type:
                </Text>
                <Text>{product?.stoneType?.value || "Natural"}</Text>
              </Group>
            </div>

            {/* Quantity + Add to Cart */}
            <Group mt="lg" gap="md" mb={"xl"}>
              <NumberInput
                value={quantity}
                onChange={(val: any) => setQuantity(val || 1)}
                min={1}
                max={99}
                w={100}
                radius="md"
                size="md"
              />
              <Button
                color="#0b182d"
                onClick={addProductInCart}
                fullWidth
                leftSection={<IconShoppingCart size={20} />}
                w={300}
              >
                ADD TO CART
              </Button>
            </Group>
            <div className="max-w-3xl">
              <QuestionAndDeliveryAccordian />
            </div>
          </div>
        </GridCol>
      </Grid>
    </Container>
  );
}
