import React from "react";
import { Input } from "@mantine/core";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";

export const PhoneNumberInput = ({ form }: any) => {
  return (
    <Input.Wrapper
      label="Phone Number"
      error={form?.errors?.phoneNumber}
      required
    >
      <PhoneInput
        international
        countryCallingCodeEditable={false}
        defaultCountry="US"
        value={form?.values?.phoneNumber}
        onChange={(value) => {
          form.setFieldValue("phoneNumber", value ?? "");
        }}
        placeholder="(123) 456-7890"
        style={{
          width: "100%",
          padding: "8px",
          borderRadius: "8px",
          border: "1px solid #ced4da",
          fontSize: "16px",
        }}
      />
    </Input.Wrapper>
  );
};
