"use client";

import {
  ActionIcon,
  Badge,
  Button,
  Card,
  Divider,
  Grid,
  GridCol,
  Group,
  Image,
  Switch,
  Text,
  Textarea,
  Title,
  Tooltip,
} from "@mantine/core";
import {
  IconCheck,
  IconDiamond,
  IconFileCertificate,
  IconScale,
  IconShape,
  IconMaximize,
  IconShoppingCart,
  IconInfoCircle
} from "@tabler/icons-react";
import { generateCalibratedStoneUrl } from "@/utils/seoUrlHelpers";
import React, { useEffect, useMemo, useState } from "react";
import { GemstonesInputSection } from "./GemstonesInputSection";
import { useAuth } from "@/hooks/useAuth";
import { notifications } from "@mantine/notifications";
import { getCartStore } from "@/store/useCartStore";
import { useRouter } from "next/navigation";
import { EmeraldShade } from "./EmeraldShade";
import { BlueSapphireShade } from "./BlueSapphireShade";
import { shades } from "@/utils/constants";
import { getPerCaratPrice, getPerStonePrice, isLabGrown } from "@/utils/priceHelpers";
import { QuoteRequestModal } from "./QuoteRequestModal";

interface AddToCartModalProps {
  opened: boolean;
  onClose: () => void;
  price: number | string;
  image_url: string;
  name: string;
  size?: string;
  quality?: string;
  ct_weight?: string | number;
  color?: string;
  product: any;
  hideShadeOptions?: boolean;
}

export const AddToCartModal: React.FC<AddToCartModalProps> = ({
  opened,
  onClose,
  price,
  image_url,
  name,
  size,
  quality,
  ct_weight,
  color,
  product,
  hideShadeOptions = false,
}) => {
  const { user } = useAuth();
  const userKey = user?.id?.toString() || "guest";
  const router = useRouter();
  const cartStore = getCartStore(userKey);
  const addToCart = cartStore((state: any) => state.addToCart);

  const [additionalComments, setAdditionalComments] = useState("");
  const [emeraldShade, setEmeraldShade] = useState<string | null>("Zambian");
  const [sapphireShade, setSapphireShade] = useState<string | null>(
    "Vivid Royal Blue",
  );
  const [displayImage, setDisplayImage] = useState<any>(
    product?.collection_slug === "Sapphire" &&
      product?.color === "Blue" &&
      product?.quality !== "Lab Grown" &&
      product?.shape === "Round"
      ? shades[0]?.image
      : product?.extra_images?.length > 0
        ? product?.extra_images[0]
        : image_url,
  );
  const [purchaseByCarat, setPurchaseByCarat] = useState<boolean>(false);
  const [caratError, setCaratError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [caratWeight, setCaratWeight] = useState<number>(1);
  const [allowPurchaseByCarat, setAllowPurchaseByCarat] = useState(true);
  const [quoteProduct, setQuoteProduct] = useState<any | null>(null);


  useEffect(() => {
    if (product?.ct_weight) {
      setCaratWeight(1);
    }
  }, [product]);

  const perCarat = useMemo(() => getPerCaratPrice(product), [product]);
  const perStone = useMemo(() => getPerStonePrice(product), [product]);

  const handleAddToCart = () => {
    if (!product) return;

    addToCart({
      product: {
        id: product?.id,
        handle: product?.collection_slug?.toLowerCase(),
        productType: "stone",
        purchaseByCarat,
        productId: product.id,
        collection_slug: product.collection_slug,
        color: product.color,
        ct_weight: product.ct_weight,
        cut: product.cut,
        shade:
          product?.collection_slug === "Emerald" &&
          product?.quality === "Lab Grown"
            ? emeraldShade
            : product?.collection_slug === "Sapphire" &&
                product?.color === "Blue" &&
                product?.quality !== "Lab Grown"
              ? sapphireShade
              : "",
        image_url:
          product?.collection_slug === "Emerald" &&
          product?.quality === "Lab Grown"
            ? displayImage
            : product?.collection_slug === "Sapphire" &&
                product?.color === "Blue" &&
                product?.quality !== "Lab Grown" &&
                product?.shape === "Round"
              ? displayImage
              : product?.image_url,

        price: purchaseByCarat ? perCarat : perStone,
        quality: product.quality,
        shape: product.shape,
        size: product.size,
        type: product.type,
        additionalComments: additionalComments,
      },
      quantity: purchaseByCarat ? 1 : quantity,
      caratWeight: purchaseByCarat ? `${caratWeight}` : undefined,
    });

    notifications.show({
      icon: <IconCheck />,
      color: "teal",
      message: "Product added to the cart!",
      position: "top-right",
      autoClose: 3500,
    });
    onClose();
  };

  const handleRedirect = () => {
    const stoneHandle = product?.collection_slug?.toLowerCase() || "unknown-stone";
    router?.push(generateCalibratedStoneUrl(product, stoneHandle));
  };

  const isPurchaseByCarat = (product: any) => {
    const size = product?.size;
    if (product?.quality === "Lab Grown") {
      if (
        size === "1.00 mm" ||
        size === "1.25 mm" ||
        size === "1.50 mm" ||
        size === "1.75 mm"
      ) {
        setAllowPurchaseByCarat(false);
        return;
      }
    }
    setAllowPurchaseByCarat(true);
  };

  useEffect(() => {
    isPurchaseByCarat(product);
  }, [product]);

  return (
    <>
      <Card
      padding="lg"
      radius={0}
      className="
        relative overflow-hidden
      "
    >
      {/* Gradient header strip */}
      <div
        className="absolute inset-x-0 -top-0.5 h-[3px]"
        // style={{
        //   background:
        //     "linear-gradient(90deg, #0b182d, #0b182d 30%, #3b82f6 70%, #06b6d4)",
        // }}
      />

      <Grid gutter="xl" align="stretch">
        <GridCol span={{ base: 12, md: 5 }}>
          <Card
            radius={0}
            p="md"
            className="
              h-full
              shadow-inner
            "
          >
            <div className="relative rounded-xl overflow-hidden ring-1 ring-gray-200 dark:ring-zinc-800">
              <Image loading="lazy"
                src={displayImage}
                alt={name}
                radius="md"
                className="transition-transform duration-300 hover:scale-[1.02]"
              />
              {/* subtle glow */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-transparent via-transparent to-white/10" />
            </div>

            {/* Quick facts → now as details */}
            <div className="mt-4 space-y-1 text-sm text-black dark:text-gray-300">
              {product?.shape && (
                <p>
                  <strong>Shape:</strong> {product.shape}
                </p>
              )}
              {size && (
                <p>
                  <strong>Size:</strong> {size}
                </p>
              )}
              {quality && (
                <p>
                  <strong>Quality:</strong> {quality}
                </p>
              )}
              {product?.type && (
                <p>
                  <strong>Type:</strong>{" "}
                  <span
                    className={
                      isLabGrown(product) ? "text-indigo-600" : "text-green-600"
                    }
                  >
                    {product.type}
                  </span>
                </p>
              )}
            </div>
          </Card>
        </GridCol>

        {/* RIGHT — Details */}
        <GridCol span={{ base: 12, md: 7 }}>
          <div className="flex h-full flex-col">
            {/* Title + link */}
            <Group justify="space-between" align="start" mb="xs">
              <Title order={3} className="text-[20px] md:text-[22px]">
                <span
                  onClick={handleRedirect}
                  className="text-blue-800 hover:underline inline-flex items-center gap-1 cursor-pointer"
                  title="Open product details"
                >
                  {`${size || ""} ${name}, Quality ${quality || ""}, ${
                    ct_weight || "-"
                  } ct.`}
                </span>
              </Title>
            </Group>

            <Group gap="sm" wrap="wrap" mt="sm" mb="xs">
              <Badge
                size="lg"
                radius="md"
                variant="filled"
                color="dark"
                className="!bg-[#0b182d]"
              >
                {perStone === 0 ? (
                  <button
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setQuoteProduct(product); }}
                    className="text-white underline bg-transparent border-none p-0 cursor-pointer"
                  >
                    Request Pricing
                  </button>
                ) : `Per Stone: $${perStone.toFixed(2)}`}
              </Badge>
              {allowPurchaseByCarat && (
                <Badge size="lg" radius="md" variant="light" color="dark">
                  {perCarat === 0 ? (
                    <button
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); setQuoteProduct(product); }}
                      className="text-dark underline bg-transparent border-none p-0 cursor-pointer"
                    >
                      Request Pricing
                    </button>
                  ) : `Per Carat: $${perCarat.toFixed(2)}`}
                </Badge>
              )}
            </Group>

            <Divider my="md" />
            {!hideShadeOptions && product?.collection_slug === "Emerald" &&
            product?.quality === "Lab Grown" ? (
              <EmeraldShade
                product={product}
                emeraldShade={emeraldShade}
                setEmeraldShade={setEmeraldShade}
                setDisplayImage={setDisplayImage}
              />
            ) : null}

            {!hideShadeOptions && product?.collection_slug === "Sapphire" &&
            product?.color === "Blue" &&
            product?.quality !== "Lab Grown" ? (
              <BlueSapphireShade
                product={product}
                sapphireShade={sapphireShade}
                setSapphireShade={setSapphireShade}
                setDisplayImage={setDisplayImage}
              />
            ) : null}

            {/* Purchase mode + inputs */}
            <div className="mt-6">
              {user && allowPurchaseByCarat && (
                <Switch
                  checked={purchaseByCarat}
                  onChange={(event) =>
                    setPurchaseByCarat(event.currentTarget.checked)
                  }
                  label="Purchase by carat weight"
                  onLabel="Carat"
                  offLabel="Stone"
                  color="teal"
                  size="md"
                  className="mb-3"
                />
              )}

              <GemstonesInputSection
                purchaseByCarat={purchaseByCarat}
                caratWeight={caratWeight}
                product={product}
                quantity={quantity}
                setQuantity={setQuantity}
                caratError={caratError}
                setCaratError={setCaratError}
                setCaratWeight={setCaratWeight}
              />

              {caratError && (
                <Text c="red.6" size="sm" mt="xs">
                  {caratError}
                </Text>
              )}
            </div>

            {/* Notes */}
            <Textarea
              className="mt-4"
              autosize
              onChange={(event) =>
                setAdditionalComments(event.currentTarget.value)
              }
              minRows={2}
              maxRows={4}
              label="Special instructions for B. V."
              placeholder="e.g., Match a slightly bluer shade to my ring center stone."
            />

            {/* Footer CTA */}
            <Group mt="lg">
              <Button
                onClick={handleAddToCart}
                fullWidth
                size="md"
                radius="md"
                leftSection={<IconShoppingCart size={18} />}
                className="!bg-[#0b182d] hover:opacity-95 transition-opacity"
              >
                Add to cart
              </Button>
            </Group>
          </div>
        </GridCol>
      </Grid>
    </Card>

    <QuoteRequestModal 
      opened={!!quoteProduct} 
      onClose={() => setQuoteProduct(null)} 
      product={quoteProduct} 
    />
    </>
  );
};
