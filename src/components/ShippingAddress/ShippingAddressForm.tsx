"use client";
import { Button, Group, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";
import { useEffect } from "react";
import { upsertShippingAddress } from "@/apis/api";
import { PhoneNumberInput } from "../CommonComponents/PhoneInput";
import { useStpperStore } from "@/store/useStepperStore";
import { isValidPhoneNumber } from "react-phone-number-input";

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
  const { shippingAddress, setShippingAddress, hasHydrated } = useStpperStore();
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
    validateInputOnChange: true,
    validate: {
      fullName: (v) => (v.trim() ? null : "Required"),
      addressLine1: (v) => (v.trim() ? null : "Required"),
      city: (v) => (v.trim() ? null : "Required"),
      state: (v) => (v.trim() ? null : "Required"),
      zipCode: (v) => (/^\d{5}(-\d{4})?$/.test(v) ? null : "Invalid ZIP"),
      email: (v) => (/^\S+@\S+\.\S+$/.test(v) ? null : "Invalid email"),
      phoneNumber: (value) => {
        if (!value) return "Phone number is required.";
        if (!isValidPhoneNumber(value))
          return "Please enter a valid phone number.";

        return null;
      },
    },
  });

  useEffect(() => {
    if (!hasHydrated) return;

    if (addressData) {
      form.setValues({
        fullName: addressData.full_name || "",
        addressLine1: addressData.address_line1 || "",
        addressLine2: addressData.address_line2 || "",
        city: addressData.city || "",
        state: addressData.state || "",
        zipCode: addressData.zip_code || "",
        country: addressData.country || "United States",
        phoneNumber: addressData.phone_number || "",
        email: addressData.email || "",
      });
    } else if (shippingAddress) {
      form.setValues({
        fullName: shippingAddress.fullName || "",
        addressLine1: shippingAddress.addressLine1 || "",
        addressLine2: shippingAddress.addressLine2 || "",
        city: shippingAddress.city || "",
        state: shippingAddress.state || "",
        zipCode: shippingAddress.zipCode || "",
        country: shippingAddress.country || "United States",
        phoneNumber: shippingAddress.phoneNumber || "",
        email: shippingAddress.email || "",
      });
    }
  }, [addressData, shippingAddress, hasHydrated]);

  if (!hasHydrated) {
    return <div>Loading...</div>;
  }

  const handleSubmit = async (values: typeof form.values) => {
    if (!userId) {
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
      onSuccess?.();
      return;
    }
    if (isStepper && form.isValid()) {
      await new Promise((resolve) => setTimeout(resolve, 300));
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
        {isStepper && (
          <div className="flex justify-end mt-5">
            <Button
              onClick={() => nextStep()}
              size="compact-sm"
              variant="transparent"
              color="#0b182d"
            >
              <span className="underline">Skip For Now</span>
            </Button>
          </div>
        )}
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
          <TextInput
            label="Enter State"
            placeholder="your state"
            className="w-1/2"
            {...form.getInputProps("state")}
          />
        </div>
        <TextInput
          label="ZIP Code"
          placeholder="10001"
          {...form.getInputProps("zipCode")}
        />
        <TextInput label="Country" value="United States" disabled />
        <PhoneNumberInput form={form} />
        <TextInput
          label="Email"
          type="email"
          placeholder="john.doe@example.com"
          {...form.getInputProps("email")}
        />
        <Group mt="md">
          <Button type="submit" color="#0b182d" fullWidth>
            {isEdit ? "UPDATE ADDRESS" : "SAVE ADDRESS"}
          </Button>
        </Group>
      </div>
    </form>
  );
};
