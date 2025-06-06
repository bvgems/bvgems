import { Button, Select, TextInput } from "@mantine/core";
import Link from "next/link";
import { useForm } from "@mantine/form";
import { useEffect, useState } from "react";
import { IconArrowRight } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useStpperStore } from "@/store/useStepperStore";
import { COUNTRY_OPTIONS } from "@/utils/constants";

export const BusinessVerificationForm = ({
  onClose,
  isStepper,
  nextStep,
}: {
  onClose?: () => void;
  isStepper?: boolean;
  nextStep: any;
}) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { stepperUser, setStepperUser, setBusinessVerification } =
    useStpperStore();

  const form = useForm({
    initialValues: {
      companyName: "",
      ownerName: "",
      companyAddress: "",
      country: "",
      state: "",
      city: "",
      website: "",
    },
    validateInputOnChange: true,
    validate: {
      ownerName: (v) => (v.trim() ? null : "Owner name is required"),
      companyAddress: (v) => (v.trim() ? null : "Company address is required"),
      country: (v) => (v ? null : "Country is required"),
      state: (v) => (v.trim() ? null : "State is required"),
      city: (v) => (v.trim() ? null : "City is required"),
    },
  });

  useEffect(() => {
    if (isStepper && stepperUser) {
      form.setFieldValue("companyName", stepperUser.companyName || "");
    }
  }, [isStepper, stepperUser]);

  const handleSubmit = async (values: typeof form.values) => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));

    if (form.isValid()) {
      setBusinessVerification({
        ownerName: values.ownerName,
        companyAddress: values.companyAddress,
        country: values.country,
        state: values.state,
        city: values.city,
        companyWebsite: values.website,
      });
    }

    setLoading(false);
    nextStep();
  };

  return (
    <>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <div
          className={`mt-10 flex flex-col gap-4 ${
            isStepper ? "px-28" : "px-3"
          }`}
        >
          <div className="flex gap-3">
            <TextInput
              disabled
              label="Enter Your Company Name"
              placeholder="your company name"
              className="w-full"
              {...form.getInputProps("companyName")}
            />
            <TextInput
              label="Enter Owner Name"
              placeholder="your owner name"
              className="w-full"
              {...form.getInputProps("ownerName")}
            />
          </div>

          <TextInput
            label="Enter Company Address"
            placeholder="your company address"
            {...form.getInputProps("companyAddress")}
          />

          <Select
            label="Country"
            data={COUNTRY_OPTIONS}
            searchable
            placeholder="Select your country"
            disabled={loading}
            {...form.getInputProps("country")}
          />

          <div className="flex gap-3">
            <TextInput
              label="Enter State"
              placeholder="your state"
              className="w-full"
              {...form.getInputProps("state")}
            />
            <TextInput
              label="Enter City"
              placeholder="your city"
              className="w-full"
              {...form.getInputProps("city")}
            />
          </div>

          <TextInput
            label="Enter Company Website"
            placeholder="your company website"
            {...form.getInputProps("website")}
          />

          <Button
            rightSection={<IconArrowRight />}
            type="submit"
            color="violet"
            loading={loading}
          >
            Save and Continue
          </Button>

          <div className="flex flex-col gap-2">
            <Link
              className="text-violet-800 text-[0.90rem] flex justify-center font-medium mt-3"
              href="/login"
            >
              Already have an account? SIGN IN
            </Link>
          </div>
        </div>
      </form>
    </>
  );
};
