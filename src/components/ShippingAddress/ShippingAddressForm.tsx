"use client";
import { Button, Group, Select, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";
import { US_STATES } from "@/utils/constants";
import React, { useEffect, useState } from "react";
import { upsertShippingAddress } from "@/apis/api";
import { PhoneInput } from "../CommonComponents/PhoneInput";
import { useStpperStore } from "@/store/useStepperStore";

export const ShippingAddressForm = ({
  userId,
  addressData,
  onSuccess,
  isStepper,
  nextStep,
}: {
  userId?: string;
  addressData?: any;
  onSuccess?: () => void;
  isStepper?: boolean;
  nextStep?: any;
}) => {
  const { setShippingAddress } = useStpperStore();
  const isEdit = Boolean(addressData?.id);

  const form = useForm({
    initialValues: {
      fullName: "",
      addressLine1: "",
      addressLine2: "",
      city: "",
      state: "",
      zipCode: "",
      country: "United States",
      phoneNumber: "",
      email: "",
    },
    validate: {
      fullName: (v) => (v.trim() ? null : "Required"),
      addressLine1: (v) => (v.trim() ? null : "Required"),
      city: (v) => (v.trim() ? null : "Required"),
      state: (v) => (v.trim() ? null : "Required"),
      zipCode: (v) => (/^\d{5}(-\d{4})?$/.test(v) ? null : "Invalid ZIP"),
      email: (v) => (/^\S+@\S+\.\S+$/.test(v) ? null : "Invalid email"),
      phoneNumber: (v) =>
        /^\(\d{3}\)\s\d{3}-\d{4}$/.test(v) ? null : "Phone must be 10 digits",
    },
  });

  useEffect(() => {
    if (addressData) {
      form.setValues({
        fullName: addressData.full_name,
        addressLine1: addressData.address_line1,
        addressLine2: addressData.address_line2,
        city: addressData.city,
        state: addressData.state,
        zipCode: addressData.zip_code,
        country: addressData.country,
        phoneNumber: addressData.phone_number,
        email: addressData.email,
      });
    }
  }, [addressData]);

  const handleSubmit = async (values: typeof form.values) => {
    if (isStepper && form.isValid()) {
      setShippingAddress({
        fullName: values.fullName,
        addressLine1: values.addressLine1,
        addressLine2: values.addressLine2,
        city: values.city,
        state: values.state,
        zipCode: values.zipCode,
        country: values.country,
        phoneNumber: values.phoneNumber,
        email: values.email,
      });
      nextStep();
      return;
    }
    const payload = {
      ...(isEdit ? { id: addressData.id } : { userId: userId }),
      fullName: values.fullName,
      addressLine1: values.addressLine1,
      addressLine2: values.addressLine2,
      city: values.city,
      state: values.state,
      zipCode: values.zipCode,
      country: values.country,
      phoneNumber: values.phoneNumber,
      email: values.email,
    };

    const response: any = await upsertShippingAddress(isEdit, payload);
    const result = response.data;

    if (result.flag) {
      notifications.show({
        icon: <IconCheck />,
        message: result.message,
        position: "top-right",
        color: "teal",
      });
      onSuccess?.();
    } else {
      notifications.show({
        icon: <IconX />,
        message: "Save failed",
        position: "top-right",
        color: "red",
      });
    }
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <div className={`flex flex-col gap-4 ${isStepper ? "px-28" : "px-2.5"}`}>
        {isStepper ? (
          <div className="flex justify-end mt-5">
            <Button
              onClick={() => nextStep()}
              size="compact-sm"
              variant="transparent"
              color="violet"
            >
              <span className="underline">Skip For Now</span>
            </Button>
          </div>
        ) : null}
        <TextInput
          label="Full Name"
          placeholder="John Doe"
          {...form.getInputProps("fullName")}
        />
        <TextInput
          label="Street Address"
          placeholder="123 Main St"
          {...form.getInputProps("addressLine1")}
        />
        <TextInput
          label="Apt, Suite, etc."
          placeholder="Apt 4B"
          {...form.getInputProps("addressLine2")}
        />
        <div className="flex gap-4">
          <TextInput
            className="w-1/2"
            label="City"
            placeholder="New York"
            {...form.getInputProps("city")}
          />
          <Select
            searchable
            className="w-1/2"
            label="State"
            placeholder="Select state"
            data={US_STATES}
            {...form.getInputProps("state")}
          />
        </div>
        <TextInput
          label="ZIP Code"
          placeholder="10001"
          {...form.getInputProps("zipCode")}
        />
        <TextInput label="Country" value="United States" disabled />
        <PhoneInput form={form} />
        <TextInput
          label="Email"
          type="email"
          placeholder="john.doe@example.com"
          {...form.getInputProps("email")}
        />
        <Group mt="md">
          <Button type="submit" color="violet" fullWidth>
            {isEdit ? "Update Address" : "Save Address"}
          </Button>
        </Group>
      </div>
    </form>
  );
};
