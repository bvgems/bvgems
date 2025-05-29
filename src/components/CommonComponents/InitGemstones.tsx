"use client";
import { useEffect } from "react";
import { getAllGemstones } from "@/apis/api";
import { usestoneStore } from "@/store/useStoneStore";

export const InitGemstones = () => {
  const setGemStones = usestoneStore((state) => state.setGemStones);

  useEffect(() => {
    const fetchData = async () => {
      const gemstones = await getAllGemstones();

      if (gemstones) setGemStones(gemstones);
    };

    fetchData();
  }, [setGemStones]);

  return null;
};
