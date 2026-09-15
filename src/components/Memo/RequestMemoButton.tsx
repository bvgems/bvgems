"use client";

import { useAuth } from "@/hooks/useAuth";
import { sendMemoRequestEmail } from "@/apis/api";
import { Button } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useUserStore } from "@/store/useUserStore";

export const RequestMemoButton = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleRequestMemo = async () => {
    if (!user) {
      router.push("/login?redirect=/trade/memo-program");
      return;
    }

    if (user.isMemoPurchaseApproved) {
      notifications.show({
        message: "Your account is already approved for memo purchases.",
        color: "blue",
        position: "top-right",
      });
      return;
    }

    if (user.isMemoRequested) {
      notifications.show({
        message: "You have already submitted a memo request. Please wait for approval.",
        color: "blue",
        position: "top-right",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await sendMemoRequestEmail(user, []);
      if (response?.flag) {
        useUserStore.getState().setUser({ ...user, isMemoRequested: true });
        notifications.show({
          icon: <IconCheck />,
          color: "teal",
          message: response?.message || "Memo request sent successfully!",
          position: "top-right",
          autoClose: 4000,
        });
      } else {
        notifications.show({
          icon: <IconX />,
          color: "red",
          message: response?.error || "Failed to send memo request.",
          position: "top-right",
          autoClose: 4000,
        });
      }
    } catch (error) {
      notifications.show({
        icon: <IconX />,
        color: "red",
        message: "An error occurred.",
        position: "top-right",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handleRequestMemo}
      loading={loading}
      size="xl"
      radius="none"
      className="inline-block px-10 py-4 bg-[#0b182d] text-white uppercase tracking-widest text-sm font-semibold hover:bg-black transition-colors border-0 h-auto"
      style={{ backgroundColor: "#0b182d" }}
    >
      Request Memo Approval
    </Button>
  );
};
