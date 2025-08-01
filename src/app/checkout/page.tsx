"use client";
import { useMemo, useState } from "react";
import {
  Container,
  Grid,
  GridCol,
  Button,
  Table,
  TableTr,
  TableThead,
  TableTh,
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
import { getJewelryCartStore } from "@/store/useJewelryCartStore";

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
          const isJewelry = isRing || isNecklace || isBracelet || isEarring;
  
          const title = item?.product?.collection_slug;
  
          const baseProperties = isStone
            ? [
                { name: "Size", value: item?.product?.size },
                { name: "Weight", value: item?.product?.ct_weight?.toString() },
                { name: "Quality", value: item?.product?.quality }
              ]
            : isRing
            ? [
                { name: "Gemstone", value: item?.product?.gemstone },
                { name: "Gold Color", value: item?.product?.goldColor },
                { name: "Stone Size", value: item?.product?.size },
                { name: "Shape", value: item?.product?.shape }
              ]
            : isNecklace
            ? [
                { name: "Gold Color", value: item?.product?.goldColor },
                { name: "Stone Size", value: item?.product?.size },
                { name: "Length", value: item?.product?.length }
              ]
            : isBracelet
            ? [
                { name: "Gold Color", value: item?.product?.goldColor },
                { name: "Size", value: item?.product?.size }
              ]
            : isEarring
            ? [
                { name: "Gold Color", value: item?.product?.goldColor }
              ]
            : [];
  
          const imageUrl =
            item?.jewelryProduct?.image_url ?? item?.product?.image_url ?? "";
  
          // Conditional payload based on presence of variantId
          const isStored = !!item?.product?.variantId;
  
          return isStored
            ? {
                variant_id: item?.product?.variantId,
                quantity: item?.quantity,
                properties: baseProperties,
                requires_shipping: deliveryMethod === "delivery",
                fulfillment_service: "manual"
              }
            : {
                title: title || "Custom Product",
                quantity: item?.quantity,
                price: (item?.product?.price ?? item?.jewelryProduct?.price)?.toString(),
                requires_shipping: deliveryMethod === "delivery",
                taxable: true,
                fulfillment_service: "manual",
                properties: [
                  ...baseProperties,
                  { name: "_image_url", value: imageUrl }
                ]
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
          tags: "online-store"
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
            ""
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
            ""
        }
      }
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

  const rows = cart.map((value: any, index: number) => {
    console.log("valueee", value);
    return (
      <TableTr key={index}>
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
            <div className="flex flex-col">
              <span>
                {value?.product?.collection_slug
                  ? value?.product?.collection_slug +
                    " " +
                    value?.product?.shape
                  : value?.jewelryProduct?.productName}
              </span>
              <span className="text-sm">Qty: {value?.quantity}</span>
            </div>
            {value?.product?.productType === "stone" ? (
              <div className="flex flex-col">
                <span>Size: {value?.product?.size}</span>
                <span>Weight: {value?.product?.ct_weight}</span>
                <span>Quality: {value?.product?.quality}</span>
              </div>
            ) : null}
          </div>
        </TableTd>
        <TableTd className="font-semibold">
          <div className="text-lg">
            <span>$</span>
            {value?.jewelryProduct?.price ?? value?.product?.price}
          </div>
        </TableTd>
      </TableTr>
    );
  });

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
              <h2 className="text-lg font-semibold">Review Your Order</h2>
              <Divider mt={"lg"} />
              <Table
                verticalSpacing={"lg"}
                className="mt-5"
                striped
                horizontalSpacing={"xl"}
              >
                <TableThead className="uppercase text-[#0b182d]">
                  <TableTr>
                    <TableTh>Product</TableTh>
                    <TableTh>Price</TableTh>
                  </TableTr>
                </TableThead>
                <Table.Tbody>{rows}</Table.Tbody>
              </Table>
            </div>
          </GridCol>
        </Grid>
      </Container>
    </div>
  );
}
