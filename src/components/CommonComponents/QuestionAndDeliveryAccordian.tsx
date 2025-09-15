import { Card, Button, Text, Group } from "@mantine/core";
import React from "react";
import { ProductAccordion } from "../ProductDetails/ProductAccordion";
import { IconMessageCircle } from "@tabler/icons-react";
import { useRouter } from "next/navigation";

export const QuestionAndDeliveryAccordian = ({description}:any) => {
  const router = useRouter();

  return (
    <div>
      {/* Minimal Help Section */}
      <Card
        radius="lg"
        padding="lg"
        className="mb-8"
        style={{ backgroundColor: "#f8f9fb", border: "1px solid #eceff3" }}
      >
        <Group align="center" mb="sm">
          <IconMessageCircle size={22} color="#0b182d" />
          <Text fw={600} size="md">
            Have a question?
          </Text>
        </Group>

        <Text size="sm" c="dimmed" mb="md">
          Our gemstone specialists are here to help with your order or any
          customization requests.
        </Text>

        <Button
          onClick={() => router.push("/customer-support/contact-us")}
          radius="0"
          color="dark"
          variant="outline"
        >
          Contact Us
        </Button>
      </Card>

      {/* Accordion Section */}
      <ProductAccordion description={description}/>
    </div>
  );
};
