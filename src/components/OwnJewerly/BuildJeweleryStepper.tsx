import { Stepper, StepperStep } from "@mantine/core";
import React, { useState } from "react";
import { Grid, GridCol } from "@mantine/core";
import { JeweleryFilter } from "../CommonComponents/JeweleryFilter";

export const BuildJeweleryStepper = () => {
  const [active, setActive] = useState(0);

  const stepperSteps = [
    {
      label: "Choose Jewelry",
      description: "Bracelet or necklace",
      content: <JeweleryFilter  />,
    },
    {
      label: "Choose Gold Color",
      description: "All in 14k gold",
      content: <div>Gold Color Selector</div>,
    },
    {
      label: "Choose Length",
      description: "Pick the chain length",
      content: <div>Length Selector</div>,
    },
    {
      label: "Choose Shape",
      description: "Select stone shape",
      content: <div>Shape Selector</div>,
    },
    {
      label: "Choose Stone Size",
      description: "Pick stone size",
      content: <div>Stone Size Selector</div>,
    },
    {
      label: "Choose Gemstone",
      description: "Select your gemstone",
      content: <div>Gemstone Selector</div>,
    },
    {
      label: "Choose Color",
      description: "Pick stone color",
      content: <div>Color Selector</div>,
    },
    {
      label: "Choose Pattern",
      description: "Straight or ombre layout",
      content: <div>Pattern Selector</div>,
    },
  ];

  return (
    <div>
      <Stepper
        orientation="vertical"
        active={active}
        onStepClick={setActive}
        color="gray"
        size="md"
      >
        {stepperSteps.map((step, index) => (
          <Grid>
            <GridCol span={{ base: 12, md: 6 }}>
              <Stepper.Step
                key={index}
                label={step.label}
                description={step.description}
              />
            </GridCol>
            <GridCol span={{ base: 12, md: 6 }}>
              {stepperSteps[active]?.content}
            </GridCol>
          </Grid>
        ))}
      </Stepper>
    </div>
  );
};
