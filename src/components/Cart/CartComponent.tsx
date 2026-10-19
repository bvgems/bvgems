"use client";

import { useAuth } from "@/hooks/useAuth";
import { getCartStore, fetchAndSyncUserCart } from "@/store/useCartStore";
import {
  Button,
  Grid,
  GridCol,
  Alert,
  Container,
  Stack,
} from "@mantine/core";
import {
  IconCheck,
  IconClock,
  IconArrowNarrowRight,
  IconGift,
  IconTrash,
} from "@tabler/icons-react";
import { generateCalibratedStoneUrl, generateFreeSizeStoneUrl } from "@/utils/seoUrlHelpers";
import dynamic from "next/dynamic";
import { notifications } from "@mantine/notifications";
import { useMemo, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BillingSummary } from "../CommonComponents/BillingSummary";
import { QuoteRequestModal } from "../CommonComponents/QuoteRequestModal";
import { RecentlyViewedSection } from "../CommonComponents/RecentlyViewedSection";
import { CartLineItem } from "./CartLineItem";

const Player = dynamic(
  () => import("@lottiefiles/react-lottie-player").then((mod) => mod.Player),
  { ssr: false },
);

export function CartComponent() {
  const { user } = useAuth();

  const cartStore = useMemo(
    () => getCartStore(user?.id || "guest"),
    [user?.id],
  );
  const addToCart = cartStore((state: any) => state.addToCart);

  const cart = cartStore((state: any) => state.cart);
  const removeProduct = cartStore((state: any) => state.removeFromCart);
  const updateQuantity = cartStore((state: any) => state.updateQuantity);
  const updateCaratWeight = cartStore((state: any) => state.updateCaratWeight);
  const setCartTotal = cartStore((state: any) => state.setCartTotal);
  const toggleCertification = cartStore(
    (state: any) => state.toggleCertification,
  );
  const router = useRouter();
  const [hasMounted, setHasMounted] = useState(false);
  const [subtotal, setSubtotal] = useState(0);
  const [grandTotal, setGrandTotal] = useState(0);
  const [isFreeStuds, setIsFreeStuds] = useState(false);
  const [studsDetails, setStudsDetails] = useState<any>({});
  const [quoteProduct, setQuoteProduct] = useState<any | null>(null);
  
  useEffect(() => {
    setHasMounted(true);
    if (user?.id) {
      fetchAndSyncUserCart(user.id);
    }
  }, [user?.id]);

  useEffect(() => {
    checkFreeStuds();
  }, [cart, grandTotal]);

  const checkFreeStuds = () => {
    let eligible = false;

    cart?.forEach((item: any) => {
      const productType = item?.product?.productType;

      if (
        productType === "braceletJewelry" ||
        productType === "ringJewelry" ||
        productType === "earringJewelry" ||
        productType === "necklaceJewelry"
      ) {
        if (Number(item?.product?.price) * item?.quantity > 1000) {
          eligible = true;
        }
      }
    });

    setIsFreeStuds(eligible);

    const giftItem = cart.find((item: any) => item.product.isGift);

    if (!eligible && giftItem) {
      removeProduct(giftItem.product.productId, giftItem.product.shade);
    }
  };

  useEffect(() => {
    if (!hasMounted) return;

    let total = 0;

    cart.forEach((item: any) => {
      const price = parseFloat(item.product.price);
      const stoneWeight = parseFloat(item.product.ct_weight) || 0;
      const minWeight = stoneWeight > 1 ? stoneWeight : 1;
      const weight = item.product.productType === "freeSizeStone"
        ? (stoneWeight || 1)
        : Math.max(minWeight, parseFloat(item.caratWeight || `${minWeight}`));
      const quantity = item.quantity || 1;

      // 💎 Handle per-carat logic
      if (item.product.purchaseByCarat) {
        total += price * weight;
      } else {
        total += price * quantity;
      }

      // ✅ Add certification fee if selected
      if (item.product.needCertification) total += 75 * quantity;
    });

    // Base subtotal
    setSubtotal(total);

    const shippingCost = total >= 200 ? 0 : 15;
    setGrandTotal(total + shippingCost);
  }, [cart, hasMounted]);

  useEffect(() => {
    // fetchStudsDetails();
    if (isFreeStuds && !cart.some((item: any) => item.product.isGift)) {
      addProductInCart();
    }
  }, [isFreeStuds]);

  const addProductInCart = () => {
    const variables: any = {};
    variables.goldColor = "white";
    variables.totalCaratWeight = "0.65";
    variables.stone = null;
    variables.image =
      "/assets/shopify/1233_Y.png";
    addToCart({
      product: {
        productType: "earringJewelry",

        productId: `gid://shopify/Product/7963364196405-FREE-GIFT`,
        handle: "natural-round-blue-sapphire-studs-earrings",
        title: "Natural Round Blue Sapphire Studs Earrings",
        image_url:
          "/assets/shopify/1233_Y.png",
        price: 0,
        gemstone: variables?.stone,
        size: variables?.size || "",
        goldColor: variables?.goldColor || "",
        length: variables?.length || "",
        firstStone: "",
        secondStone: "",
        totalCaratWeight: variables?.totalCaratWeight,
        isGift: Boolean(true),
      },
      quantity: 1,
    });
  };

  const handleRemoveProduct = (id: any, product: any, purchaseByCarat?: boolean) => {
    removeProduct(id, product?.shade, purchaseByCarat);
    notifications.show({
      icon: <IconCheck />,
      color: "teal",
      message: "Product has been removed from the cart!",
      position: "top-right",
      autoClose: 3000,
    });
  };

  const getTotalCaratPrice = (value: any) => {
    if (value?.product?.productType === "stone") {
      const stoneWeight = Number(value?.product?.ct_weight) || 0;
      const minWeight = stoneWeight > 1 ? stoneWeight : 1;
      const weight = Math.max(minWeight, Number(value?.caratWeight || minWeight));
      return (
        Number(value?.product?.price) * weight
      );
    } else {
      return (
        Number(value?.product?.price) *
        Number(value?.product?.ct_weight || 1)
      );
    }
  };

  const getCategory = (values: any) => {
    switch (values?.productType) {
      case "ringJewelry":
        return "rings";
      case "necklaceJewelry":
        return "necklaces";
      case "braceletJewelry":
        return "bracelets";
      case "earringJewelry":
        return "earrings";
      case "bead":
        return "beads";
      default:
        return "products";
    }
  };

  const redirectToProduct = (value: any) => {
    if (value?.product?.productType === "stone") {
      const stoneHandle = value?.product?.handle || "unknown-stone";
      router.push(generateCalibratedStoneUrl(value?.product, stoneHandle));
    } else if (value?.product?.productType === "freeSizeStone") {
      const stoneHandle =
        value?.product?.gemstone_type ||
        value?.product?.handle ||
        value?.product?.collection_slug ||
        "gemstone";
      router.push(generateFreeSizeStoneUrl(value?.product, stoneHandle));
    } else if (value?.product?.productType === "layouts") {
      router.push(`/trade/layouts/${value?.product?.handle}`);
    } else {
      const category = getCategory(value?.product);
      // Ensure we redirect to the correct jewelry path (now `/jewelry/...` instead of `/jewelry-details/...` if it had stone in old logic, but here it's just /jewelry/category/handle)
      router.push(`/jewelry/${category}/${value?.product?.handle}`);
    }
  };

  useEffect(() => {
    const total = cart.reduce((sum: number, value: any) => {
      let productTotal = 0;

      if (
        value.product.productType === "stone" ||
        value.product.productType === "freeSizeStone"
      ) {
        productTotal = value.product.purchaseByCarat
          ? getTotalCaratPrice(value)
          : value.product.price * value.quantity;
      } else {
        productTotal = Number(value.product.price) * value.quantity;
      }

      if (value.product.needCertification) {
        productTotal += 75 * value?.quantity;
      }

      return sum + productTotal;
    }, 0);

    setCartTotal(total);
  }, [cart, setCartTotal]);

  const handleCheckout = () => {
    router.push("/checkout");
  };

  const handleCustomization = (value: any) => {
    cartStore.getState().setFreeGiftSession(true);
    router.push(
      `/jewelry/earrings/${value?.product?.handle}/${value?.product?.handle}?freeGift=true&fromCart=true`,
    );
  };

  if (cart.length === 0) {
    return (
      <div className="flex flex-col gap-3 items-center justify-center py-24">
        <Player
          autoplay
          loop
          src="/assets/empty-cart.json"
          style={{ height: "300px", width: "300px" }}
        />
        <p className="text-xl font-semibold mt-4 text-gray-700">
          Your cart is empty
        </p>
        <Button
          onClick={() => router.push("/calibrated-stones")}
          color="gray"
          rightSection={<IconArrowNarrowRight />}
        >
          Shop Now
        </Button>
      </div>
    );
  }

  return (
    <Container size="xl" className="py-10">
      <Grid gutter="xl">
        <GridCol span={{ base: 12, md: 8 }}>
          <div className="flex items-center justify-between">
            <div />
            <Button
              color="#0b182d"
              size="compact-sm"
              leftSection={<IconTrash size={14} />}
              onClick={() => {
                cartStore.getState().clearCart();
              }}
            >
              CLEAR CART
            </Button>
          </div>
          {cart.some((item: any) => item.product.isGift) && (
            <Alert mb="md" color="green" icon={<IconGift />} radius="md">
              🎉 Congratulations! You've unlocked a complimentary gift with your
              purchase.
            </Alert>
          )}
          <Stack gap="md">
            {cart.map((value: any, index: number) => {
              const itemKey =
                value?.cartItemId ||
                `${value?.product?.productId}-${value?.product?.purchaseByCarat ? "carat" : "piece"}-${value?.product?.shade || ""}-${index}`;

              return (
                <CartLineItem
                  key={itemKey}
                  value={value}
                  onOpenProduct={() => redirectToProduct(value)}
                  onRemove={() =>
                    handleRemoveProduct(itemKey, value.product, value.product?.purchaseByCarat)
                  }
                  onCustomizeGift={() => handleCustomization(value)}
                  onRequestPricing={() => setQuoteProduct(value?.product)}
                  onQuantityChange={(newQuantity) => {
                    updateQuantity(
                      itemKey,
                      newQuantity,
                      value.product?.shade,
                      value.product?.purchaseByCarat
                    );
                  }}
                  onCaratWeightChange={(newCaratWeight) => {
                    const stoneWeight = Number(value.product?.ct_weight) || 0;
                    const minWeight = stoneWeight > 1 ? Number(stoneWeight.toFixed(2)) : 1;
                    const safeWeight = Math.max(minWeight, Number(newCaratWeight) || minWeight);
                    updateCaratWeight(
                      itemKey,
                      safeWeight,
                      value.product?.shade
                    );
                  }}
                  onToggleCertification={(checked) => {
                    toggleCertification(
                      itemKey,
                      checked,
                      value.product?.shade,
                      value.product?.purchaseByCarat
                    );
                  }}
                />
              );
            })}
          </Stack>
        </GridCol>

        {/* Right Side Summary */}
        <GridCol span={{ base: 12, md: 4 }}>
          <BillingSummary />
          <Button
            disabled={!cart?.length}
            onClick={handleCheckout}
            rightSection={<IconArrowNarrowRight />}
            mt="md"
            size="lg"
            color="#0b182d"
            fullWidth
            radius="md"
          >
            CHECKOUT
          </Button>
        </GridCol>
      </Grid>
      <QuoteRequestModal 
        opened={!!quoteProduct} 
        onClose={() => setQuoteProduct(null)} 
        product={quoteProduct} 
      />
      <RecentlyViewedSection title="Recently Viewed by You" />
    </Container>
  );
}
