"use client";
import { useAuth } from "@/hooks/useAuth";
import React, { useEffect, useState } from "react";
import {
  Loader,
  Card,
  Text,
  Stack,
  Image,
  Grid,
  GridCol,
  Divider,
  Box,
  Badge,
} from "@mantine/core";
import { fetchAllOrders } from "@/apis/api";
import { AnimatedText } from "@/components/CommonComponents/AnimatedText";
import { IconCreditCard, IconTruckDelivery } from "@tabler/icons-react";
import { motion } from "framer-motion";

interface ShopifyOrder {
  id: number;
  name: string;
  created_at: string;
  total_price: string;
  financial_status: string;
  fulfillment_status: string;
  line_items: {
    name: string;
    quantity: number;
  }[];
}

export default function MyOrders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<ShopifyOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.email) return;

    const fetchOrders = async () => {
      try {
        const res = await fetchAllOrders(user.email);
        setOrders(res?.data || []);
      } catch (err) {
        console.error("Error fetching orders", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user?.email]);

  return (
    <Stack p="xl" className="bg-[#f9f9f9] min-h-screen">
      <AnimatedText
        text="Order History"
        className="text-center text-4xl text-[#0b182d] font-semibold mb-6"
      />

      {loading ? (
        <Loader />
      ) : orders.length === 0 ? (
        <Text>No orders found.</Text>
      ) : (
        orders.map((order, index) => {
          const isLatest = index === 0;

          return (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                delay: index * 0.1,
                ease: "easeOut",
              }}
            >
              <Card
                shadow="md"
                radius="xl"
                withBorder
                mb="lg"
                p="lg"
                className={`bg-white ${
                  isLatest ? "border-[2px] border-blue-500" : ""
                }`}
              >
                <Box className="bg-[#f0f4f8] p-4 rounded-t-xl mb-4 flex justify-between items-center">
                  <div>
                    <Text fw={600}>Order #{order.name}</Text>
                    <Text size="sm" c="dimmed">
                      Placed on:{" "}
                      {new Date(order.created_at).toLocaleDateString()}
                    </Text>
                  </div>
                  {isLatest && (
                    <Badge
                      size="lg"
                      radius={0}
                      fw={700}
                      color="green"
                      className="px-3 py-1"
                    >
                      Latest Order
                    </Badge>
                  )}
                </Box>

                <Grid gutter="xl">
                  <GridCol span={{ base: 12, md: 6 }}>
                    <Stack gap="sm">
                      {order.line_items.map((item, i) => (
                        <Box key={i} className="flex gap-4 items-center">
                          <Image
                            src="/assets/ownbracelet.png"
                            alt={item.name}
                            w={80}
                            h={60}
                            radius="md"
                            fit="cover"
                          />
                          <Box>
                            <Text size="lg" fw={600}>
                              {item.name}
                            </Text>
                            <Text size="sm" c="dimmed">
                              Qty: {item.quantity}
                            </Text>
                          </Box>
                        </Box>
                      ))}
                      <Divider my="md" />
                      <Text size="xl" fw={700}>
                        Total: ${order.total_price}
                      </Text>
                    </Stack>
                  </GridCol>

                  <GridCol span={{ base: 12, md: 6 }}>
                    <Stack gap="sm" className="justify-center h-full">
                      <Box className="flex items-center gap-2 text-lg">
                        <IconCreditCard size={22} />
                        <Text fw={500}>
                          Payment Status:{" "}
                          <Text
                            span
                            fw={700}
                            c={
                              order?.financial_status === "pending"
                                ? "yellow"
                                : "green"
                            }
                            style={{ textTransform: "capitalize" }}
                          >
                            {order.financial_status}
                          </Text>
                        </Text>
                      </Box>
                      <Box className="flex items-center gap-2 text-lg">
                        <IconTruckDelivery size={22} />
                        <Text fw={500}>
                          Order Status:{" "}
                          <Text
                            span
                            fw={700}
                            c={!order?.fulfillment_status ? "blue" : "green"}
                            style={{ textTransform: "capitalize" }}
                          >
                            {!order.fulfillment_status
                              ? "Processing"
                              : "Delivered"}
                          </Text>
                        </Text>
                      </Box>
                    </Stack>
                  </GridCol>
                </Grid>
              </Card>
            </motion.div>
          );
        })
      )}
    </Stack>
  );
}
