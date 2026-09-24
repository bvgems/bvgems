import React, { useState } from "react";
import { Modal, TextInput, Textarea, Button, Text, Group, NumberInput, Select } from "@mantine/core";
import { useForm } from "@mantine/form";
import { sendGAEvent } from "@next/third-parties/google";

interface QuoteRequestModalProps {
  opened: boolean;
  onClose: () => void;
  product: any;
}

export const QuoteRequestModal = ({ opened, onClose, product }: QuoteRequestModalProps) => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const form = useForm({
    initialValues: {
      name: "",
      companyName: "",
      email: "",
      phone: "",
      notes: "",
      quantity: 1,
      unit: "Pieces",
    },
    validate: {
      name: (v) => (v.trim().length > 0 ? null : "Name is required"),
      email: (v) => (/^\S+@\S+$/.test(v) ? null : "Invalid email"),
      quantity: (v) => (v > 0 ? null : "Quantity must be greater than 0"),
    },
  });

  const computedTitle = product?.title || (product?.collection_slug ? `Loose ${product?.collection_slug} ${product?.shape} ${product?.size} - ${product?.quality}` : "Unknown");
  const computedSku = product?.sku || product?.lot_number || product?.id || "N/A";

  const handleSubmit = async (values: typeof form.values) => {
    setLoading(true);

    try {
      const response = await fetch("/api/quoteRequest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productTitle: computedTitle,
          sku: computedSku,
          quantity: values.quantity,
          unit: values.unit,
          name: values.name,
          companyName: values.companyName,
          email: values.email,
          phone: values.phone,
          notes: values.notes,
        }),
      });

      if (response.ok) {
        setSuccess(true);
        sendGAEvent("event", "quote_request_submitted", {
          product_sku: computedSku,
          product_title: computedTitle,
        });
      } else {
        // Simple fallback
        alert("Something went wrong. Please email us directly at sales@bvgems.com");
      }
    } catch (error) {
      console.error(error);
      alert("Error sending request.");
    }

    setLoading(false);
  };

  return (
    <Modal opened={opened} onClose={onClose} title={<span className="font-semibold uppercase tracking-widest text-lg text-[#0b182d]">Request Wholesale Quote</span>} size="lg" centered>
      {success ? (
        <div className="text-center py-10">
          <h3 className="text-2xl text-green-700 mb-2">Request Sent Successfully!</h3>
          <p className="text-gray-600 mb-6">Our sales team will get back to you with wholesale pricing and availability shortly.</p>
          <Button color="#0b182d" onClick={onClose}>Close</Button>
        </div>
      ) : (
        <form onSubmit={form.onSubmit(handleSubmit)} className="flex flex-col gap-4">
          <div className="bg-gray-50 p-4 border border-gray-100 rounded text-sm text-gray-700 mb-2">
            <span className="font-semibold block">Inquiring about:</span>
            {computedTitle} (SKU: {computedSku})
          </div>
          
          <div className="flex gap-4">
            <NumberInput
              label="Quantity"
              min={1}
              withAsterisk
              className="flex-1"
              {...form.getInputProps("quantity")}
            />
            <Select
              label="Unit"
              data={["Pieces", "Carats", "Parcels"]}
              withAsterisk
              className="flex-1"
              {...form.getInputProps("unit")}
            />
          </div>

          <div className="flex gap-4">
            <TextInput
              label="Full Name"
              placeholder="Your Name"
              withAsterisk
              className="flex-1"
              {...form.getInputProps("name")}
            />
            <TextInput
              label="Company Name"
              placeholder="Your Business Name"
              className="flex-1"
              {...form.getInputProps("companyName")}
            />
          </div>

          <div className="flex gap-4">
            <TextInput
              label="Email Address"
              placeholder="you@company.com"
              withAsterisk
              className="flex-1"
              {...form.getInputProps("email")}
            />
            <TextInput
              label="Phone Number"
              placeholder="Your Phone Number"
              className="flex-1"
              {...form.getInputProps("phone")}
            />
          </div>

          <Textarea
            label="Additional Notes / Questions"
            placeholder="Are there specific modifications, quantities, or memo terms you need?"
            minRows={3}
            {...form.getInputProps("notes")}
          />

          <Button type="submit" color="#0b182d" className="mt-4 h-12 uppercase tracking-widest text-xs" loading={loading}>
            Submit Quote Request
          </Button>
          <Text size="xs" color="dimmed" className="text-center mt-2">
            We typically respond within 1 business day.
          </Text>
        </form>
      )}
    </Modal>
  );
};
