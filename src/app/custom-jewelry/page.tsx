"use client";

import { useForm } from "@mantine/form";
import {
  Button,
  Group,
  Autocomplete,
  TextInput,
  Textarea,
  FileInput,
  NumberInput,
  Container,
  Image,
  Text,
} from "@mantine/core";
import { isValidPhoneNumber } from "react-phone-number-input";
import { PhoneNumberInput } from "@/components/CommonComponents/PhoneInput";
import { gemstoneOptions } from "@/utils/constants";
import { IconDiamond, IconCheck, IconX } from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";
import { submitCustomDesignRequest } from "@/apis/api"; // 🔹 create this in your backend api
import { useState } from "react";

export default function CustomDesignForm() {
  const [loading, setLoading] = useState(false);

  const form = useForm({
    initialValues: {
      fullName: "",
      email: "",
      phoneNumber: "",
      creationType: "",
      budget: "",
      centerStone: "",
      sideStone: "",
      goldColor: "",
      inspirationFile: null as File | null,
      additionalDetails: "",
    },
    validateInputOnChange: true,
    validate: {
      fullName: (v) => (v.trim() ? null : "Full Name is required"),
      email: (value) => {
        if (!value) return "Email is required";
        if (!/^\S+@\S+\.\S+$/.test(value)) return "Invalid email address";
      },
      phoneNumber: (v) => {
        if (!v) return "Phone number is required.";
        if (!isValidPhoneNumber(v)) return "Please enter a valid phone number.";
        return null;
      },
      creationType: (v) => (v ? null : "Please select what you want to create"),
      budget: (v) => (v ? null : "Budget is required"),
      centerStone: (v) => (v ? null : "Please select a gemstone"),
      goldColor: (v) => (v ? null : "Please select a gold color"),
    },
  });

  // 🔹 No images, only labels
  const creationOptions = [
    { value: "engagement-ring", label: "Engagement Ring" },
    { value: "necklace", label: "Necklace" },
    { value: "bracelet", label: "Bracelet" },
    { value: "earrings", label: "Earrings" },
    { value: "other", label: "Other" },
  ];

  // 🔹 Gold color with icons
  const goldColorOptions = [
    {
      value: "rose",
      label: "Rose",
      icon: <IconDiamond size={20} color="#ff007f" />,
    },
    {
      value: "white",
      label: "White",
      icon: <IconDiamond size={20} color="gray" />,
    },
    {
      value: "yellow",
      label: "Yellow",
      icon: <IconDiamond size={20} color="orange" />,
    },
  ];

  const handleSubmit = async (values: typeof form.values) => {
    setLoading(true);
    try {
      const formData = new FormData();
      Object.entries(values).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          formData.append(key, value as any);
        }
      });
      const response = await submitCustomDesignRequest(formData);

      if (response?.flag) {
        notifications.show({
          icon: <IconCheck />,
          color: "teal",
          message: response?.message || "Request submitted successfully!",
          position: "top-right",
          autoClose: 4000,
        });
        form.reset();
      } else {
        notifications.show({
          icon: <IconX />,
          color: "red",
          message: response?.error || "Submission failed. Try again.",
          position: "top-right",
          autoClose: 4000,
        });
      }
      setLoading(false);
    } catch (error: any) {
      console.error("Submit failed:", error);
      notifications.show({
        icon: <IconX />,
        color: "red",
        message: "Something went wrong. Please try again.",
        position: "top-right",
        autoClose: 4000,
      });
    }
  };

  return (
    <Container size="lg" py="lg">
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <div className="flex flex-col gap-4 px-5 sm:px-8 lg:px-28 py-10">
          <h1 className="text-center mt-5 text-2xl">Build Custom Jewelry</h1>

          {/* Full Name */}
          <TextInput
            label="Full Name"
            placeholder="Jane Doe"
            {...form.getInputProps("fullName")}
          />

          {/* Email */}
          <TextInput
            label="Email Address"
            placeholder="jane@example.com"
            {...form.getInputProps("email")}
          />

          {/* Phone */}
          <PhoneNumberInput form={form} />

          {/* Creation Type (labels only) */}
          <Autocomplete
            label="What would you like to create?"
            placeholder="Select option"
            data={creationOptions}
            {...form.getInputProps("creationType")}
          />

          {/* Budget */}
          <NumberInput
            label="Budget (USD)"
            placeholder="5000"
            min={100}
            allowNegative={false}
            allowDecimal={false}
            prefix="$ "
            {...form.getInputProps("budget")}
          />

          {/* Center Stone (with image + label) */}
          <Autocomplete
            label="Preferred Center Stone"
            placeholder="Choose a gemstone"
            data={gemstoneOptions}
            renderOption={({ option }: any) => (
              <div className="flex items-center gap-2.5">
                {option?.image && (
                  <Image src={option.image} h={24} w={24} alt={option.label} />
                )}
                <Text size="sm">{option.label}</Text>
              </div>
            )}
            {...form.getInputProps("centerStone")}
          />

          {/* Side Stones */}
          <TextInput
            label="Describe Side Stone(s)"
            placeholder="Ruby, Sapphire etc."
            {...form.getInputProps("sideStone")}
          />

          {/* Gold Color (with icon) */}
          <Autocomplete
            label="Preferred Metal Color"
            placeholder="Select metal color"
            data={goldColorOptions}
            renderOption={({ option }: any) => (
              <div className="flex items-center gap-2">
                {option?.icon}
                <Text size="sm">{option.label}</Text>
              </div>
            )}
            {...form.getInputProps("goldColor")}
          />

          {/* Inspiration File */}
          <FileInput
            label="Upload Inspiration Photo (optional)"
            placeholder="Choose file"
            accept="image/*"
            {...form.getInputProps("inspirationFile")}
          />

          {/* Additional Notes */}
          <Textarea
            label="Additional Information"
            placeholder="Describe your vision in detail..."
            autosize
            minRows={3}
            {...form.getInputProps("additionalDetails")}
          />

          {/* Submit */}
          <Group mt="md">
            <Button loading={loading} type="submit" color="#0b182d" fullWidth>
              SUBMIT REQUEST
            </Button>
          </Group>
        </div>
      </form>
    </Container>
  );
}
