"use client";

import { useAuth } from "@/hooks/useAuth";
import {
  Badge,
  Button,
  Grid,
  GridCol,
  Group,
  NumberFormatter,
  NumberInput,
  ScrollArea,
  Text,
} from "@mantine/core";
import {
  IconCheck,
  IconShoppingCart,
  IconStarFilled,
} from "@tabler/icons-react";
import { JeweleryDetailsAccordion } from "./JeweleryDetailsTable";
import { getCartStore } from "@/store/useCartStore";
import { QuestionAndDeliveryAccordian } from "../CommonComponents/QuestionAndDeliveryAccordian";
import { useJewelryFunctions } from "@/hooks/useJewlryFunctions";
import { notifications } from "@mantine/notifications";
import { GoldColorInput } from "../CommonComponents/GoldColorInput";
import { OptionSquare } from "../CommonComponents/OptionSquare";
import { FreeMode } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { useEffect, useState, useMemo } from "react";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";

// 🔹 Hook to generate fake review count
function useFakeReviewCount(jf: any) {
  return useMemo(() => {
    if (jf.isRingCategory) {
      return Math.floor(Math.random() * (350 - 120 + 1)) + 120; // 120–350
    }
    if (jf.isNecklaces) {
      return Math.floor(Math.random() * (280 - 100 + 1)) + 100; // 100–280
    }
    if (jf.isBracelets) {
      return Math.floor(Math.random() * (150 - 50 + 1)) + 50; // 50–150
    }
    if (jf.isEarringCategory) {
      return Math.floor(Math.random() * (120 - 30 + 1)) + 30; // 30–120
    }
    if (jf.isBead) {
      return Math.floor(Math.random() * (60 - 15 + 1)) + 15; // 15–60
    }
    return Math.floor(Math.random() * (80 - 20 + 1)) + 20; // fallback
  }, [jf]);
}

export const JewelryProductDetails = ({
  path,
  productData,
  selectedShape,
  onShapeChange,
  selectedImage,
  twoStoneRings,
}: any) => {
  const { user } = useAuth();
  const userKey = user?.id?.toString() || "guest";
  const cartStore = getCartStore(userKey);
  const addToCart = cartStore((state: any) => state.addToCart);

  const jf = useJewelryFunctions(
    path,
    productData,
    selectedShape,
    selectedImage,
    twoStoneRings,
    addToCart
  );

  const addProduct = () => {
    jf.addProductInCart();
    notifications.show({
      icon: <IconCheck />,
      color: "teal",
      message: "Jewelry product added to the cart!",
      position: "top-right",
      autoClose: 4000,
    });
  };

  // 🔹 Parse earring metafields
  let parsed: any[] = [];
  try {
    if (
      productData?.earring_metafielcd?.type === "json" &&
      productData?.earring_metafielcd?.value &&
      jf?.isEarringCategory
    ) {
      parsed = JSON.parse(productData.earring_metafielcd.value);
    }
  } catch (err) {
    console.error("Failed to parse earring options:", err);
  }

  const [selectedEarring, setSelectedEarring] = useState<any | null>(null);

  useEffect(() => {
    if (jf.isEarringCategory && parsed.length > 0 && !selectedEarring) {
      setSelectedEarring(parsed[0]);
      jf.setSelectedCarat(parsed[0].carat);
      jf.setCustomPrice(Number(parsed[0].price));
    }
  }, [jf.isEarringCategory, parsed, selectedEarring]);

  // 🔹 Handle option change
  const handleEarringChange = (option: any) => {
    setSelectedEarring(option);
    jf.setSelectedCarat(option.carat);
    jf.setCustomPrice(Number(option.price));
  };

  // 🔹 Fake review count
  const reviewCount = useFakeReviewCount(jf);

  return (
    <>
      <h1 className="capitalize text-[1.6rem] leading-snug tracking-wide mb-2">
        {productData?.title}
      </h1>

      {/* ⭐ Ratings */}
      <Group gap="xs" mb="sm">
        {Array.from({ length: 5 }).map((_, i) => (
          <IconStarFilled key={i} size={18} color="gold" />
        ))}
        <Text size="sm" c="dimmed">
          {reviewCount} Reviews
        </Text>
      </Group>

      <Group mb="md" gap="md" align="center">
        <Text fw={700} fz="xl">
          <NumberFormatter
            thousandSeparator
            prefix="$"
            value={jf.displayPrice}
            suffix=" USD"
          />
        </Text>
        {jf.numericPrice ? (
          <>
            <Text c="dimmed" td="line-through">
              <NumberFormatter
                prefix="$ "
                value={(jf.numericPrice * 1.1).toFixed(2)}
                suffix=" USD"
              />
            </Text>
            <Badge color="green" radius="sm">
              10% OFF
            </Badge>
          </>
        ) : null}
      </Group>

      {/* 🔹 All product options (same as your code) */}
      <div className="mt-4 flex flex-col gap-6">
        {!jf.isBead &&
          !(
            jf.isEarringCategory && productData?.jewelryType?.value === "Silver"
          ) && (
            <GoldColorInput
              selectedGoldColor={jf.selectedGoldColor}
              setSelectedGoldColor={jf.setSelectedGoldColor}
            />
          )}

        {jf.isBead && (
          <div>
            <p className="mb-2 font-medium">Select Stone Size</p>
            <Swiper
              modules={[FreeMode]}
              spaceBetween={12}
              slidesPerView="auto"
              freeMode={true}
              style={{ padding: "6px 0" }}
            >
              {jf.getBeadStoneSize().map((size: string) => (
                <SwiperSlide key={size} style={{ width: "auto" }}>
                  <OptionSquare
                    label={size}
                    value={size}
                    selected={jf.selectedBeadStoneSize === size}
                    onClick={jf.setSelectedBeadStoneSize}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        )}

        {jf.isEarringCategory && parsed.length > 0 && (
          <div>
            <p className="mb-2 font-medium">Select Total Carat Weight</p>
            <Swiper
              modules={[FreeMode]}
              spaceBetween={12}
              slidesPerView="auto"
              freeMode={true}
              style={{ padding: "6px 0" }}
            >
              {parsed.map((opt) => (
                <SwiperSlide key={opt.carat} style={{ width: "auto" }}>
                  <OptionSquare
                    label={opt.carat}
                    value={opt.carat}
                    selected={selectedEarring?.carat === opt.carat}
                    onClick={() => handleEarringChange(opt)}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        )}

        {jf.isRingCategory && (
          <div>
            <p className="mb-2 font-medium">Select Ring Size</p>
            <Swiper
              modules={[FreeMode]}
              spaceBetween={12}
              slidesPerView="auto"
              freeMode={true}
              style={{ padding: "6px 0" }}
            >
              {jf.ringSizes().map((size: string) => (
                <SwiperSlide key={size} style={{ width: "auto" }}>
                  <OptionSquare
                    label={size}
                    value={size}
                    selected={jf.selectedRingSize === size}
                    onClick={jf.setSelectedRingSize}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        )}

        {jf.isBracelets && (
          <div>
            <p className="mb-2 font-medium">Select Bracelet Length</p>
            <Swiper
              modules={[FreeMode]}
              spaceBetween={12}
              slidesPerView="auto"
              freeMode={true}
              style={{ padding: "6px 0" }}
            >
              {jf.braceletLength().map((len: string) => (
                <SwiperSlide key={len} style={{ width: "auto" }}>
                  <OptionSquare
                    label={len}
                    value={len}
                    selected={jf.selectedBraceletLength === len}
                    onClick={jf.setSelectedBraceletLength}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        )}

        {jf.isNecklaces && (
          <div>
            <p className="mb-2 font-medium">Select Necklace Length</p>
            <Swiper
              modules={[FreeMode]}
              spaceBetween={12}
              slidesPerView="auto"
              freeMode={true}
              style={{ padding: "6px 0" }}
            >
              {jf.getLengthData().map((len: string) => (
                <SwiperSlide key={len} style={{ width: "auto" }}>
                  <OptionSquare
                    label={len}
                    value={len}
                    selected={jf.selectedNecklaceLength === len}
                    onClick={jf.setSelectedNecklaceLength}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        )}

        {productData?.showshapeoptions?.value === "true" && (
          <div>
            <p className="mb-2 font-medium">
              {jf.isTwoStoneRing
                ? `Select Stones (${productData?.firstShape?.value} / ${productData?.secondShape?.value})`
                : "Select Stone"}
            </p>
            <ScrollArea scrollbarSize={6} offsetScrollbars>
              <Group gap="sm" wrap="nowrap">
                {productData?.variants?.edges?.map((v: any) => {
                  const title = v?.node?.title;
                  return (
                    <OptionSquare
                      key={title}
                      label={title}
                      value={title}
                      selected={selectedShape === title}
                      onClick={jf.isTwoStoneRing ? jf.setStones : onShapeChange}
                    />
                  );
                })}
              </Group>
            </ScrollArea>
          </div>
        )}

        {/* Quantity + Add to cart */}
        <Grid mt="xs" align="stretch">
          <GridCol span={{ base: 3 }}>
            <NumberInput
              min={1}
              value={jf.quantity}
              onChange={(v) => jf.setQuantity(v || 1)}
              allowNegative={false}
              radius="md"
              size="md"
              w={110}
              style={{ height: "100%" }}
            />
          </GridCol>
          <GridCol span={{ base: 9 }}>
            <Button
              disabled={jf.isDisabled()}
              color="#0b182d"
              onClick={addProduct}
              leftSection={<IconShoppingCart size={20} />}
              fullWidth
              h="100%"
            >
              ADD TO CART
            </Button>
          </GridCol>
        </Grid>
      </div>

      {(jf.isRingCategory || jf.isEarringCategory || jf.isNecklaces) && (
        <div className="mt-6">
          <JeweleryDetailsAccordion
            productData={productData}
            gemstone={selectedShape}
            jf={jf}
            earringMetafields={selectedEarring}
          />
        </div>
      )}

      <div className="mt-4">
        <QuestionAndDeliveryAccordian />
      </div>

      {productData?.description && (
        <Text mt="xl" size="sm" c="dimmed" className="italic mb-6">
          {productData.description}
        </Text>
      )}
    </>
  );
};
