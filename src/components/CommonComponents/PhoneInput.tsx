import { TextInput } from "@mantine/core";
import React from "react";

export const PhoneInput = ({ form }: any) => {
  return (
    <TextInput
      label="Phone Number"
      placeholder="(123) 456-7890"
      value={form?.values?.phoneNumber}
      onChange={(e) => {
        const raw = e.currentTarget.value.replace(/\D/g, "").slice(0, 10);
        const formatted =
          raw.length <= 3
            ? raw
            : raw.length <= 6
            ? `(${raw.slice(0, 3)}) ${raw.slice(3)}`
            : `(${raw.slice(0, 3)}) ${raw.slice(3, 6)}-${raw.slice(6)}`;
        form.setFieldValue("phoneNumber", formatted);
      }}
      error={form?.errors?.phoneNumber}
      leftSection={
        <span style={{ fontSize: "1.25rem", marginRight: "6px" }}>🇺🇸</span>
      }
    />
  );
};
