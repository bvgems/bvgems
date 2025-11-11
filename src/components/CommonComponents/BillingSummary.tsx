"use client";

import { useAuth } from "@/hooks/useAuth";
import { getCartStore } from "@/store/useCartStore";
import { Divider, NumberFormatter } from "@mantine/core";
import React, { useMemo, useState, useEffect } from "react";

export const BillingSummary = ({
  deliveryMethod,
}: {
  deliveryMethod?: string;
}) => {
  const { user } = useAuth();
  const cartStore = useMemo(
    () => getCartStore(user?.id || "guest"),
    [user?.id]
  );

  const cartTotal = cartStore((state: any) => state.cartTotal);
  const shippingTotal = cartStore((state: any) => state.shippingTotal);
  const grandTotal = cartStore((state: any) => state.grandTotal);
  const updateTotals = cartStore((state: any) => state.updateTotals);
  const cart = cartStore((state: any) => state.cart);

  const [hasMounted, setHasMounted] = useState(false);
  const [effectiveShipping, setEffectiveShipping] = useState(0);
  const [effectiveGrandTotal, setEffectiveGrandTotal] = useState(0);

  useEffect(() => setHasMounted(true), []);

  useEffect(() => {
    if (hasMounted) updateTotals();
  }, [cart, hasMounted, updateTotals]);

  // ✅ Adjust shipping and grand total dynamically
  useEffect(() => {
    if (!hasMounted) return;

    if (deliveryMethod === "store") {
      // Free shipping for store pickup
      setEffectiveShipping(0);
      setEffectiveGrandTotal(cartTotal); // No shipping added
    } else {
      // Normal shipping logic
      setEffectiveShipping(shippingTotal);
      setEffectiveGrandTotal(cartTotal + shippingTotal);
    }
  }, [deliveryMethod, cartTotal, shippingTotal, hasMounted]);

  if (!hasMounted) return null;

  return (
    <div className="mt-5 bg-[#f1f1f1] p-6 rounded-lg shadow-sm">
      <div className="flex flex-row justify-between">
        <span>Subtotal:</span>
        <span className="font-semibold">
          <NumberFormatter
            thousandSeparator
            prefix="$"
            value={cartTotal.toFixed(2)}
          />
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

      <div>
        <div className="flex flex-row justify-between">
          <span>Estimated Shipping:</span>
          <span className="font-semibold">
            {effectiveShipping === 0
              ? "Free"
              : `$${effectiveShipping.toFixed(2)}`}
          </span>
        </div>
        {/* 👇 Added small info text */}
        <p className="text-xs text-gray-500 mt-1">
          Free shipping on orders above $200
        </p>
      </div>

      <Divider my="sm" />

      <div className="flex flex-row justify-between text-lg text-[#0b182d] font-semibold">
        <span>Grand Total:</span>
        <span className="font-semibold">
          <NumberFormatter
            thousandSeparator
            prefix="$"
            value={effectiveGrandTotal.toFixed(2)}
            suffix=" USD"
          />
        </span>
      </div>
    </div>
  );
};
