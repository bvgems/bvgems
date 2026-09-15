import {
  FreeSizeGemstonesList,
  ShapeFilterList,
  shopByColorOptions,
} from "@/utils/constants";
import { Button, Center, Grid, GridCol, HoverCard, Image } from "@mantine/core";
import { IconChevronDown } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

export const HeaderHoverCardForGemstones = ({
  link,
  smallerTextFlag,
  pathname,
  menuItems,
  user,
}: any) => {
  const router = useRouter();
  const [opened, setOpened] = useState(false);

  const handleNav = (query: string) => {
    setOpened(false);
    router.push(`/loose-gemstones?${query}`);
  };

  return (
    <HoverCard
      key={link.label}
      width={1200}
      position="bottom"
      radius="md"
      shadow="md"
      withinPortal
    >
      <HoverCard.Target>
        <div className="px-3 py-2 rounded-sm hover:text-gray-500 text-[12px]">
          <Center>
            <span
              className={`mr-1 ${smallerTextFlag ? "text-[12px]" : "text-[15px]"
                } ${link.links?.some((item: any) => pathname === item.link)
                  ? "text-gray-400"
                  : "text-black"
                }`}
            >
              {link.label}
            </span>
            <IconChevronDown size={14} stroke={1.5} />
          </Center>
        </div>
      </HoverCard.Target>

      <HoverCard.Dropdown
        className="relative px-10 py-10 bg-white rounded-lg shadow-lg border border-gray-200"
        style={{ minHeight: "450px" }}
      >
        <Grid className="w-full pl-8">
          <GridCol span={4}>
            <div className="mt-4">
              <p className="font-semibold mb-5 text-sm uppercase text-black">
                SHOP BY GEMSTONES
              </p>
              <div className="flex flex-col gap-2 text-black">
                {link.links?.map((item: any) => (
                  <div
                    key={item.link}
                    className="w-full px-4 py-2 rounded-md hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                        setOpened(false);
                        router.push(item.link);
                    }}
                  >
                    <div className="flex items-start gap-2">
                      {item.image && (
                        <div className="relative w-[20px] h-[20px] mt-1 shrink-0">
                          <Image loading="lazy" src={item.image} fit="contain" h={20} w={20} />
                        </div>
                      )}
                      <span className={`text-[17px] hover:text-gray-500 ${pathname === item.link ? "text-gray-400" : "text-black"}`}>
                        {item.label}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-end pr-4">
                <Button
                  variant="transparent"
                  color="#0b182d"
                  onClick={() => handleNav("")}
                  className="text-blue-600 underline flex items-center gap-1 hover:text-blue-800"
                >
                  <span className="underline">View All</span>
                  <IconChevronDown
                    style={{ transform: "rotate(-90deg)" }}
                    size={16}
                    stroke={2}
                  />
                </Button>
              </div>
            </div>
          </GridCol>

          <GridCol span={4}>
            <div className="mt-4">
              <p className="font-semibold mb-5 text-sm uppercase text-black">SHOP BY SHAPE</p>
              <div className="flex flex-col gap-2 text-black">
                {ShapeFilterList?.map((item, index) => (
                  <div
                    key={index}
                    onClick={() =>
                      handleNav(`shape=${item.label.toLowerCase()}`)
                    }
                    className="flex items-center gap-2 cursor-pointer hover:text-gray-500"
                  >
                    <Image loading="lazy" src={item.image} h={35} w={35} fit="contain" />
                    <span className="text-md mb-2">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </GridCol>

          <GridCol span={4}>
            <div className="mt-4">
              <p className="font-semibold mb-5 text-sm uppercase text-black">SHOP BY COLOR</p>
              <div className="flex flex-col gap-2 text-black">
                {shopByColorOptions?.map((item, index) => (
                  <div
                    onClick={() =>
                      handleNav(`color=${item.name.toLowerCase()}`)
                    }
                    key={index}
                    className="flex items-center gap-2 hover:text-gray-500 cursor-pointer"
                  >
                    <Image loading="lazy" src={item?.image} h={35} w={35} fit="contain" />
                    <span className="text-md mb-2">{item.name}</span>
                  </div>
                ))}
              </div>
              <div>
                <p className="font-semibold mt-10 text-sm uppercase">SHOP BY TYPE</p>
                <div className="flex flex-col gap-2 mt-4 text-blue-800 cursor-pointer">
                  <span onClick={() => handleNav(`type=Natural`)}>
                    Natural
                  </span>
                  <span onClick={() => handleNav(`type=Lab Grown`)}>
                    Lab Grown
                  </span>
                </div>
              </div>
            </div>
          </GridCol>
        </Grid>
      </HoverCard.Dropdown>
    </HoverCard>
  );
};
