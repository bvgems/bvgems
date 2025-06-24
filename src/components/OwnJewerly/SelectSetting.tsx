"use client";
import { Divider } from "@mantine/core";
import { AnimatedText } from "../CommonComponents/AnimatedText";
import { SettingFilter } from "./SettingFilter";

export const SelectSetting = ({ category }: any) => {
  return (
    <>
      <AnimatedText
        text={`Design Your Own ${category}`}
        y={20}
        className="capitalize text-2xl text-gray-500 mb-5"
      />
      <Divider />

      <SettingFilter />
    </>
  );
};
