"use client";

import { useEffect, useState } from "react";
import { EducationSidebar } from "@/components/Education/EducationSidebar";
import { SpecificGemstoneKnowledge } from "@/components/Education/SpecificGemstoneKnowledge";
import { usestoneStore } from "@/store/useStoneStore";
import { useSearchParams } from "next/navigation";

export default function EducationPage() {
  const gemstones: any = usestoneStore((state) => state.gemstones) || [];
  const [selectedStone, setSelectedStone] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const queryStone = searchParams.get("activeStone");

  useEffect(() => {
    if (queryStone && queryStone !== selectedStone) {
      setSelectedStone(queryStone.toLowerCase());
    }
  }, [queryStone]);

  return (
    <div className="flex">
      <div className="w-[300px] border-r border-gray-200">
        <EducationSidebar
          gemstones={gemstones}
          selected={selectedStone}
          onSelect={setSelectedStone}
          activeStone={queryStone}
        />
      </div>
      <div className="flex-1 overflow-y-auto">
        <SpecificGemstoneKnowledge activeStone={selectedStone ?? undefined} />
      </div>
    </div>
  );
}
