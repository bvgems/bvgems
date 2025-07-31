"use client";

import {
  Popover,
  Checkbox,
  PopoverDropdown,
  PopoverTarget,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconFilter, IconX } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";

export const FilterDialog = () => {
  const [opened, { toggle, close }] = useDisclosure(false);
  const router = useRouter();
  const pathname = usePathname();

  const handleCheckboxChange = (category: string) => {
    const newPath = `/jewelry/${category.toLowerCase().replace(/\s/g, "")}`;
    if (pathname !== newPath) {
      router.push(newPath);
    }
    close(); // Optional: close the popover after selecting
  };

  return (
    <div className="cursor-pointer flex items-center gap-1.5 text-gray-500">
      <Popover
        width={250}
        position="bottom-end"
        withArrow
        shadow="md"
        opened={opened}
        transitionProps={{
          transition: "fade-down",
          duration: 800,
          timingFunction: "easeOut",
        }}
      >
        <PopoverTarget>
          <div onClick={toggle} className="flex items-center gap-1.5 text-xl">
            <IconFilter size={23} />
            <span>Filter</span>
          </div>
        </PopoverTarget>

        <PopoverDropdown>
          <div className="relative py-6 px-5 text-xl">
            <IconX
              size={20}
              className="absolute top-3 right-3 text-gray-500 cursor-pointer hover:text-black"
              onClick={close}
            />

            <div>
              <span className="font-semibold text-black">Categories</span>
              <div className="flex flex-col mt-3 gap-5 cursor-pointer">
                <Checkbox
                  variant="outline"
                  size="md"
                  label="Rings"
                  onChange={() => handleCheckboxChange("rings")}
                />
                <Checkbox
                  variant="outline"
                  size="md"
                  label="Ear Rings"
                  onChange={() => handleCheckboxChange("earrings")}
                />
                <Checkbox
                  variant="outline"
                  size="md"
                  label="Necklace"
                  onChange={() => handleCheckboxChange("necklaces")}
                />
                <Checkbox
                  variant="outline"
                  size="md"
                  label="Bracelets"
                  onChange={() => handleCheckboxChange("bracelets")}
                />
              </div>
            </div>
          </div>
        </PopoverDropdown>
      </Popover>
    </div>
  );
};
