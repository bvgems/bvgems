import { Button, Loader, PasswordInput, TextInput } from "@mantine/core";
import Link from "next/link";
import { useForm } from "@mantine/form";
import { useEffect, useState } from "react";
import { IconArrowRight } from "@tabler/icons-react";
import { PhoneNumberInput } from "../CommonComponents/PhoneInput";
import { useRouter } from "next/navigation";
import { useStpperStore } from "@/store/useStepperStore";
import { isValidPhoneNumber } from "react-phone-number-input";
import { useDebouncedValue } from "@mantine/hooks";
import { handleEmailExists } from "@/apis/api";

export const SignupForm = ({
  onClose,
  isStepper,
  nextStep,
}: {
  onClose?: () => void;
  isStepper?: boolean;
  nextStep?: any;
}) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { stepperUser, setStepperUser, hasHydrated } = useStpperStore();

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
      email: (value) => {
        if (!value) return "Email is required";
        if (!/^\S+@\S+\.\S+$/.test(value)) return "Invalid email address";
        if (emailChecked && emailExists) return "Email already registered";
        return null;
      },
      companyName: (value) =>
        value.trim().length > 0 ? null : "Company name is required",
      phoneNumber: (value) => {
        if (!value) return "Phone number is required.";
        if (!isValidPhoneNumber(value))
          return "Please enter a valid phone number.";

        return null;
      },
      password: (value) =>
        value.trim().length >= 6
          ? null
          : "Password must be at least 6 characters",
      confirmPassword: (value, values) =>
        value === values.password ? null : "Passwords do not match",
    },
  });

  const [emailChecked, setEmailChecked] = useState(false);
  const [emailExists, setEmailExists] = useState(false);
  const [debouncedEmail] = useDebouncedValue(form.values.email, 400);
  useEffect(() => {
    const checkEmail = async () => {
      if (!debouncedEmail || !/^\S+@\S+\.\S+$/.test(debouncedEmail)) {
        setEmailChecked(false);
        return;
      }

      const data = await handleEmailExists(debouncedEmail);
      setEmailExists(data.exists);
      setEmailChecked(true);
    };

    checkEmail();
  }, [debouncedEmail]);
  useEffect(() => {
    if (emailChecked) {
      form.validateField("email");
    }
  }, [emailChecked, emailExists]);

  useEffect(() => {
    if (!hasHydrated) return;

    if (isStepper && stepperUser) {
      form.setValues({
        firstName: stepperUser.firstName || "",
        lastName: stepperUser.lastName || "",
        email: stepperUser.email || "",
        companyName: stepperUser.companyName || "",
        phoneNumber: stepperUser.phoneNumber || "",
        password: stepperUser.password || "",
        confirmPassword: stepperUser.password || "",
      });
    }
  }, [isStepper, stepperUser, hasHydrated]);

  if (!hasHydrated) {
    return <div>Loading...</div>;
  }

  const handleSubmit = async (values: any) => {
    if (isStepper) {
      setStepperUser({
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        companyName: values.companyName,
        phoneNumber: values.phoneNumber,
        password: values.password,
      });
      nextStep();
      return;
    }
    setLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 300));

    setStepperUser({
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      companyName: values.companyName,
      phoneNumber: values.phoneNumber,
      password: values.password,
    });
    setLoading(false);
    onClose?.();
    router.push("/apply-account");
  };

  return (
    <>
      {isStepper ? <h1 className="text-center mt-5 text-2xl">Personal Information</h1> : null}
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <div>
          <div
            className={`mt-5 mb-4 flex flex-col gap-4 ${
              isStepper ? "px-5 sm:px-8 lg:px-28" : "px-3"
            }`}
          >
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
              label={
                <div className="flex items-center gap-2">
                  <span>Enter Email Address</span>
                  {!emailChecked && debouncedEmail && (
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-gray-500">Checking...</span>
                      <div className="scale-[0.6]">
                        <Loader size="xs" color="gray" />
                      </div>
                    </div>
                  )}
                </div>
              }
              placeholder="your email address"
              {...form.getInputProps("email")}
            />

            <TextInput
              label="Enter Your Company Name"
              placeholder="your company name"
              {...form.getInputProps("companyName")}
            />
            <PhoneNumberInput form={form} />
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
              <Button
                disabled={emailChecked && emailExists}
                rightSection={<IconArrowRight />}
                type="submit"
                color="#0b182d"
                loading={loading}
              >
                Save and Continue
              </Button>
              <Link
                className="text-[0b182d] text-[0.90rem] flex justify-center font-medium mt-3"
                href="/login"
              >
                Already have an account? SIGN IN
              </Link>
            </div>
          </div>
        </div>
      </form>
    </>
  );
};
