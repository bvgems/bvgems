"use client";
import { useMemo, useState } from "react";
import {
  Container,
  Grid,
  GridCol,
  Button,
  TableTr,
  TableTd,
  Image,
  Divider,
} from "@mantine/core";
import { createShopifyOrder, makeCheckout } from "@/apis/api";
import { loadStripe } from "@stripe/stripe-js";
import { getCartStore } from "@/store/useCartStore";
import { useAuth } from "@/hooks/useAuth";
import { CheckoutStepper } from "@/components/Checkout/CheckoutStepper";
import { BillingSummary } from "@/components/CommonComponents/BillingSummary";
import { useStpperStore } from "@/store/useStepperStore";
import { useGuestUserStore } from "@/store/useGuestUserStore";
import { useDisclosure } from "@mantine/hooks";
import OrderConfirmationModal from "@/components/CommonComponents/OrderConfirmationModal";
import { getOrderPayload } from "@/utils/commonFunctions";

export default function CheckoutSelectionPage() {
  const { user } = useAuth();
  const { guestUser } = useGuestUserStore();
  const [selectedShippingAddress, setSelectedShippingAddress] = useState<any>();

  const cartStore = useMemo(
    () => getCartStore(user?.id || "guest"),
    [user?.id]
  );
  const cart = cartStore((state: any) => state.cart);

  const { shippingAddress } = useStpperStore();

  const [deliveryMethod, setDeliveryMethod] = useState();
  const [paymentMethod, setPaymentMethod] = useState();
  const [opened, { open, close }] = useDisclosure(false);

  const stripePromise = loadStripe(
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
  );

  const handlePayment = async (orderId: any) => {
    const stripe = await stripePromise;
    const response = await makeCheckout({
      cartItems: cart,
      shopifyOrderId: orderId.toString(),
      email: user ? user?.email : guestUser?.email || "guest@example.com",
    });
    const sessionId = response.id;
    // await stripe?.redirectToCheckout({ sessionId });
  };

  const handleOrderPlacing = async () => {
    if (!deliveryMethod || !paymentMethod) return;
    const orderPayload = getOrderPayload(
      paymentMethod,
      deliveryMethod,
      shippingAddress,
      selectedShippingAddress,
      user,
      guestUser,
      cart
    );
    console.log("order", orderPayload);

    if (paymentMethod === "cod" || paymentMethod === "memo") {
      await createShopifyOrder(orderPayload);
      cartStore.getState().clearCart();
      open();
    } else {
      const orderResponse: any = await createShopifyOrder(orderPayload);
      await handlePayment(orderResponse?.order?.id);
      cartStore.getState().clearCart();
      open();
    }
  };

  const stoneItems = cart.filter(
    (value: any) =>
      value?.product?.productType === "stone" ||
      value?.product?.productType === "freeSizeStone"
  );
  const otherItems = cart.filter(
    (value: any) =>
      value?.product?.productType !== "stone" &&
      value?.product?.productType !== "freeSizeStone"
  );

  return (
    <div className="pb-20">
      <OrderConfirmationModal opened={opened} close={close} />
      <Container size={"xl"}>
        <Grid gutter={"xl"} className="mt-10">
          <GridCol
            className="border border-gray-200 rounded-2xl bg-[#f1f1f1]"
            span={{ base: 12, md: 8 }}
          >
            <CheckoutStepper
              selectedShippingAddress={selectedShippingAddress}
              setSelectedShippingAddress={setSelectedShippingAddress}
              paymentMethod={paymentMethod}
              setPaymentMethod={setPaymentMethod}
              deliveryMethod={deliveryMethod}
              setDeliveryMethod={setDeliveryMethod}
            />
            <div className="px-10">
              <BillingSummary />
              <Button
                disabled={
                  !deliveryMethod || !paymentMethod || cart?.length === 0
                }
                onClick={handleOrderPlacing}
                color="#0b182d"
                fullWidth
              >
                PLACE ORDER
              </Button>
            </div>
          </GridCol>

          <GridCol span={{ base: 12, md: 4 }}>
            <div className="px-10">
              <h2 className="text-lg font-semibold mb-4">Review Your Order</h2>
              <Divider />

              {stoneItems.length > 0 && (
                <>
                  <h3 className="mt-4 mb-3 font-semibold text-gray-700">
                    Gemstones
                  </h3>
                  <div className="flex flex-col gap-4">
                    {stoneItems.map((item: any, idx: number) => (
                      <div
                        key={idx}
                        className="flex gap-4 border border-gray-200 rounded-lg p-3 bg-white shadow-sm hover:shadow-md transition"
                      >
                        <Image
                          src={
                            item?.jewelryProduct?.image_url ??
                            item?.product?.image_url
                          }
                          alt={item?.product?.title}
                          h={80}
                          w={80}
                          fit="cover"
                          className="rounded-md"
                        />
                        <div className="flex flex-col justify-between text-sm">
                          <div>
                            <div className="font-semibold text-gray-900 mb-1">
                              {item?.product?.collection_slug
                                ? `${item?.product?.collection_slug} ${item?.product?.shape}`
                                : item?.product?.title}
                            </div>
                            <div className="text-gray-600">
                              Size:{" "}
                              <span className="font-medium">
                                {item?.product?.size}
                              </span>
                            </div>
                            <div className="text-gray-600">
                              Weight:{" "}
                              <span className="font-medium">
                                {item?.product?.ct_weight}
                              </span>
                            </div>
                            {item?.product?.quality && (
                              <div className="text-gray-600">
                                Quality:{" "}
                                <span className="font-medium">
                                  {item?.product?.quality}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {otherItems.length > 0 && (
                <>
                  <h3 className="mt-6 mb-3 font-semibold text-gray-700">
                    Other Items
                  </h3>
                  <div className="flex flex-col gap-4">
                    {otherItems.map((item: any, idx: number) => (
                      <div
                        key={idx}
                        className="flex gap-4 border border-gray-200 rounded-lg p-3 bg-white shadow-sm hover:shadow-md transition"
                      >
                        <Image
                          src={
                            item?.jewelryProduct?.image_url ??
                            item?.product?.image_url
                          }
                          alt={item?.product?.title}
                          h={80}
                          w={80}
                          fit="cover"
                          className="rounded-md"
                        />
                        <div className="flex flex-col justify-between text-sm">
                          <div>
                            <div className="font-semibold text-gray-900 mb-1">
                              {item?.product?.collection_slug
                                ? `${item?.product?.collection_slug} ${item?.product?.shape}`
                                : item?.product?.title}
                            </div>
                            {item?.product?.goldColor && (
                              <div className="text-gray-600">
                                Gold Color:{" "}
                                <span className="font-medium">
                                  {item?.product?.goldColor}
                                </span>
                              </div>
                            )}
                            {item?.product?.size && (
                              <div className="text-gray-600">
                                Size:{" "}
                                <span className="font-medium">
                                  {item?.product?.size}
                                </span>
                              </div>
                            )}
                            {item?.product?.shape && (
                              <div className="text-gray-600">
                                Shape:{" "}
                                <span className="font-medium">
                                  {item?.product?.shape}
                                </span>
                              </div>
                            )}
                            {item?.product?.gemstone && (
                              <div className="text-gray-600">
                                Selected Stones:{" "}
                                <span className="font-medium">
                                  {item?.product?.gemstone}
                                </span>
                              </div>
                            )}
                            {item?.product?.length && (
                              <div className="text-gray-600">
                                Length:{" "}
                                <span className="font-medium">
                                  {item?.product?.length}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </GridCol>
        </Grid>
      </Container>
    </div>
  );
}
