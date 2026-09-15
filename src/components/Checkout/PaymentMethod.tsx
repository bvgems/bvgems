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
    [user?.id],
  );
  const cart = cartStore((state: any) => state.cart);
  const isDisabled = () => {
    console.log("Memo Debug: user object:", user);
    console.log("Memo Debug: isMemoPurchaseApproved:", user?.isMemoPurchaseApproved);
    if (!user) return true;

    if (user.isMemoPurchaseApproved) {
      return false;
    }

    return true;
  };

  console.log("Memo Debug: isDisabled() returned", isDisabled());

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
              <div className="flex items-center gap-5">
                <Radio
                  value="memo"
                  label="ON MEMO"
                  size="md"
                  color="#0b182d"
                  disabled={isDisabled()}
                />
                <Button
                  variant="subtle"
                  color="blue"
                  size="xs"
                  onClick={open}
                  className="ml-auto"
                >
                  View Terms
                </Button>
              </div>
            </div>
          </Group>
        </Radio.Group>
      </Card>
    </>
  );
};
