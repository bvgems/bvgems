import { Button, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useState } from "react";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";
import { handleForgotPassword } from "@/apis/api"; // 👈 implement API call here

export const ForgotPasswordForm = ({
  onClose,
  goToSignin,
}: {
  onClose: () => void;
  goToSignin: () => void;
}) => {
  const [loading, setLoading] = useState(false);

  const form = useForm({
    initialValues: { email: "" },
    validate: {
      email: (value) =>
        /^\S+@\S+$/.test(value) ? null : "Invalid email address",
    },
  });

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      const res = await handleForgotPassword(values.email);
      if (res?.data?.success) {
        notifications.show({
          icon: <IconCheck />,
          color: "teal",
          message: res?.data?.message,
          position: "top-right",
        });
        form.reset();
        goToSignin();
      } else {
        notifications.show({
          icon: <IconX />,
          color: "red",
          message: res?.data?.error || "Email not found",
          position: "top-right",
        });
      }
    } catch (e) {
      notifications.show({
        icon: <IconX />,
        color: "red",
        message: "Something went wrong, try again",
        position: "top-right",
      });
    }
    setLoading(false);
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <div className="mt-10 flex flex-col gap-4 px-3">
        <TextInput
          label="Enter your email to reset password"
          placeholder="your email address"
          {...form.getInputProps("email")}
        />
        <Button type="submit" color="#0b182d" loading={loading}>
          Send Reset Link
        </Button>

        <button
          type="button"
          onClick={goToSignin}
          className="text-[#0b182d] text-[0.90rem] flex justify-center font-medium mt-3 cursor-pointer"
        >
          Back to Sign In
        </button>
      </div>
    </form>
  );
};
