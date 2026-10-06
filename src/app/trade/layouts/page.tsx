import React from "react";
import ColorStoneLayouts from "@/app/colorstone-layouts/page";
import { PageHeader } from "@/components/CommonComponents/PageHeader";

export const metadata = {
  title: "Colorstone Layouts - Wholesale | B.V. Gems",
  description: "Expertly matched gemstone layouts for your custom jewelry designs.",
};

export default function TradeLayoutsPage() {
  return (
    <div className="w-full">
      <PageHeader 
        title="Colorstone Layouts" 
        subtitle="Expertly matched wholesale gemstone layouts for bespoke and production jewelry." 
      />
      <ColorStoneLayouts />
    </div>
  );
}
