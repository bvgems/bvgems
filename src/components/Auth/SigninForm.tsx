import { Button, Image, PasswordInput, TextInput } from "@mantine/core";
import Link from "next/link";
import { useForm } from "@mantine/form";
import { useState } from "react";
import { handleSignin } from "@/apis/api";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";
import { useUserStore } from "@/store/useUserStore";

export const SigninForm = ({ onClose }: { onClose: () => void }) => {
  const [loading, setLoading] = useState(false);
  const { setUser } = useUserStore();

  const form = useForm({
    initialValues: {
      email: "",
      password: "",
    },
    validateInputOnChange: true,

    validate: {
      email: (value) =>
        /^\S+@\S+$/.test(value) ? null : "Invalid email address",
      password: (value) =>
        value.trim().length > 0 ? null : "Password is required",
    },
  });

  const handleSubmit = async (values: any) => {
    setLoading(true);

    const payload = {
      email: values.email,
      password: values.password,
    };

    const signinResponse = await handleSignin(payload);
    console.log("response", signinResponse);
    if (signinResponse?.flag) {
      notifications.show({
        icon: <IconCheck />,
        color: "teal",
        message: "Welcome Back " + signinResponse?.user?.firstName + " !",
        position: "top-right",
        autoClose: 4000,
      });

      setUser(signinResponse.user);
      form.reset();
      onClose();
    } else {
      notifications.show({
        icon: <IconX />,
        color: "red",
        message: signinResponse?.error,
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
          <TextInput
            label="Enter Email Address"
            placeholder="your email address"
            {...form.getInputProps("email")}
          />
          <PasswordInput
            label="Enter Your Password"
            placeholder="your password"
            {...form.getInputProps("password")}
          />
          <div className="flex flex-col gap-2">
            <Link
              className="text-violet-800 text-[0.90rem] font-medium flex justify-end"
              href="#"
            >
              Forgot Password?
            </Link>

            <Button type="submit" color="violet" loading={loading}>
              Sign In
            </Button>
            <Link
              className="text-violet-800 text-[0.90rem] flex justify-center font-medium mt-3"
              href="#"
            >
              Don't have an account? SIGN UP
            </Link>
          </div>
          <div className="flex justify-center text-gray-400">Or</div>
          <div className="flex gap-4 justify-center">
            <Image src="/assets/google.png" h="44" w="40" />
            <Image src="/assets/facebook.png" h="40" w="40" />
            <Image src="/assets/apple.png" h="40" w="40" />
          </div>
        </div>
      </div>
    </form>
  );
};
