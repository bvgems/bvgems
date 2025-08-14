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
import { applyForAccount, editAMLInfo, getAMLInfo } from "@/apis/api";
import { AML_OPTIONS, COUNTRY_OPTIONS } from "@/utils/constants";
import { PhoneNumberInput } from "../CommonComponents/PhoneInput";
import { useStpperStore } from "@/store/useStepperStore";
import { useRouter } from "next/navigation";
import { isValidPhoneNumber } from "react-phone-number-input";

export const AMLInfo = ({ isStepper }: any) => {
  const router = useRouter();
  const { user }: any = useUserStore();
  const [isLoading, setIsLoading] = useState(false);
  const [initialData, setInitialData] = useState<any>({});
  const {
    stepperUser,
    businessVerification,
    shippingAddress,
    businessReference,
    amlInfo,
    setAmlInfo,
    hasHydrated,
  } = useStpperStore();

  const form = useForm({
    initialValues: {
      amlStatus: "",
    },
    validateInputOnChange: true,
  });

  useEffect(() => {
    if (!hasHydrated) return;

    const fetchAMLInfo = async () => {
      if (amlInfo) {
        form.setValues({
          amlStatus: amlInfo.amlStatus || "",
        });
        setInitialData({
          amlStatus: amlInfo.amlStatus || "",
        });
      } else if (user?.id) {
        const res: any = await getAMLInfo(user.id);
        if (res?.amlInfo) {
          const normalized = {
            amlStatus: res.amlInfo.aml_status ?? "",
            amlOther: res.amlInfo.aml_other ?? "",
          };
          form.setValues(normalized);
          setInitialData(normalized);
        }
      }
    };
    fetchAMLInfo();
  }, [amlInfo, user, hasHydrated]);

  const handleCheckboxChange = (status: string) => {
    form.setValues({
      amlStatus: status === form.values.amlStatus ? "" : status,
    });
  };

  const applyAccount = async (values: any) => {
    try {
      const response = await applyForAccount(
        stepperUser,
        businessVerification,
        shippingAddress,
        businessReference,
        values
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

        setAmlInfo(null);
        useStpperStore.getState().clearStepperUser();
        useStpperStore.getState().clearBusinessVerification();
        useStpperStore.getState().clearShippingAddress();
        useStpperStore.getState().clearBusinessReference();
        useStpperStore.getState().clearAmlInfo();
        useStpperStore.getState().clearDataFlags();
        localStorage.clear();

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
    }
  };

  const handleSubmit = async (values: typeof form.values) => {
    try {
      setIsLoading(true);

      if (isStepper && form.isValid()) {
        await new Promise((resolve) => setTimeout(resolve, 300));
        setAmlInfo(values);
        await applyAccount(values);
        router?.push("/");
      } else if (user?.id) {
        const response = await editAMLInfo(user.id, values);
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

  const redirectToHome = async () => {
    try {
      setIsLoading(true);
      await applyAccount(amlInfo);
      router.push("/");
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

  if (!hasHydrated) {
    return <div>Loading...</div>;
  }

  return (
    <Container mt="xl" size="xl">
      <form
        className={isStepper ? "px-5 sm:px-8 lg:px-28" : ""}
        onSubmit={form.onSubmit(handleSubmit)}
      >
        {!isStepper && (
          <Title order={3} mb="md">
            AML Information
          </Title>
        )}

        {isStepper && (
          <div className="flex justify-end mt-5">
            <Button
              onClick={redirectToHome}
              size="compact-sm"
              variant="transparent"
              color="#0b182d"
            >
              <span className="underline">Skip For Now</span>
            </Button>
          </div>
        )}

        <div className="flex flex-col gap-2 mt-5">
          {AML_OPTIONS.map((label, index) => (
            <Checkbox
              size="md"
              color="#0b182d"
              key={index}
              label={label}
              checked={form.values.amlStatus === label}
              onChange={() => handleCheckboxChange(label)}
              disabled={isLoading}
            />
          ))}
          <Checkbox
            label="Other"
            color="#0b182d"
            checked={form.values.amlStatus === "Other"}
            onChange={() => handleCheckboxChange("Other")}
            disabled={isLoading}
          />
        </div>

        <Group mt="xl">
          <Button
            type="submit"
            color="#0b182d"
            loading={isLoading}
            disabled={!isFormChanged || isLoading}
          >
            SAVE AML INFO
          </Button>
        </Group>
      </form>
    </Container>
  );
};
