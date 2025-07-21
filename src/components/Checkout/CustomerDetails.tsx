import { TextInput } from "@mantine/core";
import { PhoneNumberInput } from "../CommonComponents/PhoneInput";
import { useForm } from "@mantine/form";
import { isValidPhoneNumber } from "react-phone-number-input";
import { useEffect } from "react";

export const CustomerDetails = ({
  setIsFormValid,
  initialValues,
  setInitialValues,
  isStepper,
}: {
  setIsFormValid: any;
  initialValues: any;
  setInitialValues: any;
  isStepper?: boolean;
}) => {
  const form = useForm({
    initialValues: initialValues,
    validateInputOnChange: true,
    validate: {
      firstName: (value) =>
        value.trim().length > 0 ? null : "First name is required",
      lastName: (value) =>
        value.trim().length > 0 ? null : "Last name is required",
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
      phoneNumber: (value) => {
        if (!value) return "Phone number is required.";
        if (!isValidPhoneNumber(value))
          return "Please enter a valid phone number.";

        return null;
      },
    },
  });
  useEffect(() => {
    if (form.isValid()) {
      setInitialValues(form.values);
    }
    setIsFormValid(form.isValid());
  }, [form.values]);
  return (
    <>
      <form>
        <div>
          <div
            className={`mt-5 mb-4 flex flex-col gap-4 ${
              isStepper ? "px-28" : "px-3"
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
              label="Enter Email Address"
              placeholder="your email address"
              {...form.getInputProps("email")}
            />
            <PhoneNumberInput form={form} />
          </div>
        </div>
      </form>
    </>
  );
};
