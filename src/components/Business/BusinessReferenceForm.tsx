"use client";
import { Button, Group, Textarea, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";
import { useEffect } from "react";
import { upsertBusinessReference } from "@/apis/api";
import { PhoneNumberInput } from "../CommonComponents/PhoneInput";
import { useStpperStore } from "@/store/useStepperStore";
import { isValidPhoneNumber } from "react-phone-number-input";

export const BusinessReferenceForm = ({
  userId,
  referenceData,
  onSuccess,
  isStepper,
  nextStep,
}: {
  userId?: string;
  referenceData?: any;
  onSuccess?: () => void;
  isStepper?: boolean;
  nextStep?: any;
}) => {
  const isEdit = Boolean(referenceData?.id);
  const { businessReference, setBusinessReference, hasHydrated } =
    useStpperStore();

  const form = useForm({
    initialValues: {
      companyName: "",
      contactPerson: "",
      phoneNumber: "",
      companyAddress: "",
      additionalNotes: "",
    },
    validateInputOnChange: true,
    validate: {
      companyName: (v) => (v.trim() ? null : "Company Name is Required"),
      companyAddress: (v) => (v.trim() ? null : "Company Address is Required"),
      contactPerson: (v) => (v.trim() ? null : "Contact Person is Required"),
      phoneNumber: (value) => {
        if (!value) return "Phone number is required.";
        if (!isValidPhoneNumber(value))
          return "Please enter a valid phone number.";

        return null;
      },
    },
  });

  useEffect(() => {
    if (!hasHydrated) return;

    if (referenceData) {
      form.setValues({
        companyName: referenceData?.company_name || "",
        companyAddress: referenceData?.company_address || "",
        contactPerson: referenceData?.contact_person || "",
        phoneNumber: referenceData?.contact_number || "",
        additionalNotes: referenceData?.additional_notes || "",
      });
    } else if (businessReference) {
      form.setValues({
        companyName: businessReference.companyName || "",
        companyAddress: businessReference.companyAddress || "",
        contactPerson: businessReference.contactPerson || "",
        phoneNumber: businessReference.phoneNumber || "",
        additionalNotes: businessReference.addtionalNotes || "",
      });
    }
  }, [referenceData, businessReference, hasHydrated]);

  if (!hasHydrated) {
    return <div>Loading...</div>;
  }

  const handleSubmit = async (values: typeof form.values) => {
    if (isStepper && form.isValid()) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      setBusinessReference({
        companyName: values.companyName,
        contactPerson: values.contactPerson,
        phoneNumber: values.phoneNumber,
        companyAddress: values.companyAddress,
        addtionalNotes: values.additionalNotes,
      });
      nextStep();
      return;
    }
    const payload = {
      ...(isEdit ? { id: referenceData.id } : { userId: userId }),
      contactPerson: values.contactPerson,
      phoneNumber: values.phoneNumber,
      companyAddress: values.companyAddress,
      companyName: values.companyName,
      additionalNotes: values.additionalNotes,
    };
    const response: any = await upsertBusinessReference(isEdit, payload);
    const result = response.data;
    if (result.flag) {
      notifications.show({
        icon: <IconCheck />,
        message: result.message,
        position: "top-right",
        color: "teal",
      });
      onSuccess?.();
    } else {
      notifications.show({
        icon: <IconX />,
        message: "Save failed",
        position: "top-right",
        color: "red",
      });
    }
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <div className={`flex flex-col gap-4 ${isStepper ? "px-28" : "px-2.5"}`}>
        {isStepper && (
          <div className="flex justify-end mt-5">
            <Button
              type="button"
              onClick={() => {
                console.log("Skip clicked", isStepper);
                try {
                  nextStep();
                } catch (e) {
                  console.error("Skip failed:", e);
                }
              }}
              size="compact-sm"
              variant="transparent"
              color="violet"
            >
              <span className="underline">Skip For Now</span>
            </Button>
          </div>
        )}
        <TextInput
          label="Company Name"
          placeholder="B. V. Gems"
          {...form.getInputProps("companyName")}
        />
        <TextInput
          label="Contact Person"
          placeholder="John Doe"
          {...form.getInputProps("contactPerson")}
        />
        <PhoneNumberInput form={form} />
        <TextInput
          label="Company Address"
          placeholder="123 Main st, NY, NY, 10038"
          {...form.getInputProps("companyAddress")}
        />
        <Textarea
          label="Additional Notes"
          placeholder="Provide additional notes"
          {...form.getInputProps("additionalNotes")}
        />

        <Group mt="md">
          <Button type="submit" color="violet" fullWidth>
            {isEdit
              ? "Update Reference"
              : `${isStepper ? "Save and Continue" : "Save Reference"}`}
          </Button>
        </Group>
      </div>
    </form>
  );
};
