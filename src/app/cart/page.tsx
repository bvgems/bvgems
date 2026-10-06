import { CartComponent } from "@/components/Cart/CartComponent";
import React from "react";
import { PageHeader } from "@/components/CommonComponents/PageHeader";

export default function CartPage() {
  return (
    <div className="w-full">
      <PageHeader 
        title="Your Cart" 
        subtitle="Review your selected items before checkout." 
      />
      <CartComponent />
    </div>
  );
}
