"use client";

import { Button, PasswordInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useState } from "react";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";
import { handleChangePassword } from "@/apis/api";
import { useUserStore } from "@/store/useUserStore";

export const ChangePasswordForm = ({ onClose }: { onClose?: () => void }) => {
  const [loading, setLoading] = useState(false);
  const { user } = useUserStore();

  const form = useForm({
    initialValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    validateInputOnChange: true,
    validate: {
      oldPassword: (value) =>
        value.trim().length > 0 ? null : "Old password is required",
      newPassword: (value) =>
        value.trim().length >= 6
          ? null
          : "New password must be at least 6 characters",
      confirmPassword: (value, values) =>
        value === values.newPassword ? null : "Passwords do not match",
    },
  });

  const handleSubmit = async (values: typeof form.values) => {
    setLoading(true);

    const payload = {
      id: user?.id || "",
      oldPassword: values.oldPassword,
      newPassword: values.newPassword,
    };

    try {
      const res = await handleChangePassword(payload);
      if (res?.flag) {
        notifications.show({
          icon: <IconCheck />,
          color: "teal",
          message: res.message || "Password changed successfully",
          position: "top-right",
        });
        form.reset();
        onClose?.();
      } else {
        notifications.show({
          icon: <IconX />,
          color: "red",
          message: res?.error || "Failed to change password",
          position: "top-right",
        });
      }
    } catch (err) {
      notifications.show({
        icon: <IconX />,
        color: "red",
        message: "An error occurred. Try again later.",
        position: "top-right",
      });
    }

    setLoading(false);
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <div className="flex flex-col gap-4 px-3 pb-5">
        <PasswordInput
          label="Old Password"
          placeholder="Enter current password"
          {...form.getInputProps("oldPassword")}
        />
        <PasswordInput
          label="New Password"
          placeholder="Enter new password"
          {...form.getInputProps("newPassword")}
        />
        <PasswordInput
          label="Confirm New Password"
          placeholder="Re-enter new password"
          {...form.getInputProps("confirmPassword")}
        />
        <Button type="submit" color="violet" loading={loading}>
          Change Password
        </Button>
      </div>
    </form>
  );
};
