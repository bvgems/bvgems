'use client'
import { FreeSizeGemstonesCard } from "@/components/FreeSizeGemtones/FreeSizeGemstonesCard";
import { useParams } from "next/navigation";
import React from "react";

export default function FreeSizeGemstonePage() {
  const path = useParams();
  console.log('path',path)
  return (
    <>
      <div className="flex justify-center gap-6 py-10 bg-[#E5E7EB]">
        <h1 className="text-3xl text-[#6B7280]">Free Size Gemstones</h1>
      </div>
      <FreeSizeGemstonesCard />
    </>
  );
}
