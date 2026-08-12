"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";
import { useForm } from "@mantine/form";
import { Button, PasswordInput, Paper, Title } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";
import { useState } from "react";
import { resetPassword } from "@/apis/api";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");
  const [loading, setLoading] = useState(false);

  const form = useForm({
    initialValues: {
      password: "",
      confirmPassword: "",
    },
    validateInputOnChange: true,
    validate: {
      password: (value) =>
        value.trim().length >= 6
          ? null
          : "Password must be at least 6 characters long",
      confirmPassword: (value, values) =>
        value === values.password ? null : "Passwords do not match",
    },
  });

  const handleSubmit = async (values: typeof form.values) => {
    if (!token) {
      notifications.show({
        icon: <IconX />,
        color: "red",
        message: "Invalid or missing reset token",
        position: "top-right",
      });
      return;
    }

    setLoading(true);
    try {
      const data = await resetPassword(token, values);

      if (data.success) {
        notifications.show({
          icon: <IconCheck />,
          color: "teal",
          message: "Password reset successfully! Please sign in.",
          position: "top-right",
        });
        router.push("/"); // redirect to sign in page
      } else {
        notifications.show({
          icon: <IconX />,
          color: "red",
          message: data.error || "Failed to reset password",
          position: "top-right",
        });
      }
    } catch (error) {
      notifications.show({
        icon: <IconX />,
        color: "red",
        message: "Something went wrong. Try again later.",
        position: "top-right",
      });
    }
    setLoading(false);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 p-4">
      <Paper
        shadow="md"
        radius="md"
        p="xl"
        withBorder
        className="w-full max-w-md"
      >
        <Title order={2} className="text-center mb-6 text-[#0b182d]">
          Reset Your Password
        </Title>

        <form
          onSubmit={form.onSubmit(handleSubmit)}
          className="flex flex-col gap-4"
        >
          <PasswordInput
            label="New Password"
            placeholder="Enter new password"
            {...form.getInputProps("password")}
          />
          <PasswordInput
            label="Confirm Password"
            placeholder="Re-enter new password"
            {...form.getInputProps("confirmPassword")}
          />

          <Button type="submit" color="#0b182d" loading={loading} fullWidth>
            Reset Password
          </Button>
        </form>
      </Paper>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="flex justify-center items-center min-h-screen bg-gray-50 p-4">Loading...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
