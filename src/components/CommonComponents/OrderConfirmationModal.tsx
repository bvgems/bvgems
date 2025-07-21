import {
  Modal,
  Title,
  Text,
  Button,
  Center,
  Stack,
  Group,
} from "@mantine/core";
import { IconCheck } from "@tabler/icons-react";

export default function OrderConfirmationModal({
  opened,
  close,
}: {
  opened: boolean;
  close: () => void;
}) {
  return (
    <Modal
      opened={opened}
      onClose={close}
      withCloseButton={false}
      centered
      size="md"
      overlayProps={{
        blur: 4,
        backgroundOpacity: 0.5,
      }}
      transitionProps={{ transition: "slide-up", duration: 300 }}
      radius="lg"
    >
      <Stack align="center">
        <Center w={60} h={60} bg="green.1" style={{ borderRadius: "50%" }}>
          <IconCheck size={32} color="green" />
        </Center>

        <Title order={3} ta="center" fw={600}>
          Order Confirmed!
        </Title>

        <Text c="dimmed" ta="center">
          Thank you for your purchase. We've received your order and will begin
          processing it shortly.
        </Text>

        <Group justify="center" mt="sm">
          <Button variant="light" color="green" onClick={close}>
            Close
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}
