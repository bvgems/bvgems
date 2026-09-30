import React, { useState } from "react";
import { Modal, TextInput, Textarea, Button, Text, Group, NumberInput, Select } from "@mantine/core";
import { useForm } from "@mantine/form";
import { sendGAEvent } from "@next/third-parties/google";
import { useAuth } from "@/hooks/useAuth";
import { IconBrandWhatsapp, IconMail } from "@tabler/icons-react";

interface QuoteRequestModalProps {
  opened: boolean;
  onClose: () => void;
  product: any;
}

export const QuoteRequestModal = ({ opened, onClose, product }: QuoteRequestModalProps) => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { user } = useAuth();

  const form = useForm({
    initialValues: {
      notes: "",
      quantity: 1,
      unit: "Pieces",
    },
    validate: {
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
          name: `${user?.firstName || ""} ${user?.lastName || ""}`.trim() || "Unknown User",
          companyName: user?.companyName || "N/A",
          email: user?.email || "Unknown Email",
          phone: user?.phoneNumber || "N/A",
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

  const handleWhatsAppSubmit = () => {
    form.validate();
    if (!form.isValid()) return;

    const values = form.values;
    const computedName = `${user?.firstName || ""} ${user?.lastName || ""}`.trim() || "Unknown User";
    const text = `Hello,\n\nI would like to request a wholesale quote for the following product:\n\n*Product*: ${computedTitle}\n*SKU*: ${computedSku}\n*Quantity*: ${values.quantity} ${values.unit}\n*Name*: ${computedName}\n*Company*: ${user?.companyName || "N/A"}\n\n*Notes*: ${values.notes || "None"}\n\nPlease let me know the pricing and availability.`;
    window.open(`https://wa.me/12129444382?text=${encodeURIComponent(text)}`, "_blank");
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
              data={["Pieces", "Carats"]}
              withAsterisk
              className="flex-1"
              {...form.getInputProps("unit")}
            />
          </div>

          <Textarea
            label="Additional Notes / Questions"
            placeholder="Are there specific modifications, quantities, or memo terms you need?"
            minRows={3}
            {...form.getInputProps("notes")}
          />

          <div className="flex gap-2 mt-4">
            <Button
              color="green"
              className="h-12 flex-1 uppercase tracking-widest text-xs"
              leftSection={<IconBrandWhatsapp size={18} />}
              onClick={(e) => {
                e.preventDefault();
                handleWhatsAppSubmit();
              }}
              title="Send Request by WhatsApp"
            >
              Send request by WhatsApp
            </Button>
            <Button 
              type="submit" 
              color="#0b182d" 
              className="h-12 flex-1 uppercase tracking-widest text-xs" 
              leftSection={<IconMail size={18} />}
              loading={loading}
            >
              Send request by Email
            </Button>
          </div>
          <Text size="xs" color="dimmed" className="text-center mt-2">
            We typically respond within 1 business day.
          </Text>
        </form>
      )}
    </Modal>
  );
};
