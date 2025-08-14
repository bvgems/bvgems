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
    await stripe?.redirectToCheckout({ sessionId });
  };

  const getOrderPayload = (paymentMethod: any) => {
    const orderPayload = {
      order: {
        line_items: cart?.map((item: any) => {
          const productType = item?.product?.productType;
          const isStone = productType === "stone";
          const isRing = productType === "ringJewelry";
          const isNecklace = productType === "necklaceJewelry";
          const isBracelet = productType === "braceletJewelry";
          const isEarring = productType === "earringJewelry";

          const baseProperties = isStone
            ? [
                { name: "Size", value: item?.product?.size },
                { name: "Weight", value: item?.product?.ct_weight?.toString() },
                { name: "Quality", value: item?.product?.quality },
              ]
            : isRing
            ? [
                { name: "Gemstone", value: item?.product?.gemstone },
                { name: "Gold Color", value: item?.product?.goldColor },
                { name: "Stone Size", value: item?.product?.size },
                { name: "Shape", value: item?.product?.shape },
              ]
            : isNecklace
            ? [
                { name: "Gold Color", value: item?.product?.goldColor },
                { name: "Stone Size", value: item?.product?.size },
                { name: "Length", value: item?.product?.length },
              ]
            : isBracelet
            ? [
                { name: "Gold Color", value: item?.product?.goldColor },
                { name: "Size", value: item?.product?.size },
              ]
            : isEarring
            ? [{ name: "Gold Color", value: item?.product?.goldColor }]
            : [];

          const imageUrl =
            item?.jewelryProduct?.image_url ?? item?.product?.image_url ?? "";

          const isStored = !!item?.product?.variantId;

          return isStored
            ? {
                variant_id: item?.product?.variantId,
                quantity: item?.quantity,
                properties: baseProperties,
                requires_shipping: deliveryMethod === "delivery",
                fulfillment_service: "manual",
              }
            : {
                title:
                  item?.product?.collection_slug ||
                  item?.product?.title ||
                  "Custom Product",
                quantity: item?.quantity,
                price: (
                  item?.product?.price ?? item?.jewelryProduct?.price
                )?.toString(),
                requires_shipping: deliveryMethod === "delivery",
                taxable: true,
                fulfillment_service: "manual",
                properties: [
                  ...baseProperties,
                  { name: "_image_url", value: imageUrl },
                ],
              };
        }),
        tags:
          paymentMethod === "cod"
            ? "Pickup Payment"
            : paymentMethod === "memo"
            ? "Memo Purchase"
            : paymentMethod === "online"
            ? "Already Paid"
            : "",
        email: user ? user?.email : guestUser?.email,
        phone: user ? user?.phoneNumber : guestUser?.phoneNumber,
        customer: {
          email: user ? user?.email : guestUser?.email || "guest@example.com",
          first_name: user ? user?.firstName : guestUser?.firstName || "Guest",
          last_name: user ? user?.lastName : guestUser?.lastName || "User",
          phone: user ? user?.phoneNumber : guestUser?.phoneNumber || null,
          accepts_marketing: false,
          accepts_marketing_updated_at: new Date().toISOString(),
          marketing_opt_in_level: "single_opt_in",
          tags: "online-store",
        },
        financial_status: "pending",
        send_receipt: paymentMethod === "cod",
        fulfillment_status: "unfulfilled",
        currency: "USD",
        buyer_accepts_marketing: false,
        billing_address: {
          first_name:
            selectedShippingAddress?.fullName ??
            shippingAddress?.fullName ??
            "Guest",
          last_name:
            selectedShippingAddress?.fullName ??
            shippingAddress?.fullName ??
            "User",
          address1:
            selectedShippingAddress?.addressLine1 ??
            shippingAddress?.addressLine1 ??
            "",
          address2:
            selectedShippingAddress?.addressLine2 ??
            shippingAddress?.addressLine2 ??
            "",
          city: selectedShippingAddress?.city ?? shippingAddress?.city ?? "",
          province:
            selectedShippingAddress?.state ?? shippingAddress?.state ?? "",
          country:
            selectedShippingAddress?.country ?? shippingAddress?.country ?? "",
          zip:
            selectedShippingAddress?.zipCode ?? shippingAddress?.zipCode ?? "",
          phone:
            selectedShippingAddress?.phoneNumber ??
            shippingAddress?.phoneNumber ??
            guestUser?.phoneNumber ??
            "",
        },
        shipping_address: {
          first_name:
            selectedShippingAddress?.fullName ??
            shippingAddress?.fullName ??
            "Guest",
          last_name:
            selectedShippingAddress?.fullName ??
            shippingAddress?.fullName ??
            "User",
          address1:
            selectedShippingAddress?.addressLine1 ??
            shippingAddress?.addressLine1 ??
            "",
          address2:
            selectedShippingAddress?.addressLine2 ??
            shippingAddress?.addressLine2 ??
            "",
          city: selectedShippingAddress?.city ?? shippingAddress?.city ?? "",
          province:
            selectedShippingAddress?.state ?? shippingAddress?.state ?? "",
          country:
            selectedShippingAddress?.country ?? shippingAddress?.country ?? "",
          zip:
            selectedShippingAddress?.zipCode ?? shippingAddress?.zipCode ?? "",
          phone:
            selectedShippingAddress?.phoneNumber ??
            shippingAddress?.phoneNumber ??
            guestUser?.phoneNumber ??
            "",
        },
      },
    };
    return orderPayload;
  };

  const handleOrderPlacing = async () => {
    if (!deliveryMethod || !paymentMethod) return;
    const orderPayload = getOrderPayload(paymentMethod);

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
    (value: any) => value?.product?.productType === "stone"
  );
  const otherItems = cart.filter(
    (value: any) => value?.product?.productType !== "stone"
  );

  const renderRows = (items: any[]) =>
    items.map((value: any, index: number) => (
      <TableTr key={index}>
        <TableTd className="text-[1rem]">
          <div className="flex gap-4">
            <Image
              src={
                value?.jewelryProduct?.image_url ?? value?.product?.image_url
              }
              h={100}
              w={100}
              fit="fill"
            />
            <div className="flex flex-col gap-1">
              <div className="font-semibold">
                {value?.product?.collection_slug
                  ? value?.product?.collection_slug +
                    " " +
                    value?.product?.shape
                  : value?.product?.title}
              </div>

              {/* Stones */}
              {(value?.product?.productType === "stone" ||
                value.product?.productType === "freeSizeStone") && (
                <div className="flex flex-col">
                  <span>Size: {value?.product?.size}</span>
                  <span>Weight: {value?.product?.ct_weight}</span>
                  {value?.product?.productType === "stone" && (
                    <span>Quality: {value?.product?.quality}</span>
                  )}
                </div>
              )}

              {/* Rings / Necklaces */}
              {(value?.product?.productType === "ringJewelry" ||
                value?.product?.productType === "necklaceJewelry") && (
                <div className="flex flex-col">
                  <span>Gold Color: {value?.product?.goldColor}</span>
                  {value?.product?.size && (
                    <span>Size: {value?.product?.size}</span>
                  )}
                  {value?.product?.productType === "ringJewelry" ? (
                    <>
                      <span>Shape: {value?.product?.shape}</span>
                      <span>Selected Stones: {value?.product?.gemstone}</span>
                    </>
                  ) : value?.product?.length ? (
                    <span>Length: {value?.product?.length}</span>
                  ) : null}
                </div>
              )}

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
          </div>
        </TableTd>
      </TableTr>
    ));

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
