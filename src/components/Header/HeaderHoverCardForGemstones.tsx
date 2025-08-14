import {
  FreeSizeGemstonesList,
  ShapeFilterList,
  shopByColorOptions,
} from "@/utils/constants";
import { Button, Center, Grid, GridCol, HoverCard, Image } from "@mantine/core";
import { IconChevronDown } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import React from "react";

export const HeaderHoverCardForGemstones = ({
  link,
  smallerTextFlag,
  pathname,
  menuItems,
}: any) => {
  const router = useRouter();

  const handleNav = (query: string) => {
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
              className={`mr-1 ${
                smallerTextFlag ? "text-[12px]" : "text-[15px]"
              } ${
                link.links?.some((item: any) => pathname === item.link)
                  ? "text-gray-400"
                  : ""
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
          <GridCol span={3}>
            <div className="mt-4">
              <h4 className="font-semibold mb-5">CALIBRATED GEMSTONES</h4>
              <div className="flex flex-col gap-2">{menuItems}</div>
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

          <GridCol span={3}>
            <div className="mt-4">
              <h4 className="font-semibold mb-5">SHOP BY SHAPE</h4>
              <div className="flex flex-col gap-2">
                {ShapeFilterList?.map((item, index) => (
                  <div
                    key={index}
                    onClick={() =>
                      handleNav(`shape=${item.label.toLowerCase()}`)
                    }
                    className="flex items-center gap-2 cursor-pointer hover:text-gray-500"
                  >
                    <Image src={item.image} h={35} w={35} fit="contain" />
                    <span className="text-md mb-2">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </GridCol>

          <GridCol span={3}>
            <div className="mt-4">
              <h4 className="font-semibold mb-5">SHOP BY COLOR</h4>
              <div className="flex flex-col gap-2">
                {shopByColorOptions?.map((item, index) => (
                  <div
                    onClick={() =>
                      handleNav(`color=${item.name.toLowerCase()}`)
                    }
                    key={index}
                    className="flex items-center gap-2 hover:text-gray-500 cursor-pointer"
                  >
                    <Image src={item?.image} h={35} w={35} fit="contain" />
                    <span className="text-md mb-2">{item.name}</span>
                  </div>
                ))}
              </div>
              <div>
                <h4 className="font-semibold mt-10">SHOP BY TYPE</h4>
                <div className="flex flex-col gap-2 mt-4 text-blue-800 cursor-pointer">
                  <span onClick={() => handleNav(`type=Natural`)}>
                    Naturals
                  </span>
                  <span onClick={() => handleNav(`type=Lab Grown`)}>
                    Lab Growns
                  </span>
                </div>
              </div>
            </div>
          </GridCol>

          <GridCol className="bg-[#FAFAFA]" span={3}>
            <div className="p-6">
              <h4 className="font-semibold mb-5">FREE SIZE GEMSTONES</h4>
              <div className="flex flex-col gap-5">
                {FreeSizeGemstonesList?.map((item, index) => (
                  <div
                    onClick={() => {
                      router?.push(
                        `/free-size-gemstones/${item?.label.toLowerCase()}`
                      );
                    }}
                    key={index}
                    className="flex items-center gap-3 cursor-pointer hover:text-gray-500"
                  >
                    <Image src={item?.image} h={35} w={35} fit="contain" />
                    <span className="text-md mb-2">{item.label}</span>
                  </div>
                ))}
              </div>
              <Button
                onClick={() => {
                  router?.push("/free-size-gemstones");
                }}
                className="mt-6"
                fullWidth
                variant="outline"
                color="#0b182d"
              >
                VIEW ALL
              </Button>
            </div>
          </GridCol>
        </Grid>
      </HoverCard.Dropdown>
    </HoverCard>
  );
};
