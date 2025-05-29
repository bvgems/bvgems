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
  Divider,
  Checkbox,
  Alert,
  Tooltip,
} from "@mantine/core";
import {
  IconArrowNarrowRight,
  IconCheck,
  IconInfoCircle,
  IconMinus,
  IconPlus,
} from "@tabler/icons-react";
import dynamic from "next/dynamic";
import { notifications } from "@mantine/notifications";
import { useMemo } from "react";
import { UnAuthorized } from "../CommonComponents/UnAuthorized";

const Player = dynamic(
  () => import("@lottiefiles/react-lottie-player").then((mod) => mod.Player),
  {
    ssr: false,
  }
);

export function CartComponent() {
  const { user } = useAuth();
  const cartStore = useMemo(
    () => getCartStore(user?.id || "guest"),
    [user?.id]
  );

  const cart = cartStore((state: any) => state.cart);
  const removeFromCart = cartStore((state: any) => state.removeFromCart);
  const updateQuantity = cartStore((state: any) => state.updateQuantity);
  const getTotalPrice = cartStore((state: any) => state.getTotalPrice);

  if (!user) {
    return <UnAuthorized />;
  }

  if (cart.length === 0) {
    return (
      <div className="flex flex-col gap-3 items-center justify-center mt-24">
        <Player
          autoplay
          loop
          src="/assets/empty-cart.json"
          style={{ height: "300px", width: "300px" }}
        />
        <p className="text-xl font-semibold mt-4 text-violet-800">
          Your cart is empty
        </p>
        <Button color="violet" rightSection={<IconArrowNarrowRight />}>
          Shop Now
        </Button>
      </div>
    );
  }

  const rows = cart.map((value: any, index: number) => (
    <TableTr key={index}>
      <TableTd className="text-[1rem]">
        <div className="flex flex-col gap-2 justify-start">
          <Image src={value?.product?.image_url} h={100} w={100} />
          <div className="font-semibold">
            {value?.product?.collection_slug + " " + value?.product?.shape}
          </div>
          <div className="flex flex-col">
            <span>Size: {value?.product?.size}</span>
            <span>Weight: {value?.product?.ct_weight}</span>
            <span>Quality: {value?.product?.quality}</span>
          </div>
        </div>
      </TableTd>
      <TableTd className="font-semibold">$ {value?.product?.price}</TableTd>
      <TableTd>
        <div className="flex flex-row">
          <Button
            onClick={() =>
              updateQuantity(value.product.productId, value.quantity + 1)
            }
            variant="default"
          >
            <IconPlus />
          </Button>
          <NumberInput placeholder="Quantity" min={1} value={value?.quantity} />
          <Button
            onClick={() =>
              updateQuantity(value.product.productId, value.quantity - 1)
            }
            variant="default"
            disabled={value.quantity <= 1}
          >
            <IconMinus />
          </Button>
        </div>
      </TableTd>
      <TableTd className="font-semibold">
        ${(value.product.price * value.quantity).toFixed(2)}
      </TableTd>
      <TableTd className="font-semibold">
        <Button
          onClick={() => {
            removeFromCart(value.product.productId);
            notifications.show({
              icon: <IconCheck />,
              color: "teal",
              message: "Product Is Removed From The Cart!",
              position: "top-right",
              autoClose: 4000,
            });
          }}
          color="red"
          variant="outline"
        >
          Remove
        </Button>
      </TableTd>
    </TableTr>
  ));

  return (
    <div className="">
      <Grid>
        <GridCol span={{ base: 12, md: 8 }}>
          <Table striped horizontalSpacing={"xl"} verticalSpacing={"sm"}>
            <TableThead className="uppercase text-violet-800">
              <TableTr>
                <TableTh>Product</TableTh>
                <TableTh>Price</TableTh>
                <TableTh>Quantity</TableTh>
                <TableTh>Total</TableTh>
                <TableTh>Action</TableTh>
              </TableTr>
            </TableThead>
            <Table.Tbody>{rows}</Table.Tbody>
          </Table>
        </GridCol>
        <GridCol span={{ base: 12, md: 4 }}>
          <div className="p-6">
            <span className="text-xl font-semibold text-violet-800">
              Order Summary
            </span>
            <div className="mt-5">
              <div className="flex flex-row justify-between">
                <span>Subtotal:</span>
                <span className="font-semibold">
                  ${getTotalPrice().toFixed(2)}
                </span>
              </div>
              <Divider my="sm" />
              <div className="flex flex-row justify-between">
                <span>Sales Tax:</span>
                <span className="font-semibold">+ $0</span>
              </div>
              <Divider my="sm" />
              <div className="flex flex-row justify-between">
                <span>Discount:</span>
                <span className="font-semibold">- $0</span>
              </div>
              <Divider my="sm" />
              <div className="flex flex-row justify-between text-lg text-violet-800 font-semibold">
                <span className="">Grand Total:</span>
                <span className="font-semibold">
                  {" "}
                  ${getTotalPrice().toFixed(2)}
                </span>
              </div>
            </div>
            <div className="mt-9 flex flex-col gap-4">
              <div className="flex flex-row items-center gap-2">
                <Checkbox color="violet" label="NYC Store Pickup" />{" "}
                <Tooltip
                  multiline
                  w={220}
                  withArrow
                  transitionProps={{ duration: 200 }}
                  label="Pick up from our Address: 66 W 47th St, Booth #9 and #10 , New York, NY 10036v"
                >
                  <span className="cursor-pointer">
                    <IconInfoCircle size={19} />
                  </span>
                </Tooltip>
              </div>
              <Alert
                color="violet"
                title="Hassle-Free Returns"
                icon={<IconInfoCircle />}
              >
                We offer a 15-day return policy on all gemstone purchases. If
                you're not 100% satisfied, return it for a full refund or
                exchange. No questions asked.
              </Alert>
            </div>

            <div className="mt-5">
              <Button
                rightSection={<IconArrowNarrowRight />}
                className="mt-3"
                color="violet"
                fullWidth
              >
                Checkout
              </Button>
            </div>
          </div>
        </GridCol>
      </Grid>
    </div>
  );
}
