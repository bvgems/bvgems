import {
  Card,
  Text,
  Group,
  Stack,
  Badge,
  Divider,
  Loader,
  Center,
  Title,
  TextInput,
  Container,
} from "@mantine/core";
import { IconPackage, IconCalendar, IconSearch, IconTruck } from "@tabler/icons-react";
import { useEffect, useMemo, useState } from "react";
import { getOrders } from "@/apis/api";
import { useAuth } from "@/hooks/useAuth";
import { UnAuthorized } from "../CommonComponents/UnAuthorized";

type Order = {
  id: number;
  name: string;
  created_at: string;
  total_price: string;
  financial_status: string;
  fulfillment_status: string | null;
  line_items: {
    name: string;
    quantity: number;
    price: string; // ✅ price per item
  }[];
  tracking_info?: {
    tracking_number: string;
    tracking_url: string;
    tracking_company: string;
    shipment_status: string | null;
  }[];
};

export const MyOrders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await getOrders(user?.email);
      setOrders(res?.data || []);
    } catch (error) {
      console.error("Failed to fetch orders", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.email) {
      fetchOrders();
    }
  }, [user]);

  // 🔍 Filter logic
  const filteredOrders = useMemo(() => {
    if (!search.trim()) return orders;

    const query = search.toLowerCase();

    return orders.filter((order) => {
      const orderNumberMatch = order.name.toLowerCase().includes(query);

      const dateMatch = new Date(order.created_at)
        .toLocaleDateString()
        .toLowerCase()
        .includes(query);

      const itemsMatch = order.line_items.some((item) =>
        item.name.toLowerCase().includes(query),
      );

      return orderNumberMatch || dateMatch || itemsMatch;
    });
  }, [orders, search]);

  if (!user) return <UnAuthorized />;
  if (loading) {
    return (
      <Center h={300}>
        <Loader size="lg" />
      </Center>
    );
  }

  return (
    <Container my="xl" size="xl">
      <div className="flex flex-col gap-6">
        <Title mt="xl" order={2}>
          My Orders
        </Title>

        {/* 🔍 Search bar */}
        <TextInput
          placeholder="Search by order number, product name, or date"
          leftSection={<IconSearch size={16} />}
          value={search}
          onChange={(e) => setSearch(e.currentTarget.value)}
        />

        {!filteredOrders.length ? (
          <Center h={200}>
            <Text c="dimmed">No matching orders found</Text>
          </Center>
        ) : (
          filteredOrders.map((order) => (
            <Card
              key={order.id}
              shadow="sm"
              radius="md"
              withBorder
              padding="lg"
            >
              {/* Header */}
              <Group justify="space-between" align="stretch">
                <Stack gap={4}>
                  <Text fw={600}>{order.name}</Text>

                  <Group gap={6} c="dimmed">
                    <IconCalendar size={14} />
                    <Text size="sm">
                      {new Date(order.created_at).toLocaleDateString()}
                    </Text>
                  </Group>

                  {order.tracking_info && order.tracking_info.length > 0 && (
                    <Stack gap={4} mt={6}>
                      {order.tracking_info.map((track, idx) => (
                        <Group key={idx} gap={6} align="center">
                          <IconTruck size={14} className="text-gray-500" />
                          <Text size="sm" c="dimmed">
                            {track.tracking_company}:
                          </Text>
                          <Text
                            size="sm"
                            c="blue"
                            td="underline"
                            component="a"
                            href={track.tracking_url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {track.tracking_number}
                          </Text>
                        </Group>
                      ))}
                    </Stack>
                  )}
                </Stack>
                <Stack align="flex-end" justify="space-between" gap={6}>
                  <Badge color="green" variant="light">
                    {order.financial_status.toUpperCase()}
                  </Badge>

                  <Badge
                    color={order.fulfillment_status ? "blue" : "gray"}
                    variant="light"
                  >
                    {order.fulfillment_status || "Unfulfilled"}
                  </Badge>
                </Stack>
              </Group>

              <Divider my="md" />

              {/* Line items */}
              <Stack gap="sm">
                {order.line_items.map((item, index) => {
                  return (
                    <Group
                      key={index}
                      justify="space-between"
                      align="flex-start"
                    >
                      <Group gap={8}>
                        <IconPackage size={16} />
                        <Stack gap={2}>
                          <Text size="sm">{item.name}</Text>
                          <Text size="xs" c="dimmed">
                            Qty: {item.quantity} × $
                            {Number(item.price).toFixed(2)}
                          </Text>
                        </Stack>
                      </Group>

                      <Text fw={500}>
                        $
                        {(Number(item?.quantity) * Number(item?.price)).toFixed(
                          2,
                        )}
                      </Text>
                    </Group>
                  );
                })}
              </Stack>

              <Divider my="md" />

              {/* Footer */}
              <Group justify="space-between">
                <Text size="sm" c="dimmed">
                  Order Total
                </Text>

                <Text fw={600}>${Number(order.total_price).toFixed(2)}</Text>
              </Group>
            </Card>
          ))
        )}
      </div>
    </Container>
  );
};
