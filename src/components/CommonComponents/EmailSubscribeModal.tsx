"use client";

import { subscribeEmail } from "@/apis/api";
import {
  Button,
  Checkbox,
  Image,
  Modal,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconMail, IconX } from "@tabler/icons-react";
import { subscribe } from "diagnostics_channel";
import { useEffect, useState } from "react";

export const EmailSubscribeModal = () => {
  const [opened, { open, close }] = useDisclosure(false);
  const [dontShowAgain, setDontShowAgain] = useState(false);
  const [email, setEmail] = useState("");

  useEffect(() => {
    const hidePopup = localStorage.getItem("hideSubscribePopup");
    if (!hidePopup) {
      open();
    }
  }, [open]);

  const handleClose = () => {
    if (dontShowAgain) {
      localStorage.setItem("hideSubscribePopup", "true");
    }
    close();
  };

  const handleSubmit = async () => {
    try {
      const res = await subscribeEmail(email);
      localStorage.setItem("hideSubscribePopup", "true");

      notifications.show({
        icon: <IconCheck />,
        color: "teal",
        message: res?.message,
        position: "top-right",
      });

      // if (res?.flag) {
      //   localStorage.setItem("hideSubscribePopup", "true");
      //   notifications.show({
      //     icon: <IconCheck />,
      //     color: "teal",
      //     message: res?.message,
      //     position: "top-right",
      //   });
      // } else {
      //   notifications.show({
      //     icon: <IconX />,
      //     color: "red",
      //     message: res.error || "An error occurred",
      //     position: "top-right",
      //   });
      // }
      close();
    } catch (err) {
      console.error(err);
      alert("An error occurred. Please try again later.");
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={handleClose}
      withCloseButton
      size="md"
      centered
      padding="lg"
      className="z-[999]"
    >
      <Stack align="center">
        <Image
          src="/assets/banner.png"
          alt="Subscribe Banner"
          height={100}
          fit="cover"
          radius="md"
        />

        <Text size="md">
          Enter your email to get the latest trending products and offers
          updates.
        </Text>

        <TextInput
          leftSection={<IconMail size={16} />}
          placeholder="Your email address"
          value={email}
          onChange={(event) => setEmail(event.currentTarget.value)}
          w="100%"
          radius="md"
          size="md"
        />

        <Button
          variant="outline"
          fullWidth
          size="md"
          color="#0b182d"
          onClick={handleSubmit}
        >
          SUBMIT
        </Button>

        <Checkbox
          label="Don't show this popup again"
          checked={dontShowAgain}
          onChange={(event) => setDontShowAgain(event.currentTarget.checked)}
        />
      </Stack>
    </Modal>
  );
};
