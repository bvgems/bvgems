"use client";
import { Button, Group, Select, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";
import { US_STATES } from "@/utils/constants";
import React, { useEffect, useState } from "react";
import { upsertShippingAddress } from "@/apis/api";

export const ShippingAddressForm = ({
  userId,
  addressData,
  onSuccess,
}: {
  userId: string;
  addressData?: any;
  onSuccess: () => void;
}) => {
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
    const payload = {
      ...(isEdit ? { id: addressData.id } : { user_id: userId }),
      full_name: values.fullName,
      address_line1: values.addressLine1,
      address_line2: values.addressLine2,
      city: values.city,
      state: values.state,
      zip_code: values.zipCode,
      country: values.country,
      phone_number: values.phoneNumber,
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
      onSuccess();
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
      <div className="flex flex-col gap-4 px-2.5">
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
        <TextInput
          label="Phone Number"
          placeholder="(123) 456-7890"
          value={form.values.phoneNumber}
          onChange={(e) => {
            const raw = e.currentTarget.value.replace(/\D/g, "").slice(0, 10);
            const formatted =
              raw.length <= 3
                ? raw
                : raw.length <= 6
                ? `(${raw.slice(0, 3)}) ${raw.slice(3)}`
                : `(${raw.slice(0, 3)}) ${raw.slice(3, 6)}-${raw.slice(6)}`;
            form.setFieldValue("phoneNumber", formatted);
          }}
          error={form.errors.phoneNumber}
          leftSection={
            <span style={{ fontSize: "1.25rem", marginRight: "6px" }}>🇺🇸</span>
          }
        />
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
