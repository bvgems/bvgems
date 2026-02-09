"use client";
import { MyOrders } from "@/components/MyOrders/MyOrders";
import { useAuth } from "@/hooks/useAuth";

export default function MyOrdersPage() {
  const { user } = useAuth();
  console.log("user", user);

  return <MyOrders />;
}
