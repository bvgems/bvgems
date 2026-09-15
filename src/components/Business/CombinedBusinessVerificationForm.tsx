"use client";
import { Button, Group, TextInput, Textarea, Checkbox } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useEffect, useState } from "react";
import { IconArrowRight, IconCheck, IconX } from "@tabler/icons-react";
import { useStpperStore } from "@/store/useStepperStore";
import { useUserStore } from "@/store/useUserStore";
import { getBusinessVerification, applyForAccount } from "@/apis/api";
import { AddressAutocomplete } from "../CommonComponents/AddressAutocomplete";
import { PhoneNumberInput } from "../CommonComponents/PhoneInput";
import { isValidPhoneNumber } from "react-phone-number-input";
import { notifications } from "@mantine/notifications";
import { useRouter } from "next/navigation";
import { sendGAEvent } from "@next/third-parties/google";

export const CombinedBusinessVerificationForm = ({
  nextStep,
}: {
  nextStep: () => void;
}) => {
  const [loading, setLoading] = useState(false);
  const [verification, setVerification] = useState<any>(null);
  const [sameAsBusiness, setSameAsBusiness] = useState(false);

  const { user }: any = useUserStore();
  const {
    stepperUser,
    businessVerification,
    setBusinessVerification,
    shippingAddress,
    setShippingAddress,
    businessReference,
    setBusinessReference,
    hasHydrated,
  } = useStpperStore();

  const form = useForm({
    initialValues: {
      // Business Verification
      companyName: "",
      ownerName: "",
      companyAddress: "",
      aptSuite: "",
      country: "",
      state: "",
      city: "",
      zipCode: "",
      website: "",
      einNumber: "",

      // Shipping Address
      shipFullName: "",
      shipAddressLine1: "",
      shipAddressLine2: "",
      shipCity: "",
      shipState: "",
      shipZipCode: "",
      shipCountry: "",
      shipPhoneNumber: "",
      shipEmail: "",

      // Business Reference
      refCompanyName: "",
      refContactPerson: "",
      refPhoneNumber: "",
      refCompanyAddress: "",
      refAdditionalNotes: "",
    },
    validateInputOnChange: true,
    validate: {
      // Business Verification Validation
      ownerName: (v) => (v.trim() ? null : "Owner name is required"),
      companyAddress: (v) => (v.trim() ? null : "Company address is required"),
      country: (v) => (v ? null : "Country is required"),
      state: (v) => (v.trim() ? null : "State is required"),
      city: (v) => (v.trim() ? null : "City is required"),
      zipCode: (value) => {
        if (!value || value.trim().length < 3) return "Postal code is too short";
        if (value.length > 10) return "Postal code is too long";
        return null;
      },
      einNumber: (v) => (v.trim() ? null : "EIN/Tax ID is required for verification"),

      // Shipping Address Validation
      shipFullName: (v) => (v.trim() ? null : "Required"),
      shipAddressLine1: (v) => (v.trim() ? null : "Required"),
      shipCity: (v) => (v.trim() ? null : "Required"),
      shipState: (v) => (v.trim() ? null : "Required"),
      shipZipCode: (value) => {
        if (!value || value.trim().length < 3) return "Postal code is too short";
        if (value.length > 10) return "Postal code is too long";
        return null;
      },
      shipEmail: (v) => (/^\S+@\S+\.\S+$/.test(v) ? null : "Invalid email"),
      shipPhoneNumber: (value) => {
        if (!value) return "Phone number is required.";
        if (!isValidPhoneNumber(value)) return "Please enter a valid phone number.";
        return null;
      },

      // Business Reference Validation
      refCompanyName: (v) => (v.trim() ? null : "Company Name is Required"),
      refCompanyAddress: (v) => (v.trim() ? null : "Company Address is Required"),
      refContactPerson: (v) => (v.trim() ? null : "Contact Person is Required"),
      refPhoneNumber: (value) => {
        if (!value) return "Phone number is required.";
        if (!isValidPhoneNumber(value)) return "Please enter a valid phone number.";
        return null;
      },
    },
  });

  // Fetch Business Verification from DB if user is logged in
  useEffect(() => {
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
          aptSuite: fetched.apt_suite || "",
          country: fetched.country || "",
          state: fetched.state || "",
          city: fetched.city || "",
          zipCode: fetched.zip_code || "",
          website: fetched.company_website || "",
          einNumber: fetched.ein_number || "",
        });
      }
    };
    fetchBusinessVerification();
  }, [user?.id]);

  // Hydrate from Stepper Store
  useEffect(() => {
    if (!hasHydrated) return;

    const valuesToSet: any = {};

    // 1. Business Verification
    if (!verification) {
      if (stepperUser?.companyName && !businessVerification) {
        valuesToSet.companyName = stepperUser.companyName;
      }
      if (businessVerification) {
        valuesToSet.companyName = stepperUser?.companyName || "";
        valuesToSet.ownerName = businessVerification.ownerName || "";
        valuesToSet.companyAddress = businessVerification.companyAddress || "";
        valuesToSet.aptSuite = businessVerification.aptSuite || "";
        valuesToSet.country = businessVerification.country || "";
        valuesToSet.state = businessVerification.state || "";
        valuesToSet.city = businessVerification.city || "";
        valuesToSet.zipCode = businessVerification.zipCode || "";
        valuesToSet.website = businessVerification.companyWebsite || "";
        valuesToSet.einNumber = businessVerification.einNumber || "";
      }
    }

    // 2. Shipping Address
    if (shippingAddress) {
      valuesToSet.shipFullName = shippingAddress.fullName || "";
      valuesToSet.shipAddressLine1 = shippingAddress.addressLine1 || "";
      valuesToSet.shipAddressLine2 = shippingAddress.addressLine2 || "";
      valuesToSet.shipCity = shippingAddress.city || "";
      valuesToSet.shipState = shippingAddress.state || "";
      valuesToSet.shipZipCode = shippingAddress.zipCode || "";
      valuesToSet.shipCountry = shippingAddress.country || "United States";
      valuesToSet.shipPhoneNumber = shippingAddress.phoneNumber || "";
      valuesToSet.shipEmail = shippingAddress.email || "";
    } else {
      valuesToSet.shipFullName = (stepperUser?.firstName || "") + (stepperUser?.lastName ? " " + stepperUser.lastName : "");
      valuesToSet.shipAddressLine1 = businessVerification?.companyAddress || "";
      valuesToSet.shipAddressLine2 = businessVerification?.aptSuite || "";
      valuesToSet.shipCity = businessVerification?.city || "";
      valuesToSet.shipState = businessVerification?.state || "";
      valuesToSet.shipZipCode = businessVerification?.zipCode || "";
      valuesToSet.shipCountry = businessVerification?.country || "United States";
      valuesToSet.shipPhoneNumber = stepperUser?.phoneNumber || "";
      valuesToSet.shipEmail = stepperUser?.email || "";
    }

    // 3. Business Reference
    if (businessReference) {
      valuesToSet.refCompanyName = businessReference.companyName || "";
      valuesToSet.refCompanyAddress = businessReference.companyAddress || "";
      valuesToSet.refContactPerson = businessReference.contactPerson || "";
      valuesToSet.refPhoneNumber = businessReference.phoneNumber || "";
      valuesToSet.refAdditionalNotes = businessReference.addtionalNotes || "";
    }

    if (Object.keys(valuesToSet).length > 0) {
      form.setValues(valuesToSet);
    }
  }, [hasHydrated, verification, stepperUser, businessVerification, shippingAddress, businessReference]);

  // Uncheck the box if they manually edit the shipping address to differ from business address
  useEffect(() => {
    if (sameAsBusiness) {
      if (
        form.values.shipAddressLine1 !== form.values.companyAddress ||
        form.values.shipAddressLine2 !== form.values.aptSuite ||
        form.values.shipCity !== form.values.city ||
        form.values.shipState !== form.values.state ||
        form.values.shipZipCode !== form.values.zipCode ||
        form.values.shipCountry !== form.values.country
      ) {
        setSameAsBusiness(false);
      }
    }
  }, [
    form.values.shipAddressLine1,
    form.values.shipAddressLine2,
    form.values.shipCity,
    form.values.shipState,
    form.values.shipZipCode,
    form.values.shipCountry,
    form.values.companyAddress,
    form.values.aptSuite,
    form.values.city,
    form.values.state,
    form.values.zipCode,
    form.values.country,
    sameAsBusiness,
  ]);

  if (!hasHydrated) {
    return <div>Loading...</div>;
  }

  const router = useRouter();

  const handleSubmit = async (values: typeof form.values) => {
    setLoading(true);

    if (form.isValid()) {
      const newBusinessVerification = {
        ownerName: values.ownerName,
        companyAddress: values.companyAddress,
        aptSuite: values.aptSuite,
        country: values.country,
        state: values.state,
        city: values.city,
        zipCode: values.zipCode,
        companyWebsite: values.website,
        einNumber: values.einNumber,
      };

      const newShippingAddress = {
        fullName: values.shipFullName,
        addressLine1: values.shipAddressLine1,
        addressLine2: values.shipAddressLine2,
        city: values.shipCity,
        state: values.shipState,
        zipCode: values.shipZipCode,
        country: values.shipCountry,
        phoneNumber: values.shipPhoneNumber,
        email: values.shipEmail,
      };

      const newBusinessReference = {
        companyName: values.refCompanyName,
        contactPerson: values.refContactPerson,
        phoneNumber: values.refPhoneNumber,
        companyAddress: values.refCompanyAddress,
        addtionalNotes: values.refAdditionalNotes,
      };

      setBusinessVerification(newBusinessVerification);
      setShippingAddress(newShippingAddress);
      setBusinessReference(newBusinessReference);

      try {
        const response = await applyForAccount(
          stepperUser,
          newBusinessVerification,
          newShippingAddress,
          newBusinessReference,
          { amlStatus: "" }, // Default empty AML info since step is removed
          user?.id
        );

        if (response?.flag) {
          notifications.show({
            icon: <IconCheck />,
            color: "teal",
            title: response.message,
            message:
              "We're currently reviewing your information and will notify you once your account has been approved. You’ll be able to log in and access your account at that time.",
            position: "top-right",
          });

          useStpperStore.getState().clearStepperUser();
          useStpperStore.getState().clearBusinessVerification();
          useStpperStore.getState().clearShippingAddress();
          useStpperStore.getState().clearBusinessReference();
          useStpperStore.getState().clearAmlInfo();
          useStpperStore.getState().clearDataFlags();
          localStorage.removeItem("user-storage");

          sendGAEvent("event", "trade_application_submitted", { user_id: user?.id });
          router?.push("/");
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
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  };

  const isDisabled = loading;

  return (
    <>
      <h2 className="text-center mt-5 text-2xl mb-8">Business Details & Verification</h2>

      <form onSubmit={form.onSubmit(handleSubmit)}>
        <div className="flex flex-col gap-10 px-5 sm:px-8 lg:px-28">
          
          {/* SECTION 1: BUSINESS VERIFICATION */}
          <div className="flex flex-col gap-4">
            <h3 className="text-xl font-semibold border-b pb-2">Business Verification</h3>
            <div className="flex gap-3">
              <TextInput
                disabled={!!stepperUser?.companyName || isDisabled}
                label="Your Company Name"
                placeholder="your company name"
                className="w-full"
                {...form.getInputProps("companyName")}
              />
              <TextInput
                label="Company's Owner Name"
                placeholder="your owner name"
                className="w-full"
                disabled={isDisabled}
                {...form.getInputProps("ownerName")}
                withAsterisk
              />
            </div>

            <AddressAutocomplete
              value={form.values.companyAddress}
              onChange={(val) => form.setFieldValue("companyAddress", val)}
              error={form.errors.companyAddress}
              onAddressSelect={(components) => {
                form.setValues({
                  ...form.values,
                  companyAddress: components.addressLine1,
                  city: components.city,
                  state: components.state,
                  zipCode: components.zipCode,
                  country: components.country,
                });
              }}
              withAsterisk
            />

            <TextInput
              label="Apt, Suite, etc."
              placeholder="Apt 4B"
              disabled={isDisabled}
              {...form.getInputProps("aptSuite")}
            />

            <TextInput label="Country" {...form.getInputProps("country")} disabled={isDisabled} withAsterisk />

            <div className="flex gap-3">
              <TextInput
                label="Enter State"
                placeholder="your state"
                className="w-1/2"
                disabled={isDisabled}
                {...form.getInputProps("state")}
                withAsterisk
              />
              <TextInput
                label="Enter City"
                placeholder="your city"
                className="w-1/2"
                disabled={isDisabled}
                {...form.getInputProps("city")}
                withAsterisk
              />
            </div>
            
            <TextInput
              label="ZIP Code"
              placeholder="10001"
              disabled={isDisabled}
              {...form.getInputProps("zipCode")}
              withAsterisk
            />

            <div className="flex gap-3">
              <TextInput
                label="Enter Company Website"
                placeholder="your company website"
                className="w-full"
                disabled={isDisabled}
                {...form.getInputProps("website")}
              />
              <TextInput
                label="EIN / Tax ID"
                placeholder="e.g. 12-3456789"
                className="w-full"
                disabled={isDisabled}
                withAsterisk
                {...form.getInputProps("einNumber")}
              />
            </div>
          </div>

          {/* SECTION 2: SHIPPING ADDRESS */}
          <div className="flex flex-col gap-4">
            <h3 className="text-xl font-semibold border-b pb-2">Shipping Address</h3>
            
            <Checkbox
              label="Same as Business Verification Address"
              checked={sameAsBusiness}
              onChange={(event) => {
                const checked = event.currentTarget.checked;
                setSameAsBusiness(checked);
                if (checked) {
                  form.setValues({
                    ...form.values,
                    shipAddressLine1: form.values.companyAddress,
                    shipAddressLine2: form.values.aptSuite,
                    shipCity: form.values.city,
                    shipState: form.values.state,
                    shipZipCode: form.values.zipCode,
                    shipCountry: form.values.country,
                  });
                }
              }}
              className="mt-2 mb-2"
            />

            <TextInput
              label="Full Name"
              placeholder="John Doe"
              disabled={isDisabled}
              {...form.getInputProps("shipFullName")}
              withAsterisk
            />

            <AddressAutocomplete
              value={form.values.shipAddressLine1}
              onChange={(val) => form.setFieldValue("shipAddressLine1", val)}
              error={form.errors.shipAddressLine1}
              onAddressSelect={(components) => {
                form.setValues({
                  ...form.values,
                  shipAddressLine1: components.addressLine1,
                  shipCity: components.city,
                  shipState: components.state,
                  shipZipCode: components.zipCode,
                  shipCountry: components.country,
                });
              }}
              withAsterisk
            />
            <TextInput
              label="Apt, Suite, etc."
              placeholder="Apt 4B"
              disabled={isDisabled}
              {...form.getInputProps("shipAddressLine2")}
            />
            <div className="flex gap-4">
              <TextInput
                className="w-1/2"
                label="City"
                placeholder="New York"
                disabled={isDisabled}
                {...form.getInputProps("shipCity")}
                withAsterisk
              />
              <TextInput
                label="Enter State"
                placeholder="your state"
                className="w-1/2"
                disabled={isDisabled}
                {...form.getInputProps("shipState")}
                withAsterisk
              />
            </div>
            <TextInput
              label="ZIP Code"
              placeholder="10001"
              disabled={isDisabled}
              {...form.getInputProps("shipZipCode")}
              withAsterisk
            />
            <TextInput label="Country" disabled={isDisabled} {...form.getInputProps("shipCountry")} />
            
            <PhoneNumberInput 
              form={{
                ...form,
                errors: { phoneNumber: form.errors.shipPhoneNumber },
                values: { phoneNumber: form.values.shipPhoneNumber },
                setFieldValue: (field: any, val: any) => form.setFieldValue("shipPhoneNumber", val)
              }} 
            />

            <TextInput
              label="Email"
              type="email"
              placeholder="john.doe@example.com"
              disabled={isDisabled}
              {...form.getInputProps("shipEmail")}
              withAsterisk
            />
          </div>

          {/* SECTION 3: BUSINESS REFERENCE */}
          <div className="flex flex-col gap-4">
            <h3 className="text-xl font-semibold border-b pb-2">Business Reference</h3>
            <TextInput
              label="Reference Company Name"
              placeholder="B. V. Gems"
              disabled={isDisabled}
              {...form.getInputProps("refCompanyName")}
              withAsterisk
            />
            <TextInput
              label="Reference Contact Person"
              placeholder="John Doe"
              disabled={isDisabled}
              {...form.getInputProps("refContactPerson")}
              withAsterisk
            />
            
            <PhoneNumberInput 
              form={{
                ...form,
                errors: { phoneNumber: form.errors.refPhoneNumber },
                values: { phoneNumber: form.values.refPhoneNumber },
                setFieldValue: (field: any, val: any) => form.setFieldValue("refPhoneNumber", val)
              }} 
            />

            <TextInput
              label="Reference Company Address"
              placeholder="123 Main st, NY, NY, 10038"
              disabled={isDisabled}
              {...form.getInputProps("refCompanyAddress")}
              withAsterisk
            />
            <Textarea
              label="Additional Notes"
              placeholder="Provide additional notes"
              disabled={isDisabled}
              {...form.getInputProps("refAdditionalNotes")}
            />
          </div>

          <Group mt="md" className="pb-10">
            <Button
              rightSection={<IconArrowRight />}
              type="submit"
              color="#0b182d"
              loading={loading}
              fullWidth
            >
              SUBMIT APPLICATION
            </Button>
          </Group>

        </div>
      </form>
    </>
  );
};
