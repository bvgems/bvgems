"use client";

import { useAuth } from "@/hooks/useAuth";
import { getCartStore } from "@/store/useCartStore";
import {
  Image,
  Button,
  Grid,
  GridCol,
  NumberInput,
  Alert,
  Container,
  Paper,
  Group,
  Text,
  Divider,
  Stack,
  Badge,
  Checkbox,
  NumberFormatter,
} from "@mantine/core";
import {
  IconArrowNarrowRight,
  IconCheck,
  IconInfoCircle,
  IconTrash,
} from "@tabler/icons-react";
import dynamic from "next/dynamic";
import { notifications } from "@mantine/notifications";
import { useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { BillingSummary } from "../CommonComponents/BillingSummary";

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

  const cart = cartStore((state: any) => state.cart);
  console.log("carttyy", cart);
  const removeProduct = cartStore((state: any) => state.removeFromCart);
  const updateQuantity = cartStore((state: any) => state.updateQuantity);
  const setCartTotal = cartStore((state: any) => state.setCartTotal);
  const toggleCertification = cartStore(
    (state: any) => state.toggleCertification,
  );
  const router = useRouter();

  const handleRemoveProduct = (id: any, product: any) => {
    removeProduct(product?.productId);
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
      return Number(value?.product?.price) * Number(value?.caratWeight);
    } else {
      return Number(value?.product?.price) * Number(value?.product?.ct_weight);
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
    console.log("valueeee", value);
    if (value?.product?.productType === "stone") {
      router.push(
        `/product-details?id=${value?.product?.id}&name=${value?.product?.handle}`,
      );
    } else if (value?.product?.productType === "freeSizeStone") {
      router.push(`/free-size-gemstone-details/${value?.product?.id}`);
    } else if (value?.product?.productType === "layouts") {
      router.push(`colorstone-layouts/${value?.product?.handle}`);
    } else {
      const category = getCategory(value?.product);
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
          onClick={() => router.push("/loose-gemstones")}
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
            <Text size="xl" fw={600} mb="md">
              Shopping Cart
            </Text>
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
          <Stack gap="md">
            {cart.map((value: any, index: number) => {
              let total =
                value.product.productType === "stone" ||
                value.product.productType === "freeSizeStone"
                  ? value.product.purchaseByCarat
                    ? getTotalCaratPrice(value)
                    : value.product.price * value.quantity
                  : value.product.price * value.quantity;

              if (value.product.needCertification) {
                total += 75 * value.quantity;
              }

              return (
                <Paper
                  key={index}
                  shadow="sm"
                  radius="md"
                  p="md"
                  withBorder
                  style={{
                    display: "flex",
                    gap: "1rem",
                    alignItems: "flex-start",
                  }}
                >
                  <Image
                    src={
                      value?.jewelryProduct?.image_url ??
                      value?.product?.image_url
                    }
                    h={120}
                    w={120}
                    radius="md"
                    fit="cover"
                    onClick={() => redirectToProduct(value)}
                    style={{ cursor: "pointer" }}
                  />

                  <div style={{ flex: 1 }}>
                    <Group justify="space-between" align="flex-start">
                      <div
                        style={{ cursor: "pointer" }}
                        onClick={() => redirectToProduct(value)}
                      >
                        <Text fw={600} size="lg">
                          {value?.product?.collection_slug
                            ? value?.product?.collection_slug +
                              " " +
                              value?.product?.shape
                            : value?.product?.title}
                        </Text>
                        <Text size="sm" c="dimmed" mt={2}>
                          {value?.product?.productType === "stone" && (
                            <>
                              Size: {value?.product?.size} | Weight:{" "}
                              {value?.product?.ct_weight} | Quality:{" "}
                              {value?.product?.quality} | Color:{" "}
                              {value?.product?.color}
                              {value?.product?.collection_slug === "Emerald" &&
                                value?.product?.shade && (
                                  <> | Shade: {value?.product?.shade}</>
                                )}
                            </>
                          )}
                          {value?.product?.productType === "bead" && (
                            <>Stone Size: {value?.product?.size}</>
                          )}
                          {value?.product?.productType === "layouts" && (
                            <>
                              Stone Size: {value?.product?.size} | Weight:{" "}
                              {value?.product?.ct_weight} | Stone Count:{" "}
                              {value?.product?.stoneCount}
                            </>
                          )}
                          {value?.product?.productType === "freeSizeStone" && (
                            <>
                              Size: {value?.product?.size} | Color:{" "}
                              {value?.product?.color}
                            </>
                          )}

                          {value?.product?.productType === "ringJewelry" && (
                            <>
                              Gold Color: {value?.product?.goldColor} | Size:{" "}
                              {value?.product?.size}
                            </>
                          )}
                          {value?.product?.productType === "necklaceJewelry" &&
                            value?.product?.length && (
                              <>
                                Gold Color: {value?.product?.goldColor} |
                                Length: {value?.product?.length}
                                {value?.product?.size &&
                                  ` | Gemstone Size: ${value?.product?.size}`}
                              </>
                            )}
                          {value?.product?.productType === "braceletJewelry" &&
                            value?.product?.length && (
                              <>
                                Gold Color: {value?.product?.goldColor} |
                                Length: {value?.product?.length}
                              </>
                            )}
                          {value?.product?.productType === "earringJewelry" && (
                            <>
                              {value?.product?.goldColor && (
                                <>Gold Color: {value.product.goldColor} </>
                              )}
                              {value?.product?.totalCaratWeight && (
                                <>
                                  | Total Carat Weight:{" "}
                                  {value.product.totalCaratWeight} ct.{" "}
                                </>
                              )}
                              {value?.product?.gemstone && (
                                <>| Stone: {value.product.gemstone}</>
                              )}
                            </>
                          )}
                        </Text>
                      </div>
                      <Button
                        color="red"
                        variant="subtle"
                        onClick={() =>
                          handleRemoveProduct(value.cartItemId, value.product)
                        }
                        leftSection={<IconTrash size={16} />}
                      >
                        Remove
                      </Button>
                    </Group>
                    <Group mt="sm" align="center" justify="space-between">
                      <Text fw={500} size="lg">
                        <NumberFormatter
                          thousandSeparator
                          prefix="$"
                          value={
                            value?.jewelryProduct?.price ??
                            value?.product?.price
                          }
                        />{" "}
                      </Text>
                      {value?.product?.purchaseByCarat ? (
                        <Badge color="gray" variant="light">
                          Carat Weight:{" "}
                          {value?.product?.productType === "stone"
                            ? value?.caratWeight
                            : value?.product?.ct_weight}
                        </Badge>
                      ) : (
                        <NumberInput
                          min={1}
                          value={value.quantity}
                          onChange={(newQuantity) => {
                            const safeQuantity =
                              typeof newQuantity === "number" ? newQuantity : 1;
                            updateQuantity(
                              value.product.productId,
                              safeQuantity,
                            );
                          }}
                          allowNegative={false}
                          radius="md"
                          style={{ maxWidth: 90 }}
                        />
                      )}
                      <Text fw={600} size="lg">
                        <NumberFormatter
                          thousandSeparator
                          prefix="$"
                          value={total.toFixed(2)}
                        />{" "}
                      </Text>
                    </Group>

                    <Checkbox
                      color="#0b182d"
                      size="sm"
                      mt="sm"
                      label={
                        <span className="text-gray-500">
                          Add certification for this item (+$75)
                        </span>
                      }
                      checked={!!value.product.needCertification}
                      onChange={(e) =>
                        toggleCertification(
                          value.product.productId,
                          e.currentTarget.checked,
                        )
                      }
                    />
                  </div>
                </Paper>
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
          <Alert
            mt="lg"
            color="#0b182d"
            title="Hassle-Free Returns"
            icon={<IconInfoCircle />}
            radius="md"
          >
            We offer a 15-day return policy on all gemstone purchases. If you're
            not 100% satisfied, return it for a full refund or exchange. No
            questions asked.
          </Alert>
        </GridCol>
      </Grid>
    </Container>
  );
}
