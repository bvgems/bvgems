import { CustomerSupportSidebar } from "@/components/CommonComponents/CustomerSupportSidebar";
import React from "react";

export default function CustomerSupportLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex">
      <div className="hidden md:block w-1/4 top-24 h-screen overflow-y-auto">
        <CustomerSupportSidebar />
      </div>

      <div className="w-full md:w-3/4 px-8 py-6">{children}</div>
    </div>
  );
}
