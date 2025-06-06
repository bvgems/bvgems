import React from "react";
import { BusinessVerificationForm } from "./BusinessVerificationForm";

export const BusinessVerification = ({ isStepper, nextStep }: any) => {
  return <BusinessVerificationForm isStepper={isStepper} nextStep={nextStep} />;
};
