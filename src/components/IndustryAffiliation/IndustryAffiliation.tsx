import { IndustryAffiliationOptions } from "@/utils/constants";
import { Image } from "@mantine/core";
import Link from "next/link";
import React from "react";
import { AnimatedText } from "../CommonComponents/AnimatedText";

export const IndustryAffiliation = () => {
  return (
    <div className="bg-[#F9F5F0] py-10 mt-10">
      <div className="flex justify-center items-center gap-20">
        {IndustryAffiliationOptions?.map((item: any, index: number) => {
          return (
            <Link key={index} target="_blank" href={item?.link}>
              <Image h={140} w={160} fit="contain" src={item?.logo} />
            </Link>
          );
        })}
      </div>
    </div>
  );
};
