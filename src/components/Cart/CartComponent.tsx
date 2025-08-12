"use client";

import { useAuth } from "@/hooks/useAuth";
import { getCartStore } from "@/store/useCartStore";
import {
  Image,
  Button,
  Grid,
  GridCol,
  Table,
  TableThead,
  TableTr,
  TableTh,
  TableTd,
  NumberInput,
  Alert,
  Container,
  Divider,
  Tooltip,
} from "@mantine/core";
import {
  IconArrowNarrowRight,
  IconCheck,
  IconInfoCircle,
} from "@tabler/icons-react";
import dynamic from "next/dynamic";
import { notifications } from "@mantine/notifications";
import { useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { BillingSummary } from "../CommonComponents/BillingSummary";

const Player = dynamic(
  () => import("@lottiefiles/react-lottie-player").then((mod) => mod.Player),
  { ssr: false }
);

export function CartComponent() {
  const { user } = useAuth();
  const cartStore = useMemo(
    () => getCartStore(user?.id || "guest"),
    [user?.id]
  );

  const cart = cartStore((state: any) => state.cart);
  const removeProduct = cartStore((state: any) => state.removeFromCart);
  const updateQuantity = cartStore((state: any) => state.updateQuantity);
  const setCartTotal = cartStore((state: any) => state.setCartTotal); // new setter
  const router = useRouter();

  const handleRemoveProduct = (id: any, product: any) => {
    removeProduct(product?.productId);
    notifications.show({
      icon: <IconCheck />,
      color: "teal",
      message: "Product has been removed from the cart!",
      position: "top-right",
      autoClose: 4000,
    });
  };

  const getTotalCaratPrice = (value: any) => {
    return value?.product?.price * Number(value?.caratWeight);
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
      case "Product":
      default:
        return "products";
    }
  };

  const redirectToProduct = (value: any) => {
    console.log("value", value);
    if (value?.product?.productType === "stone") {
      router.push(
        `/product-details?id=${value?.product?.id}&name=${value?.product?.handle}`
      );
    } else {
      const category = getCategory(value?.product);
      router?.push(`/jewelry/${category}/${value?.product?.handle}`);
    }
  };
  useEffect(() => {
    const total = cart.reduce((sum: number, value: any) => {
      if (value.product.productType === "stone") {
        return (
          sum +
          (value.product.purchaseByCarat
            ? getTotalCaratPrice(value)
            : value.product.price * value.quantity)
        );
      } else {
        return sum + value.product.price * value.quantity;
      }
    }, 0);
    setCartTotal(total);
  }, [cart, setCartTotal]);

  const handleCheckout = async () => {
    router?.push("/checkout");
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
          onClick={() => router?.push("/loose-gemstones")}
          color="gray"
          rightSection={<IconArrowNarrowRight />}
        >
          Shop Now
        </Button>
      </div>
    );
  }

  const renderRows = (items: any[]) =>
    items.map((value: any, index: number) => {
      const total =
        value.product.productType === "stone"
          ? value.product.purchaseByCarat
            ? getTotalCaratPrice(value)
            : value.product.price * value.quantity
          : value.product.price * value.quantity;

      return (
        <TableTr
          onClick={(event) => {
            event.stopPropagation();
            redirectToProduct(value);
          }}
          className="cursor-pointer"
          key={index}
        >
          {/* Product Column */}
          <TableTd className="text-[1rem]">
            <div className="flex flex-col gap-2 justify-start">
              <Image
                src={
                  value?.jewelryProduct?.image_url ?? value?.product?.image_url
                }
                h={100}
                w={100}
                fit="fill"
              />
              <div className="font-semibold">
                {value?.product?.collection_slug
                  ? value?.product?.collection_slug +
                    " " +
                    value?.product?.shape
                  : value?.product?.title}
              </div>

              {/* Stones */}
              {value?.product?.productType === "stone" ? (
                <div className="flex flex-col">
                  <span>Size: {value?.product?.size}</span>
                  <span>Weight: {value?.product?.ct_weight}</span>
                  <span>Quality: {value?.product?.quality}</span>
                </div>
              ) : null}

              {/* Rings / Necklaces */}
              {value?.product?.productType === "ringJewelry" ||
              value?.product?.productType === "necklaceJewelry" ? (
                <div className="flex flex-col">
                  <span>Gold Color: {value?.product?.goldColor}</span>
                  {value?.product?.size ? (
                    <span>Size: {value?.product?.size}</span>
                  ) : null}
                  {value?.product?.productType === "ringJewelry" ? (
                    <>
                      <span>Shape: {value?.product?.shape}</span>
                      <span>Selected Stones: {value?.product?.gemstone}</span>
                    </>
                  ) : value?.product?.length ? (
                    <span>Length: {value?.product?.length}</span>
                  ) : null}
                </div>
              ) : null}

              {/* Earrings */}
              {value?.product?.productType === "earringJewelry" &&
                value?.product?.goldColor && (
                  <span>Gold Color: {value?.product?.goldColor}</span>
                )}

              {/* Bracelets */}
              {value?.product?.productType === "braceletJewelry" && (
                <span>Gold Color: {value?.product?.goldColor}</span>
              )}

              {/* Beads */}
              {value?.product?.productType === "bead" && (
                <span>Stone size: {value?.product?.size}</span>
              )}
            </div>
          </TableTd>

          {/* Price */}
          <TableTd className="font-semibold">
            ${value?.jewelryProduct?.price ?? value?.product?.price}
          </TableTd>

          {/* Quantity / Carat Weight */}
          <TableTd>
            {value?.product?.purchaseByCarat ? (
              <span>Carat Weight: {value?.caratWeight}</span>
            ) : (
              <NumberInput
                className="flex-1"
                min={1}
                value={value.quantity}
                onChange={(newQuantity) => {
                  const safeQuantity =
                    typeof newQuantity === "number" ? newQuantity : 1;
                  updateQuantity(value.product.productId, safeQuantity);
                }}
                allowNegative={false}
                radius={0}
              />
            )}
          </TableTd>

          {/* Total */}
          <TableTd className="font-semibold">${total.toFixed(2)}</TableTd>

          {/* Remove Button */}
          <TableTd>
            <Button
              onClick={(e) => {
                e.stopPropagation();
                handleRemoveProduct(value.cartItemId, value.product);
              }}
              color="red"
              variant="outline"
            >
              Remove
            </Button>
          </TableTd>
        </TableTr>
      );
    });

  return (
    <Container size={"xl"} className="py-10">
      <Grid gutter={"xl"}>
        <GridCol
          span={{ base: 12, md: 9 }}
          className="!px-4 flex flex-col gap-10"
        >
          <h2 className="text-lg font-semibold text-[#0b182d]">Cart Items</h2>
          <Table striped horizontalSpacing={"xl"} verticalSpacing={"sm"}>
            <TableThead className="uppercase text-[#0b182d]">
              <TableTr>
                <TableTh>Product</TableTh>
                <TableTh>Price</TableTh>
                <TableTh>Quantity / Carat Weight</TableTh>
                <TableTh>Total</TableTh>
                <TableTh>Action</TableTh>
              </TableTr>
            </TableThead>
            <Table.Tbody>{renderRows(cart)}</Table.Tbody>
          </Table>
        </GridCol>

        {/* Right Side Summary */}
        <GridCol span={{ base: 12, md: 3 }}>
          <BillingSummary />
          <div className="mt-5">
            <Button
              disabled={!cart?.length}
              onClick={handleCheckout}
              rightSection={<IconArrowNarrowRight />}
              className="mt-3"
              color="#0b182d"
              fullWidth
            >
              CHECKOUT
            </Button>
          </div>
          <div className="mt-9">
            <Alert
              color="#0b182d"
              title="Hassle-Free Returns"
              icon={<IconInfoCircle />}
            >
              We offer a 15-day return policy on all gemstone purchases. If
              you're not 100% satisfied, return it for a full refund or
              exchange. No questions asked.
            </Alert>
          </div>
        </GridCol>
      </Grid>
    </Container>
  );
}
