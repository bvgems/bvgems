"use client";
import { useEffect, useRef, useState } from "react";
import {
  IconCircleCheck,
  IconUser,
  IconBrandAuth0,
  IconTruck,
  IconUserShare,
  IconArrowLeft,
} from "@tabler/icons-react";
import { Button, Container, Stepper, Loader } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { SignupForm } from "../Auth/SignupForm";
import { useAuth } from "@/hooks/useAuth";
import { CombinedBusinessVerificationForm } from "../Business/CombinedBusinessVerificationForm";

export const StepperComponent = () => {
  const { user, loading } = useAuth();
  const [active, setActive] = useState(0);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!loading && !isReady) {
      setActive(user ? 1 : 0);
      setIsReady(true);
    }
  }, [user, loading, isReady]);

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
        color: "#0b182d",
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
      content: <CombinedBusinessVerificationForm nextStep={nextStep} />,
    },
  ];

  if (!isReady) {
    return (
      <Container size="xl" className="mt-6 flex justify-center py-20">
        <Loader color="#0b182d" />
      </Container>
    );
  }

  if (user) {
    return (
      <Container size="xl" className="mt-6 text-center py-20">
        <h2 className="text-2xl font-semibold mb-4 text-[#0b182d]">
          Application Already Submitted
        </h2>
        <p className="text-gray-600 mb-6">
          You are already logged in and your wholesale account is active. You do not need to submit another trade application.
        </p>
        <Button onClick={() => window.location.href = "/"} color="#0b182d">
          Return Home
        </Button>
      </Container>
    );
  }

  return (
    <Container size={"xl"} className="mt-6">
      <div className="mb-8 text-center max-w-2xl mx-auto">
        <h2 className="text-2xl font-semibold mb-2 text-[#0b182d]">Apply for Wholesale Access</h2>
        <p className="text-gray-600 text-sm">
          Wholesale access is available for jewelry retailers, designers, manufacturers, and other approved trade businesses. Please have your business registration or resale credentials ready.
        </p>
      </div>
      <Stepper
        allowNextStepsSelect={false}
        color="#0b182d"
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
        color="#0b182d"
        disabled={active === 0}
      >
        Previous
      </Button>
    </Container>
  );
};
