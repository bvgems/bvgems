import { CustomerSupportSidebar } from "@/components/CommonComponents/CustomerSupportSidebar";
import React from "react";

export default function CustomerSupportLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="w-full px-8 py-6">{children}</div>
    </div>
  );
}
