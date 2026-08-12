"use client";
import { OwnJewerleryStepper } from "@/components/OwnJewerly/OwnJewerleryStepper";
import { useParams, useSearchParams } from "next/navigation";

import React, { Suspense } from "react";

function DesignYourJewelryCategoryContent() {
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

export default function DesignYourJewelryCategoryPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center">Loading designer...</div>}>
      <DesignYourJewelryCategoryContent />
    </Suspense>
  );
}
