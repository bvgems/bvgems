"use client";

import { useAuth } from "@/hooks/useAuth";
import { getCartStore } from "@/store/useCartStore";
import { Divider } from "@mantine/core";
import React, { useMemo, useState, useEffect } from "react";

export const BillingSummary = () => {
  const { user } = useAuth();
  const cartStore = useMemo(
    () => getCartStore(user?.id || "guest"),
    [user?.id]
  );
  const totalPrices = cartStore((state: any) => state.cartTotal); // NEW: read stored total

  const [hasMounted, setHasMounted] = useState(false);
  useEffect(() => setHasMounted(true), []);

  if (!hasMounted) return null;

  return (
    <div className="mt-5 bg-[#f1f1f1] p-6">
      <div className="flex flex-row justify-between">
        <span>Subtotal:</span>
        <span className="font-semibold">${totalPrices.toFixed(2)}</span>
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
        <span>Grand Total:</span>
        <span className="font-semibold">${totalPrices.toFixed(2)}</span>
      </div>
    </div>
  );
};
