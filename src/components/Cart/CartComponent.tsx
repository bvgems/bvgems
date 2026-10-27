"use client";

import { useAuth } from "@/hooks/useAuth";
import {
  getCartStore,
  fetchAndSyncUserCart,
  generateCartItemId,
} from "@/store/useCartStore";
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
  const isSynced = cartStore((state: any) => state.isSynced);
  const removeProduct = cartStore((state: any) => state.removeFromCart);
  const updateQuantity = cartStore((state: any) => state.updateQuantity);
  const updateCaratWeight = cartStore((state: any) => state.updateCaratWeight);
  const setCartTotal = cartStore((state: any) => state.setCartTotal);
  const toggleCertification = cartStore(
    (state: any) => state.toggleCertification,
  );
  const shippingOption =
    cartStore((state: any) => state.shippingOption) || "2day";
  const router = useRouter();
  const [hasMounted, setHasMounted] = useState(false);
  const [subtotal, setSubtotal] = useState(0);
  const [grandTotal, setGrandTotal] = useState(0);
  const [quoteProduct, setQuoteProduct] = useState<any | null>(null);
  
  useEffect(() => {
    setHasMounted(true);
    if (user?.id) {
      fetchAndSyncUserCart(user.id);
    }
  }, [user?.id]);

  // Purge any legacy gift items from cart if present (only after initial DB sync for logged-in users)
  useEffect(() => {
    if (user?.id && !isSynced) return;
    const legacyGifts = cart.filter(
      (item: any) =>
        item?.product?.isGift ||
        String(item?.product?.productId || "").includes("FREE-GIFT"),
    );
    if (legacyGifts.length > 0) {
      legacyGifts.forEach((giftItem: any) => {
        const giftKey = giftItem?.cartItemId || generateCartItemId(giftItem);
        removeProduct(giftKey, giftItem?.product?.shade);
      });
    }
  }, [cart, removeProduct, user?.id, isSynced]);

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
      if (item.product.needCertification) {
        total += 75 * (item.product.purchaseByCarat ? 1 : quantity);
      }
    });

    // Base subtotal
    setSubtotal(total);

    // Free 2-day shipping on orders of $500 or above ($23 otherwise; overnight is $15 / $38)
    const shippingCost =
      total === 0
        ? 0
        : total >= 500
          ? shippingOption === "overnight"
            ? 15
            : 0
          : shippingOption === "overnight"
            ? 38
            : 23;
    setGrandTotal(total + shippingCost);
  }, [cart, hasMounted, shippingOption]);

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
        productTotal += 75 * (value.product.purchaseByCarat ? 1 : (value?.quantity || 1));
      }

      return sum + productTotal;
    }, 0);

    setCartTotal(total);
  }, [cart, setCartTotal]);

  const handleCheckout = () => {
    router.push("/checkout");
  };

  if (cart.length === 0) {
    return (
      <>
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
        <RecentlyViewedSection />
      </>
    );
  }

  return (
    <>
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
            <Stack gap="md" mt="md">
              {cart.map((value: any, index: number) => {
                const itemKey =
                  value?.cartItemId || generateCartItemId(value);

                return (
                  <CartLineItem
                    key={`${itemKey}-${index}`}
                    value={value}
                    onOpenProduct={() => redirectToProduct(value)}
                    onRemove={() =>
                      handleRemoveProduct(itemKey, value.product, value.product?.purchaseByCarat)
                    }
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
      </Container>
      <RecentlyViewedSection />
    </>
  );
}
