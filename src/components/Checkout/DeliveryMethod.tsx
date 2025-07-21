import { Card, Radio, Tooltip, Group } from "@mantine/core";
import { IconInfoCircle } from "@tabler/icons-react";
import React from "react";

export const DeliveryMethod = ({ deliveryMethod, setDeliveryMethod }: any) => {
  return (
    <Card withBorder className="flex flex-col gap-4 py-6">
      <Radio.Group
        value={deliveryMethod}
        onChange={setDeliveryMethod}
        name="delivery-method"
      >
        <Group gap="xs" align="center">
          <Radio
            value="store"
            size="md"
            color="#0b182d"
            label="NYC Store Pickup"
          />
          <Tooltip
            multiline
            w={220}
            withArrow
            transitionProps={{ duration: 200 }}
            label="Pick up from our address: 66 W 47th St, Booth #9 and #10, New York, NY 10036"
          >
            <span className="cursor-pointer">
              <IconInfoCircle size={19} />
            </span>
          </Tooltip>
        </Group>

        <Radio
          value="delivery"
          size="md"
          color="#0b182d"
          label="Delivery At Your Address"
          mt="sm"
        />
      </Radio.Group>
    </Card>
  );
};
