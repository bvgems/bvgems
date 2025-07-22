"use client";
import * as React from "react";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import StepContent from "@mui/material/StepContent";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { Button } from "@mantine/core";
import { styled } from "@mui/material/styles";
import { ShippingAddress } from "../ShippingAddress/ShipppingAddress";
import { DeliveryMethod } from "./DeliveryMethod";
import { PaymentMethod } from "./PaymentMethod";
import { CustomerDetails } from "./CustomerDetails";
import { useGuestUserStore } from "@/store/useGuestUserStore";
import { useAuth } from "@/hooks/useAuth";

const CustomStepLabel = styled(StepLabel)(() => ({
  "& .MuiStepLabel-label": {
    color: "#0b182d",
    fontSize: "1.1rem",
  },
  "& .MuiStepIcon-root": {
    color: "#6C7481",
  },
  "& .MuiStepIcon-root.Mui-active": {
    color: "#0b182d",
  },
  "& .MuiStepIcon-root.Mui-completed": {
    color: "#388e3c",
  },
}));

export const CheckoutStepper = ({
  selectedShippingAddress,
  setSelectedShippingAddress,
  paymentMethod,
  setPaymentMethod,
  deliveryMethod,
  setDeliveryMethod,
}: any) => {
  const { user } = useAuth();
  const { setGuestUser } = useGuestUserStore();
  const [activeStep, setActiveStep] = React.useState(0);
  const [isFormValid, setIsFormValid] = React.useState(false);
  const [initialValues, setInititalValues] = React.useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
  });

  const steps = React.useMemo(() => {
    const result = [
      {
        label: "Delivery Method",
        content: (
          <DeliveryMethod
            deliveryMethod={deliveryMethod}
            setDeliveryMethod={setDeliveryMethod}
          />
        ),
      },
    ];
    if (!user) {
      result?.push({
        label: "Customer Details",
        content: (
          <CustomerDetails
            setIsFormValid={setIsFormValid}
            initialValues={initialValues}
            setInitialValues={setInititalValues}
          />
        ),
      });
    }

    if (deliveryMethod === "delivery") {
      result.push({
        label: "Select Shipping Address",
        content: (
          <ShippingAddress
            selectable={true}
            onSelect={(address) => {
              setSelectedShippingAddress({
                fullName: address.full_name,
                addressLine1: address.address_line1,
                addressLine2: address.address_line2,
                city: address.city,
                state: address.state,
                country: address.country,
                zipCode: address.zip_code,
                phoneNumber: address.phone_number,
                email: address.email,
              });
            }}
          />
        ),
      });
    }

    result.push({
      label: "Choose Payment Method",
      content: (
        <PaymentMethod
          deliveryMethod={deliveryMethod}
          paymentMethod={paymentMethod}
          setPaymentMethod={setPaymentMethod}
        />
      ),
    });

    return result;
  }, [deliveryMethod, user]);

  const handleNext = (index: number) => {
    console.log("in", index);
    if (index === 1) {
      setGuestUser(initialValues);
    }
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  const isDisabled = (index: any) => {
    if (index === 0 && !deliveryMethod) {
      return true;
    } else if (index === 1) {
      if (!isFormValid && !user) {
        return true;
      }
    } else if (index === 2 && !user) {
      if (!selectedShippingAddress) {
        return true;
      }
    }
  };

  return (
    <div className="pt-10 px-10">
      <Stepper
        activeStep={activeStep}
        orientation="vertical"
        sx={{
          "& .MuiStepConnector-line": {
            borderColor: "#0b182d",
          },
        }}
      >
        {steps.map((step, index) => (
          <Step key={step.label}>
            <CustomStepLabel>{step.label}</CustomStepLabel>
            <StepContent>
              <div>{step.content}</div>
              <div className="flex gap-5 mt-3">
                {index === steps?.length - 1 ? null : (
                  <Button
                    disabled={isDisabled(index)}
                    color="#0b182d"
                    onClick={() => handleNext(index)}
                  >
                    {index === steps.length - 1 ? "FINISH" : "CONTINUE"}
                  </Button>
                )}
                <Button
                  variant="light"
                  color="#0b182d"
                  disabled={index === 0}
                  onClick={handleBack}
                >
                  BACK
                </Button>
              </div>
            </StepContent>
          </Step>
        ))}
      </Stepper>

      {activeStep === steps.length && (
        <Paper square elevation={0} sx={{ p: 3 }}>
          <Typography>All steps completed - you're finished</Typography>
          <Button onClick={handleReset}>Reset</Button>
        </Paper>
      )}
    </div>
  );
};
