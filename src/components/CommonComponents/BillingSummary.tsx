"use client";
import { useAuth } from "@/hooks/useAuth";
import { getCartStore } from "@/store/useCartStore";
import { getJewelryCartStore } from "@/store/useJewelryCartStore";
import { Divider } from "@mantine/core";
import React, { useEffect, useMemo, useState } from "react";

export const BillingSummary = () => {
  const { user } = useAuth();
  const cartStore = useMemo(
    () => getCartStore(user?.id || "guest"),
    [user?.id]
  );
  const jewelryCartStore = useMemo(
    () => getJewelryCartStore(user?.id || "guest"),
    [user?.id]
  );

  const simpleProductTotal = cartStore((state: any) => state.getTotalPrice);
  const jewelryProductTotal = jewelryCartStore(
    (state: any) => state.getTotalPrice
  );

  const getGrandTotal = () => {
    return simpleProductTotal() + jewelryProductTotal();
  };

  const [hasMounted, setHasMounted] = useState(false);
  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) return null;

  return (
    <div className="mt-5 bg-[#f1f1f1] p-6">
      <div className="flex flex-row justify-between">
        <span>Subtotal:</span>
        <span className="font-semibold">
          ${(simpleProductTotal() + jewelryProductTotal()).toFixed(2)}
        </span>
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
        <span className="font-semibold">${getGrandTotal().toFixed(2)}</span>
      </div>
    </div>
  );
};
