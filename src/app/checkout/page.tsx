"use client";
import { useMemo, useState } from "react";
import { Container, Grid, GridCol, Button, Stack } from "@mantine/core";
import { ShippingAddress } from "@/components/ShippingAddress/ShipppingAddress";
import { makeCheckout } from "@/apis/api";
import { loadStripe } from "@stripe/stripe-js";
import { getCartStore } from "@/store/useCartStore";
import { useAuth } from "@/hooks/useAuth";
import { PaymentOptions } from "@/components/CommonComponents/PaymentOptions";

export default function CheckoutSelectionPage() {
  const { user } = useAuth();
  const cartStore = useMemo(
    () => getCartStore(user?.id || "guest"),
    [user?.id]
  );
  const [selectedAddress, setSelectedAddress] = useState<any>(null);
  const [paymentOption, setPaymentOption] = useState<"online" | "cod" | null>(
    null
  );

  const cart = cartStore((state: any) => state.cart);

  const stripePromise = loadStripe(
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
  );

  const handlePayment = async () => {
    const stripe = await stripePromise;
    const response = await makeCheckout(cart);
    const sessionId = response.id;
    await stripe?.redirectToCheckout({ sessionId });
  };

  return (
    <div className="py-12">
      <Container size={"lg"} className="py-5">
        <Grid gutter={"xl"}>
          <GridCol span={{ base: 12, md: 8 }}>
            <h1 className="text-xl py-6">Select Your Shipping Address</h1>
            <ShippingAddress selectable={true} onSelect={setSelectedAddress} />
          </GridCol>

          <GridCol span={{ base: 12, md: 4 }}>
            {selectedAddress && (
              <div className="p-12">
                <h2 className="text-lg font-semibold py-6">
                  Choose Payment Method
                </h2>
                <Stack>
                  <Button
                    color="#0b182d"
                    variant={paymentOption === "online" ? "filled" : "outline"}
                    onClick={() => {
                      setPaymentOption("online");
                      handlePayment();
                    }}
                  >
                    Pay Online Now
                  </Button>
                  <PaymentOptions />
                  <Button
                    color="#0b182d"
                    variant={paymentOption === "cod" ? "filled" : "outline"}
                    onClick={() => setPaymentOption("cod")}
                  >
                    Pay on Delivery
                  </Button>
                </Stack>
              </div>
            )}
          </GridCol>
        </Grid>
      </Container>
    </div>
  );
}
