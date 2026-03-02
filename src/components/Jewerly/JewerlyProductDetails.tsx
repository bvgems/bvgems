"use client";

import { useAuth } from "@/hooks/useAuth";
import {
  Badge,
  Button,
  Drawer,
  Grid,
  GridCol,
  Group,
  Image,
  Modal,
  NumberFormatter,
  NumberInput,
  Text,
} from "@mantine/core";
import {
  IconCheck,
  IconGift,
  IconShoppingCart,
  IconSparkles,
  IconStarFilled,
} from "@tabler/icons-react";

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
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import { JewelryOptionsDrawer } from "./JewelryOptionsDrawer";
import { CustomizeJewelryDrawer } from "./CustomizeJewelryDrawer";
import { JeweleryDetailsTable } from "./JeweleryDetailsTable";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

// 🔹 Hook to generate fake review count
function useFakeReviewCount(jf: any) {
  return useMemo(() => {
    if (jf.isRingCategory) {
      return Math.floor(Math.random() * (350 - 120 + 1)) + 120;
    }
    if (jf.isNecklaces) {
      return Math.floor(Math.random() * (280 - 100 + 1)) + 100;
    }
    if (jf.isBracelets) {
      return Math.floor(Math.random() * (150 - 50 + 1)) + 50;
    }
    if (jf.isEarringCategory) {
      return Math.floor(Math.random() * (120 - 30 + 1)) + 30;
    }
    if (jf.isBead) {
      return Math.floor(Math.random() * (60 - 15 + 1)) + 15;
    }
    return Math.floor(Math.random() * (80 - 20 + 1)) + 20;
  }, [jf]);
}

export const JewelryProductDetails = ({
  path,
  productData,
  selectedShape,
  onShapeChange,
  selectedImage,
  twoStoneRings,
  category,
  isFreeGift,
}: any) => {
  const { user } = useAuth();
  const userKey = user?.id?.toString() || "guest";
  const cartStore = getCartStore(userKey);
  const addToCart = cartStore((state: any) => state.addToCart);
  const [opened, { open, close }] = useDisclosure(false);
  const [value, setValue] = useState<string>("");
  const [customizedDrawerTitle, setCustomizedDrawerTitle] = useState("");
  const [freeGiftModalOpened, setFreeGiftModalOpened] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentVariantSlug = pathname?.split("/").filter(Boolean).pop();
  useEffect(() => {
    switch (category) {
      case "necklaces":
        setCustomizedDrawerTitle("Necklace");
        break;
      case "rings":
        setCustomizedDrawerTitle("Ring");
        break;
      case "bracelets":
        setCustomizedDrawerTitle("Bracelet");
        break;

      case "earrings":
        setCustomizedDrawerTitle("Earring");

      default:
        break;
    }
  }, [category]);

  useEffect(() => {
    const fromCart = searchParams.get("fromCart");
    const freeGift = searchParams.get("freeGift");

    const alreadyShown = sessionStorage.getItem("freeGiftShown");

    if (freeGift === "true" && fromCart === "true" && !alreadyShown) {
      setFreeGiftModalOpened(true);
      sessionStorage.setItem("freeGiftShown", "true");
    }
  }, [searchParams]);

  const jf = useJewelryFunctions(
    path,
    productData,
    selectedShape,
    selectedImage,
    twoStoneRings,
    addToCart,
    userKey,
  );
  const isMobile = useMediaQuery("(max-width: 768px)");

  const router = useRouter();

  const addProduct = () => {
    let variantTitle = jf.isBead
      ? productData?.title
      : selectedShape || productData?.title;

    if (
      productData?.showshapeoptions?.value === "true" &&
      (!jf.isNecklaces ||
        (jf.isNecklaces && productData?.inHand?.value === "true"))
    ) {
      jf.setSelectedVariant(variantTitle);
    }

    jf.addProductInCart(value, variantTitle, isFreeGift);

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
      productData?.earring_metafield?.type === "json" &&
      productData?.earring_metafield?.value &&
      jf?.isEarringCategory
    ) {
      parsed = JSON.parse(productData.earring_metafield.value);
    }
  } catch (err) {
    console.error("Failed to parse earring options:", err);
  }

  const [selectedEarring, setSelectedEarring] = useState<any | null>(null);
  const [customizeOpened, { open: openCustomize, close: closeCustomize }] =
    useDisclosure(false);

  useEffect(() => {
    if (jf.isEarringCategory && parsed.length > 0 && !selectedEarring) {
      if (isFreeGift) {
        const freeOption = parsed.find((opt) => opt.carat === "0.65");

        if (freeOption) {
          setSelectedEarring(freeOption);
          jf.setSelectedCarat(freeOption.carat);
          jf.setCustomPrice(0); // FREE
        }
      } else {
        setSelectedEarring(parsed[0]);
        jf.setSelectedCarat(parsed[0].carat);
        jf.setCustomPrice(Number(parsed[0].price));
      }
    }
  }, [jf.isEarringCategory, parsed, selectedEarring, isFreeGift]);

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
      <Modal
        opened={freeGiftModalOpened}
        onClose={() => setFreeGiftModalOpened(false)}
        centered
        withCloseButton
        title={
          <Group gap="xs">
            <IconSparkles size={20} color="gold" />
            <Text fw={600}>Congratulations!</Text>
          </Group>
        }
      >
        <div className="flex flex-col gap-3">
          <Text>
            🎉 You’re receiving a <strong>FREE 0.65 Carat Stud Earring</strong>{" "}
            as a gift!
          </Text>

          <Text size="sm" c="dimmed">
            You can personalize your gift by changing the gemstone. Click on{" "}
            <strong>“Explore Different Gemstones”</strong> below the product
            image.
          </Text>

          <Button
            mt="sm"
            color="#0b182d"
            onClick={() => setFreeGiftModalOpened(false)}
            fullWidth
          >
            Continue Customizing
          </Button>
        </div>
      </Modal>

      <Drawer
        size={500}
        position="right"
        opened={customizeOpened}
        onClose={closeCustomize}
        title={`Customize This ${customizedDrawerTitle}`}
        overlayProps={{ backgroundOpacity: 0.5, blur: 0 }}
      >
        <CustomizeJewelryDrawer
          type={customizedDrawerTitle}
          productData={productData}
          close={closeCustomize}
          value={value}
          setValue={setValue}
        />
      </Drawer>

      <Drawer size={540} position="bottom" opened={opened} onClose={close}>
        <JewelryOptionsDrawer
          selectedShape={selectedShape}
          productData={productData}
          category={category}
          close={close}
          open={openCustomize}
          isFreeGift={isFreeGift}
        />
      </Drawer>
      <h1 className="capitalize text-[1.25rem] leading-snug tracking-wide mb-2">
        {jf.isBead ? productData?.title : selectedShape || productData?.title}
      </h1>

      <Group gap="xs" mb="sm">
        {Array.from({ length: 5 }).map((_, i) => (
          <IconStarFilled key={i} size={18} color="gold" />
        ))}
        <Text size="sm" c="dimmed">
          {reviewCount} Reviews
        </Text>
      </Group>

      <Group gap="md" align="center">
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
      <div className="mt-2">
        <span
          onClick={openCustomize}
          className="cursor-pointer text-sm underline"
        >
          Customize This {customizedDrawerTitle}?
        </span>
      </div>

      <div className="mt-3 flex flex-col gap-4">
        {!jf.isBead &&
          !(
            jf.isEarringCategory && productData?.jewelryType?.value === "Silver"
          ) &&
          (!jf.isBracelets ||
            (jf.isBracelets && productData?.inHand?.value === "true")) &&
          (!jf.isNecklaces ||
            (jf.isNecklaces && productData?.inHand?.value === "true")) && (
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
              freeMode
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
              freeMode
              style={{ padding: "6px 0" }}
            >
              {parsed.map((opt) => (
                <SwiperSlide key={opt.carat} style={{ width: "auto" }}>
                  <OptionSquare
                    label={opt.carat}
                    value={opt.carat}
                    selected={selectedEarring?.carat === opt.carat}
                    disabled={isFreeGift && opt.carat !== "0.65"}
                    onClick={() => {
                      if (!isFreeGift) handleEarringChange(opt);
                    }}
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
              freeMode
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

        {jf.isBracelets && productData?.inHand?.value === "true" && (
          <div>
            <p className="mb-2 font-medium">Select Bracelet Length</p>
            <Swiper
              modules={[FreeMode]}
              spaceBetween={12}
              slidesPerView="auto"
              freeMode
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

        {jf.isBracelets && productData?.inHand?.value === "true" && (
          <div>
            <p className="mb-2 font-medium">Select Necklace Length</p>
            <Swiper
              modules={[FreeMode]}
              spaceBetween={12}
              slidesPerView="auto"
              freeMode
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
              disabled={isFreeGift}
            />
          </GridCol>
          <GridCol span={{ base: 9 }}>
            {isFreeGift ? (
              <Button
                disabled={jf.isDisabled()}
                color="#0b182d"
                onClick={() => {
                  addProduct();
                }}
                leftSection={<IconGift size={20} />}
                fullWidth
                h="100%"
              >
                CLAIM YOUR FREE GIFT
              </Button>
            ) : (
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
            )}
          </GridCol>
        </Grid>

        {productData?.showshapeoptions?.value === "true" &&
        (!jf.isNecklaces ||
          (jf.isNecklaces && productData?.inHand?.value === "true")) ? (
          <>
            <h1 className="text-md px-6 pb-6 text-center">
              More Options For This Design
            </h1>
            <div className="grid grid-cols-2 gap-4">
              {productData?.variants?.edges?.map((item: any, idx: number) => {
                const slug = item?.node?.title
                  ?.toLowerCase()
                  .replace(/\s+/g, "-");

                const isActive = slug === currentVariantSlug;
                return (
                  <div
                    key={idx}
                    className={`bg-white transition-all duration-300 cursor-pointer p-4 flex flex-col justify-between shadow-md hover:shadow-xl rounded-xl
        ${isActive ? "border-2 border-[#9aa7bb]" : "border border-transparent"}
      `}
                    onClick={() => {
                      router.push(
                        `/jewelry-details/${category}/${
                          productData?.handle
                        }/${item?.node?.title.toLowerCase().replace(/\s+/g, "-")}`,
                      );
                    }}
                  >
                    <div className="w-full flex justify-center">
                      <Image
                        radius="md"
                        h={200}
                        fit="contain"
                        src={item?.node?.image?.url}
                        alt={item?.node?.title}
                        className="object-contain transition-transform duration-300 hover:scale-105"
                      />
                    </div>

                    <p className="text-sm  font-medium text-gray-500 mt-3">
                      {item?.node?.title}
                    </p>
                    <NumberFormatter
                      thousandSeparator
                      prefix="$"
                      className="text-sm  text-gray-500 mt-2"
                      value={item?.node?.price?.amount}
                      suffix=" USD"
                    />
                  </div>
                );
              })}
            </div>
          </>
        ) : productData?.relatedProducts?.references?.edges ? (
          <>
            <h1 className="text-md px-6 pb-6 text-center">
              More Options For This Design
            </h1>
            <div className="grid grid-cols-2 gap-4">
              {productData?.relatedProducts?.references?.edges.map(
                (item: any, idx: number) => {
                  const slug = item?.node?.title
                    ?.toLowerCase()
                    .replace(/\s+/g, "-");

                  const isActive = slug === currentVariantSlug;
                  return (
                    <div
                      key={idx}
                      className={`bg-white transition-all duration-300 cursor-pointer p-4 flex flex-col justify-between shadow-md hover:shadow-xl rounded-xl
        ${isActive ? "border-2 border-[#9aa7bb]" : "border border-transparent"}
      `}
                      onClick={() => {
                        const baseUrl = `/jewelry-details/${category}/${
                          item?.node?.handle
                        }/${item?.node?.title.toLowerCase().replace(/\s+/g, "-")}`;

                        const finalUrl = isFreeGift
                          ? `${baseUrl}?freeGift=true`
                          : baseUrl;

                        router.push(finalUrl);
                      }}
                    >
                      <div className="w-full flex justify-center">
                        <Image
                          radius="md"
                          h={200}
                          fit="contain"
                          src={item?.node?.featuredImage?.url}
                          alt={item?.node?.title}
                          className="object-contain transition-transform duration-300 hover:scale-105"
                        />
                      </div>

                      <p className="text-sm  font-medium text-gray-500 mt-3">
                        {item?.node?.title}
                      </p>
                      <NumberFormatter
                        thousandSeparator
                        prefix="$"
                        className="text-sm  text-gray-500 mt-2"
                        value={item?.node?.price?.amount}
                        suffix=" USD"
                      />
                    </div>
                  );
                },
              )}
            </div>
          </>
        ) : null}
      </div>

      {(jf.isRingCategory ||
        jf.isEarringCategory ||
        jf.isNecklaces ||
        jf.isBracelets) && (
        <div className="mt-6">
          <JeweleryDetailsTable
            productData={productData}
            gemstone={selectedShape}
            jf={jf}
            earringMetafields={selectedEarring}
            value={value}
          />
        </div>
      )}

      <div className="mt-4">
        <QuestionAndDeliveryAccordian description={productData?.description} />
      </div>
    </>
  );
};
