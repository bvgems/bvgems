"use client";
import { Button, Paper, Title, Text, Center, Stack } from "@mantine/core";
import { IconCircleXFilled, IconX } from "@tabler/icons-react";

const PaymentFailedPage = () => {
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
          <IconCircleXFilled
            size={64}
            color="red"
            style={{ marginBottom: 16 }}
          />
        </div>
        <h1 className="text-center text-red-600 text-2xl">
          Payment Successful
        </h1>
        <Text mt="md" color="dimmed">
          We couldn’t complete your payment. Please check your payment details
          or try again later.
        </Text>
        <Stack mt="xl" align="center">
          <Button component="a" href="/checkout" color="red">
            Retry Payment
          </Button>
        </Stack>
      </Paper>
    </Center>
  );
};

export default PaymentFailedPage;
