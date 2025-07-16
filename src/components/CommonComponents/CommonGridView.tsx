"use client";
import { useGridView } from "@/hooks/useGridView";
import { Divider, Tabs, TabsList, TabsTab } from "@mantine/core";
import React from "react";
import { FilterDialog } from "../Jewerly/FilterDialog";
import { ViewAllProductComponent } from "./ViewAllProductComponent";
import { JewelryCategoryCard } from "../Jewerly/JewerlyCard";

export const CommonGridView = ({ isBead }: any) => {
  const { category, activeTab, setActiveTab, allProducts, beads } =
    useGridView();
    console.log('ussss',isBead)
  return (
    <div className="p-8">
      <div className="w-[100%]">
        <Tabs
          color="gray"
          value={activeTab}
          onChange={(val) => {
            if (val) setActiveTab(val);
          }}
        >
          <div className="flex justify-between items-center w-full">
            <TabsList className="flex space-x-6">
              <TabsTab value="alphabetical">
                <span
                  className={`text-xl ${
                    activeTab === "alphabetical"
                      ? "text-gray-500"
                      : "text-black"
                  }`}
                >
                  ALPHABETICAL (A-Z)
                </span>
              </TabsTab>
              <TabsTab value="newest">
                <span
                  className={`text-xl ${
                    activeTab === "newest" ? "text-gray-500" : "text-black"
                  }`}
                >
                  NEWEST ARRIVAL
                </span>
              </TabsTab>
            </TabsList>

            <FilterDialog />
          </div>
          <Divider />
        </Tabs>
      </div>

      <ViewAllProductComponent
        keyProp={activeTab}
        items={allProducts?.length ? allProducts : beads}
        renderItem={(product, index) => (
          <JewelryCategoryCard
            isBead={isBead}
            category={category}
            product={product}
            index={index}
          />
        )}
      />
    </div>
  );
};
