import {
  Button,
  Image,
  Input,
  NumberInput,
  PasswordInput,
  TextInput,
} from "@mantine/core";
import Link from "next/link";
import { useForm } from "@mantine/form";
import { useState } from "react";
import { handleSignup } from "@/apis/api";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";

export const SignupForm = ({ onClose }: { onClose: () => void }) => {
  const [loading, setLoading] = useState(false);

  const form = useForm({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      companyName: "",
      phoneNumber: "",
      password: "",
      confirmPassword: "",
    },
    validateInputOnChange: true,
    validate: {
      firstName: (value) =>
        value.trim().length > 0 ? null : "First name is required",
      lastName: (value) =>
        value.trim().length > 0 ? null : "Last name is required",
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
      companyName: (value) =>
        value.trim().length > 0 ? null : "Company name is required",
      phoneNumber: (value) =>
        /^\(\d{3}\)\s\d{3}-\d{4}$/.test(value)
          ? null
          : "Phone number must be of 10 digits.",

      password: (value) =>
        value.trim().length >= 6
          ? null
          : "Password must be at least 6 characters",
      confirmPassword: (value, values) =>
        value === values.password ? null : "Passwords do not match",
    },
  });

  const handleSubmit = async (values: any) => {
    setLoading(true);

    const payload = {
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      companyName: values.companyName,
      phoneNumber: values.phoneNumber,
      password: values.password,
    };

    const signupResponse = await handleSignup(payload);
    if (signupResponse?.flag) {
      notifications.show({
        icon: <IconCheck />,
        color: "teal",
        message: signupResponse?.message,
        position: "top-right",
        autoClose: 4000,
      });
      form.reset();
      onClose();
    } else {
      notifications.show({
        icon: <IconX />,
        color: "red",
        message: signupResponse?.error,
        position: "top-right",
        autoClose: 4000,
      });
    }
    setLoading(false);
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <div>
        <div className="mt-10 flex flex-col gap-4 px-3">
          <div className="flex justify-between gap-3">
            <TextInput
              label="Enter First Name"
              placeholder="your first name"
              {...form.getInputProps("firstName")}
              className="w-full"
            />
            <TextInput
              label="Enter Last Name"
              placeholder="your last name"
              {...form.getInputProps("lastName")}
              className="w-full"
            />
          </div>
          <TextInput
            label="Enter Email Address"
            placeholder="your email address"
            {...form.getInputProps("email")}
          />
          <TextInput
            label="Enter Your Company Name"
            placeholder="your company name"
            {...form.getInputProps("companyName")}
          />
          <TextInput
            label="Enter Your Phone Number"
            placeholder="(XXX) XXX-XXXX"
            value={form.values.phoneNumber}
            onChange={(event) => {
              const raw = event.currentTarget.value
                .replace(/\D/g, "")
                .slice(0, 10);
              const formatted =
                raw.length <= 3
                  ? raw
                  : raw.length <= 6
                  ? `(${raw.slice(0, 3)}) ${raw.slice(3)}`
                  : `(${raw.slice(0, 3)}) ${raw.slice(3, 6)}-${raw.slice(6)}`;
              form.setFieldValue("phoneNumber", formatted);
            }}
            error={form.errors.phoneNumber}
            leftSection={
              <span style={{ fontSize: "1.25rem", marginRight: "6px" }}>
                🇺🇸
              </span>
            }
          />
          <div className="flex justify-between gap-3">
            <PasswordInput
              label="Set Your Password"
              placeholder="your password"
              {...form.getInputProps("password")}
              className="w-full"
            />
            <PasswordInput
              label="Confirm Your Password"
              placeholder="confirm password"
              {...form.getInputProps("confirmPassword")}
              className="w-full"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Button type="submit" color="violet" loading={loading}>
              Sign Up
            </Button>
            <Link
              className="text-violet-800 text-[0.90rem] flex justify-center font-medium mt-3"
              href="/login"
            >
              Already have an account? SIGN IN
            </Link>
          </div>
          <div className="flex justify-center text-gray-400">
            Or Continue With
          </div>
          <div className="flex gap-4 justify-center">
            <Image src="/assets/google.png" h="44" w="40" alt="Google" />
            <Image src="/assets/facebook.png" h="40" w="40" alt="Facebook" />
            <Image src="/assets/apple.png" h="40" w="40" alt="Apple" />
          </div>
        </div>
      </div>
    </form>
  );
};
