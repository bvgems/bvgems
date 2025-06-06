import { useEffect, useRef, useState } from "react";
import {
  IconCircleCheck,
  IconUser,
  IconBrandAuth0,
  IconTruck,
  IconUserShare,
  IconBellDollar,
  IconArrowLeft,
} from "@tabler/icons-react";
import { Button, Container, Stepper } from "@mantine/core";
import { SignupForm } from "../Auth/SignupForm";
import { BusinessVerification } from "../Business/BusinessVerification";
import { notifications } from "@mantine/notifications";
import { ShippingAddressForm } from "../ShippingAddress/ShippingAddressForm";
import { BusinessReferenceForm } from "../Business/BusinessReferenceForm";
import { AMLInfo } from "../AML/AMLInfo";

export const StepperComponent = () => {
  const [active, setActive] = useState(1);
  const prevStep = () =>
    setActive((current) => (current > 0 ? current - 1 : current));
  const nextStep = () =>
    setActive((current) =>
      current < stepperItems?.length ? current + 1 : current
    );
  const hasShownNotification = useRef(false);

  useEffect(() => {
    if (!hasShownNotification.current) {
      notifications.show({
        title: "Welcome!",
        position: "top-right",
        message: "Please complete each step to apply for an account.",
        color: "violet",
        autoClose: 3000,
      });
      hasShownNotification.current = true;
    }
  }, []);

  const stepperItems = [
    {
      icon: <IconUser />,
      label: "Personal Information",
      content: <SignupForm isStepper={true} nextStep={nextStep} />,
    },
    {
      icon: <IconBrandAuth0 />,
      label: "Business Verification",
      content: <BusinessVerification isStepper={true} nextStep={nextStep} />,
    },
    {
      icon: <IconTruck />,
      label: "Shipping Address",
      content: <ShippingAddressForm isStepper={true} nextStep={nextStep} />,
    },
    {
      icon: <IconUserShare />,
      label: "Business References",
      content: <BusinessReferenceForm isStepper={true} nextStep={nextStep} />,
    },
    {
      icon: <IconBellDollar />,
      label: "AML Information",
      content: <AMLInfo isStepper={true} />,
    },
  ];

  return (
    <Container size={"xl"} className="mt-6">
      <Stepper
        allowNextStepsSelect={false}
        color="violet"
        size="sm"
        active={active}
        onStepClick={setActive}
        completedIcon={<IconCircleCheck size={18} />}
      >
        {stepperItems.map((item, index) => (
          <Stepper.Step key={index} icon={item.icon} label={item.label}>
            {item.content}
          </Stepper.Step>
        ))}
      </Stepper>

      <Button
        leftSection={<IconArrowLeft size={"15"} />}
        onClick={prevStep}
        className="mt-9 mb-8 ml-5"
        size="xs"
        variant="light"
        color="violet"
        disabled={active === 0}
      >
        Previous
      </Button>
    </Container>
  );
};
