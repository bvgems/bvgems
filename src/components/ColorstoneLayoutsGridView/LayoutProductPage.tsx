"use client";

import React, { useEffect, useState } from "react";
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
  Slider,
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
import { useMediaQuery } from "@mantine/hooks";
import { ImageZoomMobile } from "../CommonComponents/ImageZoomMobile";
import { AnimatePresence } from "framer-motion";

import { FreeMode } from "swiper/modules";

import { OptionSquare } from "../CommonComponents/OptionSquare";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
interface ProductPageProps {
  product: any;
}

export default function LayoutProductPage({ product }: ProductPageProps) {
  console.log("prodd", product);
  const shapeSize = JSON.parse(product?.shapeSizes?.value);
  const images = product?.images?.edges?.map((img: any) => img.node.url) || [];
  const [mainImage, setMainImage] = useState(images?.[2] || images?.[0]); // default main image
  const { user } = useAuth();
  const isMobile = useMediaQuery("(max-width: 1100px)"); // ✅ fixed typo
  const [scale, setScale] = useState(1);

  const price = product?.variants?.edges?.[0]?.node?.price?.amount || "0.00";
  const currency =
    product?.variants?.edges?.[0]?.node?.price?.currencyCode || "USD";

  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<any>(
    shapeSize[0]?.size || ""
  );
  const [stoneCount, setStoneCount] = useState(shapeSize[0]?.stone_count || "");
  const [caratWeight, setCaratWeight] = useState(shapeSize[0]?.ct_weight || "");
  const userKey = user?.id?.toString() || "guest";
  const cartStore = getCartStore(userKey);
  const addToCart = cartStore((state: any) => state.addToCart);

  useEffect(() => {
    const matched = shapeSize?.find((item: any) => item?.size === selectedSize);

    if (matched) {
      setCaratWeight(matched.ct_weight || "");
      setStoneCount(matched.stone_count || "");
    }
  }, [selectedSize, shapeSize]);

  const addProductInCart = () => {
    try {
      addToCart({
        product: {
          id: product?.id,
          title: product?.title,
          handle: product?.handle,
          productType: "layouts",
          productId: `${product.id}-${selectedSize}`,
          ct_weight: caratWeight,
          image_url: product.images?.edges[0]?.node?.url,
          price: product?.variants?.edges?.[0]?.node?.price?.amount || "0.00",
          shape: product.shape?.value,
          size: selectedSize,
          stoneCount: stoneCount,
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

  const getShapeSizes = () => {
    return shapeSize?.map((item: any) => {
      return item?.size;
    });
  };

  return (
    <Container size={1350} className="py-12">
      <Grid gutter="xl" align="flex-start">
        {/* LEFT - Product Image */}
        <GridCol span={{ base: 12, md: 6 }}>
          <Card radius="md" shadow="sm" padding="md" withBorder>
            {isMobile ? (
              <ImageZoomMobile
                src={mainImage}
                alt={product?.title}
                scale={scale}
              />
            ) : (
              <AnimatePresence mode="wait">
                <ImageZoom
                  key={mainImage}
                  src={mainImage}
                  alt={product?.title}
                />
              </AnimatePresence>
            )}
          </Card>

          {/* Mobile Zoom Slider */}
          {isMobile && (
            <div className="px-4 mt-3" onClick={(e) => e.stopPropagation()}>
              <p className="text-xs mb-1">Zoom In</p>
              <Slider
                size="xs"
                color="#0b182d"
                min={1}
                max={4}
                step={0.1}
                value={scale}
                onChange={setScale}
                label={(value) => `${value.toFixed(1)}x`}
              />
            </div>
          )}

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
                  width: 80,
                  height: 80,
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
            <div className="mb-5">
              <p className="font-medium">Stone Size</p>
              <Swiper
                modules={[FreeMode]}
                spaceBetween={12}
                slidesPerView="auto"
                freeMode={true}
                style={{ padding: "6px 0" }}
              >
                {getShapeSizes()?.map((size: string) => (
                  <SwiperSlide key={size} style={{ width: "auto" }}>
                    <OptionSquare
                      label={size}
                      value={size}
                      selected={selectedSize === size}
                      onClick={setSelectedSize}
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>

            {/* Product Specs */}
            <div className="space-y-3 mb-6 ">
              <Group>
                <Text fw={600} w={150}>
                  Gemstone:
                </Text>
                <Text>{product?.gemstone?.value || "-"}</Text>
              </Group>
              <Group>
                <Text fw={600} w={150}>
                  Shape:
                </Text>
                <Text>{product?.shape?.value || "-"}</Text>
              </Group>
              <Group>
                <Text fw={600} w={150}>
                  Total Carat Weight:
                </Text>
                <Text>{caratWeight || "-"} ct.</Text>
              </Group>
              <Group>
                <Text fw={600} w={150}>
                  Stone Count:
                </Text>
                <Text>{stoneCount || "-"}</Text>
              </Group>

              <Group>
                <Text fw={600} w={150}>
                  Stone Type:
                </Text>
                <Text>{product?.stoneType?.value || "Natural"}</Text>
              </Group>
              <Group>
                <Text fw={600} w={150}>
                  Product Type:
                </Text>
                <Text>
                  {`${product?.jewelryType?.value} - ${
                    product?.layout_type?.value || ""
                  }`}
                </Text>
              </Group>
            </div>

            {/* Quantity + Add to Cart */}
            <Group mt="lg" gap="md" mb="xl">
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
