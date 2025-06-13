import {
  Popover,
  Checkbox,
  PopoverDropdown,
  PopoverTarget,
  createTheme,
  MantineProvider,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconFilter, IconX } from "@tabler/icons-react";

export const FilterDialog = () => {
  const [opened, { toggle, close }] = useDisclosure(false);

  const theme = createTheme({
    cursorType: "pointer",
  });

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
                <MantineProvider theme={theme}>
                  <Checkbox variant="outline" size="md" label="Rings" />
                  <Checkbox variant="outline" size="md" label="Ear Rings" />
                  <Checkbox variant="outline" size="md" label="Necklace" />
                  <Checkbox variant="outline" size="md" label="Bracelets" />
                </MantineProvider>
              </div>
            </div>

            <div className="mt-7">
              <span className="font-semibold mt-2 text-black">Colors</span>
              <div className="flex mt-3 gap-3.5 cursor-pointer">
                <div className="w-5 h-5 bg-yellow-400 rounded-full" />
                <div className="w-5 h-5 bg-gray-400 rounded-full" />
                <div className="w-5 h-5 bg-red-400 rounded-full" />
                <div className="w-5 h-5 bg-cyan-400 rounded-full" />
                <div className="w-5 h-5 bg-purple-600 rounded-full" />
              </div>
            </div>
          </div>
        </PopoverDropdown>
      </Popover>
    </div>
  );
};
