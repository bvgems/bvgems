"use client";
import { useAuth } from "@/hooks/useAuth";
import { getCartStore } from "@/store/useCartStore";
import { Divider } from "@mantine/core";
import React, { useEffect, useMemo, useState } from "react";

export const BillingSummary = () => {
  const { user } = useAuth();
  const cartStore = useMemo(
    () => getCartStore(user?.id || "guest"),
    [user?.id]
  );
  const getTotalPrice = cartStore((state: any) => state.getTotalPrice);

  const [hasMounted, setHasMounted] = useState(false);
  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) return null;

  return (
    <div className="mt-5 bg-[#f1f1f1] p-6">
      <div className="flex flex-row justify-between">
        <span>Subtotal:</span>
        <span className="font-semibold">${getTotalPrice().toFixed(2)}</span>
      </div>
      <Divider my="sm" />
      <div className="flex flex-row justify-between">
        <span>Sales Tax:</span>
        <span className="font-semibold">+ $0</span>
      </div>
      <Divider my="sm" />
      <div className="flex flex-row justify-between">
        <span>Discount:</span>
        <span className="font-semibold">- $0</span>
      </div>
      <Divider my="sm" />
      <div className="flex flex-row justify-between">
        <span>Shipping:</span>
        <span className="font-semibold">Free</span>
      </div>
      <Divider my="sm" />
      <div className="flex flex-row justify-between text-lg text-[#0b182d] font-semibold">
        <span className="">Grand Total:</span>
        <span className="font-semibold">${getTotalPrice().toFixed(2)}</span>
      </div>
    </div>
  );
};
