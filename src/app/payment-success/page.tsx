"use client";
import { Button, Paper, Text, Center, Stack } from "@mantine/core";
import { IconCircleCheckFilled } from "@tabler/icons-react";

const PaymentSuccessPage = () => {
  return (
    <Center style={{ minHeight: "100vh", backgroundColor: "#f9f9f9" }}>
      <Paper
        shadow="xl"
        radius="xl"
        p="xl"
        withBorder
        style={{ maxWidth: 500, textAlign: "center" }}
      >
        <div className="flex justify-center">
          <IconCircleCheckFilled
            size={64}
            color="green"
            style={{ marginBottom: 16 }}
          />
        </div>
        <h1 className="text-center text-green-600 text-2xl">
          Payment Successful
        </h1>
        <Text mt="md" color="dimmed">
          Thank you for your order. We’ve received your payment and are now
          processing your order. A confirmation email has been sent.
        </Text>
      </Paper>
    </Center>
  );
};

export default PaymentSuccessPage;
