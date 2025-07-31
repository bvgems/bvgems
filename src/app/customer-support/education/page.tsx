"use client";

import { useEffect, useState } from "react";
import { EducationSidebar } from "@/components/Education/EducationSidebar";
import { SpecificGemstoneKnowledge } from "@/components/Education/SpecificGemstoneKnowledge";
import { usestoneStore } from "@/store/useStoneStore";
import { useSearchParams } from "next/navigation";
import { Drawer } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconLayoutSidebar } from "@tabler/icons-react";

export default function EducationPage() {
  const gemstones: any = usestoneStore((state) => state.gemstones) || [];
  const [selectedStone, setSelectedStone] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const queryStone = searchParams.get("activeStone");
  const [opened, { open, close }] = useDisclosure(false);

  useEffect(() => {
    if (queryStone && queryStone !== selectedStone) {
      setSelectedStone(queryStone.toLowerCase());
    }
  }, [queryStone]);

  return (
    <div className="flex flex-col md:flex-row h-screen overflow-hidden">
      <div className="hidden lg:block w-[300px] border-r border-gray-200">
        <EducationSidebar
          gemstones={gemstones}
          selected={selectedStone}
          onSelect={setSelectedStone}
          activeStone={queryStone}
        />
      </div>


      <div className="flex-1 overflow-y-auto p-4 md:p-8 relative">
        <div className="lg:hidden mb-4 flex justify-start">
          <button onClick={open} className="p-2 hover:bg-gray-100 rounded">
            <IconLayoutSidebar size={24} />
          </button>
        </div>

        <SpecificGemstoneKnowledge activeStone={selectedStone ?? undefined} />
      </div>

      <Drawer
        opened={opened}
        onClose={close}
        title="Gemstone Knowledge"
        // padding="md"
        size={300}
        overlayProps={{ opacity: 0.4, blur: 2 }}
        hiddenFrom="lg"
        withinPortal={false}
      >
        <EducationSidebar
          gemstones={gemstones}
          selected={selectedStone}
          onSelect={(stone) => {
            setSelectedStone(stone);
            close();
          }}
          activeStone={queryStone}
        />
      </Drawer>
    </div>
  );
}
