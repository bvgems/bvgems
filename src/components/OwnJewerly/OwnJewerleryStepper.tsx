"use client";
import { Divider, Stepper, StepperStep } from "@mantine/core";
import { IconDiamond, IconEyeCheck, IconRings } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { SelectGemstone } from "./SelectGemstone";
import { SelectSetting } from "./SelectSetting";

export const OwnJewerleryStepper = ({ category, type }: any) => {
  const initialStep = type === "start-with-setting" ? 0 : 0;

  const [active, setActive] = useState(initialStep);

  const nextStep = () =>
    setActive((current) => (current < 2 ? current + 1 : current));
  const prevStep = () =>
    setActive((current) => (current > 0 ? current - 1 : current));

  const steps =
    type === "start-with-gemstone"
      ? [
          {
            icon: <IconDiamond />,
            label: "SELECT GEMSTONE",
            content: <SelectGemstone category={category} />,
          },
          {
            icon: <IconRings />,
            label: "SELECT SETTING",
            content: <SelectSetting category={category} />,
          },
        ]
      : [
          {
            icon: <IconRings />,
            label: "SELECT SETTING",
            content: <SelectSetting category={category} />,
          },
          {
            icon: <IconDiamond />,
            label: "SELECT GEMSTONE",
            content: <SelectGemstone category={category} />,
          },
        ];

  return (
    <div className="mt-5 px-12">
      <Stepper
        size="lg"
        color="#6a7282"
        active={active}
        onStepClick={setActive}
      >
        {steps.map((step, index) => (
          <StepperStep key={index} icon={step.icon} label={step.label}>
            <Divider className="mb-4" />
            {step.content}
          </StepperStep>
        ))}

        <StepperStep icon={<IconEyeCheck />} label="REVIEW YOUR PRODUCT">
          <Divider className="mb-4" />
        </StepperStep>
      </Stepper>
    </div>
  );
};
