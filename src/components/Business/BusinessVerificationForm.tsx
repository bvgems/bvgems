import { Button, Select, TextInput } from "@mantine/core";
import Link from "next/link";
import { useForm } from "@mantine/form";
import { useEffect, useState } from "react";
import { IconArrowRight } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useStpperStore } from "@/store/useStepperStore";
import { COUNTRY_OPTIONS } from "@/utils/constants";
import { useUserStore } from "@/store/useUserStore";
import { getBusinessVerification } from "@/apis/api";

export const BusinessVerificationForm = ({
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
  const [verification, setVerification] = useState<any[]>([]);

  const { user }: any = useUserStore();
  const {
    stepperUser,
    businessVerification,
    setBusinessVerification,
    hasHydrated,
  } = useStpperStore();

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
    fetchBusinessVerification();
  }, [user?.id]);

  const fetchBusinessVerification = async () => {
    if (!user?.id) return;
    const res = await getBusinessVerification(user.id);
    const fetched = res?.businessVerification[0];
    if (fetched) {
      setVerification(fetched);
      form.setValues({
        companyName: fetched.company_name || "",
        ownerName: fetched.owner_name || "",
        companyAddress: fetched.company_address || "",
        country: fetched.country || "",
        state: fetched.state || "",
        city: fetched.city || "",
        website: fetched.company_website || "",
      });
    }
  };

  useEffect(() => {
    if (!hasHydrated) return;

    if (!verification) {
      if (stepperUser?.companyName) {
        form.setFieldValue("companyName", stepperUser.companyName);
      }

      if (businessVerification) {
        form.setValues({
          companyName: stepperUser?.companyName || "",
          ownerName: businessVerification.ownerName || "",
          companyAddress: businessVerification.companyAddress || "",
          country: businessVerification.country || "",
          state: businessVerification.state || "",
          city: businessVerification.city || "",
          website: businessVerification.companyWebsite || "",
        });
      }
    }
  }, [stepperUser, businessVerification, hasHydrated, verification]);

  if (!hasHydrated) {
    return <div>Loading...</div>;
  }

  const handleSubmit = async (values: typeof form.values) => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 300));

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

  const isDisabled = !isStepper || loading;

  return (
    <>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <div
          className={`flex flex-col gap-4 ${
            isStepper ? "mt-10 px-28" : "px-3"
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
              disabled={isDisabled}
              {...form.getInputProps("ownerName")}
            />
          </div>

          <TextInput
            label="Enter Company Address"
            placeholder="your company address"
            disabled={isDisabled}
            {...form.getInputProps("companyAddress")}
          />

          <Select
            label="Country"
            data={COUNTRY_OPTIONS}
            searchable
            placeholder="Select your country"
            disabled={isDisabled}
            {...form.getInputProps("country")}
          />

          <div className="flex gap-3">
            <TextInput
              label="Enter State"
              placeholder="your state"
              className="w-full"
              disabled={isDisabled}
              {...form.getInputProps("state")}
            />
            <TextInput
              label="Enter City"
              placeholder="your city"
              className="w-full"
              disabled={isDisabled}
              {...form.getInputProps("city")}
            />
          </div>

          <TextInput
            label="Enter Company Website"
            placeholder="your company website"
            disabled={isDisabled}
            {...form.getInputProps("website")}
          />

          {isStepper ? (
            <>
              <Button
                rightSection={<IconArrowRight />}
                type="submit"
                color="#0b182d"
                loading={loading}
              >
                SAVE AND CONTINUE
              </Button>

              <div className="flex flex-col gap-2">
                <Link
                  className="text-[0b182d] text-[0.90rem] flex justify-center font-medium mt-3"
                  href="/login"
                >
                  Already have an account? SIGN IN
                </Link>
              </div>
            </>
          ) : null}
        </div>
      </form>
    </>
  );
};
