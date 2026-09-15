import React from "react";
import { StepperComponent } from "@/components/Stepper/StepperComponent";

export const metadata = {
  title: "Apply for a Trade Account | B.V. Gems",
  description: "Apply for a wholesale trade account with B.V. Gems to access exclusive pricing, our memo program, and bespoke gemstone sourcing.",
};

export default function TradeApplyPage() {
  return (
    <div className="w-full">
      <div className="bg-[#0b182d] text-white py-12 px-6 text-center">
        <h1 className="text-3xl md:text-4xl uppercase tracking-widest font-light mb-4">
          Trade Account Application
        </h1>
        <p className="text-gray-300 font-light max-w-2xl mx-auto">
          Exclusive access for verified jewelry trade professionals. 
          Please complete all steps below to establish your wholesale account.
        </p>
      </div>

      <div className="max-w-6xl mx-auto py-12">
        <StepperComponent />
      </div>
    </div>
  );
}
