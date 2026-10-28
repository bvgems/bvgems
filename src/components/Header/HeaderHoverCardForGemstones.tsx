import {
  ShapeFilterList,
  shopByColorOptions,
} from "@/utils/constants";
import { Center, Grid, GridCol, Popover } from "@mantine/core";
import { IconChevronDown } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";

export const HeaderHoverCardForGemstones = ({
  link,
  smallerTextFlag,
  pathname,
  menuItems,
  user,
}: any) => {
  const router = useRouter();
  const [opened, setOpened] = useState(false);
  const closeTimeoutRef = useRef<number | null>(null);

  const clearCloseTimeout = () => {
    if (closeTimeoutRef.current !== null) {
      window.clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
  };

  const handleTargetMouseEnter = () => {
    clearCloseTimeout();
    setOpened(true);
  };

  const handleDropdownMouseEnter = () => {
    clearCloseTimeout();
  };

  const handleMouseLeave = () => {
    clearCloseTimeout();
    closeTimeoutRef.current = window.setTimeout(() => {
      setOpened(false);
    }, 150);
  };

  const closePopup = () => {
    clearCloseTimeout();
    setOpened(false);
  };

  useEffect(() => {
    return () => clearCloseTimeout();
  }, []);

  const handleNav = (query: string) => {
    closePopup();
    router.push(query ? `/calibrated-stones?${query}` : "/calibrated-stones");
  };

  return (
    <Popover
      key={link.label}
      opened={opened}
      onChange={setOpened}
      width={1200}
      position="bottom"
      radius="md"
      shadow="md"
      withinPortal
      transitionProps={{ exitDuration: 0 }}
    >
      <Popover.Target>
        <div
          onMouseEnter={handleTargetMouseEnter}
          onMouseLeave={handleMouseLeave}
          className="px-3 py-2 rounded-sm hover:text-gray-500 text-[12px] cursor-pointer"
        >
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
      </Popover.Target>

      <Popover.Dropdown
        onMouseEnter={handleDropdownMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="relative px-8 py-8 bg-white rounded-xl shadow-2xl border border-slate-100"
        style={{ minHeight: "440px" }}
      >
        <Grid className="w-full">
          {/* Column 1: Shop By Gemstones */}
          <GridCol span={4} className="border-r border-slate-100/80 pr-6">
            <div>
              <div className="pb-2 mb-3 border-b border-slate-100">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  SHOP BY GEMSTONES
                </p>
              </div>
              <div className="flex flex-col gap-0.5">
                {link.links?.map((item: any) => (
                  <div
                    key={item.link}
                    className="group flex items-center gap-3 px-3 py-1.5 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors duration-150"
                    onClick={() => {
                      closePopup();
                      router.push(item.link);
                    }}
                  >
                    {item.image && (
                      <div className="w-7 h-7 shrink-0 flex items-center justify-center overflow-visible">
                        <img
                          src={item.image}
                          alt={item.label}
                          className="w-full h-full object-contain scale-[1.8] group-hover:scale-[2.05] transition-transform duration-200 ease-out"
                        />
                      </div>
                    )}
                    <span
                      className={`text-[13.5px] font-medium transition-colors ${
                        pathname === item.link
                          ? "text-slate-400 font-semibold"
                          : "text-slate-700 group-hover:text-slate-950"
                      }`}
                    >
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
              <div className="flex justify-end pr-3 mt-3 pt-2 border-t border-slate-100">
                <button
                  onClick={() => handleNav("")}
                  className="text-xs font-semibold text-[#0b182d] hover:text-blue-700 flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <span>View All Gemstones</span>
                  <IconChevronDown
                    style={{ transform: "rotate(-90deg)" }}
                    size={14}
                    stroke={2.5}
                  />
                </button>
              </div>
            </div>
          </GridCol>

          {/* Column 2: Shop By Shape */}
          <GridCol span={4} className="border-r border-slate-100/80 px-6">
            <div>
              <div className="pb-2 mb-3 border-b border-slate-100">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  SHOP BY SHAPE
                </p>
              </div>
              <div className="flex flex-col gap-0.5">
                {ShapeFilterList?.map((item, index) => (
                  <div
                    key={index}
                    onClick={() =>
                      handleNav(`shape=${encodeURIComponent(item.value.toLowerCase())}`)
                    }
                    className="group flex items-center gap-3 px-3 py-1.5 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors duration-150"
                  >
                    <div className="w-7 h-7 shrink-0 flex items-center justify-center">
                      <img
                        src={item.image}
                        alt={item.label}
                        className="w-5 h-5 object-contain opacity-75 group-hover:opacity-100 group-hover:scale-110 transition-all duration-200 ease-out"
                      />
                    </div>
                    <span className="text-[13.5px] font-medium text-slate-700 group-hover:text-slate-950 transition-colors">
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </GridCol>

          {/* Column 3: Shop By Color & Origin */}
          <GridCol span={4} className="pl-6">
            <div>
              <div className="pb-2 mb-3 border-b border-slate-100">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  SHOP BY COLOR
                </p>
              </div>
              <div className="flex flex-col gap-0.5">
                {shopByColorOptions?.map((item, index) => (
                  <div
                    onClick={() => {
                      closePopup();
                      router.push(item.href || `/calibrated-stones?color=${encodeURIComponent(item.name.toLowerCase())}`);
                    }}
                    key={index}
                    className="group flex items-center gap-3 px-3 py-1.5 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors duration-150"
                  >
                    <div className="w-7 h-7 shrink-0 flex items-center justify-center overflow-visible">
                      <img
                        src={item?.image}
                        alt={item.name}
                        className="w-full h-full object-contain scale-[1.8] group-hover:scale-[2.05] transition-transform duration-200 ease-out"
                      />
                    </div>
                    <span className="text-[13.5px] font-medium text-slate-700 group-hover:text-slate-950 transition-colors">
                      {item.name}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 px-1">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                  SHOP BY TYPE
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleNav("type=Natural")}
                    className="flex-1 py-1.5 px-3 text-xs font-semibold rounded-md border border-slate-200 bg-white hover:border-[#0b182d] hover:bg-slate-50 text-slate-700 hover:text-slate-950 transition-all duration-150 cursor-pointer"
                  >
                    Natural
                  </button>
                  <button
                    onClick={() => handleNav("type=Lab Grown")}
                    className="flex-1 py-1.5 px-3 text-xs font-semibold rounded-md border border-slate-200 bg-white hover:border-[#0b182d] hover:bg-slate-50 text-slate-700 hover:text-slate-950 transition-all duration-150 cursor-pointer"
                  >
                    Lab Grown
                  </button>
                </div>
              </div>
            </div>
          </GridCol>
        </Grid>
      </Popover.Dropdown>
    </Popover>
  );
};
