import { Button, Card, Group, Radio } from "@mantine/core";
import { useMemo } from "react";
import { PaymentOptions } from "../CommonComponents/PaymentOptions";
import { useAuth } from "@/hooks/useAuth";
import { getCartStore } from "@/store/useCartStore";
import { useDisclosure } from "@mantine/hooks";
import { MemoTermsModal } from "../CommonComponents/MemoTermsModal";

export const PaymentMethod = ({
  deliveryMethod,
  paymentMethod,
  setPaymentMethod,
}: any) => {
  const { user } = useAuth();
  const [opened, { open, close }] = useDisclosure(false);

  const cartStore = useMemo(
    () => getCartStore(user?.id || "guest"),
    [user?.id]
  );
  const cart = cartStore((state: any) => state.cart);
  const isDisabled = () => {
    if (!user) return true;

    if (user.isMemoPurchaseApproved) {
      const hasJewelry = cart?.some(
        (item: any) => item?.product?.productType !== "stone"
      );

      return hasJewelry;
    }

    return true;
  };

  return (
    <>
      <MemoTermsModal cartItems={cart} opened={opened} close={close} />
      <Card withBorder className="py-6 px-3">
        <Radio.Group
          value={paymentMethod}
          onChange={setPaymentMethod}
          name="payment-method"
        >
          <Group>
            <div className="flex flex-col gap-4 p-4">
              <div className="flex items-center gap-5">
                <Radio
                  value="online"
                  label="PAY NOW"
                  size="md"
                  color="#0b182d"
                />
                <PaymentOptions size={25} />
              </div>

              {deliveryMethod === "store" && (
                <Radio
                  value="cod"
                  label="PICKUP PAYMENT"
                  size="md"
                  color="#0b182d"
                />
              )}

              <Radio
                disabled={isDisabled()}
                value="memo"
                description={
                  <Button
                    onClick={open}
                    variant="transparent"
                    size="compact-xs"
                  >
                    <span className="underline text-[#0b182d]">
                      Request Memo Purchase
                    </span>
                  </Button>
                }
                label="PURCHASE ON MEMO"
                size="md"
                color="#0b182d"
              />
            </div>
          </Group>
        </Radio.Group>
      </Card>
    </>
  );
};
