"use client";
import { useParams, useSearchParams } from "next/navigation";
import { OwnJewerleryStepper } from "@/components/OwnJewelry/OwnJewerleryStepper";
import React from "react";

export default function DesignYourJewelryCategoryPage() {
  const params = useParams();
  const searchParams = useSearchParams();

  const category = params.category;
  const type = searchParams.get("type");

  return (
    <div>
      <OwnJewerleryStepper category={category} type={type} />
    </div>
  );
}
