"use client";
import { MyOrders } from "@/components/MyOrders/MyOrders";
import { useAuth } from "@/hooks/useAuth";

import { PageHeader } from "@/components/CommonComponents/PageHeader";

export default function MyOrdersPage() {
  const { user } = useAuth();
  console.log("user", user);

  return (
    <div className="w-full">
      <PageHeader 
        title="My Orders" 
        subtitle="View and track your previous purchases." 
      />
      <MyOrders />
    </div>
  );
}
