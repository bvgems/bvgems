"use client";
import { useEffect, useState } from "react";
import {
  TextInput,
  Button,
  Select,
  Group,
  Container,
  Title,
  Checkbox,
  Textarea,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";
import { useForm } from "@mantine/form";
import { useUserStore } from "@/store/useUserStore";
import { editAMLInfo, getAMLInfo } from "@/apis/api";
import { AML_OPTIONS, COUNTRY_OPTIONS } from "@/utils/constants";

export const AMLInfo = () => {
  const { user }: any = useUserStore();
  const [isLoading, setIsLoading] = useState(false);
  const [initialData, setInitialData] = useState<any>({});

  const form = useForm({
    initialValues: {
      bankName: "",
      bankAccount: "",
      bankAddress: "",
      primaryContact: "",
      country: "",
      state: "",
      city: "",
      zipCode: "",
      phone: "",
      amlStatus: "",
      amlOther: "",
      confirmed: false,
    },
    validateInputOnChange: true,
    validate: {
      bankName: (v) => (v.trim() ? null : "Bank name is required"),
      bankAccount: (v) =>
        /^\d{8,17}$/.test(v)
          ? null
          : "Bank account must be 8-17 digits (U.S. standard)",
      bankAddress: (v) => (v.trim() ? null : "Bank address is required"),
      primaryContact: (v) => (v.trim() ? null : "Primary contact is required"),
      country: (v) => (v.trim() ? null : "Country is required"),
      state: (v) => (v.trim() ? null : "State is required"),
      city: (v) => (v.trim() ? null : "City is required"),
      zipCode: (v) => (/^\d{5}(-\d{4})?$/.test(v) ? null : "Invalid ZIP code"),
      phone: (v) =>
        /^\d{10}$/.test(v.replace(/\D/g, ""))
          ? null
          : "Phone must be 10 digits",
      confirmed: (v) => (v ? null : "Confirmation is required"),
    },
  });

  useEffect(() => {
    const fetchAMLInfo = async () => {
      if (!user?.id) return;
      const res: any = await getAMLInfo(user.id);
      if (res?.amlInfo) {
        const normalized = {
          bankName: res.amlInfo.bank_name ?? "",
          bankAccount: res.amlInfo.bank_account ?? "",
          bankAddress: res.amlInfo.bank_address ?? "",
          primaryContact: res.amlInfo.primary_contact ?? "",
          country: res.amlInfo.country ?? "",
          state: res.amlInfo.state ?? "",
          city: res.amlInfo.city ?? "",
          zipCode: res.amlInfo.zip_code ?? "",
          phone: res.amlInfo.phone ?? "",
          amlStatus: res.amlInfo.aml_status ?? "",
          amlOther: res.amlInfo.aml_other ?? "",
          confirmed: res.amlInfo.confirmed ?? false,
        };
        form.setValues(normalized);
        setInitialData(normalized);
      }
    };
    fetchAMLInfo();
  }, [user]);

  const handleCheckboxChange = (status: string) => {
    form.setValues({
      amlStatus: status === form.values.amlStatus ? "" : status,
      amlOther: "",
    });
  };

  const handleSubmit = async (values: typeof form.values) => {
    try {
      setIsLoading(true);
      const response: any = await editAMLInfo(user.id, values);
      if (response?.flag) {
        notifications.show({
          icon: <IconCheck />,
          color: "teal",
          message: response.message,
          position: "top-right",
        });
        setInitialData(values);
      } else {
        throw new Error(response?.error || "Submission failed");
      }
    } catch (error: any) {
      notifications.show({
        icon: <IconX />,
        color: "red",
        message: error.message || "An error occurred",
        position: "top-right",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const isFormChanged =
    JSON.stringify(form.values) !== JSON.stringify(initialData);

  return (
    <Container size="xl">
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Title order={3} mb="md">
          AML Information
        </Title>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <TextInput
            label="Bank Name"
            placeholder="Enter your bank's name"
            disabled={isLoading}
            {...form.getInputProps("bankName")}
          />
          <TextInput
            label="Bank Account"
            placeholder="Enter your bank account number"
            disabled={isLoading}
            {...form.getInputProps("bankAccount")}
          />
          <TextInput
            label="Primary Contact"
            placeholder="Full name of primary contact"
            disabled={isLoading}
            {...form.getInputProps("primaryContact")}
          />
          <TextInput
            label="Bank Address"
            placeholder="Address of the bank"
            disabled={isLoading}
            {...form.getInputProps("bankAddress")}
          />
          <Select
            label="Country"
            data={COUNTRY_OPTIONS}
            searchable
            placeholder="Select your country"
            disabled={isLoading}
            {...form.getInputProps("country")}
          />
          <TextInput
            label="State"
            placeholder="Enter your state"
            disabled={isLoading}
            {...form.getInputProps("state")}
          />
          <TextInput
            label="City"
            placeholder="Enter your city"
            disabled={isLoading}
            {...form.getInputProps("city")}
          />
          <TextInput
            label="ZIP Code"
            placeholder="Enter ZIP code"
            disabled={isLoading}
            {...form.getInputProps("zipCode")}
          />
          <TextInput
            label="Phone"
            placeholder="Enter phone number"
            value={form.values.phone}
            onChange={(e) => {
              const raw = e.currentTarget.value.replace(/\D/g, "").slice(0, 10);
              const formatted =
                raw.length <= 3
                  ? raw
                  : raw.length <= 6
                  ? `(${raw.slice(0, 3)}) ${raw.slice(3)}`
                  : `(${raw.slice(0, 3)}) ${raw.slice(3, 6)}-${raw.slice(6)}`;
              form.setFieldValue("phone", formatted);
            }}
            error={form.errors.phone}
            disabled={isLoading}
          />
        </div>

        <Title order={4} mt="xl" mb="sm">
          AML Status
        </Title>
        <div className="flex flex-col gap-2">
          {AML_OPTIONS.map((label, index) => (
            <Checkbox
              key={index}
              label={label}
              checked={form.values.amlStatus === label}
              onChange={() => handleCheckboxChange(label)}
              disabled={isLoading}
            />
          ))}
          <Checkbox
            label="Other"
            checked={form.values.amlStatus === "Other"}
            onChange={() => handleCheckboxChange("Other")}
            disabled={isLoading}
          />
          {form.values.amlStatus === "Other" && (
            <Textarea
              placeholder="Describe your AML status"
              {...form.getInputProps("amlOther")}
              disabled={isLoading}
            />
          )}
        </div>

        <Title order={4} mt="xl" mb="sm">
          Confirmation
        </Title>
        <Checkbox
          label="I confirm that all the stated information is true and correct. If additional documentation is required for verification, I will provide as requested."
          {...form.getInputProps("confirmed", { type: "checkbox" })}
          disabled={isLoading}
        />

        <Group mt="xl">
          <Button
            type="submit"
            color="violet"
            loading={isLoading}
            disabled={!isFormChanged || isLoading}
          >
            Save AML Info
          </Button>
        </Group>
      </form>
    </Container>
  );
};
