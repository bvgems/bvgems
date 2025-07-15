"use client";
import React, { useState } from "react";
import { Button, TextInput, Textarea, Select, Text, Card } from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";

export const ContactUsForm = () => {
  const [loading, setLoading] = useState(false);

  const form = useForm({
    initialValues: {
      name: "",
      email: "",
      subject: "",
      inquiryType: "",
      message: "",
    },
    validateInputOnChange: true,
    validate: {
      name: (value) => (value.trim().length > 0 ? null : "Name is required"),
      email: (value) =>
        /^\S+@\S+$/.test(value) ? null : "Invalid email address",
      subject: (value) =>
        value.trim().length > 0 ? null : "Subject is required",
      inquiryType: (value) => (value ? null : "Please select an inquiry type"),
      message: (value) =>
        value.trim().length > 0 ? null : "Message is required",
    },
  });

  const handleSubmit = async (values: any) => {
    setLoading(true);

    try {
      console.log("Submitted values:", values);

      notifications.show({
        icon: <IconCheck />,
        color: "teal",
        message: "Your inquiry has been sent successfully!",
        position: "top-right",
        autoClose: 4000,
      });

      form.reset();
    } catch (error) {
      notifications.show({
        icon: <IconX />,
        color: "red",
        message: "An error occurred while sending your inquiry.",
        position: "top-right",
        autoClose: 4000,
      });
    }

    setLoading(false);
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Card
        shadow="md"
        padding="xl"
        component="a"
        className="mt-10 flex flex-col gap-4 max-w-xl mx-auto px-12 py-3.5 rounded-3xl"
      >
        <span className="text-center text-[#0b182d] text-xl font-semibold">
          Submit The Inquiry
        </span>
        <TextInput
          label="Name"
          placeholder="Your name"
          {...form.getInputProps("name")}
        />

        <TextInput
          label="Email"
          placeholder="your@email.com"
          {...form.getInputProps("email")}
        />

        <TextInput
          label="Subject"
          placeholder="Subject"
          withAsterisk
          {...form.getInputProps("subject")}
        />

        <Select
          label="Inquiry Type"
          placeholder="Select an option"
          data={[
            { value: "Product Questions", label: "Product Questions" },
            { value: "Custom Jewelry", label: "Custom Jewelry" },
            { value: "Loose Stones", label: "Loose Stones" },
            { value: "Wholesale", label: "Wholesale" },
            { value: "Other", label: "Other" },
          ]}
          withAsterisk
          {...form.getInputProps("inquiryType")}
        />

        <Textarea
          label="Message"
          placeholder="Your message"
          minRows={4}
          autosize
          {...form.getInputProps("message")}
        />

        <Button type="submit" color="#0b182d" loading={loading}>
          SUBMIT INQUIRY
        </Button>
      </Card>
    </form>
  );
};
