import { Card, Radio, Tooltip, Group } from "@mantine/core";
import { IconInfoCircle } from "@tabler/icons-react";
import React from "react";

export const DeliveryMethod = ({
  deliveryMethod,
  setDeliveryMethod,
  shippingOption = "2day",
  setShippingOption,
  subtotal = 0,
}: any) => {
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

        {deliveryMethod === "delivery" && (
          <div className="mt-4 pt-4 border-t border-gray-200 flex flex-col gap-3 pl-1 sm:pl-4">
            <p className="text-xs font-bold text-gray-700 uppercase tracking-wider m-0">
              Select Shipping Speed:
            </p>

            <Radio.Group
              value={shippingOption}
              onChange={(val) => setShippingOption && setShippingOption(val)}
              name="shipping-speed"
            >
              <div className="flex flex-col gap-2.5">
                <div
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                    shippingOption === "2day"
                      ? "border-[#0b182d] bg-slate-50 ring-1 ring-[#0b182d]"
                      : "border-gray-200 hover:border-gray-300 bg-white"
                  }`}
                  onClick={() => setShippingOption && setShippingOption("2day")}
                >
                  <Radio
                    value="2day"
                    size="sm"
                    color="#0b182d"
                    label={
                      <div>
                        <span className="font-semibold text-sm text-[#0b182d] block">
                          2 Days Shipping
                        </span>
                        <span className="text-xs text-gray-500">
                          Delivery in 2 business days
                        </span>
                      </div>
                    }
                  />
                  <span className="text-sm font-bold text-[#0b182d]">
                    {subtotal >= 500 ? (
                      <span className="text-emerald-700">FREE</span>
                    ) : (
                      "$23.00"
                    )}
                  </span>
                </div>

                <div
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                    shippingOption === "overnight"
                      ? "border-[#0b182d] bg-slate-50 ring-1 ring-[#0b182d]"
                      : "border-gray-200 hover:border-gray-300 bg-white"
                  }`}
                  onClick={() => setShippingOption && setShippingOption("overnight")}
                >
                  <Radio
                    value="overnight"
                    size="sm"
                    color="#0b182d"
                    label={
                      <div>
                        <span className="font-semibold text-sm text-[#0b182d] block">
                          Priority Overnight
                        </span>
                        <span className="text-xs text-gray-500">
                          Next business day delivery
                        </span>
                      </div>
                    }
                  />
                  <span className="text-sm font-bold text-[#0b182d]">
                    {subtotal >= 500 ? "$15.00" : "$38.00"}
                  </span>
                </div>
              </div>
            </Radio.Group>

            {subtotal >= 500 ? (
              <p className="text-xs text-emerald-700 font-medium m-0">
                ✓ Free 2 Days Shipping applied on orders over $500! (Priority Overnight available for $15)
              </p>
            ) : (
              <p className="text-xs text-gray-500 m-0">
                Free 2 Days Shipping on orders of $500 or more.
              </p>
            )}
          </div>
        )}
      </Radio.Group>
    </Card>
  );
};
