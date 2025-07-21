import {
  Button,
  Card,
  Divider,
  Grid,
  Group,
  Radio,
  Tooltip,
} from "@mantine/core";
import React from "react";
import { PaymentOptions } from "../CommonComponents/PaymentOptions";
import { useAuth } from "@/hooks/useAuth";

export const PaymentMethod = ({
  deliveryMethod,
  paymentMethod,
  setPaymentMethod,
}: any) => {
  const { user } = useAuth();

  return (
    <Card withBorder className="py-6 px-3">
      <Radio.Group
        value={paymentMethod}
        onChange={setPaymentMethod}
        name="payment-method"
      >
        <Group>
          <div className="flex flex-col gap-4 p-4">
            <div className="flex items-center gap-5">
              <Radio value="online" label="PAY NOW" size="md" color="#0b182d" />
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
              disabled={!user}
              value="memo"
              description="First get your account approved in order to purchase on Memo."
              label="PURCHASE ON MEMO"
              size="md"
              color="#0b182d"
            />
          </div>
        </Group>
      </Radio.Group>
    </Card>
  );
};
