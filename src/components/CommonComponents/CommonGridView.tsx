"use client";
import { useGridView } from "@/hooks/useGridView";
import { Divider, Tabs, TabsList, TabsTab } from "@mantine/core";
import React from "react";
import { ViewAllProductComponent } from "./ViewAllProductComponent";
import { FilterDialog } from "../Jewerly/FilterDialog";
import { JewelryCategoryCard } from "../Jewerly/JewerlyCard";

export const CommonGridView = ({ isBead }: any) => {
  const { category, activeTab, setActiveTab, allProducts, beads } =
    useGridView();

  return (
    <div className="px-4 sm:px-8 pt-6">
      <div className="w-full">
        <Tabs
          color="gray"
          value={activeTab}
          onChange={(val) => {
            if (val) setActiveTab(val);
          }}
        >
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-0 mb-2">
            <TabsList className="flex gap-4 sm:gap-6">
              <TabsTab value="alphabetical">
                <span
                  className={`text-base sm:text-xl font-medium ${
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
                  className={`text-base sm:text-xl font-medium ${
                    activeTab === "newest" ? "text-gray-500" : "text-black"
                  }`}
                >
                  NEWEST ARRIVAL
                </span>
              </TabsTab>
            </TabsList>

            <div className="self-start sm:self-center">
              <FilterDialog />
            </div>
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
