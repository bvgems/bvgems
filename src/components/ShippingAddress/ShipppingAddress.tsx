"use client";
import {
  Card,
  Text,
  Group,
  Button,
  Stack,
  Modal,
  Paper,
  Title,
} from "@mantine/core";
import {
  IconMapPin,
  IconPhone,
  IconMail,
  IconEdit,
  IconTrash,
  IconCheck,
  IconX,
} from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import { useEffect, useState } from "react";
import { useUserStore } from "@/store/useUserStore";
import { deleteAddress, getShippingAddresses } from "@/apis/api";
import { ShippingAddressForm } from "./ShippingAddressForm";
import { notifications } from "@mantine/notifications";
import { useStpperStore } from "@/store/useStepperStore";

export const ShippingAddress = ({
  selectable = false,
  onSelect,
}: {
  selectable?: boolean;
  onSelect?: (address: any) => void;
}) => {
  const { user }: any = useUserStore();
  const userId = user?.id;
  const { shippingAddress } = useStpperStore();

  const [addresses, setAddresses] = useState<any[]>([]);
  const [editingAddress, setEditingAddress] = useState<any>(null);
  const [modalOpened, { open, close }] = useDisclosure(false);
  const [deleteModalOpened, setDeleteModalOpened] = useState(false);
  const [toDeleteId, setToDeleteId] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const fetchAddresses = async () => {
    if (!user?.id) return;
    const res = await getShippingAddresses(user.id);
    const fetched = res?.shippingAddresses || [];
    setAddresses(fetched);
  };

  useEffect(() => {
    fetchAddresses();
  }, [user?.id]);

  useEffect(() => {
    if (selectable && addresses.length > 0) {
      setSelectedId(addresses[0].id);
      onSelect?.(addresses[0]);
    }
  }, [addresses, selectable]);

  const handleDelete = async () => {
    if (toDeleteId) {
      const response = await deleteAddress(toDeleteId);
      if (response.flag) {
        notifications.show({
          icon: <IconCheck />,
          message: response.message,
          position: "top-right",
          color: "teal",
        });
      } else {
        notifications.show({
          icon: <IconX />,
          message: "Delete failed",
          position: "top-right",
          color: "red",
        });
      }
      setToDeleteId(null);
      setDeleteModalOpened(false);
      fetchAddresses();
    }
  };

  const NoAddress = () => {
    return (
      <Paper p="xl" radius="md" className="text-center">
        <div className="flex justify-center mb-3">
          <IconMapPin size={48} color="red" />
        </div>
        <Title order={3} mb="sm">
          Shipping Address Needed
        </Title>
        <Text c="dimmed" mb="md">
          We need your shipping address to proceed with your order. This helps
          us to ensure timely delivery.
        </Text>
        <Button color="#0b182d" onClick={open}>
          ADD SHIPPING ADDRESS
        </Button>
      </Paper>
    );
  };

  return (
    <div>
      {!userId ? (
        !shippingAddress ? (
          <NoAddress />
        ) : (
          <Card
            withBorder
            radius="md"
            p="lg"
            style={{
              cursor: "pointer",
              marginBottom: "1rem",
              transition: "all 0.2s ease-in-out",
            }}
          >
            <Group justify="space-between" align="flex-start" wrap="nowrap">
              <Group wrap="nowrap">
                <Stack gap={4}>
                  <Group gap={4}>
                    <IconMapPin size={16} />
                    <Text fw={500}>{shippingAddress.fullName}</Text>
                  </Group>
                  <Text size="sm" c="dimmed">
                    {shippingAddress.addressLine1}
                  </Text>
                  {shippingAddress.addressLine2 && (
                    <Text size="sm" c="dimmed">
                      {shippingAddress.addressLine2}
                    </Text>
                  )}
                  <Text size="sm" c="dimmed">
                    {shippingAddress.city}, {shippingAddress.state}{" "}
                    {shippingAddress.zipCode}
                  </Text>
                  <Text size="sm" c="dimmed">
                    {shippingAddress.country}
                  </Text>
                  <Group gap={4}>
                    <IconPhone size={14} />
                    <Text size="sm">{shippingAddress.phoneNumber}</Text>
                  </Group>
                  <Group gap={4}>
                    <IconMail size={14} />
                    <Text size="sm">{shippingAddress.email}</Text>
                  </Group>
                </Stack>
              </Group>
            </Group>
          </Card>
        )
      ) : addresses?.length === 0 ? (
        <NoAddress />
      ) : (
        addresses.map((address) => {
          return (
            <Card
              key={address.id}
              withBorder
              radius="md"
              shadow={selectedId == address.id ? "md" : "sm"}
              p="lg"
              style={{
                cursor: "pointer",
                marginBottom: "1rem",
                transition: "all 0.2s ease-in-out",
                border:
                  selectable && selectedId === address.id
                    ? "2px solid #0b182d"
                    : undefined,
              }}
              onClick={() => {
                if (selectable) {
                  console.log("Selecting address:", address);
                  setSelectedId(address.id);
                  onSelect?.(address);
                }
              }}
            >
              <Group justify="space-between" align="flex-start" wrap="nowrap">
                <Group wrap="nowrap">
                  <Stack gap={4}>
                    <Group gap={4}>
                      <IconMapPin size={16} />
                      <Text fw={500}>{address.full_name}</Text>
                    </Group>
                    <Text size="sm" c="dimmed">
                      {address.address_line1}
                    </Text>
                    {address.address_line2 && (
                      <Text size="sm" c="dimmed">
                        {address.address_line2}
                      </Text>
                    )}
                    <Text size="sm" c="dimmed">
                      {address.city}, {address.state} {address.zip_code}
                    </Text>
                    <Text size="sm" c="dimmed">
                      {address.country}
                    </Text>
                    <Group gap={4}>
                      <IconPhone size={14} />
                      <Text size="sm">{address.phone_number}</Text>
                    </Group>
                    <Group gap={4}>
                      <IconMail size={14} />
                      <Text size="sm">{address.email}</Text>
                    </Group>
                  </Stack>
                </Group>
                {!selectable && (
                  <Stack gap="xs" align="flex-end">
                    <Button
                      variant="light"
                      color="blue"
                      size="xs"
                      leftSection={<IconEdit size={14} />}
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingAddress(address);
                        open();
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="light"
                      color="red"
                      size="xs"
                      leftSection={<IconTrash size={14} />}
                      onClick={(e) => {
                        e.stopPropagation();
                        setToDeleteId(address.id);
                        setDeleteModalOpened(true);
                      }}
                    >
                      Delete
                    </Button>
                  </Stack>
                )}
              </Group>
            </Card>
          );
        })
      )}
      {addresses?.length && !selectable ? (
        <Button
          mt="md"
          color="#0b182d"
          onClick={() => {
            setEditingAddress(null);
            open();
          }}
        >
          ADD NEW ADDRESS
        </Button>
      ) : null}

      <Modal
        opened={modalOpened}
        onClose={close}
        centered
        title={editingAddress ? "Edit Address" : "Add Address"}
      >
        <ShippingAddressForm
          userId={user?.id}
          addressData={editingAddress}
          onSuccess={() => {
            fetchAddresses();
            close();
          }}
        />
      </Modal>

      <Modal
        opened={deleteModalOpened}
        onClose={() => setDeleteModalOpened(false)}
        title="Delete Address"
        centered
      >
        <Text>Are you sure you want to delete this address?</Text>
        <Group mt="md" justify="flex-end">
          <Button variant="default" onClick={() => setDeleteModalOpened(false)}>
            Cancel
          </Button>
          <Button color="red" onClick={handleDelete}>
            Delete
          </Button>
        </Group>
      </Modal>
    </div>
  );
};
