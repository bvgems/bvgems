"use client";
import { Button, Group, Textarea, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";
import { useEffect } from "react";
import { upsertBusinessReference } from "@/apis/api";

export const BusinessReferenceForm = ({
  userId,
  referenceData,
  onSuccess,
}: {
  userId: string;
  referenceData?: any;
  onSuccess: () => void;
}) => {
  const isEdit = Boolean(referenceData?.id);

  const form = useForm({
    initialValues: {
      companyName: "",
      contactPerson: "",
      contactNumber: "",
      companyAddress: "",
      additionalNotes: "",
    },
    validateInputOnChange: true,
    validate: {
      companyName: (v) => (v.trim() ? null : "Company Name is Required"),
      companyAddress: (v) => (v.trim() ? null : "Company Address is Required"),
      contactPerson: (v) => (v.trim() ? null : "Contact Person is Required"),
      contactNumber: (v) =>
        /^\(\d{3}\)\s\d{3}-\d{4}$/.test(v) ? null : "Phone must be 10 digits",
    },
  });

  useEffect(() => {
    if (referenceData) {
      form.setValues({
        companyName: referenceData?.company_name,
        companyAddress: referenceData?.company_address,
        contactPerson: referenceData?.contact_person,
        contactNumber: referenceData?.contact_number,
        additionalNotes: referenceData?.additional_notes,
      });
    }
  }, [referenceData]);

  const handleSubmit = async (values: typeof form.values) => {
    const payload = {
      ...(isEdit ? { id: referenceData.id } : { user_id: userId }),
      contact_person: values.contactPerson,
      contact_number: values.contactNumber,
      company_address: values.companyAddress,
      company_name: values.companyName,
      additional_notes: values.additionalNotes,
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
      onSuccess();
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
      <div className="flex flex-col gap-4 px-2.5">
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
        <TextInput
          label="Contact Number"
          placeholder="(123) 456-7890"
          value={form.values.contactNumber}
          onChange={(e) => {
            const raw = e.currentTarget.value.replace(/\D/g, "").slice(0, 10);
            const formatted =
              raw.length <= 3
                ? raw
                : raw.length <= 6
                ? `(${raw.slice(0, 3)}) ${raw.slice(3)}`
                : `(${raw.slice(0, 3)}) ${raw.slice(3, 6)}-${raw.slice(6)}`;
            form.setFieldValue("contactNumber", formatted);
          }}
          error={form.errors.contactNumber}
          leftSection={
            <span style={{ fontSize: "1.25rem", marginRight: "6px" }}>🇺🇸</span>
          }
        />
        <TextInput
          label="Company Address"
          placeholder="123 Main st, NY, NY, 10038"
          {...form.getInputProps("companyAddress")}
        />
        <Textarea
          label="Additional Notes"
          placeholder="provide additinal notes"
          {...form.getInputProps("additionalNotes")}
        />

        <Group mt="md">
          <Button type="submit" color="violet" fullWidth>
            {isEdit ? "Update Reference" : "Save Reference"}
          </Button>
        </Group>
      </div>
    </form>
  );
};
