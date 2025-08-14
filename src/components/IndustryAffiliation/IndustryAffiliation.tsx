import { IndustryAffiliationOptions } from "@/utils/constants";
import { Image } from "@mantine/core";
import Link from "next/link";
import React from "react";

export const IndustryAffiliation = () => {
  return (
    <div className="bg-[#F9F5F0] py-10 mt-10">
      <div
        className="
          grid 
          grid-cols-2 gap-8 
          sm:flex sm:flex-wrap sm:justify-center sm:items-center sm:gap-20
        "
      >
        {IndustryAffiliationOptions?.map((item: any, index: number) => {
          return (
            <Link
              key={index}
              target="_blank"
              href={item?.link}
              className="flex justify-center items-center"
            >
              <img
                src={item?.logo}
                className="h-[90px] w-[100px] md:h-[140px] md:w-[160px] object-contain"
                alt=""
              />
            </Link>
          );
        })}
      </div>
    </div>
  );
};
