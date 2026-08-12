import AccountApprovalComponent from "@/components/CommonComponents/AccountAproovalComponent";
import React, { Suspense } from "react";

export default function AccountAprooval() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AccountApprovalComponent />
    </Suspense>
  );
}
