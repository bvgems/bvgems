import AccountApprovalComponent from "@/components/CommonComponents/AccountApprovalComponent";
import React, { Suspense } from "react";

export default function AccountApproval() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AccountApprovalComponent />
    </Suspense>
  );
}
