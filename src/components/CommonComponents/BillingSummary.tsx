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
    [user?.id],
  );

  const cartTotal = cartStore((state: any) => state.cartTotal);
  const getTotalPrice = cartStore((state: any) => state.getTotalPrice);

  const [hasMounted, setHasMounted] = useState(false);
  const [subtotal, setSubtotal] = useState(0);
  const [shipping, setShipping] = useState(0);
  const [grandTotal, setGrandTotal] = useState(0);

  useEffect(() => setHasMounted(true), []);

  useEffect(() => {
    if (!hasMounted) return;

    // Use getTotalPrice() to always get an up-to-date accurate total, preventing stale cartTotal issues.
    const total = getTotalPrice() || 0;
    setSubtotal(total);

    // 🧭 Determine shipping method
    const isStorePickup = deliveryMethod === "store";

    if (isStorePickup) {
      // Store pickup → free shipping
      setShipping(0);
      setGrandTotal(total);
    } else {
      // Normal delivery logic
      const shippingCost = total >= 200 || total === 0 ? 0 : 15;
      setShipping(shippingCost);
      setGrandTotal(total + shippingCost);
    }
  }, [cartTotal, deliveryMethod, hasMounted, getTotalPrice]);

  if (!hasMounted) return null;

  return (
    <div className="mt-5 bg-[#f1f1f1] p-6 rounded-lg shadow-sm">
      {/* Subtotal */}
      <div className="flex flex-row justify-between">
        <span>Subtotal:</span>
        <span className="font-semibold">
          <NumberFormatter
            thousandSeparator
            prefix="$"
            value={subtotal.toFixed(2)}
          />
        </span>
      </div>

      <Divider my="sm" />

      {/* Sales Tax */}
      <div className="flex flex-row justify-between">
        <span>Sales Tax:</span>
        <span className="font-semibold">+ $0</span>
      </div>

      <Divider my="sm" />

      {/* Discount */}
      <div className="flex flex-row justify-between">
        <span>Discount:</span>
        <span className="font-semibold">- $0</span>
      </div>

      <Divider my="sm" />

      {/* Shipping */}
      <div className="flex flex-row justify-between">
        <span>Estimated Shipping:</span>
        <span className="font-semibold">
          {shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}
        </span>
      </div>
      <p className="text-xs text-gray-500 mt-1">
        Free shipping on orders above $200
      </p>

      <Divider my="sm" />

      {/* Grand Total */}
      <div className="flex flex-row justify-between text-lg text-[#0b182d] font-semibold">
        <span>Grand Total:</span>
        <span className="font-semibold">
          <NumberFormatter
            thousandSeparator
            prefix="$"
            value={grandTotal.toFixed(2)}
            suffix=" USD"
          />
        </span>
      </div>
    </div>
  );
};
